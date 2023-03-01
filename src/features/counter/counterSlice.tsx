import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppDispatch } from "../../app/store";

interface ICounterState {
    value: number;
}

const initialState: ICounterState = {
    value: 0
}

export const counterSlice = createSlice({
    name: 'counter',
    initialState: initialState,
    reducers: {
        increment: (state) => {
            state.value++
        },
        decrement: (state) => {
            state.value--
        },
        incrementByAmount: (state, action: PayloadAction<number>) => {
            state.value += action.payload
        },
        reset: (state) => {
            state.value = counterSlice.getInitialState().value
        }
    }
})

export const {
    increment,
    decrement,
    incrementByAmount,
    reset,
} = counterSlice.actions

export const incrementAsync = (amount: number) => (dispatch: AppDispatch) => {
    setTimeout(() => {
        dispatch(incrementByAmount(amount))
    },1000)
}

export default counterSlice.reducer