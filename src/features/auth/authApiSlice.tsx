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
        refreshToken: builder.mutation({
            query: () => ({
                url: '/refresh',
                method: 'GET'
            })
        }),
        getIdToken: builder.mutation({
            query: () => ({
                url: '/user',
                method: 'GET'
            })
        })
    })
})

export const {
    useLoginMutation,
    useGetIdTokenMutation,
    useRefreshTokenMutation
} = authApiSlice