import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";

export type IFreeCurrencyApiData = Record<string, Record<string, number>>

export interface IFreeCurrencyState {
    data: IFreeCurrencyApiData | undefined
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    timestamp: number | undefined;
    error: string | null;
}

const initialState: IFreeCurrencyState = {
    data: undefined,
    status: 'loading',
    timestamp: undefined,
    error: null
}

export const fetchFreeCurrencyData = createAsyncThunk('currency/fetchCurrencyData', async ({ API_URL, apikey }: { API_URL: string, apikey: string }) => {
    const config = {
        headers:{
            apikey
        }
    }
    const response = await axios.get(API_URL, config)
    return response.data
})

export const freeCurrencySlice = createSlice({
    name: 'freeCurrency',
    initialState: initialState,
    reducers: {
        changeStatusToIdle(state) {
            state.status = 'idle'
        },
        saveFreeCurrencyDataToState: (state, action: PayloadAction<IFreeCurrencyState>) => {
            state.data = action.payload.data
            state.timestamp = action.payload.timestamp
            state.status = 'succeeded'
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchFreeCurrencyData.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchFreeCurrencyData.fulfilled, (state, action: PayloadAction<IFreeCurrencyState>) => {
                state.data = action.payload.data
                state.timestamp = Date.now()
                state.status = 'succeeded'
                localStorage.setItem('DP_freeCurrency', JSON.stringify(state))
            })
            .addCase(fetchFreeCurrencyData.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message!
            })
    },
})

export const {
    changeStatusToIdle,
    saveFreeCurrencyDataToState
} = freeCurrencySlice.actions

export default freeCurrencySlice.reducer

export const selectFreeCurrencyStackData = (state: RootState) => state.freeCurrency