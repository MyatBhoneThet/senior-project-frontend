import React, { useContext, useMemo } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from "../../context/UserContext";
import CharAvatar from "../Cards/CharAvatar";
import useT from "../../hooks/useT";
import { LuLogOut, LuPiggyBank, LuRefreshCcw, LuBriefcaseBusiness, LuX } from "react-icons/lu";

export default function SideMenu({ onClose }) {
  const { user, clearUser, prefs } = useContext(UserContext);
  const { t } = useT();
  const navigate = useNavigate();
  const location = useLocation();

  const isDarkTheme = prefs?.theme === "dark";

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
      case "/savings":
        return "menu.savings";
      case "/debts":
        return "menu.debts";
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
    const base = Array.isArray(SIDE_MENU_DATA) ? [...SIDE_MENU_DATA] : [];

    if (!base.some((i) => i?.path === "/recurring")) {
      base.splice(1, 0, {
        path: "/recurring",
        label: "Recurring",
        i18nKey: "menu.recurring",
        icon: LuRefreshCcw,
      });
    }

    if (!base.some((i) => i?.path === "/savings")) {
      base.splice(2, 0, {
        path: "/savings",
        label: "Savings",
        i18nKey: "menu.savings",
        icon: LuPiggyBank,
      });
    }

    if (!base.some((i) => i?.path === "/debts")) {
      base.splice(5, 0, {
        path: "/debts",
        label: "Loans",
        i18nKey: "menu.debts",
        icon: LuBriefcaseBusiness,
      });
    }

    return base;
  }, []);

  const getLabel = (item) => {
    const key = item.i18nKey || pathToI18nKey(item.path);
    if (key) {
      const translated = t(key);
      if (!translated || translated === key || translated.includes(".")) {
        return item.label ?? "Menu";
      }
      return translated;
    }
    return item.label ?? "Menu";
  };

  const profilePhoto = user?.profilePhoto || null;
  const chatbotAccent = "#d9ff34";

  const shellClass = isDarkTheme
    ? "bg-[linear-gradient(165deg,#1a220f_0%,#121814_42%,#0b100d_100%)] border-white/10 text-[#d2d7de] shadow-[0_20px_80px_rgba(0,0,0,0.45)]"
    : "bg-[linear-gradient(180deg,rgba(255,255,255,0.44)_0%,rgba(255,255,255,0.22)_42%,rgba(246,250,238,0.30)_100%)] border-white/35 text-[#334155] shadow-[inset_-1px_0_0_rgba(255,255,255,0.55)] backdrop-blur-3xl";

  const itemIdle = isDarkTheme
    ? "text-white/75 hover:bg-white/[0.04] hover:text-white"
    : "text-[#334155] hover:bg-white/45 hover:text-[#0f172a]";

  const itemActive = isDarkTheme
    ? "bg-[#d9ff34]/10 text-[#d9ff34] ring-1 ring-[#d9ff34]/15"
    : "bg-[#d9ff34]/24 text-[#4d7c0f] ring-1 ring-white/45 shadow-[0_14px_36px_rgba(132,204,22,0.12)]";

  return (
    <div className={`relative overflow-hidden flex min-h-full flex-col border-r px-5 py-6 ${shellClass}`}>
      <div className={`pointer-events-none absolute -left-16 -top-24 h-64 w-64 rounded-full blur-[70px] ${isDarkTheme ? "bg-[#d9ff34]/12" : "bg-[#d9ff34]/20"}`} />
      <div className={`pointer-events-none absolute -right-20 top-1/3 h-72 w-72 rounded-full blur-[90px] ${isDarkTheme ? "bg-[#47d7ff]/6" : "bg-[#8b5cf6]/8"}`} />
      <div className={`pointer-events-none absolute bottom-0 left-6 h-52 w-52 rounded-full blur-[80px] ${isDarkTheme ? "bg-transparent" : "bg-[#fb7185]/7"}`} />
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-11 w-1.5 shrink-0 rounded-full shadow-[0_0_16px_rgba(217,255,52,0.65)]" style={{ backgroundColor: chatbotAccent }} />
          <h2 className={`truncate text-[35px] font-extrabold leading-none tracking-[-0.02em] drop-shadow-sm ${isDarkTheme ? "text-white" : "text-[#0f172a]"}`}>
            Smart<span style={{ color: chatbotAccent }}>Spend</span>
          </h2>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-colors ${
              isDarkTheme
                ? "border-white/20 text-white/90 hover:bg-white/10"
                : "border-white/45 bg-white/40 text-slate-700 hover:bg-white/65"
            }`}
            aria-label="Close menu"
          >
            <LuX className="text-[24px]" />
          </button>
        ) : null}
      </div>

      <div className="mb-8 flex flex-col items-center text-center">
        {profilePhoto ? (
          <img src={profilePhoto} alt="Profile" className="h-[88px] w-[88px] rounded-full object-cover" />
        ) : (
          <CharAvatar fullName={user?.fullName} width="w-[88px]" height="h-[88px]" style="text-[28px] font-bold" />
        )}
        <h5 className={`mt-3 text-[19px] font-semibold ${isDarkTheme ? "text-white" : "text-[#0f172a]"}`}>
          {user?.fullName || user?.username || "Smart Spend"}
        </h5>
        <p className={`mt-1 text-[13px] ${isDarkTheme ? "text-white/55" : "text-[#64748b]"}`}>
          {user?.email || "smartspend@local"}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        {menuItems.map((item, idx) => {
          const labelText = getLabel(item);
          const Icon = item.icon;

          if (item.path === "/logout") {
            return (
              <button
                key={`menu_${idx}`}
                onClick={handleLogout}
              className={`mt-auto flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left text-[16px] font-semibold transition-colors ${itemIdle}`}
              >
                <span className="text-[20px]">{Icon ? <Icon /> : null}</span>
                <span>{labelText}</span>
              </button>
            );
          }

          return (
            <NavLink
              key={`menu_${idx}`}
              to={item.path}
              end
              onClick={(e) => {
                if (location.pathname === item.path) e.preventDefault();
              }}
              className={({ isActive }) =>
                `flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-[16px] font-semibold transition-all ${
                  isActive ? itemActive : itemIdle
                }`
              }
            >
              <span className="text-[20px]">{Icon ? <Icon /> : null}</span>
              <span>{labelText}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
