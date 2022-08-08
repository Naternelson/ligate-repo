import { collection, doc, DocumentReference, getFirestore, runTransaction, serverTimestamp, Timestamp } from "firebase/firestore"
import Papa from "papaparse"
import { Gender, Subscription, SubscriptionRequest, Unit, UnitControl, UnitType, UnitVariant } from "../models"
import { ActivityRate, Member, Status } from "../models/member.model"

export type ParseCSVProps  = {
    file: any, 
    timeout?: number,
    onTimeout?:(message: string) => void 
} & Papa.ParseLocalConfig

export default function parseCSV(config: Partial<ParseCSVProps>) {
    const {file, timeout, onTimeout, complete, step, ...c} = config
    return new Promise((res, rej)=> {
        let aborted = false 
        Papa.parse(file, {
            complete: (results, file) => {
                config.complete && config.complete(results, file)
                res({results, file})
            },
            error: (error, file) => {
                rej({error, file})
            },
            step: (results, parser) => {
                if(aborted) parser.abort()
                if(step) step(results, parser)
            },
            skipEmptyLines: config.skipEmptyLines === false ? false : true,
            ...c 
        })
        setTimeout(()=> {
            aborted = true 
            rej("TIMEOUT")
        }, timeout || 10000)
    })
}

interface MemberUpload {
    file: File, 
    stake?: {
        id?: string 
        name: string 
    },
    ward?: {
        id?: string, 
        name: string 
    },
    uid: string 
}

export function uploadMembers(config: MemberUpload){
    let stake = {
        id: config.stake?.id,
        name: config.stake?.name,
        ref: null 
    }
    let ward = {
        id: config.stake?.id,
        name: config.stake?.name,
        ref: null 
    }
    const {file} = config
    parseCSV({file})
}




interface UnitConfigObject {
    stakeOfRecord?: {
        id: string, 
        name: string, 
        variant: UnitVariant, 
    },
    wardOfRecord?: {
        id: string, 
        name: string, 
        variant: UnitVariant, 
    },
    controlledUnits: {
        [unitName: string]: {
            id: string, 
            name: string, 
            variant: UnitVariant, 
            type: UnitType
        }
    }
}

async function parseRecord(record:Papa.ParseStepResult<any>, config: UnitConfigObject):UnitConfigObject{
    const [hasRecords, homeStake, homeWard, firstName, lastName, birthDate, hasCalling, callingTitle, recommend, activity] = record.data.map((el:string) => cleanT(el))
    const memberDoc = doc(collection(getFirestore(), "/members"))
    const member: Member = {
        firstName, lastName, 
        gender: Gender.UNKNOWN, 
        birthDate: Timestamp.fromDate(new Date(birthDate)),
        activity: (activity in ActivityRate) ? activity : ActivityRate.UNKNOWN,
        activityLastUpdate: serverTimestamp(),
        currentCalling: hasCalling === "yes",
        callingTitle: callingTitle !== "" ? callingTitle : undefined, 
        currentTempleRecommend: recommend === "yes",
        recommendLastUpdate: serverTimestamp(),
        callingLastUpdate: serverTimestamp(), 
        stakeControl: UnitControl.CLAIMED,
        stakeId: '',
        stakeName: '',
        stakeVariant: UnitVariant.YSA,
        wardControl: UnitControl.CLAIMED,
        wardId: '',
        wardName: '',
        wardVariant: UnitVariant.YSA
    }
    const ward = () => config.controlledUnits[homeWard]
    const stake = () => config.controlledUnits[homeStake]
    let request: SubscriptionRequest
    if(!!ward() || !!stake()) await createControlledWardStake(homeStake, homeWard, config)
    if(hasRecords){ 
        const s = config.stakeOfRecord
        const w = config.wardOfRecord 
        if(!s || !w) throw new Error("Cant find ward or stake")
        if(s?.id) member.stakeId = s.id 
        if(s?.name) member.stakeName = s.name 
        if(w?.id) member.wardId = w.id 
        if(w?.name) member.wardName = w.name 
        const foreignWard = config.controlledUnits[homeStake]
        request = {
            requestFromUnitId: foreignWard.id,
            requestFromUnitName: foreignWard.name,
            requestFromUnitVariant: foreignWard.variant,
            requestFromUnitControl: UnitControl.PLACEHOLDER,
            requestFromUnitType: UnitType.WARD, 
            requestToUnitControl: UnitControl.CLAIMED, 
            requestToUnitId: w.id, 
            requestToUnitName: w.name,
            requestToUnitType: UnitType.WARD, 
            requestToUnitVariant: w.variant, 
            status: Status.CONFIRMED, 
            statusReason: 'upload',
            confirmedOn: serverTimestamp(),
            memberId: memberDoc.id,
            rejectedOn: null, 
        }

    } else {
        const stakeUnit = config.controlledUnits[homeStake]
        const wardUnit = config.controlledUnits[homeWard]
        const w = config.wardOfRecord
        if(!w) throw new Error("Cannot find ward")
        member.stakeId = stakeUnit.id 
        member.stakeName = stakeUnit.name 
        member.stakeControl = UnitControl.PLACEHOLDER

        member.wardId = wardUnit.id 
        member.wardName = wardUnit.name 
        member.wardControl = UnitControl.PLACEHOLDER
        request = {
            requestFromUnitId: w.id,
            requestFromUnitName: w.name,
            requestFromUnitVariant: w.variant,
            requestFromUnitControl: UnitControl.CLAIMED,
            requestFromUnitType: UnitType.WARD, 
            requestToUnitControl: UnitControl.PLACEHOLDER, 
            requestToUnitId: wardUnit.id, 
            requestToUnitName: wardUnit.name,
            requestToUnitType: UnitType.WARD, 
            requestToUnitVariant: wardUnit.variant, 
            status: Status.CONFIRMED, 
            statusReason: 'upload',
            confirmedOn: serverTimestamp(),
            memberId: memberDoc.id,
            rejectedOn: null, 
        }
    }
    await uploadMember(member, request)
    return config
}



