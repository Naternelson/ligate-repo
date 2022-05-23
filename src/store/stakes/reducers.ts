import { StakesState } from "./slice"
import { CaseReducer } from "../types"
import { StakeState } from "../current-stake/slice"

type Reducer<T> = CaseReducer<T, StakesState>

const startLoad: Reducer<undefined> = (state) => {
    state.loading = true 
    return state 
}
const endLoad: Reducer<undefined> = (state) => {
    state.loading = false 
    return state 
}
const addStakes:Reducer<{[id:string]: StakeState}> = (state, action) => {
    return {...state, data: {...state.data, ...action.payload}}
}
const removeStakes:Reducer<string[]> = (state, action) => {
    const ids = new Set(Object.keys(state.data))
    action.payload.forEach((s:string) => ids.delete(s))
    const data = Array.from(ids).reduce((obj, id) => ({...obj, [id]:state.data[id]}),{})
    state.data = data 
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
const selectStakes:Reducer<string[]> = (state, action) => {
    const stakeIds = new Set(Object.keys(state.data))
    action.payload.forEach(s => {
        if(stakeIds.has(s)) state.selected[s] = true 
    })
    return state 
}
const unselectStakes:Reducer<string[]> = (state, action) => {
    const stakeIds = new Set(Object.keys(state.data))
    const actionIds = new Set(action.payload)
    action.payload.forEach(s => {
        if(stakeIds.has(s)) state.selected[s] = false 
    })
    return state 
}
const toggleStakes:Reducer<string[]> = (state, action) => {
    const stakeIds = new Set(Object.keys(state.data))
    const actionIds = new Set(action.payload)
    actionIds.forEach(s => {
        if(stakeIds.has(s)) state.selected[s] = !state.selected[s] 
    })
    return state 
}
const focusStake:Reducer<string> = (state, action) => {
    const id = action.payload
    if(id in state.data) state.focus = id 
    return state 
}
const clearFocus:Reducer<undefined> = state => {
    return {...state, focus: null}
}

const reducers =  {startLoad, endLoad, addStakes, removeStakes, selectAll, selectStakes, unselectStakes, toggleStakes, focusStake, clearFocus, unselectAll}



export default reducers 
