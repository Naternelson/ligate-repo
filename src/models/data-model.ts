import { getAuth } from "firebase/auth"
import { FieldValue, serverTimestamp } from "firebase/firestore"

export type  Subscriber = SubscriberObject[]
export type SubscriberObject = {documentPath: string, attributePath: string, destinationPath: string}

export type PermissionValue = null | "admin" | "editor"
export type MetaDate = Date | FieldValue | null
export interface MetaAttribute {
    createdOn: MetaDate,
    createdBy: string | null, 
    updatedOn: MetaDate,
    updatedBy: string | null, 
    deleteOn: MetaDate, 
    expireOn: MetaDate 
}
export type Attributes = {[key:string|symbol]: any}
export interface DataModel {
    attributes: Attributes,
    subscribers: SubscriberObject[],
    permissions: {[uid:string]: PermissionValue}
    meta: MetaAttribute
}

export default class DocumentDataModel{
    static getBlank(){
        return new DocumentDataModel({}, {blank:true})
    }
    static build(props:Partial<DataModel>){
        const model = this.getBlank() 
        const {attributes, subscribers, permissions, meta} = props
        if(attributes) model.attributes = attributes 
        if(subscribers) model.subscribers = subscribers
        if(permissions) model.permissions = permissions 
        if(meta) model.meta = meta 
        return model 
    }
    attributes: Attributes = {}
    subscribers: SubscriberObject[] = []
    permissions: {[uid:string]: PermissionValue} = {}
    subcollections: string[] = []
    meta: MetaAttribute = {createdOn: null, createdBy: null, updatedOn: null, updatedBy: null, deleteOn: null, expireOn:null}

    updateMeta(){
        this.meta = {...this.meta, updatedOn: serverTimestamp(), updatedBy: getAuth().currentUser?.uid || null}
    }
    toObj(update?:boolean){
        if(update !== false) this.updateMeta()
        const {attributes, subscribers, permissions, meta, subcollections} = this 
        return {attributes, subscribers, permissions, meta, subcollections}
    }
    fromDotNotation(str:string){
        const sep = str.split(".")
        return sep.reduce((obj, nextLayer)=>{
            if(obj === undefined) return undefined
            return obj[nextLayer]
        },this.toObj() as any)
    }
    update(obj:{[key:string|symbol]: any}){
        for(let key in obj){
            const sep = key.split(".")
            sep.reduce((updateObj:any, nextLayer:any, currentIndex, arr)=>{
                if(currentIndex === (arr.length -1)) return updateObj[nextLayer] = obj[key]
                if(updateObj[nextLayer] === undefined) updateObj[nextLayer] = {}
                return updateObj[nextLayer]
            },this)
        }   
        return this 
    }
    remove(str:string){
        const sep = str.split(".")
            sep.reduce((updateObj:any, nextLayer:any, currentIndex, arr)=>{
                if(updateObj[nextLayer] === undefined) return undefined
                if(currentIndex === (arr.length -1)) return delete updateObj[nextLayer]
                return updateObj[nextLayer]
            },this.toObj() )
    }
    addSubcollection(string:string){
        const set = new Set(this.subcollections)
        set.add(string)
        this.subcollections = Array.from(set)
        return this 
    }
    removeSubcollection(string:string){
        const set = new Set(this.subcollections)
        set.delete(string)
        this.subcollections = Array.from(set)
        return this 
    }
    addPermisssion(permissions: {[uid:string]: PermissionValue}){
        this.permissions = {...this.permissions, ...permissions}
        return this 
    }
    removePermission(uid:string){
        delete this.permissions[uid]
        return this 
    }
    constructor(attributes?: {[key:string]:any}, options?:{blank?:boolean, userPermission?: PermissionValue}){
        if(attributes !== undefined) this.attributes = attributes
        if(options && options.blank) return this 
        const uid = getAuth().currentUser?.uid || ""
        this.meta = {
            ...this.meta, 
            createdOn: serverTimestamp(),
            createdBy: uid, 
            updatedOn: serverTimestamp(),
            updatedBy: uid
        }
        this.permissions[uid] = (options && options.userPermission) ? options.userPermission : "admin"
        return this
    }
}
