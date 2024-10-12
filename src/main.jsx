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
import Login from './components/login/login.jsx'
import Editor from './components/editor/index.jsx'
import Settings from './components/settings/index..jsx'

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
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'editor',
        element: <Editor />
      },
      {
        path: 'settings',
        element: <Settings />
      },
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
