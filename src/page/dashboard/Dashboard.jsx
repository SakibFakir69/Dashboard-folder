import React, { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  FiClipboard,
  FiInbox,
  FiShoppingCart,
  FiShare2,
  FiMenu,
  FiX,
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { getValidAccessToken } from "../../utils/auth";
import { CircularProgress } from "@mui/material";

function Dashboard() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const prevPath = useRef(location.pathname);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    prevPath.current = location.pathname;
  }, [location.pathname]);

  const links = [
    { id: 1, title: "Dashboard", route: "dashboard", icon: <FiClipboard /> },
    { id: 2, title: "Inventory", route: "/inventory", icon: <FiInbox /> },
    { id: 3, title: "Category", route: "/category", icon: <FiShoppingCart /> },
    { id: 4, title: "Share", route: "/share", icon: <FiShare2 /> },
  ];

  useEffect(() => {
    const checkTokens = async () => {
      const validToken = await getValidAccessToken();
      if (!validToken) {
        toast.error("Session expired. Please login again.");
        localStorage.clear();
        navigate("/auth/login");
        return;
      }
      setLoading(false);
    };
    checkTokens();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth/login");
    toast.success("User logged out successfully");
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Toaster />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-50
          transform transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:relative
        `}
      >
        {/* Mobile header */}
        <div className="flex justify-between items-center p-4 md:hidden">
          <h2 className="text-2xl font-bold text-black">Dashboard</h2>
          <button onClick={() => setIsSidebarOpen(false)}>
            <FiX className="text-red-500 text-2xl" />
          </button>
        </div>

        {/* Logo / title */}
        <div className="px-4 md:mt-4">
          <h2 className="hidden md:block text-2xl font-bold mb-2 text-black">
            Inventory Manager
          </h2>
          <p className="text-gray-500 text-sm text-center md:ml-0 -ml-8 md:text-left">
            Business Management System
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col h-screen px-4 pt-6">
          <div className="flex-1 flex flex-col gap-3">
            {links.map((link) => (
              <NavLink
                key={link.id}
                to={link.route}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                {link.icon}
                <span className="font-medium">{link.title}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <div className="flex justify-between items-center bg-white p-4 shadow-md">
          {/* Title */}
          <h1 className="hidden md:block text-2xl font-bold text-gray-800">
            Dashboard
          </h1>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsSidebarOpen(true)}>
              <FiMenu size={28} className="text-blue-500" />
            </button>
          </div>

          {/* Profile & logout */}
          <div className="flex items-center gap-4">
            {token && (
              <button
                onClick={handleLogout}
                className="bg-blue-600 hover:bg-blue-700 h-10 rounded text-white px-4 transition-all"
              >
                Logout
              </button>
            )}
            <Link to="/profile">
              <img
                src="https://img.icons8.com/material-rounded/24/person-male.png"
                alt="Profile"
                className="h-10 w-10 rounded-full border"
              />
            </Link>
          </div>
        </div>

        <div className="flex-1 p-4 bg-gray-100">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