async function createControlledWardStake(homeStake:string, homeWard:string, config:UnitConfigObject){
    const stakeDoc = doc(collection(getFirestore(), "/units"))
    const wardDoc = doc(collection(getFirestore(), "/units"))
    const stake: Unit = {
        type: UnitType.STAKE,
        variant: UnitVariant.STANDARD,
        name: homeStake,
        control: UnitControl.PLACEHOLDER, 
        state: 'unknown',
        city: 'unknown',
        controlledBy: config.wardOfRecord?.id,
        language: 'english',
        subUnits: {
            [wardDoc.id]: {
                id: wardDoc.id, 
                type: UnitType.WARD,
                variant: UnitVariant.STANDARD,
                name: homeWard,
                control: UnitControl.PLACEHOLDER, 
                state: 'unknown',
                city: 'unknown',
                language: 'english',
            }
        },
        controlUnits: {}
    }
    const ward: Unit = {
        type: UnitType.WARD,
        variant: UnitVariant.STANDARD,
        name: homeWard,
        control: UnitControl.PLACEHOLDER, 
        state: 'unknown',
        city: 'unknown',
        controlledBy: config.wardOfRecord?.id,
        language: 'english',
        parentUnit: {
            id: stakeDoc.id, 
            type: UnitType.STAKE,
            variant: UnitVariant.STANDARD,
            name: homeStake,
            control: UnitControl.PLACEHOLDER, 
            state: 'unknown',
            city: 'unknown',
            language: 'english',
        },
        controlUnits: {}
    }
    await uploadUnit(stake, stakeDoc.id)
    await uploadUnit(ward, wardDoc.id)
    config.controlledUnits[homeStake] = {
            id: stakeDoc.id , 
            name: homeStake, 
            variant: UnitVariant.STANDARD, 
            type: UnitType.STAKE
    }
    config.controlledUnits[homeWard] = {
        id: wardDoc.id , 
        name: homeWard, 
        variant: UnitVariant.STANDARD, 
        type: UnitType.WARD
    }
}

function uploadUnit(unit:Unit, id:string){
    return runTransaction((getFirestore()), async (t) => {
        const unitDoc = doc(getFirestore(), "/units/"+ id) 
        t.set(unitDoc, unit)
    })
}


function uploadMember(member:Member, request: SubscriptionRequest){
    return runTransaction(getFirestore(), async (t) => {
        const memberDoc = doc(collection(getFirestore(), "members"))
        const subDoc = doc(collection((getFirestore()), "subscription-requests"))
        t.set(memberDoc, member)
        t.set(subDoc, request)
    })
}

function cleanT(str:string){
    return str.trim().replaceAll(/\s+/gm, " ") 
}

function nowStamp(){
    return Timestamp.fromDate(new Date())
}