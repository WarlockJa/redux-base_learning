import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface IAuth {
    accessToken: string | null;
    idToken: IUser | null
}

interface IUser {
    email: string | null;
    email_confirmed: boolean;
    locale: 'en-US';
    name: string | null;
    surname: string | null;
    picture: string | null;
}

const initialState: IAuth = {
    accessToken: null,
    idToken: {
        email: null,
        email_confirmed: false,
        locale: 'en-US',
        name: null,
        surname: null,
        picture: null,
    }
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { accessToken, idToken } = action.payload
            state.idToken = idToken
            state.accessToken = accessToken
        },
        logOut: (state) => {
            state.idToken = null
            state.accessToken = null
        }
    }
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentEmail = (state: RootState) => state.auth.idToken?.email
export const selectCurrentToken = (state: RootState) => state.auth.accessToken
export const selectUserData = (state: RootState) => state.auth.idToken