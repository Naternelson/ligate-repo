import { Calling, MembersState, MemberState } from "./slice"
import { CaseReducer } from "../types"

type Reducer<T> = CaseReducer<T, MembersState>

const startLoad: Reducer<undefined> = (state) => {
    state.loading = true 
    return state 
}
const endLoad: Reducer<undefined> = (state) => {
    state.loading = false 
    return state 
}
const addMembers:Reducer<{[id:string]: MemberState}> = (state, action) => {
    return {...state, data: {...state.data, ...action.payload}}
}
const removeMembers:Reducer<string[]> = (state, action) => {
    const ids = new Set(Object.keys(state.data))
    action.payload.forEach((s:string) => ids.delete(s))
    const data = Array.from(ids).reduce((obj, id) => ({...obj, [id]:state.data[id]}),{})
    state.data = data 
    return state 
}
type PartialMember = Partial<MemberState> & {id:string}
const updateMember:Reducer<PartialMember> = (state,action) => {
    const member = state.data[action.payload.id]
    const updatedMember = {...member, ...action.payload}
    state.data[member.id] = updatedMember 
    return state 
}
const selectAll:Reducer<undefined> = state => {
    state.selected = Object.keys(state.data).reduce((obj:any, id) =>({...obj, [id]:true}),{})
    return state 
}
const unselectAll: Reducer<undefined> = state => {
    state.selected = {}
    return state 
}
const selectMembers:Reducer<string[]> = (state, action) => {
    const stakeIds = new Set(Object.keys(state.data))
    action.payload.forEach(s => {
        if(stakeIds.has(s)) state.selected[s] = true 
    })
    return state 
}
const unselectMembers:Reducer<string[]> = (state, action) => {
    const stakeIds = new Set(Object.keys(state.data))
    const actionIds = new Set(action.payload)
    action.payload.forEach(s => {
        if(stakeIds.has(s)) state.selected[s] = false 
    })
    return state 
}
const toggleMembers:Reducer<string[]> = (state, action) => {
    const stakeIds = new Set(Object.keys(state.data))
    const actionIds = new Set(action.payload)
    actionIds.forEach(s => {
        if(stakeIds.has(s)) state.selected[s] = !state.selected[s] 
    })
    return state 
}
const focusMember:Reducer<string> = (state, action) => {
    const id = action.payload
    if(id in state.data) state.focus = id 
    return state 
}
const clearFocus:Reducer<undefined> = state => {
    return {...state, focus: null}
}

type MemberCalling = {
    calling: Calling,
    makeActive: boolean /**Option to make this new calling the active calling */  
    id: string/**The ID of the member */
}

const addMemberCalling:Reducer<MemberCalling> = (state, action) => {
    state.data[action.payload.id].callings[action.payload.calling.id] = action.payload.calling
    if(action.payload.makeActive) state.data[action.payload.id].callingId = action.payload.calling.id 
    return state 
}
type RemoveCalling = {
    id: string /**The ID of the member */, 
    callingId: string /**The ID of the calling */
}
const removeMemberCalling:Reducer<RemoveCalling> = (state, action) => {
    delete state.data[action.payload.id].callings[action.payload.callingId]
    if(action.payload.callingId === state.data[action.payload.id].callingId) state.data[action.payload.id].callingId = null 
    return state 
}

type MemberActivity = {
    activity: {
        value: number, 
        date: string | number, 
        id: string 
    },
    makeActive: boolean /**Option to make this new entry the current entry */  
    id: string/**The ID of the member */
}

const addMemberActivity:Reducer<MemberActivity> = (state, action) => {
    state.data[action.payload.id].activityHistory[action.payload.activity.id] = action.payload.activity
    if(action.payload.makeActive) state.data[action.payload.id].activityId = action.payload.activity.id 
    return state 
}
type RemoveActivity = {
    id: string /**The ID of the member */, 
    activityId: string /**The ID of the acitivty history entry */
}
const removeMemberActivity:Reducer<RemoveActivity> = (state, action) => {
    delete state.data[action.payload.id].activityHistory[action.payload.activityId]
    if(action.payload.activityId === state.data[action.payload.id].activityId) state.data[action.payload.id].activityId = null 
    return state 
}



const reducers =  {startLoad, endLoad, addMemberActivity,removeMemberActivity, addMembers, removeMembers, updateMember, removeMemberCalling, addMemberCalling, selectAll, selectMembers, unselectMembers, toggleMembers, focusMember, clearFocus, unselectAll}



export default reducers 
