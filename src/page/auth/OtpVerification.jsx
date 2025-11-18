import { TextField, Typography, Paper } from "@mui/material";
import React, { useState } from "react";
import { MuiOtpInput } from "mui-one-time-password-input";
import toast, { Toaster } from "react-hot-toast";



import { useNavigate } from "react-router";
import Logo from "../../utils/logo";
import Button from "../../components/ui/Button";
import { useVerifyOtpMutation } from "../../redux/features/api";
function OtpVerification() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [ verifyOtp] = useVerifyOtpMutation();

  const handleSubmit = async () => {
  if (otp.length !== 6) {
    toast.error("Please enter a valid 6-digit OTP");
    return;
  }

  try {
   
    const res = await verifyOtp({ email, otp, token }).unwrap();

    if (res?.data) {
      toast.success("Verified successfully");
      setTimeout(() => navigate("/auth/login"), 2000);
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
      
       

        {/* Right Side Form */}
        <div className="flex-1 p-6 md:p-12">
          {/* Logo */}
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

          {/* Email Input */}
          <TextField
            fullWidth
            variant="outlined"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="-mt-10"
          />

          {/* OTP Input */}
          <MuiOtpInput
            length={6}
            value={otp}
            onChange={setOtp}
            className="mb-6 mt-2"
            TextFieldsProps={{ placeholder: "-" }}
          />

        

        

          <Button
  title="Send OTP"
  onClick={handleSubmit} // handle manually
  fullWidth
  className="bg-blue-600 hover:bg-blue-700 h-12 rounded-xl font-semibold text-lg"
/>



       
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
