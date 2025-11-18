import { TextField, Typography, Paper } from "@mui/material";
import React, { useState } from "react";
import { MuiOtpInput } from "mui-one-time-password-input";
import toast, { Toaster } from "react-hot-toast";

import { useNavigate } from "react-router";
import Logo from "../../utils/logo";
import Button from "../../components/ui/Button";
import {
  useResendPasswordMutation,
  useVerifyOtpMutation,
} from "../../redux/features/api";
import { jwtDecode } from "jwt-decode";

function OtpVerification() {
  const token = localStorage.getItem("token");
  const [resendPassword] = useResendPasswordMutation();
  const decoded = jwtDecode(token) || "sdf"
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");

  const [verifyOtp] = useVerifyOtpMutation();

  const handleResendOtp = async () => {
    try {
      const res = await resendPassword({
        email: decoded?.email,
        token: token,
      }).unwrap();

      console.log(res);
      toast.success("Sent OTP to your gmail");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const res = await verifyOtp({
        email: decoded?.email,
        otp,
        token,
      }).unwrap();
      console.log(res, "verify response");

      if (res?.detail) {
        toast.success("Verified successfully");
       

        localStorage.removeItem("token");

        setTimeout(() => navigate("/auth/login"), 2000);
      } else {
        toast.success("OTP verified!");
      }
    } catch (error) {
      toast.error(error?.data?.detail || "OTP verification failed");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 w-full p-4">
      <Toaster position="top-right" />

      <section className="flex w-full md:max-w-[1242px] bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex-1 p-6 md:p-12">
          {/* Logo */}{" "}
          <div className="flex justify-start items-center gap-2 mb-12">
            <Logo />
            <h2 className="text-2xl font-bold text-gray-800">Your Logo</h2>
          </div>
          <div className="md:ml-8">
            <div className="flex flex-col items-center md:items-start md:py-4">
              <h4 className="font-semibold text-3xl text-gray-900 ">
                Verify Your OTP
              </h4>
              <p className="text-gray-500 mb-6 text-center md:text-left">
                Enter the 6-digit OTP sent to your email
              </p>
            </div>

            <MuiOtpInput
              length={6}
              value={otp}
              onChange={setOtp}
              className="mb-6 mt-2"
              TextFieldsProps={{ placeholder: "-" }}
            />

            <Button
              title="Send OTP"
              onClick={handleSubmit}
              fullWidth
              className="bg-blue-600 hover:bg-blue-700 h-12 rounded-xl font-semibold text-lg"
            />

            <div onClick={handleResendOtp}>
              <p className="text-center text-black mt-3">Resend your code</p>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex flex-1 items-start justify-cente p-8 mt-10">
          <img
            src="/Group 4.png"
            alt="Illustration"
            className="object-contain w-[490px] h-[600px] object-top"
          />
        </div>
      </section>
    </div>
  );
}

export default OtpVerification;
