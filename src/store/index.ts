import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { currentStakeReducer } from "./current-stake/slice";
import { preloadedStore } from "./seed";
import { stakesReducer } from "./stakes/slice";
import { userReducer } from "./user/slice";

export default configureStore({
    reducer: combineReducers({
        currentStake: combineReducers({
            stake: currentStakeReducer
        }),
        stakes: stakesReducer,
        user: userReducer
    }),
    preloadedState: preloadedStore
})

