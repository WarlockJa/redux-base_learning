import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import Cookies from 'js-cookie'

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
            Cookies.set('dp-user', email, { expires: 7 })
        },
        logOut: (state) => {
            state.email = null
            state.token = null
            Cookies.remove('dp-user')
        }
    }
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentEmail = (state: RootState) => state.auth.email
export const selectCurrentToken = (state: RootState) => state.auth.token