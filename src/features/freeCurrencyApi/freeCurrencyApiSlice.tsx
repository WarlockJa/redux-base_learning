import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";

export type IFreeCurrencyApiData = Record<string, Record<string, number>>;

interface IExchangeCurrencies {
    firstCurrency: string;
    secondCurrency: string;
}

interface IFreeCurrencyState {
    data: IFreeCurrencyApiData | undefined;
    exchangeCurrencies: IExchangeCurrencies;
    status: "idle" | "loading" | "succeeded" | "failed";
    timestamp: number | undefined;
    error: string | null;
}

// loading data from the localStorage if present and not outdated
const localStorage_DP_freeCurrency = localStorage.getItem("DP_freeCurrency");
const freeCurrencyLocalData: IFreeCurrencyState = localStorage_DP_freeCurrency
    ? JSON.parse(localStorage_DP_freeCurrency)
    : undefined;
// verifying that information is current
const dateToday = new Date().toLocaleDateString();
const dateSaved =
    freeCurrencyLocalData && freeCurrencyLocalData.timestamp
        ? new Date(freeCurrencyLocalData.timestamp).toLocaleDateString()
        : "error";

const initialState: IFreeCurrencyState =
    dateSaved !== dateToday
        ? {
              data: undefined,
              exchangeCurrencies: {
                  firstCurrency: "TRY", // TODO: get for current locale or default
                  secondCurrency: "USD",
              },
              status: "idle",
              timestamp: undefined,
              error: null,
          }
        : freeCurrencyLocalData;

export const fetchFreeCurrencyData = createAsyncThunk(
    "currency/fetchCurrencyData",
    async ({ API_URL, apikey }: { API_URL: string; apikey: string }) => {
        const config = {
            headers: {
                apikey,
            },
        };
        const response = await axios.get(API_URL, config);
        return response.data;
    }
);

export const freeCurrencySlice = createSlice({
    name: "freeCurrency",
    initialState: initialState,
    reducers: {
        changeStatusToIdle(state) {
            state.status = "idle";
        },
        setFirstCurrency: (state, action: PayloadAction<string>) => {
            state.exchangeCurrencies.firstCurrency = action.payload;
        },
        setSecondCurrency: (state, action: PayloadAction<string>) => {
            state.exchangeCurrencies.secondCurrency = action.payload;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchFreeCurrencyData.pending, (state) => {
                state.status = "loading";
            })
            .addCase(
                fetchFreeCurrencyData.fulfilled,
                (state, action: PayloadAction<IFreeCurrencyState>) => {
                    state.data = action.payload.data;
                    state.timestamp = Date.now();
                    state.status = "succeeded";
                    localStorage.setItem(
                        "DP_freeCurrency",
                        JSON.stringify(state)
                    );
                }
            )
            .addCase(fetchFreeCurrencyData.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message!;
            });
    },
});

export const { changeStatusToIdle, setFirstCurrency, setSecondCurrency } =
    freeCurrencySlice.actions;

export default freeCurrencySlice.reducer;

export const selectFreeCurrency = (state: RootState) => state.freeCurrency;
export const selectFreeCurrencyData = (state: RootState) =>
    state.freeCurrency.data;
export const selectExchangeCurrencies = (state: RootState) =>
    state.freeCurrency.exchangeCurrencies;
