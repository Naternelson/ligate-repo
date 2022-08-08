import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { GlobalState } from "..";

const initialState: {
    homeUnit: string | null
    featuredStake: string | null 
    featuredWard: null | string 
    selected: {[id: string]: boolean},
    allSelected: boolean
    activeColumn: string | null 
    sortDirection: 'asc' | 'desc',
    loading: boolean,
    errorMessage: string[]
} = {homeUnit: null, featuredStake: null, featuredWard: null, selected: {}, activeColumn: null, allSelected: false,  sortDirection: 'asc', loading: false, errorMessage: []}

type State = typeof initialState

const reducers = {
    changeHomeUnit: (state: State, action:PayloadAction<string>) => {state.homeUnit = action.payload},
    changeFeaturedStake: (state: State, action:PayloadAction<string>) => {state.featuredStake = action.payload},
    toggleMembers: (state: State, action:PayloadAction<string[]>) => {action.payload.forEach(id => state.selected[id] = !state.selected[id])},
    selectMembers: (state:State, action:PayloadAction<string[]>) => {action.payload.forEach(id => state.selected[id] = true)},
    unselectMemebrs: (state:State, action:PayloadAction<string[]>) => {action.payload.forEach((id) => state.selected[id] = false)},
    selectAll: (state:State) => {state.allSelected = true },
    deselectAll:(state:State) => {
        state.allSelected = false 
        state.selected = {}
    },
    toggleSelectAll:(state:State) => {
        if(!state.allSelected) {
            state.allSelected = true 
            return state
        }
        state.allSelected = false 
        state.selected = {}
    },
    changeActiveColumn: (state:State, action:PayloadAction<string>) => {state.activeColumn = action.payload},
    toggleDirection:(state:State) =>{state.sortDirection =  state.sortDirection === "desc" ? "asc" : "desc"},
    sortAsc: (state:State) => {state.sortDirection = "asc"},
    sortDesc:(state:State) => {state.sortDirection = "desc"},
    toggleLoad: (state:State)  => {state.loading = !state.loading},
    startLoading: (state:State) =>  {state.loading = true},
    endLoading:(state:State) => {state.loading = false},
    changeErrorMessage: (state:State, action: PayloadAction<string | string[]>) => {state.errorMessage = [action.payload].flat()},
    addErrorMessage:(state:State, action:PayloadAction<string | string[]>) => {state.errorMessage = [...state.errorMessage, action.payload].flat()},
    popErrorMessage:(state:State) => {state.errorMessage.pop()},
    shiftErrorMessage: (state:State) => {state.errorMessage.shift()},
    clearErrorMessage: (state:State) => {state.errorMessage = []}
}


const slice = createSlice({initialState, name: 'ui', reducers})

export default slice 
export const uiReducer = slice.reducer



export function useUiState(cb?:(state:State) => unknown) {
    return useSelector((s:GlobalState) => cb ? cb(s.ui): s.ui)
}