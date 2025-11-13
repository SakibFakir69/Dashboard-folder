import React from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";

function Dashboard() {

  const nav = useLocation();
  console.log(nav.pathname)


  const links = [
    { id: 1, title: "Revenue", route: "/revenu" },
    { id: 2, title: "Sales", route: "/sales" },
    { id: 3, title: "User Overview", route: "/user-overview" },
    {id:4, title:"Setting", route:"/setting"}
  ];

  return (
    <div>
      <nav style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
        {links.map((link) => (
          <NavLink key={link.id} to={link.route}>
            {link.title}
          </NavLink>
        ))}
      </nav>
 <h1>Show all page content here  here</h1>
      <main  style={{border:"2px solid red"}}>
       
        <Outlet />
      </main>

      <Link  to={'/auth'}>Go Auth page</Link>
    </div>
  );
}

export default Dashboard;
