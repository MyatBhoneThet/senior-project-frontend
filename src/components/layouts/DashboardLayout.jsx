import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

import Navbar from './Navbar';
import SideMenu from './SideMenu';
import ChatWidget from '../Chat/ChatWidget';


export default function DashboardLayout({ children, activeMenu }) {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-[#fcfbfc] flex flex-col">
      {/* Top bar */}
      <Navbar activeMenu={activeMenu} />

      {/* Body */}
      <div className="flex flex-1">
        {/* Side menu (hidden below 1080px, like you had) */}
        <aside className="max-[1080px]:hidden w-[260px] shrink-0 bg-white border-r">
          <SideMenu activeMenu={activeMenu} />
        </aside>

        {/* Main content */}
        <main className="grow mx-5 my-4">
          {/* Works with either children or nested routes */}
          {children ?? <Outlet />}
        </main>
      </div>

      {/* Floating chat bubble in the footer/right — only when logged in */}
      {user && <ChatWidget side="left" />}
    </div>
  );
}
