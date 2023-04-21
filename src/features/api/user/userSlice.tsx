import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from '../../../app/store'

interface IUserSliceInitialState {
    resendEmailVerificationTimer: number;
}

const initialState: IUserSliceInitialState = {
    resendEmailVerificationTimer: new Date().getTime()
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setResendEmailVerificationTimer: (state, action: PayloadAction<IUserSliceInitialState>) => {
            const { resendEmailVerificationTimer } = action.payload
            state.resendEmailVerificationTimer = resendEmailVerificationTimer
        },
    }
})

export const { setResendEmailVerificationTimer } = userSlice.actions

export default userSlice.reducer

export const selectCurrentResendVerificationEmailTimer = (state: RootState) => state.user.resendEmailVerificationTimer