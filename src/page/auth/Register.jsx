import React from "react";
import { useForm } from "react-hook-form";
import { Button, TextField, Typography, Box, Paper } from "@mui/material";
import { useNavigate } from "react-router";
import { baseApi } from "../../utils/baseUrl";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router";

function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);

    try {
      // Register user
      const res = await baseApi.post("/auth/users/register/", data);
      const responseData = res.data;
      console.log(responseData);

      localStorage.setItem("token", responseData?.access);

      // email verification
      const emailResponse = await baseApi.post(
        "/auth/me/email/request-verify/",
        { email: data.email },
        {
          headers: {
            Authorization: `Bearer ${responseData?.access}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(emailResponse.data);
      toast.success("OTP sent to your email. Please verify.");
      navigate("/auth/otp-verify");
    } catch (error) {
      console.log(error);
      toast.error(`Error: ${error.response?.data?.detail || error.message}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700">
      <Toaster position="top-right" reverseOrder={false} />

      <Paper
        elevation={6}
        className="p-8 md:w-1/3 w-full rounded-xl shadow-lg bg-white"
      >
        <Typography
          variant="h4"
          color="black"
          className="text-center font-bold  text-gray-800"
        >
          Create Your Account
        </Typography>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 mt-4"
        >
          <TextField
            fullWidth
            label="Username"
            placeholder="Enter your username"
            variant="outlined"
            {...register("username", { required: "Username is required" })}
            error={!!errors.username}
            helperText={errors.username?.message}
          />

          <TextField
            fullWidth
            label="First Name"
            placeholder="Enter your first name"
            variant="outlined"
            {...register("firstname", { required: "First name is required" })}
            error={!!errors.firstname}
            helperText={errors.firstname?.message}
          />

          <TextField
            fullWidth
            type="password"
            label="Password"
            placeholder="Enter your password"
            variant="outlined"
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <TextField
            fullWidth
            type="email"
            label="Email"
            placeholder="Enter your email"
            variant="outlined"
            {...register("email", { required: "Email is required" })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="!mt-3 !py-3 !rounded-xl !text-lg !bg-blue-600 hover:!bg-blue-700"
          >
            Register
          </Button>
        </form>

        <Box className="mt-6 text-center text-gray-500">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/auth/login")}
          >
            Login
          </span>
        </Box>
      </Paper>
    </div>
  );
}

export default Register;
