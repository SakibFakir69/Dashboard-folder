import React from "react";
import { useForm } from "react-hook-form";
import Button from "../../components/ui/Button";
import { Link, useNavigate } from "react-router";
import { baseApi } from "../../utils/baseUrl";
import toast, { Toaster } from "react-hot-toast";
import TextField from "@mui/material/TextField";
import Logo from "../../utils/logo";

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
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 w-full">
      <Toaster />

      <section className="flex w-full md:max-w-[1242px] bg-white rounded-xl shadow-lg overflow-hidden m-12 ">
        <div className="hidden lg:flex flex-1 items-start justify-centerml-12 md:py-12 l pb-10 ">
          <img
            src="/Group 4.png"
            alt="Illustration"
            className="object-contain  w-[490px]  h-[520px]"
          />
        </div>

        <div className="flex-1 p-6 md:p-12  md:mr-2 lg:mr-10 lg:14 ">
          <div className="flex justify-end items-center gap-2 mb-8 mr-8">
            <Logo />
            <h2 className="text-2xl font-bold text-gray-800">Your Logo</h2>
          </div>

          <h4 className="font-semibold text-3xl text-gray-900 mb-2">Sign Up</h4>
          <p className="text-gray-500 mb-6">
            Let’s get you all set up so you can access your personal account.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
            <div className="grid grid-cols-2 gap-3">
              <TextField
                fullWidth
                label="username"
                variant="outlined"
                {...register("username", {
                  required: "username name is required",
                })}
                error={!!errors.username}
                helperText={errors.username?.message}
              />

              <TextField
                fullWidth
                label="Last Name"
                variant="outlined"
                {...register("last_name", {
                  required: "Last name is required",
                })}
                error={!!errors.last_name}
                helperText={errors.last_name?.message}
              />

              <TextField
                fullWidth
                type="email"
                label="Email"
                variant="outlined"
                {...register("email", { required: "Email is required" })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <TextField
                fullWidth
                type="password"
                label="Password"
                variant="outlined"
                {...register("password", { required: "Password is required" })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                className="h-4 w-4 appearance-none rounded border border-gray-400 bg-white 
             checked:bg-indigo-600 checked:border-indigo-600 
             cursor-pointer"
              />

              <p className="text-sm text-gray-800">
                I agree to all the{" "}
                <span className="text-[#FF8682] font-medium">Terms</span> and{" "}
                <span className="text-[#FF8682] font-medium">
                  Privacy Policies
                </span>
                .
              </p>
            </div>

            <Button title="Create Your Account" type="submit" fullWidth />

            <p className="text-center text-sm mt-3 text-gray-700">
              Already have an account?{" "}
              <Link to={'/auth/login'} className="text-[#FF8682] font-medium cursor-pointer">
                Login
              </Link>
            </p>

            {/* Divider */}
            <div className="py-2">
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
      </section>
    </div>
  );
}

export default Register;
