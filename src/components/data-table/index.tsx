import { Box, BoxProps, Grid } from "@mui/material"
import { useRef, useState } from "react"
import { ColumnDef } from "./column"
import RowDef from "./row"


interface DataTableProps {
    containerProps?: BoxProps
    columns:ColumnDef[] 
    rows: RowDef[],
    noSelection?:boolean
    tableRef?: React.MutableRefObject<DataTableApi>
}

type CompareOperation = "==" | ">" | ">=" | "<" | "<=" | RegExp | "includes" | "excludes"

export interface DataTableApi{
    columns: ColumnDef[],
    rows: RowDef[],
    selected: {[id:string]:boolean}
    allSelected: boolean
    sorting?: {field: string, sort: 'asc' | 'desc' | null | undefined}
    filter?: {field: string | string[], operation: CompareOperation, value: string | number }
    onDelete?: (id:string, row:RowDef, api:DataTableApi) => Promise<void>
    onAdd?: (id:string, row:RowDef, api:DataTableApi) => Promise<void> 
    onUpdate?:(id:string, row:RowDef, api:DataTableApi) => Promise<void>
}
function useDataTableApi(props: DataTableApi){
    const renderCount = useState(0)
    const r = useRef(props)
    const loading = useRef(false)
    function sortBy(field:string, sort?: 'asc' | 'desc'){
        const previous = r.current.sorting
        r.current.sorting =  {
            field, 
            sort: sort ? sort : previous?.field === field ? previous?.sort === "desc" ? 'asc' : 'desc' : 'asc' 
        }
        render()
    }
    function filterBy(field:string, value: string|number, operation:CompareOperation="includes"){
        r.current.filter =  {field, value, operation}
        render()
    }
    function startLoad(){
        loading.current = true 
        render()
    }
    function endLoad(){
        loading.current = false
        render()
    }
    function render(){
        renderCount[1](p => p+1)
    }
    return {
        params: r, 
        loading: loading.current,
        sortBy, filterBy, startLoad, endLoad,
        render
    }
}


export default function DataTable(props:DataTableProps){

    return (
        <Box>

        </Box>
    )
}

function DataHeader(props: ReturnType<typeof useDataTableApi>){

}

function HeaderCell(props:{column: ColumnDef, api: DataTableApi}){
    if(props.column.hidden === true) return null 
    const span = typeof props.column.colSpan  === "number" ? props.column.colSpan : 1
    const justifySelf = props.column.type === "string" ? "start" : "center"
    const alignItems = "center"
    const minWidth = props.column.minWidth 
    const maxWidth = props.column.maxWidth 
    const flex = props.column.flex
    const name = typeof props.column.headerName === 'string'  || props.column.field 
    return (
        <Grid item sx={{span, justifySelf, alignItems, minWidth, maxWidth, flex}}>
            {name}
        </Grid>
    )
}