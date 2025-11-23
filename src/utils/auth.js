

// utils/auth.js
export const decodeJWT = (token) => {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (err) {
    return null;
  }
};

export const isTokenExpired = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded) return true;
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refToken");
  if (!refreshToken) return null;

  try {
    const res = await fetch("http://127.0.0.1:8020/auth/jwt/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    const data = await res.json();
    console.log(data , ' refresh token');
    
    if (res.ok && data.access) {
      localStorage.setItem("token", data.access);
      return data.access;
    }
    return null;
  } catch (err) {
    console.error("Refresh token failed:", err);
    return null;
  }
};

export const getValidAccessToken = async () => {
  let token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    token = await refreshAccessToken();
  }
  return token;
};
