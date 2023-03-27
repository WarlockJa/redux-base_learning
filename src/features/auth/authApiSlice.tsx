import { apiSlice } from "../api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        reauth: builder.mutation({
            query: () => ({
                url: '/auth',
                method: 'GET'
            }),
            invalidatesTags: ['Auth']
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
            invalidatesTags: ['Auth']
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth',
                method: 'PUT'
            }),
            invalidatesTags: ['Auth']
        })
    })
})

export const {
    useLoginMutation,
    useReauthMutation,
    useLogoutMutation
} = authApiSlice