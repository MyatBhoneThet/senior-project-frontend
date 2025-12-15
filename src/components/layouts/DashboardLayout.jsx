import React, { useContext, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import SideMenu from "./SideMenu";
import ChatWidget from "../Chat/ChatWidget";
import { LuMenu } from "react-icons/lu";

export default function DashboardLayout({ children, activeMenu }) {
  const { user, prefs } = useContext(UserContext) || {};
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const appTheme = prefs?.theme || "light";

  const bgColor =
    appTheme === "dark"
      ? "bg-[#0e1218] text-gray-100"
      : "bg-[#f9fafb] text-gray-900";

  const sideBg =
    appTheme === "dark"
      ? "bg-[#10141a] border-gray-700"
      : "bg-white border-gray-200";

  // Get current path
  const location = useLocation();
  const path = location.pathname.split("/").filter(Boolean).pop() || "dashboard";

  // Map path to friendly display names
  const pageNameMap = {
    dashboard: "Dashboard",
    statistics: "Statistics",
    recurring: "Recurring",
    settings: "Settings",
    savings: "Savings",
    expense: "Expense",
    income: "Income",
    profile: "Profile",
    // add more routes here as needed
  };

  const pageTitle = pageNameMap[path.toLowerCase()] || "Dashboard";

  return (
    <div className={`min-h-screen flex flex-col ${bgColor}`}>
      {/* Top bar (mobile only) */}
      <div
        className={`md:hidden flex items-center justify-between px-4 py-3 border-b ${
          appTheme === "dark" ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <button
          onClick={() => setIsMenuOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <LuMenu size={22} />
        </button>
        <h1 className="text-lg font-semibold">{pageTitle}</h1>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar (desktop) */}
        <aside
          className={`hidden md:block w-[250px] shrink-0 overflow-y-auto
            scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent
            border-r ${sideBg}`}
          style={{ height: "100vh" }}
        >
          <SideMenu activeMenu={activeMenu} />
        </aside>

        {/* Mobile sidebar (drawer) */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className={`w-[250px] h-full ${sideBg} overflow-y-auto scrollbar-thin p-0`}
            >
              <SideMenu activeMenu={activeMenu} />
            </div>
            <div
              className="flex-1 bg-black/40"
              onClick={() => setIsMenuOpen(false)}
            />
          </div>
        )}

        {/* Main content */}
        <main
          className="flex-1 p-5 overflow-y-auto"
          style={{ height: "100vh" }}
        >
          {children ?? <Outlet />}
        </main>
      </div>

      {/* Floating Chat Widget */}
      {user && <ChatWidget side="left" />}
    </div>
  );
}
