import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { baseApi } from "../../utils/baseUrl";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MuiOtpInput } from "mui-one-time-password-input";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState("email"); // 'email' | 'otp' | 'reset'
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    setLoading(true);
    try {
      const res = await baseApi.post("/auth/user/forgot-password/send-otp/", { email });

      if (res.status === 200) {
        toast.success("OTP sent to your email");
        setStep("otp");
      }
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await baseApi.post("/auth/user/forgot-password/verify-otp/", {
        email,
        otp,
      });

      if (res?.data?.detail) {
        toast.success("OTP Verified Successfully");
        setStep("reset");
      }
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async () => {

    console.log("hanlde reset password")
    if (!password) {
      toast.error("Password is required");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await baseApi.post("/auth/user/forgot-password/reset/", {
        email,
        otp,
        new_password: password,
      });
      console.log(res)

      if (res?.status === 200) {
        toast.success("Password reset successfully! Redirecting to login...");
        setTimeout(() => navigate("/"), 1500); 
      }
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  console.log(step)

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 p-4">
      
      <Toaster/>
      {step === "email" && (
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg"
        >
          <div className="flex justify-center items-center flex-col mb-6">
            <img
              src="/20944201.jpg"
              alt="Forgot Password"
              className="w-48 h-48 object-contain"
            />
            <p className="text-gray-600 text-sm -mt-4">Enter your registered email</p>
          </div>

          <TextField
            type="email"
            placeholder="your@email.com"
            className="w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            autoFocus
          />

          


          <button       onClick={handleSendOtp}
            disabled={loading} className="bg-blue-600 hover:bg-blue-700 h-12 rounded-xl text-lg text-white font-semibold shadow-sm transition-all w-full mt-2">
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>


        </form>
      )}

  
      {step === "otp" && (
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">
            Check Your Email
          </h2>
          <p className="text-center text-sm text-gray-600 mb-6">
            We sent a 6-digit code to <strong>{email}</strong>
          </p>

          <MuiOtpInput
            length={6}
            value={otp}
            onChange={setOtp}
            className="mb-6"
           
          />

         
          <button  onClick={handleVerifyOtp}
            disabled={loading || otp.length !== 6} className="bg-blue-600 hover:bg-blue-700 h-12 rounded-xl text-lg text-white font-semibold shadow-sm transition-all w-full">
                {loading ? "Verifying..." : "Verify OTP"}
            </button>

          <p className="text-center text-xs text-gray-500 mt-4">
            Didn't receive?{" "}
            <button
             
              className="text-blue-600 hover:underline font-medium"
              disabled={loading}
            >
              Resend
            </button>

            
          </p>
        </div>
      )}

      {/*  Reset Password */}
      {step === "reset" && (
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-4">
          <h2 className="text-center text-2xl font-bold text-gray-800">
            Set New Password
          </h2>
          <p className="text-center text-sm text-gray-600">
            Your OTP is verified. Now choose a strong password.
          </p>

          <div className="flex flex-col gap-y-2">
            <TextField
            type="password"
            placeholder="New password"
            className=""
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <TextField
          
            type="password"
            placeholder="Confirm new password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />

          

          <button  onClick={handleResetPassword}
            disabled={loading || !password || password !== confirmPassword} className="bg-blue-600 hover:bg-blue-700 mt-2 h-12 rounded-xl text-lg text-white font-semibold shadow-sm transition-all">
              {loading ? "Changing Password..." : "Change Password"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;