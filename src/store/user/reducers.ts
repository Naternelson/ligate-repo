import {UserState, initialState} from "./slice"
import {CaseReducer} from "../types"

type Reducer<T> = CaseReducer<T, UserState>

const startLoad: Reducer<undefined> = (state) => {
    state.loading = true 
    return state 
}
const endLoad: Reducer<undefined> = (state) => {
    state.loading = false 
    return state 
}
type LoginType = Omit<Partial<UserState>, "uid"> & {uid:string}
const login:Reducer<{[id:string]: LoginType}> = (state, action) => {
    return {...state, ...action.payload}
}
const logout = () => {
    return initialState
}

const modify:Reducer<{[id:string]: Omit<LoginType, "uid">}> = (state, action) => {
    return {...state, ...action.payload}
}


const reducers =  {startLoad, endLoad, login, logout, modify}



export default reducers 
