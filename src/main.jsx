import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import './index.css'
import Root from './components/root.jsx'
import Register from './components/register/index.jsx'
import Home from './components/home/index.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children:[
      {
        path: '',
        element: <Home />
      },
      {
        path: 'register',
        element: <Register />
      }
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
