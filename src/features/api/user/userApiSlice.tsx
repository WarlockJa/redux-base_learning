import { apiSlice } from "../apiSlice";

const apiSliceUserTag = apiSlice.enhanceEndpoints({ addTagTypes: ['User'] })

export const userApiSlice = apiSliceUserTag.injectEndpoints({
    endpoints: builder => ({
        logout: builder.mutation({
            query: () => ({
                url: '/user',
                method: 'GET'
            }),
        }),
        sendConfirmEmail: builder.mutation({
            query: () => ({
                url: '/user',
                method: 'PUT'
            }),
        }),
        updateUser: builder.mutation({
            query: credentials => ({
                url: '/user',
                method: 'POST',
                body: credentials
            }),
            invalidatesTags: ['User']
        }),
        deleteUser: builder.mutation({
            query: credentials => ({
                url: '/user',
                method: 'DELETE',
                body: credentials
            })
        })
    })
})

export const {
    useLogoutMutation,
    useSendConfirmEmailMutation,
    useUpdateUserMutation,
    useDeleteUserMutation
} = userApiSlice