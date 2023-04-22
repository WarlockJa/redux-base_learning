import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import useSystemColorSchemeIsDark from "../../../util/useSystemColorSchemeIsDark";

// Auth data from DB
export interface IDBAuth {
    accessToken: string | null;
    idToken: {
        email: string | null;
        email_confirmed: boolean;
        locale: string;
        name: string | null;
        surname: string | null;
        picture: string | null;
        authislocal: boolean | null;
        darkmode: boolean;
        hidecompleted: boolean;
    }
}

// Auth data inside the App
export interface IAuthSliceInitialState {
    accessToken: AccessTokenType;
    idToken: IUserIdToken;
}

export type AccessTokenType = string | null;

export interface IUserIdToken {
    email: string | null;
    email_confirmed: boolean;
    locale: string;
    name: string | null;
    surname: string | null;
    picture: string | null;
    authislocal: boolean | null;
    darkmode: boolean;
    hidecompleted: boolean;
}

const initialState: IAuthSliceInitialState = {
    accessToken: null,
    idToken: {
        email: null,
        email_confirmed: false,
        locale: navigator.language,
        name: null,
        surname: null,
        picture: null,
        authislocal: null,
        darkmode: useSystemColorSchemeIsDark(),
        hidecompleted: false
    },
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<IAuthSliceInitialState>) => {
            const { accessToken, idToken } = action.payload
            state.idToken = idToken
            state.accessToken = accessToken
        },
        setIdToken: (state, action: PayloadAction<{ idToken: IUserIdToken }>) => {
            const { idToken } = action.payload
            state.idToken = idToken
        },
        setHidecompleted: (state, action) => {
            const { hidecompleted } = action.payload
            state.idToken.hidecompleted = hidecompleted
        },
        logOut: (state) => {
            state.accessToken = null
            state.idToken = initialState.idToken
        }
    }
})

export const { setCredentials, setIdToken, logOut, setHidecompleted } = authSlice.actions

export default authSlice.reducer

export const selectCurrentEmail = (state: RootState) => state.auth.idToken.email
export const selectCurrentEmailConfirmed = (state: RootState) => state.auth.idToken.email_confirmed
export const selectCurrentToken = (state: RootState) => state.auth.accessToken
export const selectUserData = (state: RootState) => state.auth.idToken
export const selectHidecompleted = (state: RootState) => state.auth.idToken.hidecompleted