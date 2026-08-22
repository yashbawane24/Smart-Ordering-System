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
  ShieldCheck,
  UtensilsCrossed
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
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md lg:hidden"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-60 bg-[#0B0B0B] border-r border-[#1C1C1C] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo & Brand Header */}
          <div className="h-16 flex items-center px-5 border-b border-[#1A1A1A] gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF2B2B] to-[#B91C1C] text-white flex items-center justify-center shadow-lg shadow-[#E50914]/25 shrink-0">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white block">
                Smart <span className="text-[#FF2B2B]">Mess</span>
              </span>
              <span className="text-[10px] text-[#737373] tracking-widest uppercase font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#E50914]" /> {user?.role} PORTAL
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-8.5rem)] no-scrollbar">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/student' || link.path === '/chef' || link.path === '/admin'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-[#260707] text-white border border-[#521010] shadow-sm'
                        : 'text-[#888888] hover:bg-[#141414] hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active Left Red Indicator Strip */}
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#E50914] rounded-r-full shadow-md shadow-[#E50914]" />
                      )}
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#FF2B2B]' : 'text-[#666666]'}`} />
                        <span>{link.label}</span>
                      </div>
                      {link.badge && (
                        <span className="px-2 py-0.5 text-[10px] font-black bg-[#E50914] text-white rounded-full font-mono">
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

        {/* Footer User Info */}
        <div className="p-3 border-t border-[#1A1A1A] bg-[#0E0E0E]">
          <div className="p-3 bg-[#151515] rounded-xl border border-[#222222] flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#3D0A0A] border border-[#7F1D1D] text-[#FF2B2B] flex items-center justify-center font-black text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-[#737373] truncate font-mono">{user?.email || 'vit.edu'}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

