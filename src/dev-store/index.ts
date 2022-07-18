import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { stakesReducer } from "./stakes";
import { uiReducer } from "./ui";
import {membersReducer} from "./members"

const store = configureStore({
    reducer: combineReducers({ui: uiReducer, stakes: stakesReducer, members: membersReducer})
})

export default store
export type GlobalState = ReturnType<typeof store.getState>