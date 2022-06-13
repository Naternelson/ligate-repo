export class BaseClass {
    static attributes: string[] = []
    toObject(){
        const fn = this.constructor as any  
        return fn.attributes
    }
    
}