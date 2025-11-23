import React, { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  FiHome,
  FiDollarSign,
  FiUsers,
  FiSettings,
  FiMenu,
  FiX,
  FiHeadphones,
  FiClipboard,
  FiInbox,
  FiShare,
  FiShare2,
  FiShoppingCart,
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import App from "../../App";
import { getValidAccessToken } from "../../utils/auth";

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
    { id: 1, title: "Dashboard", route: "dashboard", icon: <FiClipboard/> },
    { id: 2, title: "inventory", route: "/inventory", icon: <FiInbox/> },
    {
      id: 3,
      title: "category",
      route: "/category",
      icon: <FiShoppingCart/>,
    },
    { id: 4, title: "share", route: "/share", icon: <FiShare2/> },
  ];

  useEffect(() => {
    const checkTokens = async () => {
      let validToken = await getValidAccessToken();

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
    localStorage.clear("token");
    navigate("/auth/login");

    toast("User logout successfully");

    console.log("hanlde log out click");
  };

  if (loading) {
    return (
      <div
        className="w-full
    text-center mt-30"
      >
        <span className="loading size-36"></span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Toaster />

      <aside
        className={`
          fixed top-0 left-0 h-full bg-white shadow-lg md:p-4 z-50
          transform transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:relative md:w-64
       h-screen  w-64`}
      >
        <div className="flex justify-between items-center mb-8 md:hidden gap-x-3">
          <h2 className="text-2xl font-bold text-black">Dashboard</h2>
          <button onClick={() => setIsSidebarOpen(false)}>
            <FiX className=" size-10 text-red-500" />
          </button>
        </div>

      <div>
          <h2 className="hidden md:block text-2xl font-bold mb-8 text-black ">
          Inventory Manager
        </h2>
        <p className="text-gray-500 -mt-8 mr-2 text-sm text-center">Business Management System</p>
      </div>

        <nav className="flex flex-col gap-4 mt-18">
          {links.map((link) => (
            <NavLink
              key={link.id}
              to={link.route}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-black text-white transform transition delay-75 duration-150"
                    : "text-gray-700 hover:bg-gray-200"
                }`
              }
              onClick={() => setIsSidebarOpen(false)}
            >
              {link.icon}
              <span className="">{link.title}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1    ">
        <div className="flex justify-between items-center bg-white p-3 pt-8 pb-4 ">
          <h1 className="md:text-2xl font-bold text-gray-800 hidden md:block ">
            Dashboard
          </h1>
          <p></p>
          <div className="block md:hidden fixed top-4 left-4 ">
            <button onClick={() => setIsSidebarOpen(true)}>
              <FiMenu size={28} className="text-blue-500 mt-4" />
            </button>
          </div>

          <div className="flex flex-row-reverse gap-x-5">
            {token && (
              <button
                onClick={handleLogout}
                className="bg-blue-600
             hover:bg-blue-700 h-10 rounded text-xl text-white  shadow-sm transition-all w-full"
              >
                Logout
              </button>
            )}

            <Link to={"/profile"}>
              <img
                src="https://img.icons8.com/material-rounded/24/person-male.png"
                className="h-10 w-18 border rounded-full"
              />
            </Link>
          </div>
        </div>

        <div className=" p-6 rounded-xl  min-h-[500px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
