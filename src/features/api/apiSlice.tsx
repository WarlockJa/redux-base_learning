import { BaseQueryFn, createApi, fetchBaseQuery, MutationDefinition } from '@reduxjs/toolkit/query/react'
import { setCredentials, logOut, AccessTokenType } from './auth/authSlice'
import { RootState } from '../../app/store'
import { MutationTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks'

const BASE_URL = 'http://localhost:5000/'
// const PGSQL_URL = import.meta.env.VITE_APP_RAILWAY_POSTGRES_URL

export interface IRTKQuery {
    login?: MutationTrigger<MutationDefinition<any, BaseQueryFn<any, unknown, unknown, {}, {}>, "Todos" | "Auth", any, "api">>
    gLogin?: MutationTrigger<MutationDefinition<any, BaseQueryFn<any, unknown, unknown, {}, {}>, "Todos" | "Auth", any, "api">>
    isLoading: boolean;
    isError?: boolean;
    error?: unknown;
}

interface IApiErrorResponse {
    error: {
        originalStatus: number;
    }
}

interface IAuthApiError {
    data: {
        message: string;
    }
}

interface IAuthRegisterError {
    originalStatus: number;
    data: string;
}

interface IRefreshTokenResult {
    data?: {
        accessToken: AccessTokenType;
    }
}

// checks response error type to ensure it came from the API
export function isApiRefreshError(error: unknown): error is IApiErrorResponse {
    return (
        typeof error === "object" &&
        error != null &&
        "error" in error &&
        typeof (error as any).error === "object" &&
        "originalStatus" in (error as any).error &&
        typeof (error as any).error.originalStatus === "number"
    )
}

// confirming that login error came from the API by verifying its type
export function isApiAuthError(error: unknown): error is IAuthApiError {
    return (
        typeof error === "object" &&
        error != null &&
        "data" in error &&
        typeof (error as any).data === "object" &&
        "message" in (error as any).data &&
        typeof (error as any).data.message === "string"
    )
}

// confirming that login error came from the API by verifying its type
export function isApiRegisterError(error: unknown): error is IAuthRegisterError {
    return (
        typeof error === "object" &&
        error != null &&
        "data" in error &&
        typeof (error as any).data === "string" &&
        "originalStatus" in error &&
        typeof (error as any).originalStatus === "number"
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
    if(isApiRefreshError(result)) {
        if(result.error.originalStatus === 403) {
            // sending refresh token to get new access token
            const refreshResult = await baseQuery('/refresh', api, extraOptions) as IRefreshTokenResult
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
    // tagTypes: ['Todos', 'User'],
    endpoints: builder => ({})
})