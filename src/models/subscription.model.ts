import { ActivityRate, Address, RecommendType } from "./member.model";
import { DateField } from "./room.model";
import { UnitControl, UnitVariant } from "./unit.model";
import { Gender, HumanName } from "./user.model";

export type Subscription = {
    providerWardId: string 
    providerWardName: string 
    providerWardVariant: UnitVariant
    providerWardControl: UnitControl

    providerStakeId: string 
    providerStakeName: string 
    providerStakeVariant: UnitVariant
    providerStakeControl: UnitControl

    subscriberUnitId: string 
    subscriberUnitName: string 
    subscriberUnitVariant: UnitVariant
    subscriberUnitControl: UnitControl

    memberId: string 

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
} & HumanName & Partial<Address>

