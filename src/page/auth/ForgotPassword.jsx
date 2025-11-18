import { TextField } from "@mui/material";
import React, { useState } from "react";
import { MuiOtpInput } from "mui-one-time-password-input";
import toast, { Toaster } from "react-hot-toast";

import { useNavigate } from "react-router";
import Logo from "../../utils/logo";
import Button from "../../components/ui/Button";
import { useForgotPasswordSendOtpMutation, useForgotPasswordVerifyOtpMutation, useResetPasswordMutation } from "../../redux/features/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [forgotPasswordSendOtp] = useForgotPasswordSendOtpMutation();
const [forgotPasswordVerifyOtp] = useForgotPasswordVerifyOtpMutation();
const [resetPassword] = useResetPasswordMutation();

  const navigate = useNavigate();

  // Step -> OTP
  const handleSendOtp = async () => {
    if (!email) return toast.error("Email is required");
    if (!/^\S+@\S+\.\S+$/.test(email))
      return toast.error("Enter a valid email");

    setLoading(true);

    try {
      const res = await forgotPasswordSendOtp(email).unwrap();

      console.log(res);

      toast.success("OTP sent to your email");
      setStep("otp");
    } catch (error) {
      toast.error(error?.data?.detail || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (otp.length !== 6 || !/^\d+$/.test(otp))
      return toast.error("Enter valid 6-digit OTP");

    setLoading(true);
    try {
      const res = await forgotPasswordVerifyOtp({email, otp}).unwrap();
      console.log(res);
      toast.success("OTP Verified Successfully");
      setStep("reset");
    } catch (error) {
      toast.error(error?.data?.detail || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!password) return toast.error("Password is required");
    if (password.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (password !== confirmPassword)
      return toast.error("Passwords do not match");

    setLoading(true);
    try {
      await resetPassword({  email,
        otp,
        new_password: password,}).unwrap();

      toast.success("Password reset successfully! Redirecting...");
      setTimeout(() => navigate("/auth/login"), 1500);
    } catch (error) {
      toast.error(error?.data?.detail || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 p-4">
      <Toaster position="top-right" />

      <section className="flex w-full md:max-w-[1242px] bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex-1 p-6 md:p-12">
          {/* Logo */}
          <div className="flex justify-start items-center gap-2 mb-12">
            <Logo />
            <h2 className="text-2xl font-bold text-gray-800">Your Logo</h2>
          </div>

          {/* Content */}
          {step === "email" && (
            <div className="flex flex-col space-y-4 md:ml-8">
              <h4 className="font-semibold text-3xl text-gray-900 mb-2">
                Forgot Password
              </h4>
              <p className="text-gray-500 mb-6">
                Don’t worry, happens to all of us. Enter your email below to
                recover your password
              </p>

              <div className="flex flex-col md:gap-y-6 gap-y-3">
                <TextField
                  fullWidth
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="p-3"
                />

                <Button title="Send Otp" onClick={handleSendOtp} />
              </div>
              {/* Divider */}
              <div className="py-1">
                <div className="divider before:bg-gray-300 after:bg-gray-300">
                  <span className="text-gray-500">Or Sign up with</span>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex gap-3 w-full">
                <div className="flex-1 flex justify-center border border-blue-600 rounded-lg p-2 hover:shadow transition">
                  <img
                    className="w-7 h-7"
                    src="https://img.icons8.com/color/48/facebook-new.png"
                    alt="facebook-new"
                  />
                </div>

                <div className="flex-1 flex justify-center border border-blue-600 rounded-lg p-2 hover:shadow transition">
                  <img
                    className="w-7 h-7"
                    src="https://img.icons8.com/color/48/google-logo.png"
                    alt="google-logo"
                  />
                </div>

                <div className="flex-1 flex justify-center border border-blue-600 rounded-lg p-2 hover:shadow transition">
                  <img
                    className="w-7 h-7"
                    src="https://img.icons8.com/material-rounded/24/mac-os.png"
                    alt="mac-os"
                  />
                </div>
              </div>
            </div>
          )}

          {step === "otp" && (
            <div className="flex flex-col space-y-4 md:ml-8">
              <h4 className="font-semibold text-3xl text-gray-900 mb-2 text-left">
                Verify OTP
              </h4>
              <p className="text-gray-500 mb-6 text-left">
                We sent a 6-digit code to <strong>{email}</strong>
              </p>

              <MuiOtpInput
                length={6}
                value={otp}
                onChange={setOtp}
                className="mb-6"
              />

              <Button title={"Verify OTP"} onClick={handleVerifyOtp} />

              {/* Divider */}
              <div className="py-1">
                <div className="divider before:bg-gray-300 after:bg-gray-300">
                  <span className="text-gray-500">Or Sign up with</span>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex gap-3 w-full">
                <div className="flex-1 flex justify-center border border-blue-600 rounded-lg p-2 hover:shadow transition">
                  <img
                    className="w-7 h-7"
                    src="https://img.icons8.com/color/48/facebook-new.png"
                    alt="facebook-new"
                  />
                </div>

                <div className="flex-1 flex justify-center border border-blue-600 rounded-lg p-2 hover:shadow transition">
                  <img
                    className="w-7 h-7"
                    src="https://img.icons8.com/color/48/google-logo.png"
                    alt="google-logo"
                  />
                </div>

                <div className="flex-1 flex justify-center border border-blue-600 rounded-lg p-2 hover:shadow transition">
                  <img
                    className="w-7 h-7"
                    src="https://img.icons8.com/material-rounded/24/mac-os.png"
                    alt="mac-os"
                  />
                </div>
              </div>
            </div>
          )}

          {step === "reset" && (
            <div className="flex flex-col space-y-4 md:ml-8">
              <h4 className="font-semibold text-3xl text-gray-900 mb-2 text-left">
                Set a password
              </h4>
              <p className="text-gray-500 mb-6 text-left">
                Your previous password has been reseted. Please set a new
                password for your account.
              </p>

              <div className="flex gap-y-4 flex-col">
                <TextField
                  fullWidth
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <TextField
                  fullWidth
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />

                <Button
                  title={"Change Password"}
                  onClick={handleResetPassword}
                />
              </div>
            </div>
          )}
        </div>
        {/* Left Illustration */}
        <div className="hidden lg:flex flex-1 items-start justify-center p-8">
          <img
            src="/Rectangle 20.png"
            alt="Forgot Password"
            className="object-contain w-[490px] h-[600px] object-top"
          />
        </div>
      </section>
    </div>
  );
}

export default ForgotPassword;
