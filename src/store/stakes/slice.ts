import { createSlice } from "@reduxjs/toolkit"
import {StakeState} from "../current-stake/slice"
import reducers from "./reducers"

export interface StakesState {
    loading: boolean,
    selected: {[key:string]: boolean},
    focus: string | null,
    data: {[id:string]: StakeState}
}


const initialState: StakesState = {
    loading: false, 
    selected: {},
    focus: null,
    data: {}
}

const slice = createSlice({initialState, name: 'stakes', reducers})
export const stakesReducer = slice.reducer
