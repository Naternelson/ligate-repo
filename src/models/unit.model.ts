import { HumanName } from "./user.model"

export interface Unit {
    type: UnitType
    variant: UnitVariant, 
    name: string 
    city: string 
    state: string 
    control: UnitControl
    controlledBy?: string
    language: string
    parentUnit?: {
        id: string,
        type: UnitType, 
        name: string, 
        variant: UnitVariant 
        city: string 
        state: string 
        control: UnitControl
        language: string
    },
    controlUnits: {
        [id: string]: {
            id:string, 
            type: UnitType, 
            name: string, 
            variant: UnitVariant 
            city: string 
            state: string 
            control: UnitControl
            language: string
        }
    }
    subUnits?: {
        [id: string]: {
            id:string, 
            type: UnitType, 
            name: string, 
            variant: UnitVariant 
            city: string 
            state: string 
            control: UnitControl
            language: string
        }
    } 
}

export enum UnitType {
    WARD = 'ward',
    STAKE = 'stake'
}

export enum UnitVariant {
    YSA = 'young single adult',
    SA = 'single adult',
    STANDARD = 'standard',
    SL = 'special language'
}
/** A Claimed unit, is one where the user is the primary caretaker of the unit. A placeholder unit is a temp unit set up to assign other members to.  */
export enum UnitControl {
    PLACEHOLDER = 'placeholder',
    CLAIMED = 'claimed'
}

export interface UnitUsers {
    users: {[uid: string]: UserAccess}
}

export type UserUser = { 
    uid: string 
    title: string 
    access: UserAccess
} & HumanName

export enum UserAccess  {
    /**An Unit Admin can create, delete, and edit a unit and all controlling units, grant access rights to others etc */
    ADMIN = 'admin',
    /**An Unit Editor can edit a unit and all controlling units, but cannot grant access rights and cannot delete unit */
    EDITOR = 'editor'
}
