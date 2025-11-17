import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FiHome, FiDollarSign, FiUsers, FiSettings, FiMenu, FiX, FiHeadphones } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

function Dashboard() {


  const token = localStorage.getItem("token");

  const navigate=useNavigate();


  const location = useLocation();
  const prevPath = useRef(location.pathname);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    prevPath.current = location.pathname;
  }, [location.pathname]);

  const links = [
    { id: 1, title: "Revenue", route: "revenu", icon: <FiDollarSign /> },
    { id: 2, title: "Sales", route: "/sales", icon: <FiHome /> },
    { id: 3, title: "User Overview", route: "/user-overview", icon: <FiUsers /> },
    { id: 4, title: "Settings", route: "/setting", icon: <FiSettings /> },
  ];


  useEffect(()=>{

    if(!token)
    {
      navigate('/auth/login')
    }

  },[token])



  const handleLogout = ()=>{
     localStorage.clear("token");
     navigate('/auth/login')

     toast("User logout successfully");

     console.log("hanlde log out click");

  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Toaster/>
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white shadow-lg p-6 z-50
          transform transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:relative md:w-64
       h-screen `}
      >
        <div className="flex justify-between items-center mb-8 md:hidden">
          <h2 className="text-2xl font-bold text-blue-600">Dashboard</h2>
          <button  onClick={() => setIsSidebarOpen(false)}>
            <FiX size={24} />
          </button>
        </div>

        <h2 className="hidden md:block text-2xl font-bold mb-8 text-blue-600">Admin Dashboard</h2>

        <nav className="flex flex-col gap-4">
          {links.map((link) => (
            <NavLink
              key={link.id}
              to={link.route}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
                }`
              }
              onClick={() => setIsSidebarOpen(false)} 
            >
              {link.icon}
              <span>{link.title}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

  
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setIsSidebarOpen(true)}>
          <FiMenu size={28} className="text-blue-500 -mt-4" />
        </button>
      </div>

    
      <main className="flex-1 p-6   ">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 ">Dashboard</h1>
          <div className="flex flex-row-reverse gap-x-5">

          {
            token &&   <button onClick={handleLogout} className="bg-blue-600
             hover:bg-blue-700 h-10 rounded-xl text-xl text-white  shadow-sm transition-all w-full">
              Logout
            </button>
          }

            <Link to={'/profile'}>
            <img src="https://img.icons8.com/material-rounded/24/person-male.png" className="h-10 w-18 border rounded-full"/></Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow min-h-[500px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
