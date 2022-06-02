export const range = (to:number, from:number=0) =>{
    const arr:Array<number> = []
    for(let i=from; i < to; i++){
        arr.push(i)
    }
    return arr 
}