import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IPostTodo, ITodo, IUpdateTodo } from '../todos/todosSlice'

const BASE_URL = 'http://localhost:5000/'
const PGSQL_URL = import.meta.env.VITE_APP_RAILWAY_POSTGRES_URL

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ['Todos'],
    endpoints: builder => ({
        getTodos: builder.query<ITodo[], void>({
            query: () => '/todos',
            providesTags: (result = [], error, arg) => 
                result
                    ?[
                        ...result.map(({ id }) => ({ type: 'Todos' as const, id })),
                        { type: 'Todos', id: 'LIST' },
                    ]
                    :[{ type: 'Todos', id: 'LIST' }]
        }),
        addTodo: builder.mutation<void, IPostTodo>({
            query: initialTodo => ({
                url: '/todos',
                method: 'POST',
                body: initialTodo
            }),
            invalidatesTags: ['Todos']
        }),
        deleteTodo: builder.mutation<void, number> ({
            query: id => ({
                url: '/todos',
                method: 'DELETE',
                body: {id}
            }),
            invalidatesTags: ['Todos']
        }),
        updateTodo: builder.mutation<void, IUpdateTodo>({
            query: updatedTodo => ({
                url: '/todos',
                method: 'PUT',
                body: updatedTodo
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Todos', id: arg.id }]
        })
    })
})

export const { useGetTodosQuery, useAddTodoMutation, useDeleteTodoMutation, useUpdateTodoMutation } = apiSlice