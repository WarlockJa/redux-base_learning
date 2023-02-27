import { createSlice, PayloadAction } from "@reduxjs/toolkit"

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
    reset
} = counterSlice.actions

export default counterSlice.reducer