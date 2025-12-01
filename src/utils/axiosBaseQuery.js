import axios from "axios";
import { refreshAccessToken } from "./auth";
import {  jwtDecode  } from "jwt-decode";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8020",
  headers: { "Content-Type": "application/json" },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;

      // If token expired, refresh it first
      if (decoded.exp < now) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          localStorage.setItem("token", newToken);
          config.headers.Authorization = `Bearer ${newToken}`;
        } else {
          localStorage.clear();
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("missing token");
      return Promise.reject(error);
    }

    const decoded = jwtDecode(token);
    console.log(decoded, "decode");

    const now = Date.now() / 1000;

    if (decoded.exp < now && error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      console.log(newToken, "new access token");

      if (newToken) {
        localStorage.setItem("token", newToken);
        axiosInstance.defaults.headers.Authorization = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      }

      localStorage.clear();
    }

    return Promise.reject(error);
  }
);

export const axiosBaseQuery = () => async ({ url, method, data }) => {
  try {
    const result = await axiosInstance({ url, method, data });
    return { data: result.data };
  } catch (error) {
    return {
      error: {
        status: error.response?.status,
        data: error.response?.data,
      },
    };
  }
};
