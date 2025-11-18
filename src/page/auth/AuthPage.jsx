import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

function AuthPage() {
 
  return (
    <div style={{  }}>
     

      <main style={{   }}>
        <Outlet />
      </main>
    </div>
  )
}

export default AuthPage
