import { apiSlice } from "../api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        reauth: builder.mutation({
            query: () => ({
                url: '/auth',
                method: 'GET'
            }),
        }),
        // reauth: builder.query({
        //     query: () => '/auth',
        //     providesTags: ['Auth']
        // }),
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
        })
    })
})

export const {
    useLoginMutation,
    useReauthMutation,
    useLogoutMutation
} = authApiSlice