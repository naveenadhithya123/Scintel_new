import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { clearAdminSession } from "../auth/adminAuth";

/* =========================================
   SIDEBAR ICONS
========================================= */
const Megaphone = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 11 18-5v12L3 13v-2Z"/>
    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>
  </svg>
);

const Calendar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
    <line x1="16" x2="16" y1="2" y2="6"/>
    <line x1="8" x2="8" y1="2" y2="6"/>
    <line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);

const Users = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const Trophy = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>
);

const Lightbulb = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2.2 1.5 3.1.7.8 1.3 1.5 1.5 2.4"/>
    <path d="M9 18h6"/>
    <path d="M10 22h4"/>
  </svg>
);

const Message = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

/* =========================================
   SIDEBAR LAYOUT WRAPPER
========================================= */
export default function AdminSidebar({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { name: "Announcement", path: "/admin",            icon: <Megaphone /> },
    { name: "Activities",   path: "/admin/activities", icon: <Calendar /> },
    { name: "Members",      path: "/admin/members",    icon: <Users /> },
    { name: "Glories",      path: "/admin/glories",    icon: <Trophy /> },
    { name: "Problems",     path: "/admin/problems",   icon: <Lightbulb /> },
    { name: "Suggestion",   path: "/admin/suggestion", icon: <Message /> },
  ];

  const handleNavigation = (path) => {
    setIsMenuOpen(false);
    // If already on this page, dispatch a reset-view event so the page
    // can reset its internal state (e.g. go back to list from add/edit).
    if (location.pathname === path) {
      window.dispatchEvent(new CustomEvent('reset-view', { detail: path }));
    }
    navigate(path);
  };

  const handleLogout = () => {
    clearAdminSession();
    setIsMenuOpen(false);
    navigate("/admin", { replace: true });
  };

  const isActive = (item) => {
    const path = location.pathname;

    // Special cases for Members
    if (item.name === "Members") {
      return (
        path.startsWith("/admin/members") ||
        path.includes("batch") ||
        path.includes("member")
      );
    }

    // /admin (Announcement) must be an EXACT match only
    // so it doesn't light up on /admin/activities, /admin/members etc.
    if (item.path === "/admin") {
      return path === "/admin";
    }

    // All other items: match if pathname starts with item path
    return path.startsWith(item.path);
  };

  return (
    <div className="flex h-screen bg-[#f4f7f9] font-sans overflow-hidden relative">

      {/* Mobile overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#023347] text-white flex flex-col shadow-xl transition-transform duration-300 transform lg:relative lg:translate-x-0 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold">Admin Portal</h1>
          <button className="transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg active:scale-95 lg:hidden" onClick={() => setIsMenuOpen(false)}>
            <CloseIcon />
          </button>
        </div>

        <nav className="flex flex-col gap-2 px-4 mt-2">
          {items.map((item) => {
            const active = isActive(item);
            return (
              <div
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center gap-4 px-5 py-3 rounded-xl cursor-pointer transition-all duration-300 ${
                  active
                    ? "bg-[#2A8E9E] text-white font-medium shadow-sm"
                    : "text-gray-300 hover:bg-[#012535] hover:text-white"
                }`}
              >
                <span className={active ? "opacity-100" : "opacity-80"}>{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </div>
            );
          })}
        </nav>

        <div className="mt-auto p-4">
          <button className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 hover:border-red-600/50 hover:shadow-lg active:scale-95 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md"
            type="button"
            onClick={handleLogout}
           
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button className="transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg active:scale-95" onClick={() => setIsMenuOpen(true)} className="text-[#023347]">
            <MenuIcon />
          </button>
          <h1 className="text-lg font-bold text-[#023347]">Admin Portal</h1>
          <div className="w-6" />
        </header>

        <main className="flex-1 flex flex-col overflow-hidden bg-[#f4f7f9]">
          {children}
        </main>
      </div>
    </div>
  );
}
