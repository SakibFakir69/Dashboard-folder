import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "userAuth",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8020",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),

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
      query: ({ email }) => ({
        url: "/auth/me/email/request-verify/",
        method: "POST",
        body: { email },
        // removed manual headers — prepareHeaders handles token
      }),
    }),

    // Verify OTP
    verifyOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/auth/me/email/conform-verify/",
        method: "POST",
        body: { email, otp },
        // removed manual headers — prepareHeaders handles token
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

    // Reset password
    resetPassword: builder.mutation({
      query: ({ email, otp, new_password }) => ({
        url: "/auth/user/forgot-password/reset/",
        method: "POST",
        body: { email, otp, new_password },
      }),
    }),

    // Change password
changePassword: builder.mutation({
  query: ({ old_password, new_password, token }) => ({
    url: "/auth/users/me/change-password/",
    method: "POST",
    body: { old_password, new_password },
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }),
}),


    // Update profile
    updateProfile: builder.mutation({
      query: ({ data, token }) => ({
        url: "/auth/users/me/",
        method: "PUT",
        body: data,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }),
    }),


    // Resend password OTP
    resendPassword: builder.mutation({
      query: ({ email }) => ({
        url: "/auth/me/email/request-verify/",
        method: "POST",
        body: { email },

      }),
    }),

    // Refresh token
    refreshToken: builder.mutation({
      query: (refreshToken) => ({
        url: "/auth/users/login/refresh/",
        method: "POST",
        body: refreshToken,
      }),
    }),
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
