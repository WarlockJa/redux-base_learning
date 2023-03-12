import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../app/store";

export interface ITodo {
    id: string;
    userId: number;
    title: string;
    completed: boolean;
    description: string;
    date_created: string;
    date_due: string;
    reminder: boolean;
    // reminder_interval: number;
}

export interface IPostTodo {
    userid: number;
    title: string;
    description: string;
    date_due: string;
    reminder: boolean;
}

interface ITodoMenu {
    addTodoMenuState: boolean;
}

const initialState: ITodoMenu = { addTodoMenuState: false }

const todosSlice = createSlice({
    name: 'todos',
    initialState: initialState,
    reducers: {
        switchAddTodo: (state) => {
            state.addTodoMenuState = !state.addTodoMenuState
        }
        // addTodo: (state, action: PayloadAction<ITodo>) => {
        //     state.push(action.payload)
        // }
    }
})

export const {
    // addTodo
    switchAddTodo
} = todosSlice.actions

export default todosSlice.reducer

export const selectAddTodoState = (state: RootState) => state.todos.addTodoMenuState