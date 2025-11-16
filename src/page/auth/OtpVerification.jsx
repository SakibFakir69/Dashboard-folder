import { Button, TextField, Typography, Paper } from "@mui/material";
import React, { useState } from "react";
import { MuiOtpInput } from "mui-one-time-password-input";
import toast, { Toaster } from "react-hot-toast";
import { baseApi } from "../../utils/baseUrl";
import Lottie from "lottie-react";
import sendEmail from "../../../asset/Email.json";
import { useNavigate } from "react-router";

function OtpVerification() {
  const token = localStorage.getItem("token");
  const pushToLogin = useNavigate();

  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const res = await baseApi.post(
        "/auth/me/email/conform-verify/",
        { email, otp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(res?.data);

      if (res.data){
         toast.success("Verified successfully");

         setTimeout(()=>{

          pushToLogin('/auth/login');
          console.log("push to login")

          

         },2000)
      }


    } catch (error) {
      toast.error("OTP verification failed", error.name);
      console.log(error)
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-indigo-50 p-4">
      <Toaster position="top-right" />

      <Paper elevation={4} className="p-8 rounded-2xl w-full max-w-md">
        <div className="flex flex-col items-center">

        
          <Lottie animationData={sendEmail} loop className="w-56 h-56" />

          <Typography variant="h5" className="font-bold text-gray-800 mb-2">
            Verify Your OTP
          </Typography>

          <Typography className="text-gray-500 text-center mb-10">
            Enter the 6-digit OTP sent to your email
          </Typography>

          {/* Email Field */}
          <TextField
            fullWidth
            variant="outlined"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className=""
          />

          {/* OTP Input */}
          <MuiOtpInput
            length={6}
            value={otp}
            onChange={setOtp}
            className="mb-6 mt-3"
            TextFieldsProps={{ placeholder: "-" }}
          />

          {/* Submit Button */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSubmit}
            className="py-3"
          >
            Verify OTP
          </Button>
        </div>
      </Paper>
    </div>
  );
}

export default OtpVerification;
