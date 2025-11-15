import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

function AuthPage() {
  const links = [
    { id: 1, title: "Sign In", route: "" },
    { id: 2, title: "Sign Up", route: "sign-up" },
    { id: 3, title: "Reset Password", route: "reset-password" },
    { id: 4, title: "Forgot Password", route: "forgot-password" },
    { id: 5, title: "Email Verification", route: "email-verification" },
  ]

  return (
    <div style={{  }}>
      {/* <h1>Auth Content</h1> */}

      {/* <nav style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
        {links.map(link => (
          <NavLink
            key={link.id}
            to={link.route}
            
          >
            {link.title}
          </NavLink>
        ))}
      </nav> */}

      <main style={{   }}>
        <Outlet />
      </main>
    </div>
  )
}

export default AuthPage
