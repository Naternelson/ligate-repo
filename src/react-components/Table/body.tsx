import { CheckBox } from "@mui/icons-material"
import { Checkbox, CheckboxProps, ClickAwayListener, GridProps, MenuItem, Select, SelectProps, Typography } from "@mui/material"
import { DocumentData, DocumentSnapshot } from "firebase/firestore"
import { useContext, useState } from "react"
import useTable, { ColumnDef, useTableContext } from "./context"
export { Cell, Row } from "./table-basics"
export const TableBody = () => <></>
// export const TableBody = () => {
//     const context = useTableContext()
//     return (
//         <>
//             {context.pagination.currentGroup().map(doc => {
//                 return (
//                     <Row key={doc.id}>
//                         <SelectCell row={doc}/>
//                         {context.columns.map(col => {
//                             return <TableCell row={doc} column={col} key={col.field}/>
//                         })}
//                     </Row>
//                 )
//             })}
//         </>
//     )
// }

// interface TableCellProps {
//     column: ColumnDef,
//     row: DocumentSnapshot<DocumentData>
// }

// const TableCell = (props: TableCellProps) => {
//     const {column} = props
//     switch(column.type){
//         case 'string': return <StringCell {...props}/>
//         case 'number': return <NumberCell {...props}/>
//         case 'boolean': return <BooleanCell {...props}/>
//         case 'dateTime': return <DateCell {...props}/>
//         case 'singleSelect': return <SingleSelectCell {...props}/>
//         case 'actions': return <ActionsCell {...props}/>
//         case 'checkbox': return <CheckboxCell {...props}/>
//     }
// }

// const StringCell = (props:TableCellProps) => {
//     const {column, row} = props 
//     if(column.type !== "string") return null 
//     const value = column.valueGetter ? column.valueGetter({id: row.id, row: row.data(), column: column}) : row.get(column.field)
//     return (
//         <Cell xs>
//             {column.renderCell && column.renderCell({value, column})}
//             {!column.renderCell && <Typography>{value}</Typography>}
//         </Cell>
//     )
// }

// const NumberCell = (props:TableCellProps) => {
//     const {column, row} = props 
//     if(column.type !== "number") return null 
//     const value = column.valueGetter ? column.valueGetter({id: row.id, row: row.data(), column: column}) : row.get(column.field)
//     const numberValue = typeof value === "string" ? formatNumberToHuman(value) : value  
//     return (
//         <Cell xs>
//             {column.renderCell && column.renderCell({value:numberValue, column})}
//             {!column.renderCell && <Typography align="right">{numberValue}</Typography>}
//         </Cell>
//     )
// }

// const BooleanCell = (props: TableCellProps) => {
//     const {column, row} = props 
//     if(column.type !== "boolean") return null 
//     const value = column.valueGetter ? column.valueGetter({id: row.id, row: row.data(), column: column}) as boolean : row.get(column.field) as boolean 
//     return (
//         <Cell xs alignItems="center">
//             {column.renderCell && column.renderCell({value, column})}
//             {!column.renderCell && <Typography>{value}</Typography>}
//         </Cell>
//     )
// }

// const DateCell = (props: TableCellProps) => {
//     const {column, row} = props 
//     if(column.type !== "dateTime") return null 
//     const value = column.valueGetter ? column.valueGetter({id: row.id, row: row.data(), column: column}) as string : row.get(column.field) as string  
//     return (
//         <Cell xs alignItems="left">
//             {column.renderCell && column.renderCell({value, column})}
//             {!column.renderCell && <Typography>{value}</Typography>}
//         </Cell>
//     )
// }
// const SingleSelectCell = (props: TableCellProps) => {
//     const [open, setOpen] = useState<boolean>(false)
//     const [success, setSuccess] = useState("")
//     const [error, setError] = useState("")
//     const {column, row} = props 
//     if(column.type !== "singleSelect") return null 
//     const value = column.valueGetter ? column.valueGetter({id: row.id, row: row.data(), column: column}) as string : row.get(column.field) as string 
//     const cellProps: GridProps = {
//         xs:true,
//         alignItems:'center',
//         onClick: column.editable ? () => setOpen(true) : undefined
//     } 
//     const render = column.renderCell ? column.renderCell({value, column}) : value 
//     const selectProps:SelectProps = {
//         value: render, onChange: async () => {
//             if(!column.onChange)  return 
//             column.onChange({id: row.id, snap: row, field: column.field, value})
//                 .then(() => setSuccess(column.onChangeSuccessMessage ? column.onChangeSuccessMessage({id: row.id, snap:row, field: column.field, value}) : "Success!"))
//                 .catch(()=> setError(column.onChangeErrorMessage ? column.onChangeErrorMessage({id: row.id, snap:row, field: column.field, value}) : "Error"))
//         }
//     }
//     const options = (column.valueOptions || []).map(value=> <MenuItem value={value} key={value}>{value}</MenuItem>)
//     return (
//         <Cell {...cellProps}>
//             {open && <ClickAwayListener onClickAway={() => setOpen(false)}><Select {...selectProps}>{options}</Select></ClickAwayListener>}
//             {!open && render}
//         </Cell>
//     )
// }

// const ActionsCell = (props: TableCellProps) => {
//     const {column, row} = props  
//     if(column.type !== "actions") return null
//     return (
//         <Cell xs display={"flex"} flexDirection="row" justifyContent={'center'}>
//             {column.getActions && column.getActions({id: row.id, snap: row, column}) }
//         </Cell>
        
//     ) 
// }

// const CheckboxCell = (props:TableCellProps) => {
//     const {column, row} = props 
//     if(column.type !== "checkbox") return null
//     const value = column.valueGetter ? column.valueGetter({id: row.id, row: row.data(), column }) : row.get(column.field)
//     const checkboxProps: CheckboxProps = {
//         checked: value,
//         size: 'small',
//         onChange: column.onChange ? () => column.onChange && column.onChange({id: row.id, snap: row, field: column.field, value}) : undefined
//     } 
//     return (
//         <Cell justifyContent={'center'}>
//             <Checkbox {...checkboxProps}/>
//         </Cell>
//     )
// }


// const formatNumberToHuman = (numberString: string, places:number = 0) =>{
//     const toNum = Number(numberString.replaceAll(/[^0-9\.]/g, "")) 
//     if(isNaN(toNum)) return null 
//     return Number(toNum.toFixed(places)).toLocaleString()
// }

// export const SelectCell = (props: {row: DocumentSnapshot}) => {
//     const context = useTableContext()
//     const checkboxProps: CheckboxProps = {
//         size: 'small',
//         checked: context.selected.allSelected() || !!context.selected.getSelected(props.row.id),
//         onChange: () => context.selected.toggleById(props.row.id)
//     }
//     const cProps:GridProps = {
//         justifyContent: 'center',
//         display: 'flex'
//     }
//     return (
//         <Cell {...cProps}>
//             <Checkbox {...checkboxProps}/>
//         </Cell>
        
//     )
// }