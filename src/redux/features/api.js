import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../utils/axiosBaseQuery";

export const api = createApi({
  reducerPath: "userAuth",

  baseQuery: axiosBaseQuery(),

  tagTypes: ["Category", "Inventory", "Share"],

  endpoints: (builder) => ({

    // --------------- REFRESH-------------
    refreshToken: builder.mutation({
      query: (data) => ({
        url: "/auth/login/refresh/",
        method: "POST",
        data,
      }),
    }),

    // ---------------- AUTH ----------------
    registerUser: builder.mutation({
      query: (data) => ({
        url: "/auth/register/",
        method: "POST",
        data,
      }),
    }),

    loginUser: builder.mutation({
      query: (data) => ({
        url: "/auth/login/",
        method: "POST",
        data,
      }),
    }),

    sendOtp: builder.mutation({
      query: ({ email }) => ({
        url: "/auth/email/verify/request/",
        method: "POST",
        data: { email },
      }),
    }),

    verifyOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/auth/email/verify/conform/",
        method: "POST",
        data: { email, otp },
      }),
    }),

    forgotPasswordSendOtp: builder.mutation({
      query: ({ email }) => ({
        url: "/auth/user/forgot-password/send-otp/",
        method: "POST",
        data: { email },
      }),
    }),

    forgotPasswordVerifyOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/auth/user/forgot-password/verify-otp/",
        method: "POST",
        data: { email, otp },
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ email, otp, new_password }) => ({
        url: "/auth/user/forgot-password/reset/",
        method: "POST",
        data: { email, otp, new_password },
      }),
    }),

    changePassword: builder.mutation({
      query: ({ old_password, new_password }) => ({
        url: "/auth/users/me/change-password/",
        method: "POST",
        data: { old_password, new_password },
      }),
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/auth/users/me/",
        method: "PUT",
        data,
      }),
    }),

    resendPassword: builder.mutation({
      query: ({ email }) => ({
        url: "/auth/email/verify/request/",
        method: "POST",
        data: { email },
      }),
    }),

    // ---------------- CATEGORY ----------------
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/category/",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Category"],
    }),

    allCategory: builder.query({
      query: () => ({
        url: "/category/",
        method: "GET",
      }),
      providesTags: ["Category"],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),

    editCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/category/${id}/`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["Category"],
    }),

    // ---------------- INVENTORY ----------------
    createInventory: builder.mutation({
      query: (data) => ({
        url: "/inventory/",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Inventory"],
    }),

    allInventory: builder.query({
      query: () => ({
        url: "/inventory",
        method: "GET",
      }),
      providesTags: ["Inventory"],
    }),

    deleteInventory: builder.mutation({
      query: (id) => ({
        url: `/inventory/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Inventory"],
    }),

    onUpdateInventory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/inventory/${id}/`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Inventory"],
    }),

    // ---------------- SHARE INVENTORY ----------------
    allShareInventory: builder.query({
      query: () => ({
        url: "/share/inventory/",
        method: "GET",
      }),
      providesTags: ["Share"],
    }),

    shareWithOtherInventory: builder.mutation({
      query: (data) => ({
        url: "/share/inventory/",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Share"],
    }),

    deleteShareInventory: builder.mutation({
      query: (id) => ({
        url: `/share/inventory/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Share"],
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

  // Category
  useAllCategoryQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useEditCategoryMutation,

  // Inventory
  useCreateInventoryMutation,
  useAllInventoryQuery,
  useDeleteInventoryMutation,
  useOnUpdateInventoryMutation,

  // Share
  useShareWithOtherInventoryMutation,
  useAllShareInventoryQuery,
  useDeleteShareInventoryMutation,
} = api;
