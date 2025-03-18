import { configureStore } from "@reduxjs/toolkit";
import { statesReducer } from "./states";

export const store = configureStore({
  reducer: {
    state: statesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
