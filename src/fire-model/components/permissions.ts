import { BaseClass } from "../base";

type PermissionValue = "admin" | "editor" | "viewer"
type values = {[uid:string]: PermissionValue}
export default class Permissions extends BaseClass{
    static attributes: string[] = ["values"]
    toObject() {
        return this.values
    }
    values: values = {}
    constructor(values?: values){
        super()
        this.values = {...this.values, ...values}
    }
    change(value: {uid: string, value: PermissionValue}){
        this.values[value.uid] = value.value
    }
}