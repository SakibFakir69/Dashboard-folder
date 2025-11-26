import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "userAuth",
  baseQuery: fetchBaseQuery({
    // eslint-disable-next-line no-undef
    baseUrl: import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8020',
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
        url: "/auth/register/",
        method: "POST",
        body: data,
      }),
    }),

    // Login
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/auth/login/",
        method: "POST",
        body: data,
      }),
    }),

    // Send OTP
    sendOtp: builder.mutation({
      query: ({ email }) => ({
        url: "/auth/email/verify/request/",
        method: "POST",
        body: { email },

      }),
    }),

    // Verify OTP
    verifyOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/auth/email/verify/conform/",
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
        url: "/auth/email/verify/request/",
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



    // category ------------------------------

    createCategory: builder.mutation({
      query: (data) => ({

        url: '/category/',
        method: "POST",
        body: data
      }),
      invalidatesTags: ['Category']
    }),

    // all category
    allCategory: builder.query({
      query: () => ({
        url: '/category/',
        method: "GET",
      }),
      providesTags: ['Category']
    }),

    // delete category

    deleteCategory: builder.mutation({
      query: (deleteById) => ({

        url: `/category/${deleteById}/`,
        method: "DELETE"

      }),
      invalidatesTags: ['Category']
    }),

    // edit category

    editCategory: builder.mutation({
      query: ({ id, ...data }) => ({

        url: `/category/${id}/`,
        method: "PATCH",
        body: data

      }),
      invalidatesTags: ['Category']
    }),




    // inventory -------------------------------------------------
    createInventory: builder.mutation({
      query: (data) => ({
        url: '/inventory/',
        method: "POST",
        body: data


      }),
      invalidatesTags: ['Inventory']
    }),
    // show all inventory 

    allInventory: builder.query({
      query: () => ({
        url: '/inventory',
        method: "GET",


      }),
      providesTags: ['Inventory']
    }),
    // delete invetory 

    deleteInventory: builder.mutation({
      query: (deleteById) => ({
        url: `/inventory/${deleteById}/`,
        method: "DELETE",

      }),
      invalidatesTags: ['Inventory']
    }),

    // update

    onUpdateInventory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/inventory/${id}/`,
        method: "PUT",
        body: data,

      }),
      invalidatesTags: ['Inventory']
    }),



    /// share with others 

    shareWithOtherInventory: builder.mutation({

      query: (name) => ({
        url: '/share/inventory/',
        method: "POST",
        body: name
      }),
      providesTags:['Share']


    }),
    allShareInventory:builder.query({
      query:()=>({
        url:'/share/inventory/',
        method:"GET",
      }),
      invalidatesTags:['Share']
    }),
    /// delete
    deleteShareInventory:builder.mutation({

      query:(id)=>({
        url:`/share/inventory/${id}/`,
        method:"DELETE"

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


  // category
  useAllCategoryQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useEditCategoryMutation,

  // inventory

  useCreateInventoryMutation,
  useAllInventoryQuery,
  useDeleteInventoryMutation,
  useOnUpdateInventoryMutation,

  // share

  useShareWithOtherInventoryMutation,
  useAllShareInventoryQuery,

  useDeleteShareInventoryMutation


} = api;
