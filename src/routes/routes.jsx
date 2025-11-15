import { createBrowserRouter } from "react-router";
import Dashboard from "../page/dashboard/Dashboard";
import RevenuChart from "../page/dashboard/chart/RevenuChart";
import SalesChart from "../page/dashboard/chart/SalesChart";
import UserOverViewChart from "../page/dashboard/chart/UserOverViewChart";
import Setting from "../page/dashboard/setting/Setting";
import AuthPage from "../page/auth/AuthPage";

import RestPassword from "../page/auth/RestPassword";
import ForgotPassword from "../page/auth/ForgotPassword";
import EmailVerification from "../page/auth/EmailVerification";
import Login from "../page/auth/Login";
import Register from "../page/auth/Register";
import OtpVerification from "../page/auth/OtpVerification";

export const route = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {
        path: "revenu",
        element: <RevenuChart />,
      },
      {
        path: "sales",
        element: <SalesChart />,
      },
      {
        path: "user-overview",
        element: <UserOverViewChart />,
      },
      {
        path: "setting",
        element: <Setting />,
      },
    ],
  },
  // auth

  {
    path: "/auth",
    element:<AuthPage/>,
    children:[
        {
            path:'',
            element:<Login/>
        },
        {
            path:'sign-up',
            element:<Register/>
        },
        {
            path:'reset-password',
            element:<RestPassword/>
        },
        {
            path:'forgot-password',
            element:<ForgotPassword/>
        },
        {
            path:'email-verification',
            element:<EmailVerification/>
        },
        {
          path:'otp-verify',
          element:<OtpVerification/>
        }
    ]
  },



]);
