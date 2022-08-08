import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { GlobalState } from ".."
import { Unit } from "../../schema"

const initialState: {
    [id:string]: Unit & {loading: boolean }
} = {}

type State = typeof initialState
export type UnitType = Unit & {loading:boolean}

const reducers = {
    updateUnits: (state:State, action:PayloadAction<State>) => ({...state, ...action.payload}),
    updateUnit: (state:State, action: PayloadAction<Partial<UnitType> & {id:string}>) =>  {
        const {id, ...p} = action.payload
        const u = state[action.payload.id]
        if(!u) return state 
        state[action.payload.id] = {...u, ...p}
    },
    removeUnits: (state:State, action:PayloadAction<string | string[]>) => {
        const iter = [action.payload].flat()
        iter.forEach((id) => delete state[id])
    },
    toggleUnitLoad: (state:State, action:PayloadAction<string | string[]>) => {
        const iter = [action.payload].flat()
        iter.forEach((id) => state[id].loading = !state[id].loading)
    },
    startUnitLoad: (state:State, action:PayloadAction<string | string[]>) => {
        const iter = [action.payload].flat()
        iter.forEach((id) => state[id].loading = true)
    },
    endUnitLoad: (state:State, action:PayloadAction<string | string[]>) => {
        const iter = [action.payload].flat()
        iter.forEach((id) => state[id].loading = false)
    },
}

const slice = createSlice({initialState, name: 'units', reducers})
export default slice 
export const unitActions = slice.actions
export const unitsReducer = slice.reducer

export const unitsSelector = (state:GlobalState) => state.units 

export const unitSelector = (id:string) => (state:GlobalState) => state.units[id] 

export const useUnitSelector = (id:string) => {
    return useSelector(unitSelector(id))
}