import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface ITodo {
    id: string;
    userId: number;
    title: string;
    completed: boolean;
}

const initialState: ITodo[] = []

const todosSlice = createSlice({
    name: 'todos',
    initialState: initialState,
    reducers: {
        addTodo: (state, action: PayloadAction<ITodo>) => {
            state.push(action.payload)
        }
    }
})

export const {
    addTodo
} = todosSlice.actions

export default todosSlice.reducer