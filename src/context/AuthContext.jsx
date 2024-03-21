import { createContext, useEffect, useState } from "react";
import { auth } from "../config/firebase-config.js";
import { onAuthStateChanged } from "firebase/auth";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const RequireAuth = ({ children }) => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  return children || null;
};

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
};