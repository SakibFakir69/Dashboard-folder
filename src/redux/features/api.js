
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const api = createApi({
  reducerPath: "userAuth",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8020" }),


  
  endpoints: (builder) => ({
    // Register
    registerUser: builder.mutation({
      query: (data) => ({
        url: "/auth/users/register/",
        method: "POST",
        body: data,
      }),
    }),

    // Login
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/auth/users/login/",
        method: "POST",
        body: data,
      }),
    }),

    // Send OTP
    sendOtp: builder.mutation({
      query: ({ email, token }) => ({
        url: "/auth/me/email/request-verify/",
        method: "POST",
        body: { email },
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),

    // Verify OTP
    verifyOtp: builder.mutation({
      query: ({ email, otp, token }) => ({
        url: "/auth/me/email/conform-verify/",
        method: "POST",
        body: { email, otp },
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),

    // Forgot Password
    forgotPasswordSendOtp: builder.mutation({
      query: (email) => ({
        url: "/auth/user/forgot-password/send-otp/",
        method: "POST",
        body: { email },
      }),
    }),

    forgotPasswordVerifyOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/auth/user/forgot-password/verify-otp/",
        method: "POST",
        body: { email, otp },
      }),
    }),

    /// reset password

    resetPassword: builder.mutation({
      query: ({ email, otp, new_password }) => ({
        url: "/auth/user/forgot-password/reset/",
        method: "POST",
        body: { email, otp, new_password },
      }),
    }),


    /// change password 

    changePassword: builder.mutation({

      query: (data) => ({
        url: "/auth/users/me/change-password/",
        method: "POST",
        body: data
      })

    })
    ,
    updateProfile: builder.mutation({
      query: ({ data, token }) => ({
        url: "/auth/users/me/",
        method: "PUT",
        body: data,
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),


    // handle resend password

    resendPassword: builder.mutation({
      query: ({ email, token }) => ({
        url: '/auth/me/email/request-verify/',
        method: "POST",
        body: { email },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }),
    // refresh token 
    // /auth/users/login/refresh/

    refreshToken:builder.mutation({
      query:(refreshToken)=>({


        url:'/auth/users/login/refresh/',
        method:"POST",

        body:refreshToken

      })
    })






  }),
});

export const {
  useResendPasswordMutation,


  useRegisterUserMutation,
  useLoginUserMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useForgotPasswordSendOtpMutation,
  useForgotPasswordVerifyOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,

} = api;
