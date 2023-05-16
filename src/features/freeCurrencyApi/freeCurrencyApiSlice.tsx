import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";

export type IFreeCurrencyApiData = Record<string, Record<string, number>>

interface IExchangeCurrencies {
    firstCurrency: string;
    secondCurrency: string;
}

export interface IFreeCurrencyState {
    data: IFreeCurrencyApiData | undefined;
    exchangeCurrencies: IExchangeCurrencies;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    timestamp: number | undefined;
    error: string | null;
}

const initialState: IFreeCurrencyState = {
    data: undefined,
    exchangeCurrencies: {
        firstCurrency: 'TRY', // get for current locale or default
        secondCurrency: 'USD'
    },
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
        setFirstCurrency: (state, action: PayloadAction<string>) => {
            state.exchangeCurrencies.firstCurrency = action.payload
        },
        setSecondCurrency: (state, action: PayloadAction<string>) => {
            state.exchangeCurrencies.secondCurrency = action.payload
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
    saveFreeCurrencyDataToState,
    setFirstCurrency,
    setSecondCurrency,
} = freeCurrencySlice.actions

export default freeCurrencySlice.reducer

export const selectFreeCurrency = (state: RootState) => state.freeCurrency
export const selectFreeCurrencyData = (state: RootState) => state.freeCurrency.data
export const selectExchangeCurrencies = (state: RootState) => state.freeCurrency.exchangeCurrencies