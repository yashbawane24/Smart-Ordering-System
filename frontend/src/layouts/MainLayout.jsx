import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Utensils, ShoppingBag, Clock, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { totalItemsCount } = useCart();

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col transition-colors duration-300">
      {/* Top Navbar */}
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 relative">
        {/* Sidebar Drawer */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8 max-w-7xl mx-auto w-full transition-all">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation for Student Role */}
      {user?.role === 'STUDENT' && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#080808]/95 backdrop-blur-lg border-t border-[#1F1F1F] flex justify-around items-center px-2 py-2 shadow-xl">
          <NavLink
            to="/student"
            end
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 text-[10px] font-bold rounded-lg transition ${
                isActive ? 'text-[#E50914] font-bold' : 'text-[#737373] hover:text-[#A3A3A3]'
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/student/menu"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 text-[10px] font-bold rounded-lg transition ${
                isActive ? 'text-[#E50914] font-bold' : 'text-[#737373] hover:text-[#A3A3A3]'
              }`
            }
          >
            <Utensils className="w-5 h-5" />
            <span>Menu</span>
          </NavLink>

          <NavLink
            to="/student/cart"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 text-[10px] font-bold rounded-lg relative transition ${
                isActive ? 'text-[#E50914] font-bold' : 'text-[#737373] hover:text-[#A3A3A3]'
              }`
            }
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItemsCount > 0 && (
              <span className="absolute top-1 right-3 w-4 h-4 text-[9px] font-extrabold bg-[#E50914] text-white rounded-full flex items-center justify-center">
                {totalItemsCount}
              </span>
            )}
            <span>Cart</span>
          </NavLink>

          <NavLink
            to="/student/current-order"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 text-[10px] font-bold rounded-lg transition ${
                isActive ? 'text-[#E50914] font-bold' : 'text-[#737373] hover:text-[#A3A3A3]'
              }`
            }
          >
            <Clock className="w-5 h-5" />
            <span>Track</span>
          </NavLink>

          <NavLink
            to="/student/profile"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 text-[10px] font-bold rounded-lg transition ${
                isActive ? 'text-[#E50914] font-bold' : 'text-[#737373] hover:text-[#A3A3A3]'
              }`
            }
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </NavLink>
        </nav>
      )}
    </div>
  );
};
