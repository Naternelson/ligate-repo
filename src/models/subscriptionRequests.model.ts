import { Status } from "./member.model"
import { DateField } from "./room.model"
import { UnitControl, UnitType, UnitVariant } from "./unit.model"
import { HumanName } from "./user.model"

export type SubscriptionRequest = {
    requestFromUnitId: string 
    requestFromUnitName: string 
    requestFromUnitVariant: UnitVariant
    requestFromUnitType: UnitType
    requestFromUnitControl: UnitControl

    requestToUnitId: string 
    requestToUnitName: string 
    requestToUnitVariant: UnitVariant
    requestToUnitType: UnitType
    requestToUnitControl: UnitControl

    status: Status,
    statusReason: string | null 
    rejectedOn: DateField | null 
    confirmedOn: DateField | null 
    subscriptionId?: string 
    memberId?: string 
} & Partial<HumanName>