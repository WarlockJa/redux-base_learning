import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store";

export interface ITodo {
    id: number;
    userid: number;
    title: string;
    completed: boolean;
    description: string;
    date_created: string;
    date_due: Date;
    reminder: boolean;
}

export interface IUpdateTodo {
    id: number;
    userid: number;
    title: string;
    completed: boolean;
    description: string;
    date_due: Date;
    reminder: boolean;
}

export interface IPostTodo {
    userid: number;
    title: string;
    description: string;
    date_due: Date;
    reminder: boolean;
}

interface ITodosState {
    todos: ITodo[];
    addTodoMenuState: boolean;
}

const initialState: ITodosState = {
    todos: [],
    addTodoMenuState: false
}

const todosSlice = createSlice({
    name: 'todos',
    initialState: initialState,
    reducers: {
        switchAddTodo: (state) => {
            state.addTodoMenuState = !state.addTodoMenuState
        },
        storeTodos: (state, action: PayloadAction<ITodo[]>) => {
            state.todos = action.payload
        }
    }
})

export const {
    switchAddTodo,
    storeTodos
} = todosSlice.actions

export default todosSlice.reducer

export const selectAddTodoState = (state: RootState) => state.todos.addTodoMenuState
export const selectAllTodos = (state: RootState) => state.todos.todos