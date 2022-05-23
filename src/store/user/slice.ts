import { createSlice } from "@reduxjs/toolkit"
import reducers from "./reducers"

export interface HumanName{
    first: string, 
    middle: null|string, 
    last: string, 
    display: string| null
}

export type Gender = "male" | "female" | "non-binary" | "other" | "prefer not to say" | null

export interface UserState {
    loading:boolean, 
    name: HumanName|null,
    email:string|null, 
    profileImg: null|string, 
    birthdate:string|number|Date|null,
    uid: string|null,
    gender:Gender
}


export const initialState: UserState = {
    loading: false, 
    name: null, 
    email:null, 
    profileImg: null, 
    birthdate:null,
    uid: null,
    gender: null 
}

const slice = createSlice({initialState, name: 'user', reducers})
export const userReducer = slice.reducer
export const userActions = slice.actions

