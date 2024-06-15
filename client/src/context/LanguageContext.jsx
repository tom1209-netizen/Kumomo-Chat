import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from './AuthContext';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(null);
  const { auth } = useAuth();

  useEffect(() => {
    const fetchLanguage = async () => {
      if (!auth.user || !auth.user.id) {
        console.log('No current user found');
        return;
      }

      try {
        const response = await fetch(`http://localhost:3003/api/users/${auth.user.id}/language`);
        if (response.ok) {
          const data = await response.json();
          setLanguage(data.language);
        } else {
          console.log('No language to select!');
        }
      } catch (error) {
        console.error('Error fetching language:', error);
      }
    };

    fetchLanguage();
  }, [auth]);

  return <LanguageContext.Provider value={language}>{children}</LanguageContext.Provider>;
}

LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
