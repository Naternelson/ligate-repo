import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { currentStakeReducer } from "./current-stake/slice";
import { stakesReducer } from "./stakes/slice";

export default configureStore({
    reducer: combineReducers({
        currentStake: combineReducers({
            stake: currentStakeReducer
        }),
        stakes: stakesReducer
    })
})