import { configureStore } from "@reduxjs/toolkit";
import { statesReducer, userStateReducer } from "./states";

export const store = configureStore({
  reducer: {
    state: statesReducer,
    stateUser: userStateReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
