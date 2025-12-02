import axios from "axios";

// Refresh access token using the refresh token
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refToken");
  if (!refreshToken) {
    console.warn("No refresh token found");
    localStorage.clear();
    return null;
  }

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8020"}/auth/login/refresh/`,
      { refresh: refreshToken },
      { headers: { "Content-Type": "application/json" } }
    );

    const newAccess = res.data?.access;
    if (newAccess) {
      localStorage.setItem("token", newAccess);
      return newAccess;
    }

    localStorage.clear();
    return null;
  } catch (err) {
    console.error("Refresh failed:", err.response?.data || err.message);
    localStorage.clear();
    return null;
  }
};

// Get valid access token: use current or refresh if expired
export const getValidAccessToken = async () => {
  const access = localStorage.getItem("token");
  const refresh = localStorage.getItem("refToken");

  if (!refresh) return null;

  if (access) {
    try {
      const tokenData = JSON.parse(atob(access.split(".")[1]));
      const exp = tokenData.exp * 1000;
      if (Date.now() < exp) {
        // access token still valid
        return access;
      }
    } catch {
      console.warn("Invalid access token, trying refresh");
    }
  }

  // Access token missing or expired, refresh
  return await refreshAccessToken();
};
