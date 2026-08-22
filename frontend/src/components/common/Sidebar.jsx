import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Utensils,
  ShoppingBag,
  Clock,
  History,
  Wallet,
  User,
  Settings,
  Users,
  ChefHat,
  BarChart3,
  CheckSquare,
  Flame,
  Bell,
  LogOut,
  SlidersHorizontal,
  Building2,
  Receipt
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { totalItemsCount } = useCart();

  const getNavLinks = () => {
    switch (user?.role) {
      case 'STUDENT':
        return [
          { label: 'Dashboard', path: '/student', icon: LayoutDashboard },
          { label: 'Orders', path: '/student/history', icon: ShoppingBag },
          { label: 'Menu', path: '/student/menu', icon: Utensils },
          { label: 'Credits', path: '/student/credits', icon: Wallet },
          { label: 'Profile', path: '/student/profile', icon: User },
        ];
      case 'CHEF':
        return [
          { label: 'Dashboard', path: '/chef', icon: LayoutDashboard },
          { label: 'Incoming', path: '/chef/incoming', icon: Clock },
          { label: 'Preparing', path: '/chef/preparing', icon: Utensils },
          { label: 'Ready', path: '/chef/ready', icon: CheckSquare },
          { label: 'Stock', path: '/chef/availability', icon: ShoppingBag },
        ];
      case 'ADMIN':
        return [
          { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
          { label: 'Students', path: '/admin/students', icon: Users },
          { label: 'Chefs', path: '/admin/chefs', icon: ChefHat },
          { label: 'Menu', path: '/admin/menu', icon: Utensils },
          { label: 'Credits', path: '/admin/credits', icon: Wallet },
          { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md lg:hidden"
        />
      )}

      {/* Sidebar Shell Container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-56 bg-[#1a1a1a] border-r border-[#262626] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Flame Logo Header */}
          <div className="h-20 flex items-center justify-center px-4 border-b border-[#262626]/50">
            <div className="flex items-center gap-2">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#E62E00] via-[#FF3B30] to-[#FF9500] text-white flex items-center justify-center shadow-lg shadow-[#FF3B30]/30 transform rotate-[-6deg]">
                <Flame className="w-7 h-7 text-white fill-white" />
              </div>
            </div>
          </div>

          {/* Nav Links with Reference Curved Active Tab Styling */}
          <nav className="pt-6 space-y-1.5 pl-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/student' || link.path === '/chef' || link.path === '/admin'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3.5 px-4 py-3 text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-[#272727] text-[#FF3B30] rounded-l-2xl shadow-md border-l-2 border-[#FF3B30]'
                        : 'text-[#8E8E93] hover:text-white hover:bg-[#222222]/50 rounded-l-xl'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Red Dot for Active Link (matching reference image) */}
                      {isActive ? (
                        <span className="w-2 h-2 rounded-full bg-[#FF3B30] shadow-sm shadow-[#FF3B30] shrink-0" />
                      ) : (
                        <Icon className="w-4 h-4 text-[#8E8E93] group-hover:text-white shrink-0 transition-colors" />
                      )}
                      <span className="truncate tracking-wide">{link.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}

            {/* Logout Link */}
            <button
              onClick={logout}
              className="w-full flex items-center gap-3.5 px-4 py-3 text-xs font-bold text-[#8E8E93] hover:text-[#FF3B30] transition-colors rounded-l-xl"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Logout</span>
            </button>
          </nav>
        </div>

        {/* Bottom Circular Settings & Notification Buttons (from reference image bottom-left) */}
        <div className="p-4 border-t border-[#262626]/50 flex items-center justify-around">
          <NavLink
            to={user?.role === 'STUDENT' ? '/student/settings' : '/admin/settings'}
            className="w-10 h-10 rounded-full bg-[#272727] hover:bg-[#FF3B30] text-[#8E8E93] hover:text-white flex items-center justify-center transition-all duration-200 shadow-md border border-[#333333]"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </NavLink>

          <button
            type="button"
            className="w-10 h-10 rounded-full bg-[#272727] hover:bg-[#FF3B30] text-[#8E8E93] hover:text-white flex items-center justify-center transition-all duration-200 shadow-md border border-[#333333]"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};


