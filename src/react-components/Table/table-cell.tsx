import { ArrowDropDown, MoreVert } from "@mui/icons-material"
import { Alert, AlertProps, Box, BoxProps, Checkbox, CheckboxProps, ClickAwayListener, Color, GridProps, IconButton, IconButtonProps, IconProps, Menu, MenuItem, MenuProps, Snackbar, SnackbarProps, SvgIconProps, TextField, TextFieldProps } from "@mui/material"
import { DesktopDatePicker, MobileDatePicker, MobileDatePickerProps } from "@mui/x-date-pickers"
import { DocumentData, DocumentSnapshot, getFirestore, runTransaction } from "firebase/firestore"
import React, { ReactNode, useContext, useMemo, useRef, useState } from "react"
import { ColumnDef, TableContextValue, useTableContext } from "./context"
import { Cell } from "./table-basics"

interface TableCellProps {
    column: ColumnDef,
    row: DocumentSnapshot<DocumentData>
}

interface SpecificTableProps {
    column: ColumnDef,
    row: DocumentSnapshot<DocumentData>
    editMode: boolean, 
    open: boolean,
    value: any 
    onChange?: (params:any) => void   
}

export const TableCellBase = (props: TableCellProps) => {
    const {column, row} = props
    const [editMode, setEditMode] = useState(false)
    const [menuState, setMenuState] = useState(false)
    const [inputValue, setInputValue] = useState<string | number | null >(getValue(row, column))
    const [errorMessage, setErrorMessage]  = useState("") 
    const [success, setSuccess] = useState(false)
    const [showMessage, setShowMessage] = useState(false)
    
    const openAndEdit = () => {
        setEditMode(true)
        setMenuState(true)
    }
    const closeAndRestrict = () => {
        setEditMode(false)
        setMenuState(false)
    }

    const save = () => {
        if(getValue(row, column) === inputValue) return Promise.resolve()
        return runTransaction(getFirestore(), async(t)=>{
            const fValue = fieldPath(column, row)
            t.update(row.ref, {[fValue.toString()]: inputValue})
        }) 
    }
    const onClickAway = async () => {
        if(column.editable && editMode) {
            save()
                .then(()=>{
                    setErrorMessage("")
                    setShowMessage(false)
                    setSuccess(true)
                })
                .catch((err) => {
                    setErrorMessage(err)
                    setShowMessage(true)
                    setSuccess(false)
                    setInputValue(getValue(row, column))
                })
        }
        closeAndRestrict()
    }

    const onClick = () => {
        if(!column.editable) return 
        if(column.type === "singleSelect" && !menuState ) return openAndEdit()
        setEditMode(true)

    }

    const cProps: GridProps = {
        justifyContent: column.type === "number" ? "right" : column.type === "string" ? "left" : 'center',
        onClick
    }

    const editValue = (newValue: any) => {
        setInputValue(newValue)
    } 

    const render = () => {
        const onChange = editMode ? editValue : () => {} 
        const specificProps:SpecificTableProps = {
            value: inputValue, onChange, open: menuState, editMode, row, column 
        }
        if(column.renderCell) return column.renderCell({value: inputValue, column})
        if(column.type === "actions") return <ActionsCell row={row} column={column}/>
        if(column.type === "checkbox") return <CheckboxCell {...specificProps}/>
        if(column.type === "singleSelect") return <SingleSelectCell {...specificProps}/>
        if(column.type === "dateTime") return <DateCell {...specificProps}/>
        return <StringCell {...specificProps}/>
         
    }


    return (
        <Cell {...cProps}>
            <ClickAwayListener onClickAway={onClickAway}>
                <>
                    {render()}
                </>
            </ClickAwayListener>
            <Toast message={errorMessage} severity="error" open={showMessage} onClose={() => setShowMessage(false)}/>
            <Toast message={"Saved"} severity="success" open={success} onClose={() => setSuccess(false)}/>
        </Cell>
    )
}

export const StringCell = (props:SpecificTableProps) => {
    const {editMode, value, onChange, column} = props 
    const tFieldProps:TextFieldProps = {
        margin: 'none',
        variant: 'filled',
        fullWidth: true, 
        value, 
        onChange: (e) => onChange && onChange(e.target.value) 
    }
    if(column.type === "number") tFieldProps.inputProps = {inputMode: 'numeric', pattern: '[0-9]*'}
    return (
        <>
            {editMode && <TextField {...tFieldProps}/> }
            {!editMode && value }
        </>
    )
}

