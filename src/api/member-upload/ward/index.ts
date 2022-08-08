import { DocumentData, DocumentSnapshot, Timestamp } from "firebase/firestore";
import { ParseResult } from "papaparse";
import { ActivityRate, Member, SubscriptionRequest, Unit, UnitControl, UnitType, UnitVariant } from "../../../models";
import { getUnit, newMember, newUnit, sanitizeString } from "../../helpers";
import { CSVParseProps } from "../../parse-csv";
import {parseCSV} from "../../parse-csv";
type WardMemberConfig = {
    wardId: string 
    stakeId: string 
} & CSVParseProps


export default function processWardMemberUpload(config: WardMemberConfig) {
    const {wardId, stakeId, ...p} = config
    const recordUnits = retrieveUnitsofRecord(wardId, stakeId)

    return parseCSV(p) 
} 

export const retrieveUnitsofRecord = async (wardId:string, stakeId: string) => {
    return {
        ward: await getUnit(wardId),
        stake: await getUnit(stakeId)
    }
}

type UnitShortHand = {id:string, name: string, variant:UnitVariant, type:UnitType, control:UnitControl}
interface StepWrapperConfig {
    controllingUnits: {ward:DocumentSnapshot<DocumentData>, stake: DocumentSnapshot<DocumentData>}
    foreignUnits: {[id:string]: UnitShortHand}
}

type MemberStake = Pick<Member, "stakeControl" | "stakeId" | "stakeName" | "stakeVariant"> 
type MemberWard = Pick<Member, "wardControl" | "wardId" | "wardName" | "wardVariant">
type MemberUnits = MemberStake & MemberWard 


export const stepWrapper = (unitsOfRecord: {ward:DocumentSnapshot<DocumentData>, stake: DocumentSnapshot<DocumentData>}) => {
    const config:StepWrapperConfig = {controllingUnits: unitsOfRecord,foreignUnits: {}}
    
    const step: CSVParseProps["step"] = (results)=> {
        let units:MemberUnits
        let request:SubscriptionRequest
        const member = newMember()

        const params = approvedParams(results)
        if(params.hasRecords) {
            units = extractControllingUnits(config.controllingUnits)
        }
        else {
            units = extractPlaceholderUnits(params, config)
        }


    }
}

export const createSubRequest = (params: ReturnType<typeof approvedParams>, config: StepWrapperConfig, unit: string):any =>{
    const {hasRecords} = params
    let requestingUnit:UnitShortHand
    let recordUnit:UnitShortHand

    if(hasRecords) requestingUnit = config.foreignUnits[unit]
    // if(hasRecords) recordUnit = 
}

export const extractControllingUnits = (controllingUnits:StepWrapperConfig["controllingUnits"]):MemberUnits => {
    const wardData = extractUnitFromSnap(controllingUnits.ward)
    const stakeData = extractUnitFromSnap(controllingUnits.stake)
    const keys = ["stakeControl", "stakeId", "stakeName", "stakeVariant", "wardControl", "wardId", "wardName", "wardVariant"]
    const units =  keys.reduce((obj, key) => {
        const variable = key.includes("stake") ? stakeData[key.slice(5) as keyof typeof stakeData] : wardData[key.slice(4) as keyof typeof wardData]
        return {...obj, [key as keyof MemberUnits]: variable} 
    },{} as Partial<MemberUnits>)
    return units as MemberUnits
}

const extractUnitFromSnap = (unit:DocumentSnapshot<DocumentData>):UnitShortHand => {
    const data = unit.data() as Unit 
    return {
        id: unit.id, 
        name: data.name, 
        variant: data.variant, 
        control: data.control, 
        type: data.type 
    }
}

export const extractPlaceholderUnits = (params: ReturnType<typeof approvedParams>, config: StepWrapperConfig):MemberUnits => {
    const {subStake, subWard} = params 
    const stake = newUnit() 
    const ward = newUnit() 
    const units =  {
        stakeControl: UnitControl.PLACEHOLDER, 
        stakeId: stake.id,
        stakeName: subStake,
        stakeVariant: UnitVariant.STANDARD,
        wardControl: UnitControl.PLACEHOLDER, 
        wardId: ward.id,
        wardName: subWard, 
        wardVariant: UnitVariant.STANDARD
    }
    config.foreignUnits[stake.id] = {
        id: units.stakeId,
        name: units.stakeName,
        variant: units.stakeVariant,
        control: units.stakeControl,
        type: UnitType.STAKE
    }
    config.foreignUnits[ward.id] = {
        id: units.wardId,
        name: units.wardName,
        variant: units.wardVariant,
        control: units.wardControl,
        type: UnitType.WARD
    }
    return units
}


export const approvedParams = (results:ParseResult<any>) => {
    const [hasRecords, homeStake, homeWard, firstName, lastName, birthDate, hasCalling, callingTitle, recommend, activity] = results.data.map((str:string) => sanitizeString(str))
    return {
        hasRecords: hasRecords === "yes",
        subStake: homeStake, 
        subWard: homeWard, 
        firstName, 
        lastName,
        birthDate: birthDate !== "" ? toTimestamp(birthDate) : undefined,
        hasCalling: hasCalling === "yes",
        callingTitle: (hasCalling === "yes" && callingTitle !== "") ? callingTitle : undefined, 
        recommend: recommend === "yes",
        activity: activity in ActivityRate ? activity : ActivityRate.UNKNOWN 
    }
}

export const toTimestamp = (date:Date | string) => {
    return Timestamp.fromDate(new Date(date))
}