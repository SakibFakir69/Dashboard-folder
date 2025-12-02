import axios from "axios";
import { getValidAccessToken } from "./auth"; // Use getValidAccessToken for pre-check

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8020",
  headers: { "Content-Type": "application/json" },
});

// Request interceptor: attach token, check expiry
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getValidAccessToken(); // ensures token is valid or refreshed
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 by refreshing token if needed
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newToken = await getValidAccessToken(); // try refreshing
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      }

      // If still fails, clear storage and optionally redirect
      localStorage.clear();
      window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  }
);

export const axiosBaseQuery = () => async ({ url, method, data }) => {
  try {
    const result = await axiosInstance({
      url,
      method,
      ...(method.toLowerCase() === "get" ? { params: data } : { data }),
    });
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

export default axiosInstance;
