import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';
import { RightCartPanel } from '../components/student/RightCartPanel';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Utensils, ShoppingBag, Clock, User, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const { user } = useAuth();
  const { totalItemsCount } = useCart();
  const location = useLocation();

  // Show right-side cart panel on student dashboard and menu pages on desktop
  const isStudentPortal = user?.role === 'STUDENT';
  const showRightCart = isStudentPortal && (
    location.pathname === '/student' ||
    location.pathname === '/student/' ||
    location.pathname === '/student/menu'
  );

  return (
    <div className="min-h-screen bg-ambient-glow text-white flex flex-col transition-colors duration-300">
      {/* Top Navbar */}
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 relative max-w-[1700px] w-full mx-auto">
        {/* Left Sidebar Drawer */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Center Main Content Area */}
        <div className="flex-1 lg:ml-60 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 w-full min-w-0 transition-all flex flex-col lg:flex-row gap-6">
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>

          {/* Right-Side Cart Panel (Desktop Sticky 3rd Column) */}
          {showRightCart && (
            <div className="hidden xl:block sticky top-20 h-[calc(100vh-6rem)] self-start">
              <RightCartPanel />
            </div>
          )}
        </div>
      </div>

      {/* Floating Mobile Cart Button (when items in cart) */}
      {isStudentPortal && totalItemsCount > 0 && (
        <button
          type="button"
          onClick={() => setMobileCartOpen(true)}
          className="xl:hidden fixed bottom-16 right-4 z-40 px-4 py-3 bg-[#E50914] text-white font-extrabold text-xs rounded-full shadow-2xl flex items-center gap-2 border border-[#FF2B2B] btn-red-glow animate-bounce"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>View Cart ({totalItemsCount})</span>
        </button>
      )}

      {/* Mobile Right Cart Drawer */}
      {isStudentPortal && mobileCartOpen && (
        <div className="xl:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end">
          <div className="w-full max-w-sm h-full bg-[#0B0B0B] p-4 flex flex-col relative overflow-y-auto">
            <button
              onClick={() => setMobileCartOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#888888] hover:text-white bg-[#1A1A1A] rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="pt-8">
              <RightCartPanel onOrderPlaced={() => setMobileCartOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation for Student Role */}
      {isStudentPortal && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0B0B0B]/95 backdrop-blur-xl border-t border-[#1C1C1C] flex justify-around items-center px-2 py-2 shadow-2xl">
          <NavLink
            to="/student"
            end
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 text-[10px] font-bold rounded-xl transition ${
                isActive ? 'text-[#FF2B2B] font-extrabold' : 'text-[#737373] hover:text-[#A3A3A3]'
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/student/menu"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 text-[10px] font-bold rounded-xl transition ${
                isActive ? 'text-[#FF2B2B] font-extrabold' : 'text-[#737373] hover:text-[#A3A3A3]'
              }`
            }
          >
            <Utensils className="w-5 h-5" />
            <span>Menu</span>
          </NavLink>

          <NavLink
            to="/student/cart"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 text-[10px] font-bold rounded-xl relative transition ${
                isActive ? 'text-[#FF2B2B] font-extrabold' : 'text-[#737373] hover:text-[#A3A3A3]'
              }`
            }
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItemsCount > 0 && (
              <span className="absolute top-1 right-3 w-4 h-4 text-[9px] font-extrabold bg-[#E50914] text-white rounded-full flex items-center justify-center font-mono">
                {totalItemsCount}
              </span>
            )}
            <span>Cart</span>
          </NavLink>

          <NavLink
            to="/student/current-order"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 text-[10px] font-bold rounded-xl transition ${
                isActive ? 'text-[#FF2B2B] font-extrabold' : 'text-[#737373] hover:text-[#A3A3A3]'
              }`
            }
          >
            <Clock className="w-5 h-5" />
            <span>Track</span>
          </NavLink>

          <NavLink
            to="/student/profile"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 text-[10px] font-bold rounded-xl transition ${
                isActive ? 'text-[#FF2B2B] font-extrabold' : 'text-[#737373] hover:text-[#A3A3A3]'
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

