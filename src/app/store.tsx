import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../features/api/apiSlice";
import counterReducer from "../features/counter/counterSlice";
import postsReducer from "../features/posts/postsSlice";
import todosReducer from "../features/todos/todosSlice";

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        todos: todosReducer,
        posts: postsReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch