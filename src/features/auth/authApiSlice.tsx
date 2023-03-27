import { apiSlice } from "../api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/auth',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        reauth: builder.mutation({
            query: () => ({
                url: '/auth',
                method: 'GET'
            })
        })
    })
})

export const {
    useLoginMutation,
    useReauthMutation
} = authApiSlice