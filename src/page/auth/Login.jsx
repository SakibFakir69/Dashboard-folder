import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Box } from "@mui/material";
import { baseApi } from "../../utils/baseUrl";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router";

function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await baseApi.post("/auth/users/login/", data);
      const token = res.data?.access;
      localStorage.setItem("token", token);
      localStorage.setItem("refToken", res.data?.refresh);

      toast.success("Login Successful");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50">
      <Toaster />

      <div className="w-[92%] md:w-[75%] lg:w-[65%] bg-white backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-300">

        {/* form box */}
        <div className="flex-1 p-6 md:p-12">
          <h2 className="text-center font-bold text-3xl text-gray-800 mb-6">
            Welcome <span className="text-blue-600">Back</span>
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
              label="Password"
              type="password"
              fullWidth
              {...register("password", { required: "Password is required" })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Link
              to="/forgot-password"
              className="text-blue-600 hover:underline text-right text-sm"
            >
              Forgot Password?
            </Link>

            <button className="bg-blue-600 hover:bg-blue-700 h-12 rounded-xl text-lg text-white font-semibold shadow-sm transition-all">
              Login
            </button>
          </form>

          <Box className="mt-6 text-center text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/auth/sign-up"
              className="text-blue-600 hover:underline font-medium"
            >
              Register
            </Link>
          </Box>
        </div>

        {/* img box */}
        <div className="flex-1 hidden md:block">
          <img
            src="/3999335.jpg"
            alt="Login Illustration"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
