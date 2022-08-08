import Papa from "papaparse"

export type CSVParseProps = {
    file: File 
    timeout?: number
    onTimeout?: () => void 
} & Partial<Papa.ParseLocalConfig>

export enum ParseStatus  {
    PROCESSING = "processing",
    ERROR = "error",
    COMPLETE = 'complete'
}

export function parseCSV(config:CSVParseProps){
    
    const {file, timeout, onTimeout, complete, step, error, ...c} = config
    return new Promise((res, rej)=> {
        let aborted = false 
        if(onTimeout) setTimeout(() => {
            onTimeout()
            aborted = true 
            rej("TIMEOUT")
        })
        Papa.parse(file, {
            complete: (results, file) => {
                !!complete && complete(results,undefined)
                res({results, file})
            },
            error: (err, file) => {
                error && error(err, undefined)
                rej({error:err, file})
            },
            step: (results, parser) => {
                if(aborted) return parser.abort()
                if(step) step(results, parser)
            },
            ...c
        }) 
        
    })
}