// LanguageContext.js
import { createContext, useContext, useState, useEffect} from 'react';
import { db } from '../config/firebase-config';
import { onSnapshot, doc } from "firebase/firestore";
import { AuthContext } from './AuthContext.jsx';
import PropTypes from 'prop-types';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(null);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUser || !currentUser.uid) {
      console.log("No current user found");
      return;
    }

    const unSub = onSnapshot(doc(db, "users", currentUser.uid), (documentSnapshot) => {
      if (documentSnapshot.exists()) {
        setLanguage(documentSnapshot.data().language);
        console.log(documentSnapshot.data().language);
      } else {
        console.log("No language to select!");
      }
    });
    return () => {
      unSub(); 
    };
  }, [currentUser]);

  return (
    <LanguageContext.Provider value={language}>
      {children}
    </LanguageContext.Provider>
  );
};

LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
