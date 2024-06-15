import {
  createContext, useEffect, useState, useContext,
} from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [auth, setAuth] = useState({ isAuthenticated: false, user: null });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = JSON.parse(localStorage.getItem('user'));
      setAuth({ isAuthenticated: true, user });
    }
  }, []);

  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({ isAuthenticated: true, user });
  };

  const logout = (navigate) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ isAuthenticated: false, user: null });
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);

export function RequireAuth({ children }) {
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate('/login');
    }
  }, [auth, navigate]);

  return auth.isAuthenticated ? children : null;
}

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
};
