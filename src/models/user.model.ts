import { UnitType, UnitVariant } from "./unit.model"

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    NONBINARY = 'non-binary',
    OTHER = 'other',
    UNKNOWN = 'unknown'
}

export type User =  {
    uid: string 
    email: string 
    phone?: string 
    profileURL?: string 
    gender: Gender
} & HumanName & UserAssignment & Partial<UserMemberProfile>

export interface HumanName {
    firstName: string
    lastName: string 
    preferredName?: string
    middleName?: string   
}

export interface UserAssignment { 
    unitId: string 
    unitName: string 
    unitType: UnitType,
    unitVariant: UnitVariant 
}

export interface UserMemberProfile {
    memberId: string 
    memberUnitId: string 
    memberUnitName: string 
    memberUnitType: UnitType,
    memberUnitVariant: UnitVariant 
}