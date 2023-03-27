import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface IAuth {
    accessToken: string | null;
    email: string | null;
    email_confirmed: boolean;
    locale: 'en-US';
    name: string | null;
    surname: string | null;
    picture: string | null;
}

const initialState: IAuth = {
    email: null,
    email_confirmed: false,
    locale: 'en-US',
    name: null,
    surname: null,
    picture: null,
    accessToken: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { email, emaila_confirmed, locale, name, surname, picture, accessToken } = action.payload
            state.email = email
            state.email_confirmed = emaila_confirmed
            state.locale = locale
            state.name = name
            state.surname = surname
            state.picture = picture
            state.accessToken = accessToken
        },
        logOut: (state) => {
            state.email = null
            state.email_confirmed = false
            state.locale = 'en-US'
            state.name = null
            state.surname = null
            state.picture = null
            state.accessToken = null
        }
    }
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentEmail = (state: RootState) => state.auth.email
export const selectCurrentToken = (state: RootState) => state.auth.accessToken