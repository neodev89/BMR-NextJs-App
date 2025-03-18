import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    weight: "",
    height: "",
    age: ""
};

export const states = createSlice({
    name: 'state',
    initialState,
    reducers: {
        update: (state, action) => {
            console.log("Azione ricevuta:", action.payload);
            Object.assign(state, action.payload); // Aggiorna solo i campi forniti
        },
        reset: () => initialState
    }

})

export const { update, reset } = states.actions;
export const statesReducer = states.reducer;
