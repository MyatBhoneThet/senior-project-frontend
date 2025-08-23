// // src/components/layouts/SideMenu.jsx
// import React, { useContext } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { SIDE_MENU_DATA } from '../../utils/data';
// import { UserContext } from '../../context/UserContext';
// import CharAvatar from '../Cards/CharAvatar';
// import useT from '../../hooks/useT';

// const baseItem =
//   'w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3 transition';
// const activeItem = 'text-white bg-primary';
// const idleItem = 'text-slate-800 hover:bg-gray-100';

// function pathToI18nKey(path) {
//   switch (path) {
//     case '/dashboard': return 'menu.dashboard';
//     case '/income':    return 'menu.income';
//     case '/expense':   return 'menu.expense';
//     case '/settings':  return 'menu.settings';
//     case 'logout':     return 'menu.logout';
//     default:           return null;
//   }
// }

// export default function SideMenu() {
//   const { user, clearUser } = useContext(UserContext);
//   const { t } = useT();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     clearUser();
//     navigate('/login');
//   };

//   return (
//     <div className="w-64 h-[calc(100vh-64px)] bg-white border-r border-gray-200/50 p-5 sticky top-[64px] z-20">
//       <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
//         {user?.profileImageUrl ? (
//           <img
//             src={user.profileImageUrl}
//             alt="Profile"
//             className="w-20 h-20 bg-slate-400 rounded-full object-cover"
//           />
//         ) : (
//           <CharAvatar fullName={user?.fullName} width="w-20" height="h-20" style="text-xl" />
//         )}
//         <h5 className="text-gray-950 font-medium leading-6">{user?.fullName || ''}</h5>
//       </div>

//       {SIDE_MENU_DATA.map((item, idx) => {
//         // Prefer an explicit key if your data provides it (item.i18nKey),
//         // otherwise derive from the path. Fallback to the original label.
//         const derivedKey = item.i18nKey || pathToI18nKey(item.path);
//         const labelText = derivedKey ? t(derivedKey) : item.label;

//         if (item.path === 'logout') {
//           return (
//             <button
//               key={`menu_${idx}`}
//               onClick={handleLogout}
//               className={`${baseItem} ${idleItem} text-left`}
//             >
//               <item.icon className="text-xl" />
//               {labelText}
//             </button>
//           );
//         }

//         return (
//           <NavLink
//             key={`menu_${idx}`}
//             to={item.path}
//             end
//             className={({ isActive }) => `${baseItem} ${isActive ? activeItem : idleItem}`}
//           >
//             <item.icon className="text-xl" />
//             {labelText}
//           </NavLink>
//         );
//       })}
//     </div>
//   );
// }

import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { SIDE_MENU_DATA } from '../../utils/data';
import { UserContext } from '../../context/UserContext';
import CharAvatar from '../Cards/CharAvatar';
import useT from '../../hooks/useT';

const baseItem = 'w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3 transition';

export default function SideMenu() {
  const { user, clearUser, prefs } = useContext(UserContext);
  const { t } = useT();
  const navigate = useNavigate();

  // Dark theme flag
  const isDarkTheme = prefs?.theme === 'dark';

  // Adjust class names based on theme
  const activeItem = isDarkTheme
    ? 'text-white bg-primary'           // You can customize the dark theme primary bg if needed
    : 'text-white bg-primary';

  const idleItem = isDarkTheme
    ? 'text-gray-300 hover:bg-gray-700'
    : 'text-slate-800 hover:bg-gray-100';

  const containerClass = isDarkTheme
    ? 'w-64 h-[calc(100vh-64px)] bg-gray-900 border-r border-gray-700/50 p-5 sticky top-[64px] z-20'
    : 'w-64 h-[calc(100vh-64px)] bg-white border-r border-gray-200/50 p-5 sticky top-[64px] z-20';

  const userNameClass = isDarkTheme ? 'text-gray-100 font-medium leading-6' : 'text-gray-950 font-medium leading-6';

  const avatarBgClass = isDarkTheme ? 'bg-gray-700' : 'bg-slate-400';

  const pathToI18nKey = (path) => {
    switch (path) {
      case '/dashboard': return 'menu.dashboard';
      case '/income': return 'menu.income';
      case '/expense': return 'menu.expense';
      case '/settings': return 'menu.settings';
      case 'logout': return 'menu.logout';
      default: return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    clearUser();
    navigate('/login');
  };

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
        {user?.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt="Profile"
            className={`w-20 h-20 ${avatarBgClass} rounded-full object-cover`}
          />
        ) : (
          <CharAvatar fullName={user?.fullName} width="w-20" height="h-20" style="text-xl" />
        )}
        <h5 className={userNameClass}>{user?.fullName || ''}</h5>
      </div>

      {SIDE_MENU_DATA.map((item, idx) => {
        const derivedKey = item.i18nKey || pathToI18nKey(item.path);
        const labelText = derivedKey ? t(derivedKey) : item.label;

        if (item.path === 'logout') {
          return (
            <button
              key={`menu_${idx}`}
              onClick={handleLogout}
              className={`${baseItem} ${idleItem} text-left`}
            >
              <item.icon className="text-xl" />
              {labelText}
            </button>
          );
        }

        return (
          <NavLink
            key={`menu_${idx}`}
            to={item.path}
            end
            className={({ isActive }) =>
              `${baseItem} ${isActive ? activeItem : idleItem}`
            }
          >
            <item.icon className="text-xl" />
            {labelText}
          </NavLink>
        );
      })}
    </div>
  );
}
