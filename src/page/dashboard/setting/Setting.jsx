import React, { useState } from "react";
import { baseApi } from "../../../utils/baseUrl";
import toast, { Toaster } from "react-hot-toast";

function Setting() {
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false); /// handel loading state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChange = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await baseApi.post(
        "/auth/users/me/change-password/",
        { old_password: oldPassword, new_password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        toast.success("Password changed successfully");
        setOldPassword("");
        setNewPassword("");
      }
      console.log(res);
    } catch (error) {
      console.log(error);
      toast.error("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-4">
      <Toaster />
      <h3 className="md:text-3xl text-2xl font-semibold mb-6">Change Password</h3>

      <form
        onSubmit={handleChange}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="p-3 border rounded-md w-full"
          required
        />

        <input
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
