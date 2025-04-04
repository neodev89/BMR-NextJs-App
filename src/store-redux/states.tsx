import { BmrType } from "@/@types/bmr-type";
import { usersProps } from "@/@types/profilo-utente";
import { createSlice } from "@reduxjs/toolkit";

const initialState: BmrType = {
    data: {
        method: "",
        BMR: [
            {
                id: "",
                utente: "",
                password: "",
                weight: "",
                height: "",
                age: ""
            }
        ]
    }
};

export const states = createSlice({
    name: 'state',
    initialState,
    reducers: {
        update: (state, action) => {
            console.log("Azione ricevuta:", action.payload);
        
            // Se vuoi aggiornare un elemento specifico nell'array
            state.data.BMR.forEach((item, index) => {
                if (item.id === action.payload.id) {
                    state.data.BMR[index] = { ...item, ...action.payload };
                }
            });
        
            // Oppure, per sostituire l'intero array con nuovi dati
            // state.data.BMR = [...action.payload];
        },        
        reset: () => initialState
    }

});

const initialUserState: usersProps = {
    data: [
        {
            id: "-1",
            user: "",
            birth: "",
            bmr: [
                {
                    dateBmr: "",
                    weight: "",
                    height: "",
                    age: "",
                }
            ]
        }
    ]
}

export const userStates = createSlice({
    name: "user-state",
    initialState: initialUserState,
    reducers: {
        update: (state, action) => {
            console.log("Azione ricevuta:", action.payload);
        },
    }

})

export const { update, reset } = states.actions;
export const statesReducer = states.reducer;
export const userStateReducer = userStates.reducer;
