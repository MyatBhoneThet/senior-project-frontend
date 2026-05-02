import React, { useContext, useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import SideMenu from "./SideMenu";
import ChatWidget from "../Chat/ChatWidget";
import { LuMenu } from "react-icons/lu";

export default function DashboardLayout({ children, activeMenu }) {
  const { user, prefs } = useContext(UserContext) || {};
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const desktopSidebarRef = useRef(null);
  const mobileSidebarRef = useRef(null);
  const mainRef = useRef(null);

  const appTheme = prefs?.theme || "light";
  const bgColor = appTheme === "dark" ? "text-gray-100" : "text-gray-900";

  const sideBg =
    appTheme === "dark"
      ? "bg-[#080b10] border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
      : "bg-[linear-gradient(180deg,rgba(254,251,248,0.86)_0%,rgba(246,250,238,0.72)_100%)] border-white/30 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-3xl backdrop-saturate-150";

  const location = useLocation();
  const path = location.pathname.split("/").filter(Boolean).pop() || "dashboard";

  const pageNameMap = {
    dashboard: "Dashboard",
    recurring: "Recurring",
    settings: "Settings",
    savings: "Savings",
    debts: "Loans",
    expense: "Expense",
    income: "Income",
    profile: "Profile",
  };

  const pageTitle = pageNameMap[path.toLowerCase()] || "Dashboard";
  const sidebarScrollKey = "dashboard-sidebar-scroll";
  const mainScrollKey = `dashboard-main-scroll:${location.pathname}`;

  useEffect(() => {
    const restoreScroll = (ref, key) => {
      const saved = sessionStorage.getItem(key);
      if (!ref.current || saved == null) return;
      ref.current.scrollTop = Number(saved) || 0;
    };

    requestAnimationFrame(() => {
      restoreScroll(desktopSidebarRef, sidebarScrollKey);
      restoreScroll(mobileSidebarRef, sidebarScrollKey);
      restoreScroll(mainRef, mainScrollKey);
    });
  }, [location.pathname, isMenuOpen]);

  const saveSidebarScroll = (event) => {
    sessionStorage.setItem(sidebarScrollKey, String(event.currentTarget.scrollTop));
  };

  const saveMainScroll = (event) => {
    sessionStorage.setItem(mainScrollKey, String(event.currentTarget.scrollTop));
  };

  return (
    <div className={`min-h-screen flex flex-col ${bgColor}`}>
      <div
        className={`md:hidden flex items-center justify-between px-4 py-3 border-b backdrop-blur-md ${
          appTheme === "dark"
            ? "border-white/10 bg-white/[0.04]"
            : "border-white/25 bg-white/45"
        }`}
      >
        <button
          onClick={() => setIsMenuOpen(true)}
          className="p-2 rounded-xl hover:bg-gray-200/50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <LuMenu size={22} />
        </button>
        <h1 className="text-lg font-bold tracking-tight">{pageTitle}</h1>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <aside
          ref={desktopSidebarRef}
          onScroll={saveSidebarScroll}
          className={`hidden md:block w-[290px] shrink-0 overflow-y-auto z-10 border-r transition-all duration-300 ${sideBg}`}
          style={{ height: "100vh" }}
        >
          <SideMenu activeMenu={activeMenu} onClose={null} />
        </aside>

        {isMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              ref={mobileSidebarRef}
              onScroll={saveSidebarScroll}
              className={`w-[290px] h-full ${sideBg} overflow-y-auto border-r animate-fade-in-up`}
              style={{ animationDuration: "0.24s" }}
            >
              <SideMenu activeMenu={activeMenu} onClose={() => setIsMenuOpen(false)} />
            </div>
            <div className="flex-1 bg-slate-900/55 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          </div>
        )}

        <main
          ref={mainRef}
          onScroll={saveMainScroll}
          className="flex-1 p-4 md:p-8 overflow-y-auto relative z-0"
          style={{ height: "100vh" }}
        >
          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[460px] blur-[140px] rounded-full pointer-events-none -z-10 ${
              appTheme === "dark" ? "bg-[#d9ff34]/10" : "bg-[#a3e635]/30"
            }`}
          />
          <div
            className={`absolute bottom-0 right-0 w-[560px] h-[360px] blur-[140px] rounded-full pointer-events-none -z-10 ${
              appTheme === "dark" ? "bg-[#47d7ff]/8" : "bg-[#fb7185]/10"
            }`}
          />
          {children ?? <Outlet />}
        </main>
      </div>

      {user && <ChatWidget side="right" />}
    </div>
  );
}
