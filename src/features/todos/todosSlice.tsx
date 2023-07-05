import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface ITodo {
  id: number;
  useremail: string;
  title: string;
  completed: number;
  description: string;
  date_created: string;
  date_due: Date;
  reminder: number;
}

export interface IUpdateTodo {
  id: number;
  title?: string;
  completed?: number;
  description?: string;
  date_due?: string; // string due to conversion of the Date into SQL datetime
  reminder?: number;
}

export interface IPostTodo {
  useremail: string;
  title: string;
  description: string;
  date_due: string;
  reminder: number;
}

interface ITodosState {
  addTodoMenuState: boolean;
  filterCompletedTodos: boolean;
}

const initialState: ITodosState = {
  addTodoMenuState: false,
  filterCompletedTodos: false,
};

const todosSlice = createSlice({
  name: "todos",
  initialState: initialState,
  reducers: {
    switchAddTodoMenuState: (state, action: PayloadAction<boolean>) => {
      state.addTodoMenuState = action.payload;
    },
    switchFilterCompletedTodos: (state) => {
      state.filterCompletedTodos = !state.filterCompletedTodos;
    },
  },
});

export const { switchAddTodoMenuState, switchFilterCompletedTodos } =
  todosSlice.actions;

export default todosSlice.reducer;

export const selectAddTodoState = (state: RootState) =>
  state.todos.addTodoMenuState;
export const selectFilterCompletedTodos = (state: RootState) =>
  state.todos.filterCompletedTodos;
