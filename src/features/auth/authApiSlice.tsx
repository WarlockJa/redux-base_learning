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
        gLogin: builder.mutation({
            query: credentials => ({
                url: '/authgoogle',
                method: 'POST',
                body: { ...credentials }
            }),
        }),
        sendConfirmEmail: builder.mutation({
            query: () => ({
                url: '/user',
                method: 'POST'
            }),
        }),
    })
})

export const {
    useLoginMutation,
    useReauthMutation,
    useLogoutMutation,
    useRegisterMutation,
    useGLoginMutation,
    useSendConfirmEmailMutation,
} = authApiSlice