import { TextField } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import toast, { Toaster } from "react-hot-toast";

function Profile() {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
    
const [updateProfile] = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();



const onSubmit = async (data) => {
  setLoading(true);
  

  try {
    const res = await updateProfile({ data, token }).unwrap(); 

    toast.success("Profile updated successfully");
    console.log(res);
  } catch (error) {
    console.log(error);
    toast.error(error?.data?.detail || "Failed to update profile");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex justify-center items-center flex-col w-full p-4">
      <Toaster />

      <h3 className="md:text-3xl text-2xl font-semibold">Update your profile</h3>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-y-4 mt-10 justify-center mx-auto items-center"
      >
        <img className="h-20 w-20 rounded-full " src="https://img.icons8.com/material-rounded/24/person-male.png"/>
        <TextField
          {...register("username", { required: true })}
          variant="outlined"
          className="md:w-1/2 w-full"
          placeholder="Enter your username"
        />
        {errors.username && <span className="text-red-500">This field is required</span>}

        <TextField
          {...register("first_name", { required: true })}
          variant="outlined"
          className="md:w-1/2 w-full"
          placeholder="Enter your first name"
        />
        {errors.first_name && <span className="text-red-500">This field is required</span>}

        <TextField
          {...register("last_name", { required: true })}
          variant="outlined"
          className="md:w-1/2 w-full"
          placeholder="Enter your last name"
        />
        {errors.last_name && <span className="text-red-500">This field is required</span>}

        <TextField
          {...register("email", {
            required: true,
          
          })}
          variant="outlined"
          className="md:w-1/2 w-full"
          placeholder="Enter your email"
        />
        {errors.email && (
          <span className="text-red-500">
             {errors.email.message || "This field is required"}
          </span>
        )}

        

        <div className="mt-4">
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 hover:bg-blue-700 h-12 rounded-xl text-lg text-white font-semibold shadow-sm transition-all max-w-40 w-60 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
