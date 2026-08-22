import React, { useState } from 'react';
import { Sun, Moon, Bell, LogOut, Menu, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationCenter } from '../student/NotificationCenter';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#080808] border-b border-[#1F1F1F] px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left: Mobile Menu Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-[#A3A3A3] hover:text-white hover:bg-[#151515] transition"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2.5 font-extrabold text-lg tracking-tight">
          <div className="w-9 h-9 rounded-lg bg-[#E50914] text-white flex items-center justify-center shadow-md shadow-[#E50914]/20">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <span className="font-sans text-white">
            Smart <span className="text-[#E50914]">Mess</span>
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Dark / Light Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-[#A3A3A3] hover:text-white hover:bg-[#151515] transition"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-[#A3A3A3]" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-[#A3A3A3] hover:text-white hover:bg-[#151515] transition relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#E50914] rounded-full ring-2 ring-[#080808] animate-pulse" />
            )}
          </button>
          <NotificationCenter isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        </div>

        {/* User Profile Avatar */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-[#151515] transition"
          >
            <div className="w-8 h-8 rounded-full bg-[#450A0A] border border-[#7F1D1D] text-[#FF2D2D] flex items-center justify-center font-bold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-white line-clamp-1">{user?.name}</div>
              <div className="text-[10px] text-[#E50914] uppercase tracking-wider font-semibold">{user?.role}</div>
            </div>
          </button>

          {/* Profile Menu Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-48 bg-[#111111] border border-[#242424] rounded-xl shadow-2xl p-2 z-50">
              <div className="px-3 py-2 border-b border-[#1C1C1C]">
                <p className="text-xs font-bold text-white">{user?.name}</p>
                <p className="text-[11px] text-[#A3A3A3] truncate">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 mt-1 text-xs font-semibold text-[#FF2D2D] hover:bg-[#450A0A]/40 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
