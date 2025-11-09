import React, { useContext, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from "../../context/UserContext";
import CharAvatar from "../Cards/CharAvatar";
import useT from "../../hooks/useT";
import { LuRefreshCcw, LuPiggyBank } from "react-icons/lu";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

const baseItem =
  "side-link group w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-xl mb-3 transition";

export default function SideMenu() {
  const { user, clearUser, prefs } = useContext(UserContext);
  const { t } = useT();
  const navigate = useNavigate();

  const isDarkTheme = prefs?.theme === "dark";

  // ✅ Scrollable + theme-friendly sidebar container
  const containerClass = isDarkTheme
    ? "w-64 max-h-screen overflow-y-auto bg-gray-900 border-r border-gray-700/50 p-5 pb-16 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
    : "w-64 max-h-screen overflow-y-auto bg-white border-r border-gray-200/50 p-5 pb-16 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100";

  const activeItem = "text-white bg-green-600 shadow-md";
  const idleItem = isDarkTheme
    ? "text-slate-300 hover:bg-slate-800 hover:text-violet-300"
    : "text-slate-700 hover:bg-violet-50 hover:text-violet-700";

  const userNameClass = isDarkTheme
    ? "text-gray-100 font-medium leading-6"
    : "text-gray-950 font-medium leading-6";

  const avatarBgClass = isDarkTheme ? "bg-gray-700" : "bg-slate-400";

  const pathToI18nKey = (path) => {
    switch (path) {
      case "/dashboard": return "menu.dashboard";
      case "/statistics": return "menu.statistics";
      case "/income": return "menu.income";
      case "/expense": return "menu.expense";
      case "/settings": return "menu.settings";
      case "/recurring": return "menu.recurring";
      case "/profile": return "menu.profile";
      case "/savings": return "menu.savings";
      case "logout": return "menu.logout";
      default: return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearUser?.();
    navigate("/login");
  };

  const menuItems = useMemo(() => {
    const base = Array.isArray(SIDE_MENU_DATA) ? [...SIDE_MENU_DATA] : [];

    const hasRecurring = base.some((i) => i?.path === "/recurring");
    if (!hasRecurring) {
      base.splice(1, 0, {
        path: "/recurring",
        label: "Recurring",
        i18nKey: "menu.recurring",
        icon: LuRefreshCcw,
      });
    }

    const hasSavings = base.some((i) => i?.path === "/savings");
    if (!hasSavings) {
      base.splice(2, 0, {
        path: "/savings",
        label: "Savings",
        i18nKey: "menu.savings",
        icon: LuPiggyBank,
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

  const photoUrl = user?.profilePhoto
    ? `${BACKEND_URL}/api/v1/users/photo/${user._id}`
    : null;

  return (
    <div className={containerClass}>
        {/* App Title */}
      <div className="flex items-center justify-center mt-2 mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Smart <span className="text-green-500">Spend</span>
        </h1>
      </div>
      {/* Profile section */}
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
        <h5 className={userNameClass}>{user?.username || user?.fullName || ""}</h5>
      </div>

      {/* Menu items */}
      {menuItems.map((item, idx) => {
        const labelText = getLabel(item);
        const Icon = item.icon;

        if (item.path === "/logout") {
          return (
            <button
              key={`menu_${idx}`}
              onClick={handleLogout}
              className={`${baseItem} ${idleItem} text-left`}
            >
              {Icon ? (
                <Icon className="text-xl transition-transform group-hover:translate-x-0.5" />
              ) : null}
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
            {Icon ? (
              <Icon className="text-xl transition-transform group-hover:translate-x-0.5" />
            ) : null}
            {labelText}
          </NavLink>
        );
      })}
    </div>
  );
}
