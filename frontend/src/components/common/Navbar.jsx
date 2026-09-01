import React, { useState } from 'react';
import { Sun, Moon, Bell, LogOut, Menu, Flame, Leaf } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationCenter } from '../student/NotificationCenter';
import { Link } from 'react-router-dom';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#1A1A1A] border-b border-[#2B2B2B] px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left: Mobile Menu Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-full text-[#8E8E93] hover:text-white hover:bg-[#2A2A2A] transition"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="lg:hidden flex items-center gap-2.5 font-black text-lg tracking-tight">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF3B30] to-[#FF6B60] text-white flex items-center justify-center shadow-md shadow-[#FF3B30]/30">
            <Flame className="w-5 h-5 fill-white" />
          </div>
          <span className="font-sans text-white">
            Smart <span className="text-[#FF3B30]">Mess</span>
          </span>
        </div>
        <div className="hidden lg:block text-xs font-black text-[#8E8E93] tracking-wider uppercase">
          Welcome back, <span className="text-white">{user?.name || 'Student'}</span> 👋
        </div>
      </div>


      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Public Sustainability Link Button */}
        <Link
          to="/sustainability"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#10B981]/15 hover:bg-[#10B981]/25 text-[#10B981] border border-[#10B981]/30 rounded-full text-xs font-bold transition"
        >
          <Leaf className="w-3.5 h-3.5" />
          <span>Sustainability Impact</span>
        </Link>
        {/* Dark / Light Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-[#8E8E93] hover:text-white hover:bg-[#2A2A2A] transition"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#8E8E93]" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full text-[#8E8E93] hover:text-white hover:bg-[#2A2A2A] transition relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FF3B30] rounded-full ring-2 ring-[#1A1A1A] animate-pulse" />
            )}
          </button>
          <NotificationCenter isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        </div>

        {/* User Profile Avatar */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#272727] border border-[#333333] hover:border-[#FF3B30] transition"
          >
            <div className="w-7 h-7 rounded-full bg-[#FF3B30] text-white flex items-center justify-center font-black text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-white line-clamp-1">{user?.name}</div>
              <div className="text-[9px] text-[#FF3B30] uppercase tracking-wider font-black">{user?.role}</div>
            </div>
          </button>

          {/* Profile Menu Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-48 bg-[#222222] border border-[#2D2D2D] rounded-2xl shadow-2xl p-2 z-50">
              <div className="px-3 py-2 border-b border-[#2D2D2D]">
                <p className="text-xs font-bold text-white">{user?.name}</p>
                <p className="text-[11px] text-[#8E8E93] truncate">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 mt-1 text-xs font-bold text-[#FF3B30] hover:bg-[#3D0A0A] rounded-xl transition"
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

