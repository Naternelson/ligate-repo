import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { currentStakeReducer } from "./current-stake/slice";
import { membersReducer } from "./members/slice";
import { preloadedStore } from "./seed";
import { stakesReducer } from "./stakes/slice";
import { userReducer } from "./user/slice";

const store = configureStore({
    reducer: combineReducers({
        currentStake: combineReducers({
            stake: currentStakeReducer
        }),
        members: membersReducer,
        stakes: stakesReducer,
        user: userReducer
    }),
    preloadedState: preloadedStore
})
export default store 

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch