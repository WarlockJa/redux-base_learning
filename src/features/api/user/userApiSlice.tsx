import { apiSlice } from "../apiSlice";

const apiSliceUserTag = apiSlice.enhanceEndpoints({ addTagTypes: ["User"] });

export const userApiSlice = apiSliceUserTag.injectEndpoints({
  endpoints: (builder) => ({
    logout: builder.mutation({
      query: () => ({
        url: "/v1/user",
        method: "GET",
      }),
    }),
    sendConfirmEmail: builder.mutation({
      query: () => ({
        url: "/v1/user",
        method: "PUT",
      }),
    }),
    updateUser: builder.mutation({
      query: (credentials) => ({
        url: "/v1/user",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: () => ({
        url: "/v1/user",
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useLogoutMutation,
  useSendConfirmEmailMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApiSlice;
