import faker from "@faker-js/faker";
import { createSlice } from "@reduxjs/toolkit";
import reducers from "./reducers"

export type StakeTitle =  null | "President" | "1st Counselor" | "2nd Counselor" | "Secretary" | "Other"
export interface UnitRole {
    title: StakeTitle, 
    name: string 
}

export type StakeType =  null | "Standard" | "YSA" | "Married Student" | "Single Adult" | "Special Language" | "Other"

export interface CurrentStakeState{
    loading: boolean, 
    name: string | null,
    type: StakeType
    language?: string | null, 
    address: null | {
        street: string
        secondary:string, 
        city: string,  
        state: string, 
        zipcode:string 
    }
    roles: {
        [uid:string]: UnitRole
    }
}


const initialState: CurrentStakeState = {
    loading: false, 
    name: null, 
    address: null,
    type: null,  
    roles: {}
}

const slice = createSlice({initialState, name: 'stake', reducers})
export const currentStakeReducer = slice.reducer