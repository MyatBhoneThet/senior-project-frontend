// import React, { useContext, useMemo } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { SIDE_MENU_DATA } from '../../utils/data';
// import { UserContext } from '../../context/UserContext';
// import CharAvatar from '../Cards/CharAvatar';
// import useT from '../../hooks/useT';
// import { LuRefreshCcw } from 'react-icons/lu';

// const baseItem =
//   'w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3 transition';

// export default function SideMenu() {
//   const { user, clearUser, prefs } = useContext(UserContext);
//   const { t } = useT();
//   const navigate = useNavigate();

//   const isDarkTheme = prefs?.theme === 'dark';
//   const activeItem = 'text-white bg-primary';
//   const idleItem = isDarkTheme ? 'text-gray-300 hover:bg-gray-700' : 'text-slate-800 hover:bg-gray-100';
//   const containerClass = isDarkTheme
//     ? 'w-64 h-[calc(100vh-64px)] bg-gray-900 border-r border-gray-700/50 p-5 sticky top-[64px] z-20'
//     : 'w-64 h-[calc(100vh-64px)] bg-white border-r border-gray-200/50 p-5 sticky top-[64px] z-20';
//   const userNameClass = isDarkTheme ? 'text-gray-100 font-medium leading-6' : 'text-gray-950 font-medium leading-6';
//   const avatarBgClass = isDarkTheme ? 'bg-gray-700' : 'bg-slate-400';

//   const pathToI18nKey = (path) => {
//     switch (path) {
//       case '/dashboard': return 'menu.dashboard';
//       case '/income':    return 'menu.income';
//       case '/expense':   return 'menu.expense';
//       case '/settings':  return 'menu.settings';
//       case '/recurring': return 'menu.recurring';
//       case '/profile':  return 'menu.profile';
//       case 'logout':     return 'menu.logout';
//       default:           return null;
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     clearUser?.();
//     navigate('/login');
//   };

//   // Ensure a Recurring item even if not in SIDE_MENU_DATA
//   const menuItems = useMemo(() => {
//     const hasRecurring = SIDE_MENU_DATA?.some((i) => i?.path === '/recurring');
//     const base = Array.isArray(SIDE_MENU_DATA) ? [...SIDE_MENU_DATA] : [];
//     if (!hasRecurring) {
//       base.splice(1, 0, {
//         path: '/recurring',
//         label: 'Recurring',      // <-- plain label provided
//         i18nKey: 'menu.recurring',
//         icon: LuRefreshCcw,
//       });
//     }
//     return base;
//   }, []);

//   // Safe translation helper: if t returns the key (missing), fall back to label
//   const getLabel = (item) => {
//     const key = item.i18nKey || pathToI18nKey(item.path);
//     if (key) {
//       const translated = t(key);
//       // If translation missing (returns the key or contains a dot), use label
//       if (!translated || translated === key || translated.includes('.')) {
//         return item.label ?? 'Recurring';
//       }
//       return translated;
//     }
//     return item.label ?? 'Recurring';
//   };

//   return (
//     <div className={containerClass}>
//       <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
//         {user?.profileImageUrl ? (
//           <img
//             src={user.profileImageUrl}
//             alt="Profile"
//             className={`w-20 h-20 ${avatarBgClass} rounded-full object-cover`}
//           />
//         ) : (
//           <CharAvatar fullName={user?.fullName} width="w-20" height="h-20" style="text-xl" />
//         )}
//         <h5 className={userNameClass}>{user?.fullName || ''}</h5>
//       </div>

//       {menuItems.map((item, idx) => {
//         const labelText = getLabel(item);
//         const Icon = item.icon;

//         if (item.path === 'logout') {
//           return (
//             <button
//               key={`menu_${idx}`}
//               onClick={handleLogout}
//               className={`${baseItem} ${idleItem} text-left`}
//             >
//               {Icon ? <Icon className="text-xl" /> : null}
//               {labelText}
//             </button>
//           );
//         }

