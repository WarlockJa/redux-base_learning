import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import useSystemColorSchemeIsDark from "../../../util/useSystemColorSchemeIsDark";

export interface IAuth {
    accessToken: string | null;
    idToken: IUser;
}

export interface IUser {
    email: string | null;
    email_confirmed: boolean;
    locale: string;
    name: string | null;
    surname: string | null;
    picture: File | null;
    authislocal: boolean | null;
    darkmode: boolean;
}

const initialState: IAuth = {
    accessToken: null,
    idToken: {
        email: null,
        email_confirmed: false,
        locale: navigator.language,
        name: null,
        surname: null,
        picture: null,
        authislocal: null,
        darkmode: useSystemColorSchemeIsDark()
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
        setIdToken: (state, action) => {
            const { idToken } = action.payload
            state.idToken = idToken
        },
        logOut: (state) => {
            state.accessToken = null
            state.idToken = initialState.idToken
        }
    }
})

export const { setCredentials, setIdToken, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentEmail = (state: RootState) => state.auth.idToken.email
export const selectCurrentEmailConfirmed = (state: RootState) => state.auth.idToken.email_confirmed
export const selectCurrentToken = (state: RootState) => state.auth.accessToken
export const selectUserData = (state: RootState) => state.auth.idToken