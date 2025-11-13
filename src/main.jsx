import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router'
import { route } from './routes/routes.jsx'

createRoot(document.getElementById('root')).render(
  
  <RouterProvider router={route}/>
)
