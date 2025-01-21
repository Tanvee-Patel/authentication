import axios from 'axios';
import { createContext, useState, useEffect } from 'react';

axios.defaults.baseURL = 'http://localhost:8000';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true); 
   const [error, setError] = useState(null); 

   useEffect(() => {
      const token = localStorage.getItem('authToken');

      if (token) {
        
         axios.get('/profile', { headers: { Authorization: `Bearer ${token}` } })
            .then(({ data }) => {
               setUser(data);
               setLoading(false);
            })
            .catch((err) => {
               console.error('Error fetching user profile:', err);
               setError('Failed to fetch user profile');
               setLoading(false); 
               localStorage.removeItem('authToken'); 
            });
      } else {
         setLoading(false); 
      }
   }, []);

   return (
      <UserContext.Provider value={{ user, setUser, loading, error }}>
         {children}
      </UserContext.Provider>
   );
}