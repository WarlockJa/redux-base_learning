import { CredentialResponse } from '@react-oauth/google'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IPostTodo, ITodo, IUpdateTodo } from '../todos/todosSlice'
import { setCredentials, logOut } from '../auth/authSlice'
import { useAppDispatch } from '../../app/hooks'

const BASE_URL = 'http://localhost:5000/'
// const PGSQL_URL = import.meta.env.VITE_APP_RAILWAY_POSTGRES_URL

interface IGoogleAuthResponse {
    content: {
        aud: string;
        azp: string;
        email: string;              // e-mail
        email_verified: boolean;    // e-mail verified status
        exp: Date;
        familiy_name: string;       // surname
        given_name: string;         // first name
        iat: Date;
        iss: string;
        jti: string;
        name: string;               // full name
        nbf: Date;
        picture: string;            // Google avatar URL
        sub: string;
    }
}

// attaching access token to every request
const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token
        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})

// wrapping baseQuery into reauth for when access token expires
const baseQueryWithReauth = async(args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if(result?.error?.originalStatus === 403) {
        const dispatch = useAppDispatch()
        console.log('sending refresh token')
        // sending refresh token to get new access token
        const refreshResult = await baseQuery('/refresh', api, extraOptions)
        console.log(refreshResult)
        if (refreshResult?.data) {
            const email = api.getState().auth.email
            // store new token
            dispatch(setCredentials({ ...refreshResult.data, email }))
            // retry the oirignal query with new access token
            result = await baseQuery(args, api, extraOptions)
        } else {
            dispatch(logOut())
        }
    }

    return result
}

export const apiSlice = createApi({
    reducerPath: 'api',
    // baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Todos'],
    endpoints: builder => ({
        
        // authUser: builder.mutation<IGoogleAuthResponse, CredentialResponse>({
        //     query: authToken => ({
        //         url: '/auth',
        //         method: 'POST',
        //         body: authToken
        //     })
        // })
    })
})

// export const {
//     ,
//     useAuthUserMutation
// } = apiSlice