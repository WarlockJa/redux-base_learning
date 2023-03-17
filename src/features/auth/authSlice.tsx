import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface IAuth {
    email: string | null;
    token: string | null;
}

const initialState: IAuth = {
    email: null,
    token: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { email, accessToken } = action.payload
            state.email = email
            state.token = accessToken
        },
        logOut: (state) => {
            state.email = null
            state.token = null
        }
    }
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentEmail = (state: RootState) => state.auth.email
export const selectCurrentToken = (state: RootState) => state.auth.token