import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Box } from "@mui/material";

import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router";
import Logo from "../../utils/logo";
import Button from "../../components/ui/Button";
import { useLoginUserMutation } from "../../redux/features/api";

function Login() {
  const navigate = useNavigate();

  const [loginUser] = useLoginUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

const onSubmit = async (data) => {
  try {
    const res = await loginUser(data).unwrap();

    console.log(res);

    // if email not verify can not access

    localStorage.setItem("token", res?.access);
    localStorage.setItem("refToken", res?.refresh);

    toast.success("Login Successful");
    navigate("/");
  } catch (error) {
    toast.error(error?.data?.detail || "Invalid credentials");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 w-full">
      <Toaster />

      <section className="flex w-full md:max-w-[1242px] bg-white rounded-xl shadow-lg overflow-hidden m-12 ">
        <div className="flex-1 p-6 md:p-12  md:mr-2 lg:mr-10  ">
          <div className="flex justify-start items-center gap-2 mb-12 mr-8">
            <Logo />
            <h2 className="text-2xl font-bold text-gray-800">Your Logo</h2>
          </div>

          <div className="  flex flex-col leading-2 md:ml-8">

            <h4 className="font-semibold text-3xl text-gray-900 mb-2 mt-10">Login</h4>
            <p className="text-gray-500 mb-6">
              Login to access your travelwise account
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 ">
              <div className="flex flex-col gap-y-2">
                <TextField
                  fullWidth
                  label="username"
                  variant="outlined"
                  {...register("username", {
                    required: "username is required",
                  })}
                  error={!!errors.username}
                  helperText={errors.username}
                />

                <TextField
                  fullWidth
                  type="password"
                  label="Password"
                  variant="outlined"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start mb-3 mt-2 flex-col ">
                <div className="flex items-center gap-x-3">
                  <input
                  type="checkbox"
                  className="h-4 w-4 appearance-none rounded border border-gray-400 bg-white 
             checked:bg-indigo-600 checked:border-indigo-600 
             cursor-pointer"
                />

                <p className="text-sm font-semibold text-gray-800">
                  Remember me
                </p>
                </div>
                <br/>
                <Link to={'/forgot-password'} className="color-2 underline mp-2">Forgot Password</Link>
              </div>
              
            

              <Button  title="Login Your Account" type="submit" fullWidth />

              <p className="text-center text-sm mt-3 text-gray-700">
                Already have't an account?{" "}
                <Link to={'/auth/sign-up'} className="text-[#FF8682] font-medium cursor-pointer">
                  Sign up
                </Link>
              </p>

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
            </form>
          </div>
        </div>
        <div className="hidden lg:flex flex-1 items-start justify-centerml-12 md:py-12 l pb-10 mt-8 ">
          <img
            src="/Group 4.png"
            alt="Illustration"
            className="object-contain  w-[490px]  h-[600px]"
          />
        </div>
      </section>
    </div>
  );
}

export default Login;
