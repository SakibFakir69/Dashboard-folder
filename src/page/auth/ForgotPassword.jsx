import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { baseApi } from "../../utils/baseUrl";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [isTrue, setIstrue] = useState(false);
  const pushToDashboard = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await baseApi.post(
        "/auth/user/forgot-password/send-otp/",
        email
      );
      const data = await res.data;
      console.log(data);

      if (res?.status === 200) {
        setIstrue(true);
        toast("OTP Send");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlVerify = async () => {
    const inputData = {
      email: email,
      otp: otp,
    };

    try {
      const res = await baseApi.post(
        "/auth/user/forgot-password/verify-otp/",
        inputData
      );
      const data = res.data;
      console.log(data);

      if (res?.status === 200) {
        pushToDashboard("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 p-4">
      {isTrue === false && (
        <form className="md:w-1/2 bg-white p-8 rounded ">
          <TextField placeholder="Enter your email" className="w-full" />

          <Button
            onClick={handleSubmit}
            type="submit"
            variant="contained"
            fullWidth
            className="!mt-3 !py-3 !rounded-xl !text-lg !bg-blue-600 hover:!bg-blue-700"
          >
            Send Otp
          </Button>
        </form>
      )}

      {isTrue === true && (
        <form className="md:w-1/2 bg-white p-8 rounded ">
          <TextField
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full"
          />

          <MuiOtpInput
            length={6}
            value={otp}
            onChange={setOtp}
            className="mb-6 mt-3"
            TextFieldsProps={{ placeholder: "-" }}
          />
          <Button
            onClick={handlVerify}
            type="submit"
            variant="contained"
            fullWidth
            className="!mt-3 !py-3 !rounded-xl !text-lg !bg-blue-600 hover:!bg-blue-700"
          >
            Send Otp
          </Button>
        </form>
      )}
    </div>
  );
}

export default ForgotPassword;
