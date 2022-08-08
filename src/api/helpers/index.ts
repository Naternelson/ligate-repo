import { collection, doc, getDoc, getFirestore } from "firebase/firestore"
import { range } from "../../utility/range"

export const getDocument = (collection: string) => (documentId: string) => {
    return getDoc(doc(getFirestore(), collection, documentId))
}

export const newDocument = (collectionName:string) => () => {
    return doc(collection(getFirestore(), collectionName))
}

export const getUnit = getDocument("units")
export const newUnit = newDocument("units")

export const getMember = getDocument("members")
export const newMember = newDocument("newMember")

export enum StringCase   {
    SNAKE = 'snake',
    LOWER = 'lower',
    UPPER = 'upper',
    CAMEL = 'camel',
    CAPITALIZE =  'capitalize',
    KEBAB = 'kebab',
}

export type SanitizeString = {
    specialCase?: StringCase
    maxSpaces?:number
    trim?: boolean, 
}



export const stringSanitizer = (config:SanitizeString = {trim:true, maxSpaces: 1}) => (str:string) =>  {
    const {specialCase, maxSpaces, trim} = config 
    let s:string = str 
    if(typeof maxSpaces === "number")s = convertSpaces(s, maxSpaces)
    if(trim) s = s.trim()
    switch(specialCase){
        case StringCase.LOWER: 
            s = s.toLocaleLowerCase() 
            break 
        case StringCase.UPPER: 
            s = s.toLocaleUpperCase()
            break 
        case StringCase.CAMEL: 
            s = toCamelCase(s)
            break 
        case StringCase.CAPITALIZE: 
            s = toCapitalized(s)
            break 
        case StringCase.SNAKE: 
            s = toSnakeCase(s)
            break
    }
    return s 
}

export const sanitizeString = stringSanitizer()

export const toCamelCase = (str:string)  => {
    const split = str.split(/\s+/gm) 
    return split.map((word, i) => {
        if(i === 0) return word.toLocaleLowerCase() 
        return word[0].toLocaleUpperCase() + word.slice(1).toLocaleLowerCase()
    }).join("")
}
export const toCapitalized = (str:string) => {
    const split = str.split(/\s+/gm)
    return split.map(word => {
        return word[0].toLocaleUpperCase() + word.slice(1).toLocaleLowerCase()
    }).join(" ")
}

export const toKebabCase = (str:string) => {
    const split = str.split(/\s+gm/)
    return split.map(word => {
        return word.toLocaleLowerCase() 
    }).join("-")
}

export const toSnakeCase = (str:string) => {
    const split = str.split(/\s+gm/)
    return split.map(word => {
        return word.toLocaleLowerCase() 
    }).join("_")
}

export const convertSpaces = (str:string, maxSpaces:number) => {
    const spaces = range(maxSpaces).map(() => " ").join("")
    return str.replaceAll(/\s+/gm, spaces)
}