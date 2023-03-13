import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../app/store";

export interface ITodo {
    id: number;
    userId: number;
    title: string;
    completed: boolean;
    description: string;
    date_created: string;
    date_due: string;
    reminder: boolean;
}

export interface IPostTodo {
    userid: number;
    title: string;
    description: string;
    date_due: Date;
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
    }
})

export const {
    switchAddTodo
} = todosSlice.actions

export default todosSlice.reducer

export const selectAddTodoState = (state: RootState) => state.todos.addTodoMenuState