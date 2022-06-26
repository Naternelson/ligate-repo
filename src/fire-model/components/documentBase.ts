import { getAuth } from "firebase/auth";
import { DocumentReference, DocumentSnapshot } from "firebase/firestore";
import { BaseClass } from "../base";
import { getUid } from "./getUid";
import Meta from "./meta";
import Permissions from "./permissions";

export interface DocumentClass<P extends {}>{
    meta:Meta,
    permissions: Permissions
    publicAttributes: P,
    subcollections: string[],
    ref: DocumentReference
}
type BuildOptions = Partial<Exclude<DocumentClass<{}>,"publicAttributes" | "ref">>

export default class DocumentBase<P extends {}> extends BaseClass{
    static fromSnap<T>(snap:DocumentSnapshot){
        const data ={...snap.data()}
        data.ref = snap.ref
        return new this(data as DocumentClass<T>)
    }
    static build<T>(ref:DocumentReference, publicAttributes?:T, options?: BuildOptions){
        const data = {
            meta: new Meta(),
            permissions: new Permissions(),
            publicAttributes: publicAttributes || {},
            subcollections: [],
            ref,
            ...options
        }
        return new this(data)
    }
    static create<T>(ref:DocumentReference, publicAttributes?: T, options?: BuildOptions){
        const uid = getUid()
        if(uid === null) throw new UserNotSignedInError("No user found")
        const p = options?.permissions || {}
        const params:BuildOptions = {
            ...options,
            permissions: new Permissions({[uid]: "admin", ...p})
        }
        return this.build<T>(ref, publicAttributes, params)
    }
    ref: DocumentReference
    meta: Meta
    permissions:Permissions
    publicAttributes: P
    subcollections: string[]

    constructor(props: DocumentClass<P>){
        super()
        this.meta = props.meta
        this.permissions = props.permissions
        this.publicAttributes = props.publicAttributes
        this.ref = props.ref
        this.subcollections = props.subcollections
    }

    toObject() {
        return {
            meta: this.meta.toObject(),
            publicAttributes: this.publicAttributes,
            permissions: this.permissions.toObject(),
            subcollections: this.subcollections
        }
    }
    get expired():boolean{
        return this.meta.expired
    }
    get deleteReady():boolean{
        return this.meta.deleteReady
    }
    userPermission(uid?:string){
        const u = uid || getUid()
        if(u === null) return null 
        return this.permissions.values[u]
    }
    canView(){
        const p = this.userPermission()
        if(p === null) return false
        return true  
    }
    canEdit(){
        const p = this.userPermission()
        if(p === null) return false 
        if(p === "viewer") return false 
        return true 
    }
    canDelete(){
        return this.isAdmin()
    }
    isAdmin(){
        const p = this.userPermission()
        return p === "admin"
    }
}


export class UserNotSignedInError extends Error{
    constructor(message:string){
        super()
        this.name = "User is not signed in"
        this.message = message
    }
}