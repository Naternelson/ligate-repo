import { Checkbox, CheckboxProps, TableSortLabel, TableSortLabelProps, Typography } from "@mui/material"
import { useEffect } from "react"
import { ColumnDef, useTableContext } from "./context"
import { Cell, Row } from "./table-basics"


export const Header = () => {
    const context = useTableContext()

    return (
        <Row>
            <SelectorHeaderCell/>
            {context.columns.map(def => <HeaderCell key={def.field} {...def}/>)}
        </Row>
    )
}

export const SelectorHeaderCell = () => {
    const context = useTableContext()
    const checked = context.selected.allSelected()

    const indeterminate = context.selected.indeterminate() && !checked
    const cProps:CheckboxProps = {
        checked, indeterminate, 
        size: 'small',
        onChange: () => {
            if(indeterminate) return context.selected.unselectAll()
            context.selected.toggleSelectAll()
        }
    }
    // useEffect(() => {
    //  console.log({now: new Date().toLocaleDateString(), checked, indeterminate })   
    // })
    return (
        <Cell justifyContent="center">
            <Checkbox {...cProps}/>
        </Cell>
    )
}

export const HeaderCell = (props: ColumnDef) => {
    const context = useTableContext() 
    const sortLabelProps:TableSortLabelProps = {
        active: context.ordering.column === props.field,
        direction: context.ordering.direction,
        onClick: () => context.ordering.setColumn(props.field)
    }
    return (
        <Cell>
            <TableSortLabel {...sortLabelProps}>
                <Typography>{props.headerName ? props.headerName : props.field}</Typography>
            </TableSortLabel>
        </Cell>
    )
}