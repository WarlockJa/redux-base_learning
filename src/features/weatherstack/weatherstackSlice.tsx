import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";

export interface IWeatherStackState {
    request: {
        type: string;
        query: string;
        language: string;
        unit: string;
    } | undefined,
    location: {
        name: string;
        country: string;
        region: string;
        lat: number;
        lon: number;
        timezone_id: string;
        localtime: string;
        localtime_epoch: number;
        utc_offset: number;
    } | undefined,
    current: {
        observation_time: string;
        temperature: number;
        weather_code: number;
        weather_icons: string[],
        weather_descriptions: string[],
        wind_speed: number;
        wind_degree: number;
        wind_dir: string;
        pressure: number;
        precip: number;
        humidity: number;
        cloudcover: number;
        feelslike: number;
        uv_index: number;
        visibility: number;
        is_day: string;
    } | undefined,
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    timestamp: number | undefined;
    error: string | null;
}

const initialState: IWeatherStackState = {
    request: undefined,
    location: undefined,
    current: undefined,
    status: 'loading',
    timestamp: undefined,
    error: null
}

export const fetchWeatherstackData = createAsyncThunk('weatherstack/fetchWeatherstackData', async ({ API_URL }: { API_URL: string }) => {
    const response = await axios.get(API_URL)
    return response.data
})

export const weatherstackSlice = createSlice({
    name: 'weatherstack',
    initialState: initialState,
    reducers: {
        changeStatusToIdle(state) {
            state.status = 'idle'
        },
        saveWeatherDataToState: (state, action: PayloadAction<IWeatherStackState>) => {
            state.current = action.payload.current
            state.location = action.payload.location
            state.request = action.payload.request
            state.timestamp = action.payload.timestamp
            state.status = 'succeeded'
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchWeatherstackData.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchWeatherstackData.fulfilled, (state, action: PayloadAction<IWeatherStackState>) => {
                state.current = action.payload.current
                state.location = action.payload.location
                state.request = action.payload.request
                state.timestamp = Date.now()
                state.status = 'succeeded'
                localStorage.setItem('DP_weatherstack', JSON.stringify(state))
            })
            .addCase(fetchWeatherstackData.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message!
            })
    },
})

export const {
    changeStatusToIdle,
    saveWeatherDataToState
} = weatherstackSlice.actions

export default weatherstackSlice.reducer

export const selectWeatherStackData = (state: RootState) => state.weatherstack