import { BaseQueryFn, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials, logOut } from '../auth/authSlice'
import { RootState } from '../../app/store'

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

interface IApiErrorResponse {
    error: {
        originalStatus: number;
    }
}

// checks response error type to ensure it came from the API
function isApiError(error: unknown): error is IApiErrorResponse {
    return (
        typeof error === "object" &&
        error != null &&
        "error" in error &&
        typeof (error as any).error === "object" &&
        "originalStatus" in (error as any).error &&
        typeof (error as any).error.originalStatus === "number"
    )
}

// attaching access token to every request
const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.accessToken
        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})

// wrapping baseQuery into reauth for when access token expires
const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    // checking error type ensuring it came from the API
    if(isApiError(result)) {
        if(result.error.originalStatus === 403) {
            // sending refresh token to get new access token
            const refreshResult = await baseQuery('/refresh', api, extraOptions)
            if (refreshResult?.data) {
                const idToken = (api.getState() as RootState).auth.idToken
                console.log('Refresh request')
                // store new token
                api.dispatch(setCredentials({ ...refreshResult.data, idToken }))
                // retry the oirignal query with new access token
                result = await baseQuery(args, api, extraOptions)
            } else {
                api.dispatch(logOut())
            }
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Todos', 'Auth'],
    endpoints: builder => ({})
})