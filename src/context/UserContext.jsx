// import React, { createContext, useEffect, useState } from 'react';
// import axiosInstance from '../utils/axiosInstance';
// import { API_PATHS } from '../utils/apiPaths';

// export const UserContext = createContext();

// const DEFAULT_PREFS = {
//   currency: 'THB',
//   language: 'en',
//   weekStartsOn: 'Mon',
//   theme: (localStorage.getItem('theme') || 'light'),
// };

// export default function UserProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [prefs, setPrefs] = useState(DEFAULT_PREFS);

//   // Load user and saved prefs on boot
//   useEffect(() => {
//     try {
//       const saved = localStorage.getItem('appSettings');
//       if (saved) setPrefs((p) => ({ ...p, ...JSON.parse(saved) }));
//     } catch {}

//     const token = localStorage.getItem('token');
//     if (!token) return;

//     axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO)
//       .then(({ data }) => {
//         setUser(data);
//         // Merge prefs that might come from backend
//         setPrefs((p) => ({
//           ...p,
//           currency: data?.currency ?? p.currency,
//           theme: data?.theme ?? p.theme,
//           weekStartsOn: data?.weekStartsOn ?? p.weekStartsOn,
//           language: data?.language ?? p.language,
//         }));
//       })
//       .catch(() => {});
//   }, []);

//   // Globally toggle Tailwind dark mode
//   useEffect(() => {
//     const root = document.documentElement;
//     root.classList.toggle('dark', prefs.theme === 'dark');
//     // save stand-alone theme for fast first paint
//     localStorage.setItem('theme', prefs.theme);
//   }, [prefs.theme]);

//   const updateUser = (u) => setUser(u);
//   const clearUser = () => setUser(null);

//   const updatePrefs = (next) => {
//     setPrefs(next);
//     localStorage.setItem('appSettings', JSON.stringify(next));
//   };

//   return (
//     <UserContext.Provider value={{ user, updateUser, clearUser, prefs, updatePrefs }}>
//       {children}
//     </UserContext.Provider>
//   );
// }

import React, { createContext, useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

export const UserContext = createContext();

const DEFAULT_PREFS = {
  currency: 'THB',
  language: 'en',
  weekStartsOn: 'Mon',
  theme: localStorage.getItem('theme') || 'light',
};

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);

  // Load user and saved prefs on boot
  useEffect(() => {
    try {
      const saved = localStorage.getItem('appSettings');
      if (saved) setPrefs((p) => ({ ...p, ...JSON.parse(saved) }));
    } catch {}

    const token = localStorage.getItem('token');
    if (!token) return;

    axiosInstance
      .get(API_PATHS.AUTH.GET_USER_INFO)
      .then(({ data }) => {
        setUser({
          ...data,
          profilePhoto: data.profilePhoto
            ? data.profilePhoto.startsWith('http')
              ? data.profilePhoto
              : `http://localhost:8000/${data.profilePhoto}`
            : null,
        });
        // Merge prefs that might come from backend
        setPrefs((p) => ({
          ...p,
          currency: data?.currency ?? p.currency,
          theme: data?.theme ?? p.theme,
          weekStartsOn: data?.weekStartsOn ?? p.weekStartsOn,
          language: data?.language ?? p.language,
        }));
      })
      .catch(() => {});
  }, []);

  // Globally toggle Tailwind dark mode
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', prefs.theme === 'dark');
    localStorage.setItem('theme', prefs.theme);
  }, [prefs.theme]);

  const updateUser = (u) => setUser(u);
  const clearUser = () => setUser(null);

  const updatePrefs = (next) => {
    setPrefs(next);
    localStorage.setItem('appSettings', JSON.stringify(next));
  };

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser, prefs, updatePrefs }}>
      {children}
    </UserContext.Provider>
  );
}
