import { DateField } from "./room.model";
import { UnitControl, UnitType, UnitVariant } from "./unit.model";
import { Gender, HumanName } from "./user.model";

export type Member = {
    membershipRecordNumber?: string,
    email?: string,
    phoneNumber?: string 
    birthDate?: DateField,
    gender: Gender, 
    activity: ActivityRate,
    activityLastUpdate: DateField | null 
    currentTempleRecommend: boolean
    recommendType?: RecommendType
    recommendExp?: DateField 
    recommendLastUpdate: DateField | null 
    currentCalling: boolean, 
    callingTitle?: string 
    calledOn?: DateField 
    sustainedOn?: DateField 
    callingLastUpdate: DateField | null 
    uid?: string 


} & HumanName & WardRecord & StakeRecord & Partial<Address>

export type WardRecord = {
    wardId: string, 
    wardName: string,
    wardVariant: UnitVariant,
    wardControl: UnitControl
}
export type StakeRecord = {
    stakeId: string 
    stakeName: string, 
    stakeVariant: UnitVariant,
    stakeControl: UnitControl
}

export enum ActivityRate{ 
    ACTIVE  = "active",
    SEMI = "semi",
    INACTIVE = 'inactive',
    DONOTCONTACT = 'do not contact',
    UNKNOWN = 'unknown'
}

export type Address = {
    streetAddress: string, 
    secondaryAddress?: string
    city: string 
    state: string 
    country?: string 
    zipcode?: string
    addressName?: string
    addressConfirmed?: boolean
} 
export enum RecommendType {
    UNENDOWED='unendowed',
    ENDOWED='endowed',
    LIVING='living ordinance'
}


export type CallingHistory = {
    title: string 
    calledOn: DateField | null
    sustainedOn: DateField | null
    unitId: string
    unitName: string
    unitVariant: UnitVariant
    unitType: UnitType
    releasedOn: DateField | null
    status: Status 
    statusReason: string | null 
}

export type RecordHistory = {
    transferredToWardID: string 
    transferredToWardName: string 
    transerredToWardVariant: UnitVariant,
    transferredToStakeID: string 
    transferredToStakeName: string 
    transerredToStakeVariant: UnitVariant,
    receivedFromWardID?: string 
    receivedFromWardName?: string 
    receivedFromWardVariant?: UnitVariant,
    receivedFromStakeID?: string 
    receivedFromStakeName?: string 
    receivedFromStakeVariant?: UnitVariant,
    status: Status,
    statusReason: DateField | null 
    receivedOn?: DateField | null 
    requestedOn: DateField | null 
    deniedOn?: DateField
}

export type RecommendHistory = {
    type: RecommendType
    exp: string
    issuedOn: DateField
}

export enum Status  {
    PENDING = "pending",
    CONFIRMED = 'confirmed',
    REJECTED = 'rejected'
}