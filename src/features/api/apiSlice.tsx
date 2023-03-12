import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IPostTodo, ITodo } from '../todos/todosSlice'

const BASE_URL = 'http://localhost:5000/'
const PGSQL_URL = import.meta.env.VITE_APP_RAILWAY_POSTGRES_URL

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ['Todos'],
    endpoints: builder => ({
        getTodos: builder.query<ITodo[], void>({
            query: () => '/todos',
            providesTags: ['Todos']
        }),
        addTodo: builder.mutation<void, IPostTodo>({
            query: initialTodo => ({
                url: '/todos',
                method: 'POST',
                body: initialTodo
            }),
            invalidatesTags: ['Todos']
        })
    })
})

export const { useGetTodosQuery, useAddTodoMutation } = apiSlice