import { apiSlice } from "../apiSlice";

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
        
    })
})

export const {
    useLoginMutation,
    useReauthMutation,
    useRegisterMutation,
    useGLoginMutation,
} = authApiSlice