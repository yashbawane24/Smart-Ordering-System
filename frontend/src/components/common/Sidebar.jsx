import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Utensils,
  ShoppingBag,
  Clock,
  User,
  Settings,
  Users,
  ChefHat,
  BarChart3,
  CheckSquare,
  Flame,
  Bell,
  LogOut,
  X,
  CalendarCheck,
  QrCode,
  MessageSquare,
  TrendingUp,
  Vote,
  Layers,
  PieChart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const getNavLinks = () => {
    switch (user?.role) {
      case 'STUDENT':
        return [
          { label: 'Dashboard', path: '/student', icon: LayoutDashboard },
          { label: 'Menu', path: '/student/menu', icon: Utensils },
          { label: 'My Meals', path: '/student/meals', icon: CalendarCheck },
          { label: 'Meal Slots', path: '/student/slots', icon: Clock },
          { label: 'Orders', path: '/student/history', icon: ShoppingBag },
          { label: 'Credits', path: '/student/credits', icon: User },
          { label: 'QR Collection', path: '/student/qr-collection', icon: QrCode },
          { label: 'Feedback', path: '/student/feedback', icon: MessageSquare },
          { label: 'Menu Polls', path: '/student/polls', icon: Vote },
          { label: 'Profile', path: '/student/profile', icon: User },
        ];
      case 'CHEF':
        return [
          { label: 'Dashboard', path: '/chef', icon: LayoutDashboard },
          { label: 'Incoming', path: '/chef/incoming', icon: Clock },
          { label: 'Preparing', path: '/chef/preparing', icon: Utensils },
          { label: 'Ready', path: '/chef/ready', icon: CheckSquare },
          { label: 'Verify QR', path: '/chef/verify-qr', icon: QrCode },
          { label: 'Demand Planning', path: '/chef/demand', icon: TrendingUp },
          { label: 'Stock', path: '/chef/availability', icon: ShoppingBag },
        ];
      case 'ADMIN':
        return [
          { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
          { label: 'Students', path: '/admin/students', icon: Users },
          { label: 'Chefs', path: '/admin/chefs', icon: ChefHat },
          { label: 'Menu', path: '/admin/menu', icon: Utensils },
          { label: 'Meal Slots', path: '/admin/slots', icon: Layers },
          { label: 'Demand Planning', path: '/admin/demand', icon: TrendingUp },
          { label: 'Analytics', path: '/admin/analytics', icon: PieChart },
          { label: 'Feedback', path: '/admin/feedback', icon: MessageSquare },
          { label: 'Menu Polls', path: '/admin/polls', icon: Vote },
          { label: 'Credits', path: '/admin/credits', icon: User },
          { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-4 space-y-6">
      {/* Top Branding Section inside Sidebar */}
      <div className="space-y-6">
        <div className="px-2 pt-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E50914] to-[#B91C1C] text-white flex items-center justify-center shadow-lg shadow-[#E50914]/30 transform rotate-[-6deg]">
              <Flame className="w-6 h-6 fill-white" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white tracking-tight leading-tight">Smart Campus</h2>
              <span className="text-[10px] font-black text-[#E50914] uppercase tracking-widest block">MESS MANAGEMENT</span>
            </div>
          </div>
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-[#8E8E93] hover:text-white rounded-full bg-[#272727]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5 pt-2 max-h-[calc(100vh-14rem)] overflow-y-auto pr-1 custom-scrollbar">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/student' || link.path === '/chef' || link.path === '/admin'}
                onClick={onClose}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold transition-all duration-200 rounded-xl ${
                    isActive
                      ? 'bg-[#272727] text-[#E50914] shadow-md border-l-4 border-[#E50914]'
                      : 'text-[#8E8E93] hover:text-white hover:bg-[#222222]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive ? (
                      <span className="w-2 h-2 rounded-full bg-[#E50914] shadow-sm shadow-[#E50914] shrink-0" />
                    ) : (
                      <Icon className="w-4 h-4 text-[#8E8E93] group-hover:text-white shrink-0 transition-colors" />
                    )}
                    <span className="truncate tracking-wide">{link.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Controls */}
      <div className="pt-3 border-t border-[#262626]/50 space-y-3 shrink-0">
        <div className="flex items-center justify-around">
          <NavLink
            to={user?.role === 'STUDENT' ? '/student/settings' : '/admin/settings'}
            className="w-9 h-9 rounded-full bg-[#272727] hover:bg-[#E50914] text-[#8E8E93] hover:text-white flex items-center justify-center transition-all duration-200 shadow-md border border-[#333333]"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </NavLink>

          <button
            type="button"
            className="w-9 h-9 rounded-full bg-[#272727] hover:bg-[#E50914] text-[#8E8E93] hover:text-white flex items-center justify-center transition-all duration-200 shadow-md border border-[#333333]"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={logout}
            className="w-9 h-9 rounded-full bg-[#272727] hover:bg-[#E50914] text-[#8E8E93] hover:text-white flex items-center justify-center transition-all duration-200 shadow-md border border-[#333333]"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop In-Shell Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 bg-[#151515] border-r border-[#242424] flex-col justify-between self-stretch">
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#151515] border-r border-[#242424] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
