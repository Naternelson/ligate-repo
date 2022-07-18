import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { GlobalState } from ".."

const initialState: {
    [id:string]: {
        loading: boolean 
        id: string, 
        name: string, 
        variant: 'ysa' | 'standard' | 'sa' | 'special language',
        city: string, 
        state: string, 
        permissions: {
            [uid: string]: {
                role: 'admin' | 'editor' | 'contributor'
            }
        },
        wards: {
            [id:string]: {
                id: string,
                loading: boolean, 
                name: string, 
                variant: 'ysa' | 'standard' | 'sa' | 'special language',
                city: string, 
                state: string
            }
        }
    }
} = {}

type State = typeof initialState
type Stake = typeof initialState[keyof State] 
type WardState = Stake['wards']
type Ward = WardState[keyof Stake['wards']]

const reducers = {
    updateStakes: (state:State, action:PayloadAction<{[id:string]: Stake}>) => {state = {...state, ...action.payload}},
    removeStakes: (state:State, action:PayloadAction<{[id:string]:Stake}>) =>{for(const key in action.payload) delete state[key]},
    updatePermissions: (state:State, action: PayloadAction<{stake: string, permissions: Stake['permissions']}>) => {
        const stake = state[action.payload.stake]
        stake.permissions = {...stake.permissions, ...action.payload.permissions}
    },
    removePermissions: (state:State, action: PayloadAction<{stake:string, ids: string[]}>) => {action.payload.ids.forEach(id => delete state[action.payload.stake].permissions[id])},
    updateWards: (state:State, action:PayloadAction<{stake:string, wards: Stake['wards']}>) => {state[action.payload.stake].wards = {...state[action.payload.stake].wards, ...action.payload.wards}},
    removeWards:(state:State, action:PayloadAction<{stake:string, ids: string[]}>) => {action.payload.ids.forEach(id => delete state[action.payload.stake].wards[id])},
    toggleStakeLoad: (state:State, action:PayloadAction<string>) => {state[action.payload].loading = !state[action.payload].loading},
    startStakeLoad: (state:State, action:PayloadAction<string>) => {state[action.payload].loading = true },
    endStakeLoad: (state:State, action:PayloadAction<string>) => {state[action.payload].loading = false  },
    toggleWardLoad: (state:State, action:PayloadAction<{stake: string, ward: string}>) => {state[action.payload.stake].wards[action.payload.ward].loading = !state[action.payload.stake].wards[action.payload.ward].loading},
    startWardLoad: (state:State, action:PayloadAction<{stake: string, ward: string}>) => {state[action.payload.stake].wards[action.payload.ward].loading = true },
    endWardLoad: (state:State, action:PayloadAction<{stake: string, ward: string}>) => {state[action.payload.stake].wards[action.payload.ward].loading = false  },
}

const slice = createSlice({initialState, name: 'stakes', reducers})
export default slice 
export const stakesReducer = slice.reducer

export const useStakeSelector = (id?: string, cb?:(state:Stake)=> unknown) => {
    return useSelector((state:GlobalState)=> {
        if(id === undefined) return state.stakes
        if(!cb) return state.stakes[id]
        return cb(state.stakes[id])
    })
}

export const useWardSelector = (stakeId: string, wardId?:string, cb?:(state:Ward)=>unknown) => {
    return useSelector((s:GlobalState) => {
        const stake = s.stakes[stakeId]
        if(!stake) return null 
        if(!wardId) return stake 
        const ward = stake.wards[wardId]
        if(!ward) return null 
        if(!cb) return ward 
        return cb(ward)
    })
}