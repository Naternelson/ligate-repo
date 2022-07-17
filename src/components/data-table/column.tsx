import { ReactElement, ReactNode } from "react"
import { DataTableApi } from "."

interface ColumnParams{
    hidden?: boolean
    minWidth?: string
    maxWidth?: string 
    flex?: string 
    colSpan?: number | ((cellValue: unknown) => number)
    field: string
    headerName?: string | ((api:DataTableApi) => ReactNode) | ReactNode
    valueGetter?: (params:unknown) => ReactElement | string 
    type?: string 
}


export class ColumnDef {
    hidden: boolean = false
    minWidth?: string
    maxWidth?: string 
    flex?: string 
    colSpan?: number | ((cellValue: unknown) => number)
    field: string =""
    headerName?:string 
    valueGetter?: (params:unknown) => ReactElement | string 
    type:string= 'string'

    constructor(params: ColumnParams){
        Object.assign(this, params)
    }
}