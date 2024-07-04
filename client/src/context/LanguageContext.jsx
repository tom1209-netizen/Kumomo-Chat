import {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { useAuth } from './AuthContext';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }) {
  const token = localStorage.getItem('token');
  const [language, setLanguage] = useState('vietnamese');
  const { auth } = useAuth();

  useEffect(() => {
    const fetchLanguage = async () => {
      if (!auth.user || !auth.user.id) {
        // Only fetch when user is logged in
        return;
      }

      try {
        const response = await fetch(`http://localhost:3003/api/users/language/${auth.user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setLanguage(data.language);
        } else {
          throw new Error('No language to select!');
        }
      } catch (error) {
        // console.error('Error fetching language:', error);
        setLanguage('vietnamese');
      }
    };

    fetchLanguage();
  }, [auth.user?.id]);

  return <LanguageContext.Provider value={language}>{children}</LanguageContext.Provider>;
}

LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