//         return (
//           <NavLink
//             key={`menu_${idx}`}
//             to={item.path}
//             end
//             className={({ isActive }) =>
//               `${baseItem} ${isActive ? activeItem : idleItem}`
//             }
//           >
//             {Icon ? <Icon className="text-xl" /> : null}
//             {labelText}
//           </NavLink>
//         );
//       })}
//     </div>
//   );
// }

import React, { useContext, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from "../../context/UserContext";
import CharAvatar from "../Cards/CharAvatar";
import useT from "../../hooks/useT";
import { LuRefreshCcw } from "react-icons/lu";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

const baseItem =
  "w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3 transition";

export default function SideMenu() {
  const { user, clearUser, prefs } = useContext(UserContext);
  const { t } = useT();
  const navigate = useNavigate();

  const isDarkTheme = prefs?.theme === "dark";
  const activeItem = "text-white bg-primary";
  const idleItem = isDarkTheme
    ? "text-gray-300 hover:bg-gray-700"
    : "text-slate-800 hover:bg-gray-100";
  const containerClass = isDarkTheme
    ? "w-64 h-[calc(100vh-64px)] bg-gray-900 border-r border-gray-700/50 p-5 sticky top-[64px] z-20"
    : "w-64 h-[calc(100vh-64px)] bg-white border-r border-gray-200/50 p-5 sticky top-[64px] z-20";
  const userNameClass = isDarkTheme
    ? "text-gray-100 font-medium leading-6"
    : "text-gray-950 font-medium leading-6";
  const avatarBgClass = isDarkTheme ? "bg-gray-700" : "bg-slate-400";

  const pathToI18nKey = (path) => {
    switch (path) {
      case "/dashboard":
        return "menu.dashboard";
      case "/income":
        return "menu.income";
      case "/expense":
        return "menu.expense";
      case "/settings":
        return "menu.settings";
      case "/recurring":
        return "menu.recurring";
      case "/profile":
        return "menu.profile";
      case "logout":
        return "menu.logout";
      default:
        return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearUser?.();
    navigate("/login");
  };

  const menuItems = useMemo(() => {
    const hasRecurring = SIDE_MENU_DATA?.some((i) => i?.path === "/recurring");
    const base = Array.isArray(SIDE_MENU_DATA) ? [...SIDE_MENU_DATA] : [];
    if (!hasRecurring) {
      base.splice(1, 0, {
        path: "/recurring",
        label: "Recurring",
        i18nKey: "menu.recurring",
        icon: LuRefreshCcw,
      });
    }
    return base;
  }, []);

  const getLabel = (item) => {
    const key = item.i18nKey || pathToI18nKey(item.path);
    if (key) {
      const translated = t(key);
      if (!translated || translated === key || translated.includes(".")) {
        return item.label ?? "Recurring";
      }
      return translated;
    }
    return item.label ?? "Recurring";
  };

  // ✅ Use backend URL if profilePhoto exists
  const photoUrl = user?.profilePhoto
  ? `${BACKEND_URL}/api/v1/users/photo/${user._id}`
  : null;

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Profile"
            className={`w-20 h-20 ${avatarBgClass} rounded-full object-cover`}
          />
        ) : (
          <CharAvatar
            fullName={user?.fullName}
            width="w-20"
            height="h-20"
            style="text-xl"
          />
        )}
        <h5 className={userNameClass}>{user?.fullName || ""}</h5>
      </div>

      {menuItems.map((item, idx) => {
        const labelText = getLabel(item);
        const Icon = item.icon;

        if (item.path === "logout") {
          return (
            <button
              key={`menu_${idx}`}
              onClick={handleLogout}
              className={`${baseItem} ${idleItem} text-left`}
            >
              {Icon ? <Icon className="text-xl" /> : null}
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
            {Icon ? <Icon className="text-xl" /> : null}
            {labelText}
          </NavLink>
        );
      })}
    </div>
  );
}
