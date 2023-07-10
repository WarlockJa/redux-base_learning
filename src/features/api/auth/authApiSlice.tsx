import { apiSlice } from "../apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    reauth: builder.mutation({
      query: () => ({
        url: "/v1/auth",
        method: "GET",
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/v1/auth",
        method: "POST",
        body: { ...credentials },
      }),
    }),

    register: builder.mutation({
      query: (credentials) => ({
        url: "/v1/register",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    gLogin: builder.mutation({
      query: (credentials) => ({
        url: "/v1/authgoogle",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    resetPassword: builder.mutation({
      query: (credentials) => ({
        url: "/v1/password",
        method: "PUT",
        body: { ...credentials },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useReauthMutation,
  useRegisterMutation,
  useGLoginMutation,
  useResetPasswordMutation,
} = authApiSlice;
