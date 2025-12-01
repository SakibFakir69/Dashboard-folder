
import axios from 'axios'

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refToken");
  console.log(refreshToken, 'token ref')

  if (!refreshToken) return null;

  try {
    const res = await axios.post(
      `http://127.0.0.1:8020/auth/login/refresh/`,
      { refresh:refreshToken }
    );

    const newAccess = res.data?.access;
    console.log(newAccess , ' access token');

    if (newAccess) {
      localStorage.setItem("token", newAccess);
      return newAccess;
    }

    return null;
  } catch (err) {
    console.error("Refresh failed:", err);
    return null;
  }
};











export const getValidAccessToken = async () => {
  const access = localStorage.getItem("token");
  const refresh = localStorage.getItem("refToken");

  if (!access || !refresh) return null;


  try {
    const tokenData = JSON.parse(atob(access.split(".")[1]));
    const exp = tokenData.exp * 1000;

    if (Date.now() < exp) {
      // access token still valid
      return access;
    }
  } catch {
    return null;
  }

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/auth/login/refresh/`,
      { refresh }
    );
    console.log(res);

    const newAccess = res.data?.access;
    if (newAccess) {
      localStorage.setItem("token", newAccess);
      return newAccess;
    }

    return null;
  } catch {
    return null;
  }
};
