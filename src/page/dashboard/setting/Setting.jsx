import React, { useState } from "react";

import toast, { Toaster } from "react-hot-toast";
import { useChangePasswordMutation } from "../../../redux/features/api";
import { TextField } from "@mui/material";

function Setting() {
 

  const [loading, setLoading] = useState(false); /// handel loading state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changePassword] = useChangePasswordMutation();

  const handleChange = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  console.log(token)
  if (!token) {
    toast.error("You must be logged in to change your password.");
    return;
  }

  if (!oldPassword || !newPassword) {
    toast.error("Both old and new passwords are required.");
    return;
  }

  setLoading(true);
  try {
    const res = await changePassword({
      old_password: oldPassword,
      new_password: newPassword,
      token, // <-- pass token here
    }).unwrap();



    toast.success("Password changed successfully!");
    setOldPassword("");
    setNewPassword("");
    console.log(res , token);
  } catch (error) {
    toast.error(error?.data?.detail || "Failed to change password");
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex flex-col items-center justify-center w-full p-4">
      <Toaster />
      <h3 className="md:text-3xl text-2xl font-semibold mb-6 color-2">
        Change Password
      </h3>

      <form
        onSubmit={handleChange}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <TextField
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="p-3  border rounded-md w-full border-black outline "
          required
        />

        <TextField
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="p-3 border rounded-md w-full"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-600 hover:bg-blue-700 h-12 rounded-xl text-lg text-white font-semibold shadow-sm transition-all ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Submitting..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}

export default Setting;
