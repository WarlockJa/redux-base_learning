import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import postsReducer from "../features/posts/postsSlice";
import todosReducer from "../features/todos/todosSlice";

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        todos: todosReducer,
        posts: postsReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch