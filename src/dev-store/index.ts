import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { unitsReducer } from "./units";
import { uiReducer } from "./ui";
import {membersReducer} from "./members"

const store = configureStore({
    reducer: combineReducers({ui: uiReducer, units: unitsReducer, members: membersReducer}),

})

export default store
export type GlobalState = ReturnType<typeof store.getState>