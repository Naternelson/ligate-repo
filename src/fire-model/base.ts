export class BaseClass {
    static attributes: string[] = []
    toObject(){
        const fn = this.constructor as any 
        const attributes = fn.attributes as string[]
        return attributes.reduce((obj, a) => {
            const temp = this[a as keyof typeof this] as any
            return obj[a] = temp
        },{} as any)
    }

}