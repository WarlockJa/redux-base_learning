import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../features/api/apiSlice";
import counterReducer from "../features/counter/counterSlice";
import postsReducer from "../features/posts/postsSlice";
import todosReducer from "../features/todos/todosSlice";
import authReducer from "../features/api/auth/authSlice";
import userReducer from "../features/api/user/userSlice";
import weatherstackReducer from '../features/weatherstack/weatherstackSlice';
import freeCurrencyReducer from '../features/freeCurrencyApi/freeCurrencyApiSlice';

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        todos: todosReducer,
        posts: postsReducer,
        auth: authReducer,
        user: userReducer,
        weatherstack: weatherstackReducer,
        freeCurrency: freeCurrencyReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch