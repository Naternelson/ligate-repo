import { StakeState } from "./slice"
import { CaseReducer } from "../types"

type Reducer<T> = CaseReducer<T, StakeState>

const modify: Reducer<Partial<StakeState>> = (state, action) => {
    return {...state, ...(action.payload|| {})}
}
const startLoad: Reducer<undefined> = (state) => {
    state.loading = true 
    return state 
}
const endLoad: Reducer<undefined> = (state) => {
    state.loading = false 
    return state 
}


const reducers = {modify, startLoad, endLoad}

export default reducers