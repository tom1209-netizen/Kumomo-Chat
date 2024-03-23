import React from 'react'
import ReactDOM from 'react-dom/client'
import './scss/index.scss'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import { AuthContextProvider, RequireAuth } from './context/AuthContext.jsx';
import { ChatContextProvider } from './context/ChatContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';

const router = createBrowserRouter([
  {
    index: true,
    path: "/",
    element: (
      <RequireAuth>
        <Home />
      </RequireAuth>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <ChatContextProvider>
      <LanguageProvider>
        <React.StrictMode>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        <RouterProvider router={router} />
        </React.StrictMode>
      </LanguageProvider>
    </ChatContextProvider>
  </AuthContextProvider>
)
