/**
 * 
 * @param ms The number of milliseconds to wait before continuing
 * @returns A Promise that resolves when the time has elapsed
 */
export function wait(ms:number){
    return new Promise(res => {
        setTimeout(res, ms)
    })
}