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
    <div className="min-h-screen bg-reference-outer text-white p-2 sm:p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center font-sans">
      {/* Reference Outer Dashboard Shell Container */}
      <div className="w-full max-w-[1550px] bg-[#1a1a1a] border border-[#2b2b2b] rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative min-h-[90vh]">
        
        {/* Top Navbar */}
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="flex flex-1 relative w-full">
          {/* Left Sidebar Drawer */}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {/* Center Main Content Area */}
          <div className="flex-1 lg:ml-56 p-4 sm:p-6 lg:p-7 pb-24 lg:pb-7 w-full min-w-0 transition-all flex flex-col lg:flex-row gap-6">
            <main className="flex-1 min-w-0">
              <Outlet />
            </main>

            {/* Right-Side Cart Panel (Desktop 3rd Column) */}
            {showRightCart && (
              <div className="hidden xl:block sticky top-6 h-[calc(100vh-10rem)] self-start">
                <RightCartPanel />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Mobile Cart Button */}
      {isStudentPortal && totalItemsCount > 0 && (
        <button
          type="button"
          onClick={() => setMobileCartOpen(true)}
          className="xl:hidden fixed bottom-16 right-4 z-40 px-4 py-3 bg-[#FF3B30] text-white font-extrabold text-xs rounded-full shadow-2xl flex items-center gap-2 border border-[#FF6B60] btn-red-pill"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>View Cart ({totalItemsCount})</span>
        </button>
      )}

      {/* Mobile Right Cart Drawer */}
      {isStudentPortal && mobileCartOpen && (
        <div className="xl:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end">
          <div className="w-full max-w-sm h-full bg-[#1A1A1A] p-4 flex flex-col relative overflow-y-auto">
            <button
              onClick={() => setMobileCartOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#888888] hover:text-white bg-[#2A2A2A] rounded-full"
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
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#1A1A1A]/95 backdrop-blur-xl border-t border-[#2A2A2A] flex justify-around items-center px-2 py-2 shadow-2xl">
          <NavLink
            to="/student"
            end
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 text-[10px] font-bold rounded-xl transition ${
                isActive ? 'text-[#FF3B30] font-extrabold' : 'text-[#8E8E93] hover:text-white'
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
                isActive ? 'text-[#FF3B30] font-extrabold' : 'text-[#8E8E93] hover:text-white'
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
                isActive ? 'text-[#FF3B30] font-extrabold' : 'text-[#8E8E93] hover:text-white'
              }`
            }
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItemsCount > 0 && (
              <span className="absolute top-1 right-3 w-4 h-4 text-[9px] font-extrabold bg-[#FF3B30] text-white rounded-full flex items-center justify-center font-mono">
                {totalItemsCount}
              </span>
            )}
            <span>Cart</span>
          </NavLink>

          <NavLink
            to="/student/current-order"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 text-[10px] font-bold rounded-xl transition ${
                isActive ? 'text-[#FF3B30] font-extrabold' : 'text-[#8E8E93] hover:text-white'
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
                isActive ? 'text-[#FF3B30] font-extrabold' : 'text-[#8E8E93] hover:text-white'
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


