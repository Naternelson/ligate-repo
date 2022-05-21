import { CurrentStakeState } from "./slice"

type ActionPayload<T> = {type: string, payload:T}
type CaseReducer<T> = (state: CurrentStakeState, action:ActionPayload<T>) => CurrentStakeState

const modify: CaseReducer<Partial<CurrentStakeState>> = (state, action) => {
    return {...state, ...(action.payload|| {})}
}
const startLoad: CaseReducer<undefined> = (state) => {
    state.loading = true 
    return state 
}
const endLoad: CaseReducer<undefined> = (state) => {
    state.loading = false 
    return state 
}


const reducers = {modify, startLoad, endLoad}

export default reducers