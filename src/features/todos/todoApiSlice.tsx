import { apiSlice } from "../api/apiSlice";
import { IPostTodo, ITodo, IUpdateTodo } from "./todosSlice";

const apiSliceTodosTag = apiSlice.enhanceEndpoints({ addTagTypes: ["Todos"] });

export const todoApiSlice = apiSliceTodosTag.injectEndpoints({
  endpoints: (builder) => ({
    getTodos: builder.query<ITodo[], void>({
      query: () => "/v1/todos",
      providesTags: (result = [], error, arg) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Todos" as const, id })),
              { type: "Todos", id: "LIST" },
            ]
          : [{ type: "Todos", id: "LIST" }],
    }),
    addTodo: builder.mutation<void, IPostTodo>({
      query: (initialTodo) => ({
        url: "/v1/todos",
        method: "POST",
        body: initialTodo,
      }),
      invalidatesTags: ["Todos"],
    }),
    deleteTodo: builder.mutation<void, number>({
      query: (id) => ({
        url: "/v1/todos",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["Todos"],
    }),
    updateTodo: builder.mutation<
      { message: string; status: number },
      IUpdateTodo
    >({
      query: (updatedTodo) => ({
        url: "/v1/todos",
        method: "PUT",
        body: updatedTodo,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Todos", id: arg.id }],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} = todoApiSlice;
