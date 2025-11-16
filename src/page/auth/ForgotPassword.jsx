import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { baseApi } from "../../utils/baseUrl";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";  
import { MuiOtpInput } from "mui-one-time-password-input";
import { set } from "react-hook-form";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email");  
  const [ password , setPassword ] = useState("")

  const navigate = useNavigate();


  const handleSendOtp = async (event) => {
    event.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      const res = await baseApi.post(
        "/auth/user/forgot-password/send-otp/",
        { email }
      );

      if (res.status === 200) {
        console.log(res);
        toast.success("OTP sent to your email");
        setStep("otp");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to send OTP");
    }
  };


  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }

    try {
      const res = await baseApi.post(
        "/auth/user/forgot-password/verify-otp/",
        { email, otp }
      );

      if (res.status === 200) {
        toast.success("OTP Verified");

        setStep("reset")
           
      }
    } catch (error) {
      console.log(error);
      toast.error("Invalid OTP");
    }
  };



  const handleResetPassword = async ()=>{

    const data ={
      email:email,
      otp:otp,
      new_password:password
    }

    try {

      const res = await baseApi.post('/auth/user/forgot-password/reset/',data);

      console.log(res)

      if(res?.status===200)
      {
        navigate('/');
      }
      
    } catch (error) {
      console.log(error);
      
    }

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 p-4">

     
      {step === "email" && (
        <form className="md:w-1/2 bg-white p-8 rounded ">
          <TextField
            placeholder="Enter your email"
            className="w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            onClick={handleSendOtp}
            fullWidth
            variant="contained"
            className="!mt-3 !py-3 !rounded-xl !text-lg !bg-blue-600 hover:!bg-blue-700"
          >
            Send OTP
          </Button>
        </form>
      )}

      
      {step === "otp" && (
        <form className="md:w-1/2 bg-white p-8 rounded ">
          <MuiOtpInput
            length={6}
            value={otp}
            onChange={setOtp}
            className="mb-6 mt-3"
            TextFieldsProps={{ placeholder: "-" }}
          />

          <Button
            onClick={handleVerifyOtp}
            fullWidth
            variant="contained"
            className="!mt-3 !py-3 !rounded-xl !text-lg !bg-blue-600 hover:!bg-blue-700"
          >
            Verify OTP
          </Button>
        </form>
      )}


      {/* last step */}


      {
        step==='reset' && (
          <form>
              <TextField
            placeholder="Enter your email"
            className="w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <MuiOtpInput
            length={6}
            value={otp}
            onChange={setOtp}
            className="mb-6 mt-3"
            TextFieldsProps={{ placeholder: "-" }}
          />
          <TextField onChange={(e)=> setPassword(e.target.value)} placeholder="Enter your new password" className="w-full" value={password}/>

             <Button
            onClick={handleResetPassword}
            fullWidth
            variant="contained"
            className="!mt-3 !py-3 !rounded-xl !text-lg !bg-blue-600 hover:!bg-blue-700"
          >
            Change Password
          </Button>

          </form>
        )
      }


    </div>
  );
}

export default ForgotPassword;
