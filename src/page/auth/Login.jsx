import { Button, Paper, TextField } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { baseApi } from "../../utils/baseUrl";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router";

function Login() {

  const pushToDasboard = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { username, password } = data;

    if (!username) {
      toast.error("Please Enter Username");
      return;
    }
    if (!password) {
      toast.error("Please Enter Password");
      return;
    }

    try {
      const res = await baseApi.post("/auth/users/login/", data);
      const resData = res.data;

      localStorage.setItem("token", resData?.access);
      localStorage.setItem("refToken", resData?.refresh)


      console.log(resData)
     

      if(resData?.access)
      {
         toast.success("Login Successful");
         pushToDasboard('/')

      }

      
    } catch (error) {
      toast.error("Invalid credentials");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 p-4">
      <Toaster />

      <Paper className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/90 backdrop-blur-lg">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Welcome <span className="text-blue-600">Back</span>
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Username */}
          <div className="flex flex-col">
            <TextField
              {...register("username", { required: true })}
              label="Username"
              variant="outlined"
              fullWidth
            />
            {errors.username && (
              <span className="text-red-500 mt-1 text-sm">
                Username is required
              </span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <TextField
              {...register("password", { required: true })}
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
            />
            {errors.password && (
              <span className="text-red-500 mt-1 text-sm">
                Password is required
              </span>
            )}
          </div>


          <Link to={'/forgot-password'} className="text-black underline">Forgot Password</Link>

      
          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="!mt-3 !py-3 !rounded-xl !text-lg !bg-blue-600 hover:!bg-blue-700"
          >
            Login
          </Button>
        </form>

        <div className="mt-4">
          <span>You haven't account <Link to={'/auth/sign-up'} className="text-green-500 "> Register</Link>  </span>
        </div>
      </Paper>
    </div>
  );
}

export default Login;
