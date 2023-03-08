import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ITodo } from '../todos/TodosList'

const BASE_URL = 'http://localhost:3500'

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: builder => ({
        getTodos: builder.query<ITodo[], void>({
            query: () => '/todos'
        })
    })
})

export const { useGetTodosQuery } = apiSlice