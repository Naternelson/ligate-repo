import { ReactNode } from "react"
import { DataTableApi } from "."

export default interface RowDef {
    id:string 
    [field:string]: string | number | ((id: string, row:RowDef, api:DataTableApi) => ReactNode) | ReactNode
}