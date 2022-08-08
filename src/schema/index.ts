/** LIGATE Schema Models */

type UnitType = 'stake' | 'ward'
type UnitVariant = "standard" | "ysa" | "sa"  | "special language" | "married student" | 'district' | 'branch'
type Gender = 'male' | 'female'

/**Path
 * /users - User
 * /units - Unit
 * /members - Member
 * /members/private/status - MemberStatus
 * /members/reports - MemberReportParam
 */



export interface Unit {
    name: string, 
    type: UnitType
    variant: UnitVariant
    source: null | string 
    city: string
    state: string 
    parentUnit: {
        id: string,
        name: string 
        type: UnitType,
        variant: UnitVariant,
    } 
    subUnits: {
        id: string,
        name: string 
        type: UnitType,
        variant: UnitVariant,
    }[]
}

export interface User {
    uid: string 
    firstName: string 
    lastName: string
    title: null | string 
    /**Unit this user is assigned to */
    unit: null | {
        id: string,
        name: string 
        type: UnitType,
        variant: UnitVariant,
    } 
}
export interface Member {
    firstName: string 
    lastName: string
    title: string
    /** Unit This User Belongs To */
    unit: {
        id: string,
        name: string 
        type: UnitType,
        variant: UnitVariant,
        parent: {
            id: string,
            name: string 
            type: UnitType,
            variant: UnitVariant,
        }
    },
    gender: Gender | null,
    profileURL: null | string,
    birthdate: string | null 
}

export interface MemberStatus {
    activity: 'active' | 'semi' | 'inactive' | 'do not contact'
    lastSeen: null | string 
    recommend: boolean 
    calling: string | boolean 
    addressConfirmed: null | boolean 
}

export interface MemberReportParam {
    unit: string 
    createdOn: string 
    expiresOn: string | null
    deletedOn: string | null 
}