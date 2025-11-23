import { createBrowserRouter } from "react-router";
import Dashboard from "../page/dashboard/Dashboard";

import AuthPage from "../page/auth/AuthPage";

import RestPassword from "../page/auth/ResetPassword";
import ForgotPassword from "../page/auth/ForgotPassword";
import EmailVerification from "../page/auth/EmailVerification";
import Login from "../page/auth/Login";
import Register from "../page/auth/Register";
import OtpVerification from "../page/auth/OtpVerification";
import Profile from "../page/Profile";
import ResetPassword from "../page/auth/ResetPassword";
import Share from "../page/dashboard/inventory/Share";
import Category from "../page/dashboard/inventory/Category";
import Inventory from "../page/dashboard/inventory/Inventory";
import DashboardStats from "../page/dashboard/inventory/DashboardStats";

export const route = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {
        path: "dashboard",
        element: <DashboardStats/>
      },
      {
        path: "inventory",
        element: <Inventory/>
      },
      {
        path: "category",
        element: <Category/>
      },
      {
        path:'share',
        element:<Share/>

      },
      // {
      //   path: "setting",
      //   element: <Setting />,
      // },
      // profile
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  // auth

  {
    path: "/auth",
    element: <AuthPage />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "sign-up",
        element: <Register />,
      },
      {
        path: "reset-password",
        element: <RestPassword />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "email-verification",
        element: <EmailVerification />,
      },
      {
        path: "otp-verify",
        element: <OtpVerification />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
    ],
  },
  //  password

  {
    path: "forgot-password",
    element: <ForgotPassword />,
  },
  {
    path:'reset-password',
    element:<ResetPassword/>
  }
]);
