import { createSelector, createSlice } from "@reduxjs/toolkit"
import { HumanName } from "../user/slice"
import reducers from "./reducers"
import {StakeState, UnitType} from "../current-stake/slice"
import { useSelector, useStore } from "react-redux"
import faker from "@faker-js/faker"

export interface MembersState {
    loading: boolean,
    selected: {[key:string]: boolean},
    focus: string | null,
    data: {[id:string]: MemberState}
}

export interface Ward{
    id: string, 
    type: UnitType
    name: string, 
    city: string, 
    state: string 
}
export interface Stake{
    id: string, 
    type: UnitType
    name: string, 
    city: string, 
    state: string 
}
export type CallingTitle = "Sunday School Teacher" | "Secretary" | "Primary Teacher" | "Ward Mission Leader" | "Elder's Quorum President" | "Relief Society President" | string
export interface Calling {
    id: string, 
    status: boolean, 
    calledOn: string | number | null, 
    title: string,
    sustainedOn: string | number | null, 
    releasedOn: string | number | null, 
}

export interface MemberState {
    loading: boolean, 
    id: string,
    name: HumanName | null,
    ward: Ward | null,
    stake: Stake | null, 
    callingId: string| null,
    callings: {[id:string]: Calling},
    activityId: string| null,
    activityHistory: {
        [id:string]: {
            id:string,
            value: number, 
            date: string | number 
        }
    },
    address: StakeState["address"]
}


const initialState: MembersState = {
    loading: false, 
    selected: {},
    focus: null,
    data: {}
}

const slice = createSlice({initialState, name: 'members', reducers})
export const membersReducer = slice.reducer
export const membersAction = slice.actions


const selectMembers = (state:any) => state.members.data

type SelectMemberByStake = {
    [stakeId:string]: {[memberId:string]: MemberState}
}
export const selectMemberByStake = createSelector(selectMembers, (members:MembersState["data"]):SelectMemberByStake => {
    return Object.values(members).reduce((stakesObj:any, member) => {
        const stakeId = member.stake?.id
        if(stakeId === undefined) return stakesObj 
        const focusStake = stakesObj[stakeId] || {}
        return {...stakesObj, [stakeId]: {...focusStake, [member.id] : member}}
    },{})
}) 

export function useMembers(memberId?:string) {
    const members = useSelector(selectMembers) 
    if(memberId === undefined) return members 
    return members[memberId]
}

export function useStakeMembers(stakeId?:string){
    const store = useStore()
    const stakes = selectMemberByStake(store.getState() as any)
    if(stakeId === undefined) return stakes 
    return stakes[stakeId]
}

export function initializeMember(data: Partial<MemberState> = {}){
    const defaultObject:MemberState = {
        loading: false,
        id: faker.random.alphaNumeric(10),
        name: null,
        ward: null, 
        stake: null, 
        callingId: null, 
        callings: {},
        activityId: null, 
        activityHistory: {},
        address: null  
    }
    return {...defaultObject, ...data }
}


export function initializeMembersState(members:MembersState["data"]={}){
    return {
        loading: false, 
        selected: {},
        focus: null, 
        data:members
    }
}

export function initializeCalling(calling?:Partial<Calling>):Calling{
    const defaultObject:Calling = {
        id: faker.random.alphaNumeric(10),
        status:false, 
        calledOn: null, 
        title: "",
        sustainedOn: null, 
        releasedOn: null,
    }
    return {...defaultObject, ...calling}
}