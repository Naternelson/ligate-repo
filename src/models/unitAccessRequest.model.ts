import { Status } from "./member.model"
import { DateField } from "./room.model"
import { UnitType, UnitVariant, UserAccess } from "./unit.model"
import { HumanName } from "./user.model"

export type UnitAccessRequest = {
    uid: string 
    requestToUnitId: string 
    requestToUnitName: string 
    requestToUnitVariant: UnitVariant
    requestToUnitType: UnitType
    
    status: Status,
    statusReason: string | null 
    rejectedOn: DateField | null 
    confirmedOn: DateField | null 
    title: string, 
    access: UserAccess
} & HumanName

