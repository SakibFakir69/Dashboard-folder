import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Box } from "@mui/material";
import { useNavigate } from "react-router";
import { baseApi } from "../../utils/baseUrl";
import toast, { Toaster } from "react-hot-toast";

function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await baseApi.post("/auth/users/register/", data);
      const token = res.data?.access;
      localStorage.setItem("token", token);

      await baseApi.post(
        "/auth/me/email/request-verify/",
        { email: data.email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("OTP sent to your email!");
      navigate("/auth/otp-verify");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50">
      <Toaster />

      <div className="w-[92%] md:w-[75%] lg:w-[65%] bg-white backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-300">

      
        <div className="flex-1 p-6 md:p-12">
          <h2 className="text-center font-bold text-3xl text-gray-800 mb-6">
            Create Your <span className="text-blue-600">Account</span>
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <TextField
              label="Username"
              fullWidth
              {...register("username", { required: "Username is required" })}
              error={!!errors.username}
              helperText={errors.username?.message}
            />

            <TextField
              label="First Name"
              fullWidth
              {...register("firstname", { required: "First name is required" })}
              error={!!errors.firstname}
              helperText={errors.firstname?.message}
            />

            <TextField
              type="password"
              label="Password"
              fullWidth
              {...register("password", { required: "Password is required" })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <TextField
              type="email"
              label="Email"
              fullWidth
              {...register("email", { required: "Email is required" })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <button className="bg-blue-600 hover:bg-blue-700 h-12 rounded-xl text-lg text-white font-semibold shadow-sm transition-all">
              Register
            </button>
          </form>

          <Box className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <span
                   className="text-blue-600 hover:underline font-medium"
              onClick={() => navigate("/auth/login")}
            >
              Login
            </span>
          </Box>
        </div>

        {/* img */}
        <div className="flex-1 hidden md:block">
          <img
            src="/3999335.jpg"
            alt="Register"
            className="h-full w-full object-cover"
          />
        </div>

      </div>
    </div>
  );
}

export default Register;
