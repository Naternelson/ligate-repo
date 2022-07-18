import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { GlobalState } from "..";

const initialState: {
    [id: string]: {
        firstName: string, 
        lastName: string, 
        stake: string, 
        ward: string, 
        activity: 'active' | 'semi' | 'inactive' | 'do not contact'
        recommend: boolean, 
        calling: null | string | boolean,
        loading: boolean, 
        reportTo: {id:string, type: 'ward' | 'stake'}[] 
    }
} = {}
type State = typeof initialState 
type Member = typeof initialState[keyof State]

const reducers = {
    updateMembers: (state:State, action:PayloadAction<State>) => {state = {...state, ...action.payload}},
    removeMembers: (state:State, action:PayloadAction<string[]>) => {action.payload.forEach(id => delete state[id])},
    changeActivity: (state:State, action:PayloadAction<{activity:Member['activity'], ids: string[]}>) => {action.payload.ids.forEach(id => state[id].activity = action.payload.activity)},
    changeRecommend: (state:State, action:PayloadAction<{recommend:Member['recommend'], ids: string[]}>) => {action.payload.ids.forEach(id => state[id].recommend = action.payload.recommend)},
    changeCalling: (state:State, action:PayloadAction<{calling:Member['calling'], ids: string[]}>) => {action.payload.ids.forEach(id => state[id].calling = action.payload.calling)},
    toggleMemberLoad: (state:State, action: PayloadAction<string>) => {state[action.payload].loading = !state[action.payload].loading},
    startMemberLoad: (state:State, action:PayloadAction<string>/**Member iD */) => {state[action.payload].loading = true },
    endMemberLoad: (state:State, action:PayloadAction<string>) => {state[action.payload].loading = false }
}

const slice = createSlice({initialState, name: 'members', reducers})

export default slice 
export const membersReducer = slice.reducer 

export const useMemberSelector = (id?:string, cb?:(s:Member) => unknown) => {
    return useSelector((s:GlobalState) => {
        if(!id) return s.members
        if(!cb) return s.members[id]
        return cb(s.members[id])
    })
}

export const useMembersWhoReportToStake = (...stakeId:string[]) => {
    const members = useSelector((s:GlobalState) => s.members)
    return Object.values(members).filter(mem => {
        return mem.reportTo.find((s) => stakeId.includes(s.id) && s.type === "stake")
    })
}

export const useMembersWhoReportToWard = (...wardId:string[]) => {
    const members = useSelector((s:GlobalState) => s.members)
    return Object.values(members).filter(mem => {
        return mem.reportTo.find((s) => wardId.includes(s.id) && s.type === "ward")
    })
}

export const useMembersOfStake = (...stakeId:string[]) => {
    const members = useSelector((s:GlobalState) => s.members)
    return Object.values(members).filter(mem => {
        return stakeId.includes(mem.stake)
    })
}
export const useMembersOfWard = (wardId:string) => {
    const members = useSelector((s:GlobalState) => s.members)
    return Object.values(members).filter(mem => {
        return wardId.includes(mem.ward)
    })
}