export const DateCell = (props:SpecificTableProps) => {
    const {editMode, value, onChange} = props 

    const renderInput = (params?:any) => {
        console.log(params)
        return <span>{value}</span>
    }
    const datePicker:MobileDatePickerProps<unknown, unknown> = {
        value, inputFormat: "MM/dd/yyyy",
        renderInput, onChange: (value) => onChange && onChange(value)
    }
    return (
        <>
            {editMode && <MobileDatePicker {...datePicker} /> }
            {!editMode && renderInput() }
        </>
    )
}



export const getValue = (row:DocumentSnapshot<DocumentData>, column:ColumnDef) => {
    return row.get(fieldPath(column, row)) 
}

export const fieldPath = (column:ColumnDef, row: DocumentSnapshot<DocumentData>) => {
    return  !!column.valueGetter ? column.valueGetter({id: row.id, row, column}) : column.field

}


export type ToastProps = AlertProps & {message: string, timeout?:number, open:boolean, onClose: (event: React.SyntheticEvent<any> | Event, reason: string) =>void} 
export const Toast = (props:ToastProps) => {
    const {message, timeout, open, onClose, ...aProps} = props 
    const sProps:SnackbarProps = {
        autoHideDuration: timeout || 6000,
        onClose, open
    }
    return <Snackbar {...sProps}>
        <Alert {...aProps}>
            {message}
        </Alert>
    </Snackbar>
}

export const CheckboxCell = (props: SpecificTableProps) => {
    const {value, onChange, column} = props
    
    const cProps:CheckboxProps = {
        checked: !!value,
        size:"small",
        onChange: () => (column.editable && onChange) && onChange(!value), 
        disableRipple:true, 
        color: column.editable ? "primary" : 'default' 
    }
    return (
        <Checkbox {...cProps}/>
    )
}

export const ActionsCell = (props:TableCellProps) => {
    const {row, column} = props 
    const {getActions} = column 
    return (
        <>
            {getActions ? getActions({id: row.id, snap: row, column}) : null}
        </> )
}

export const SingleSelectCell = (props:SpecificTableProps) => {
    const {open, column, onChange, value} = props 
    const {editable} = column
    const ref = useRef() 
    const menuProps:MenuProps = {
        open, 
        anchorEl: ref.current,
        anchorOrigin: {horizontal: 'left', vertical: 'top'},
        transformOrigin: {horizontal: 'left', vertical: 'bottom'}
    }
    const menuOptions= () =>  column.valueOptions ? column.valueOptions.map(v => <MenuItem dense key={v} onClick={() => onChange && onChange(v)}>v</MenuItem>) : []
    const boxProps:BoxProps = {
        ref,
        display: 'flex',
        justifyContent: 'space-between',
        sx: {cursor: (editable && 'pointer') || 'default'}
    }
    const iconProps: SvgIconProps = {
        fontSize: 'small',
        sx: {opacity: 0, "&:hover": {
            opacity: editable ? 1 : 0
        }}
    }
    return (
        <>
            <Box {...boxProps}>
                <span>{value}</span>
                <ArrowDropDown {...iconProps}/>
            </Box>
            <Menu {...menuProps}>
                {editable && menuOptions()}
            </Menu>
        </>
    )
}


export type MenuActionProps = {
    items: {title: string, action: (params: {id: string, snap: DocumentSnapshot<DocumentData>, column:ColumnDef})=> void | Promise<void>}[]
    row: string, snap: DocumentSnapshot<DocumentData>, column: ColumnDef,
    icon?: ReactNode
}
export const MenuAction = (props: MenuActionProps) => {
    const {items, row, snap, column} = props 
    const [anchor, setAnchor] = useState<any>(null)
    const clickHandler = (e:React.MouseEvent) => setAnchor(e.currentTarget)
    const closeHandler = () => setAnchor(null)

    const menuProps:MenuProps = {
        open: !!anchor, 
        anchorEl: anchor, 
        onClose: closeHandler, 
        anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right'
        },
        transformOrigin: {
            vertical: 'top',
            horizontal: 'right'
        }
    }

    const buttonProps:IconButtonProps = {
        onClick: clickHandler,
        disableRipple: true 
    }

    return (
        <>
            <IconButton {...buttonProps}>
                <MoreVert/>
            </IconButton>
            <Menu {...menuProps}>
                {items.map((item, i)=>(
                    <MenuItem 
                    key={item.title} 
                    onClick={() => {
                        item.action({id: row, snap, column})
                        closeHandler()
                    }}
                    >{item.title}</MenuItem>))}
            </Menu>
        </>
       
    )
} 