import { Box, Color, IconButton, IconButtonProps, Tooltip } from "@mui/material"
import { DocumentSnapshot, FieldValue, getFirestore, runTransaction } from "firebase/firestore"
import { ReactElement } from "react"
import { ColumnDef, useTableContext } from "./context"

export const useUpdateRow = (id:string) => {
    const context = useTableContext()
    return (...data: {field: string, value: FieldValue | Partial<unknown> | undefined}[]) => {
        return runTransaction(getFirestore(), t => {
            return new Promise((res)=> {
                data.forEach(value => t.update(context.data[id].ref, {[value.field]: value.value}))
                res(null)
            })
        })
    }
}

export const useDeleteRow = (id:string) => {
    const context = useTableContext()
    return () => {
        return runTransaction(getFirestore(), t => {
            return new Promise((res)=> {
                t.delete(context.data[id].ref)
                res(null)
            })
        })
    }
}

export interface ActionItemProps  {
    color?: string,
    icon: ReactElement,
    onClick: (params: {id:string, snap:DocumentSnapshot, column: ColumnDef, ref:any}) => Promise<void> | void 
    tooltip?:string
}
export const ActionItem = (props: ActionItemProps) => {
    const buttonProps: IconButtonProps = {
        size: 'small',
        "aria-label": props.tooltip,
        sx:{fontColor: props.color || "grey.600"}
    }
    const render = <IconButton {...buttonProps} >{props.icon}</IconButton>
    return (
        <Box>
            {props.tooltip && <Tooltip title={props.tooltip}>{render}</Tooltip>}
            {!props.tooltip && render}
        </Box>
    )
}


