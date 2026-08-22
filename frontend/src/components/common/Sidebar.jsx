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
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { totalItemsCount } = useCart();

  const getNavLinks = () => {
    switch (user?.role) {
      case 'STUDENT':
        return [
          { label: 'Dashboard', path: '/student', icon: LayoutDashboard },
          { label: 'Menu', path: '/student/menu', icon: Utensils },
          { label: 'My Cart', path: '/student/cart', icon: ShoppingBag, badge: totalItemsCount > 0 ? totalItemsCount : null },
          { label: 'Current Order', path: '/student/current-order', icon: Clock },
          { label: 'Order History', path: '/student/history', icon: History },
          { label: 'Credit History', path: '/student/credits', icon: Wallet },
          { label: 'Profile', path: '/student/profile', icon: User },
          { label: 'Settings', path: '/student/settings', icon: Settings },
        ];
      case 'CHEF':
        return [
          { label: 'Dashboard', path: '/chef', icon: LayoutDashboard },
          { label: 'Incoming Orders', path: '/chef/incoming', icon: Clock },
          { label: 'Preparing', path: '/chef/preparing', icon: Utensils },
          { label: 'Ready Orders', path: '/chef/ready', icon: CheckSquare },
          { label: 'Menu Availability', path: '/chef/availability', icon: ShoppingBag },
          { label: 'Profile', path: '/chef/profile', icon: User },
        ];
      case 'ADMIN':
        return [
          { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
          { label: 'Students', path: '/admin/students', icon: Users },
          { label: 'Chefs', path: '/admin/chefs', icon: ChefHat },
          { label: 'Menu Management', path: '/admin/menu', icon: Utensils },
          { label: 'Credit Management', path: '/admin/credits', icon: Wallet },
          { label: 'Orders', path: '/admin/orders', icon: History },
          { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
          { label: 'Settings', path: '/admin/settings', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-[#080808] border-r border-[#1F1F1F] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="h-16 flex items-center px-6 border-b border-[#1F1F1F]">
            <span className="text-xs font-bold tracking-widest text-[#E50914] uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#E50914]" />
              {user?.role} Portal
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/student' || link.path === '/chef' || link.path === '/admin'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition border-l-4 ${
                      isActive
                        ? 'bg-[#450A0A] border-[#E50914] text-white shadow-sm'
                        : 'border-transparent text-[#A3A3A3] hover:bg-[#181010] hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#E50914]' : 'text-[#737373]'}`} />
                        <span>{link.label}</span>
                      </div>
                      {link.badge && (
                        <span className="px-2 py-0.5 text-xs font-bold bg-[#E50914] text-white rounded-full">
                          {link.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-[#1F1F1F]">
          <div className="p-3 bg-[#111111] rounded-xl border border-[#242424] text-center">
            <p className="text-[11px] font-semibold text-white">Smart Mess System</p>
            <p className="text-[10px] text-[#737373] mt-0.5">VIT Mess SaaS v2.0</p>
          </div>
        </div>
      </aside>
    </>
  );
};
