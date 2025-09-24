import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

import Navbar from './Navbar';
import SideMenu from './SideMenu';
import ChatWidget from '../Chat/ChatWidget';

export default function DashboardLayout({ children, activeMenu }) {
  const { user, prefs } = useContext(UserContext) || {};

  // fallback to light if undefined
  const appTheme = prefs?.theme || 'light';

  return (
    <div
      className={`min-h-screen flex flex-col ${
        appTheme === 'dark'
          ? 'bg-gray-900 text-gray-100'
          : 'bg-[#fcfbfc] text-gray-900'
      }`}
    >
      {/* Top bar */}
      <Navbar activeMenu={activeMenu} />

      {/* Body */}
      <div className="flex flex-1">
        {/* Side menu */}
        <aside
          className={`max-[1080px]:hidden w-[260px] shrink-0 border-r ${
            appTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <SideMenu activeMenu={activeMenu} />
        </aside>

        {/* Main content */}
        <main className="grow mx-5 my-4">
          {children ?? <Outlet />}
        </main>
      </div>

      {/* Floating chat bubble (left only) */}
      {user && <ChatWidget side="left" />}
    </div>
  );
}
