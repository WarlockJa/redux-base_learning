import { apiSlice } from "../api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        reauth: builder.mutation({
            query: () => ({
                url: '/auth',
                method: 'GET'
            }),
        }),
        login: builder.mutation({
            query: credentials => ({
                url: '/auth',
                method: 'POST',
                body: { ...credentials }
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth',
                method: 'PUT'
            }),
        }),
        register: builder.mutation({
            query: credentials => ({
                url: '/register',
                method: 'POST',
                body: { ...credentials }
            }),
        }),
    })
})

export const {
    useLoginMutation,
    useReauthMutation,
    useLogoutMutation,
    useRegisterMutation,
} = authApiSlice