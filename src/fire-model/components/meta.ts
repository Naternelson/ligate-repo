import { BaseClass } from "../base"

interface MetaClassAttributes {
    createdOn: Date | string | null 
    createdBy: string | null,
    updatedOn: Date | string | null 
    updatedBy: string | null 
    expiresOn: Date | string | null 
    expireBy: string | null 
    deleteOn: Date | string | null 
    deleteBy: string | null 
}
export default class Meta extends BaseClass implements MetaClassAttributes  {
    static attributes = 'createdOn createdBy updatedOn updatedBy expiresOn expireBy deleteOn deleteBy'.split(/\s+/)
    createdOn: string | Date | null = null 
    createdBy: string | null = null
    updatedOn: string | Date | null = null
    updatedBy: string | null = null 
    expiresOn: string | Date | null = null 
    expireBy: string | null = null 
    deleteOn: string | Date | null = null 
    deleteBy: string | null = null 

    constructor(props: Partial<MetaClassAttributes>){
        super()
        for(const key in props){
            const c = props[key as keyof MetaClassAttributes]
            this[key as keyof MetaClassAttributes] = c as keyof MetaClassAttributes
        }
    }
    get expired():boolean{
        if(this.expiresOn === null) return true 
        const d = new Date(this.expiresOn)
        const t = new Date() 
        return d.valueOf() < t.valueOf()
    }
    get deleteReady():boolean{
        if(this.deleteOn === null) return true 
        const d = new Date(this.deleteOn)
        const t = new Date() 
        return d.valueOf() < t.valueOf()
    }
}