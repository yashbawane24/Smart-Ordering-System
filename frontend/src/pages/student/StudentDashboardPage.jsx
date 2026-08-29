import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FoodCard } from '../../components/student/FoodCard';
import { OrderProgressWidget } from '../../components/student/OrderProgressWidget';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { formatCredits } from '../../utils/formatters';
import { Search, ChevronRight, Clock, Utensils, CalendarCheck, QrCode, ShieldCheck, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const StudentDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/student/dashboard');
      if (res.success) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      const res = await api.patch(`/orders/${orderId}/cancel`);
      if (res.success) {
        fetchDashboard();
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel order');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/student/menu?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (loading) return <SkeletonLoader count={4} type="card" />;

  const { student, activeOrder, todayMenuPreview } = dashboardData || {};
  const creditAccount = student?.creditAccount || { usedCredit: 300, remainingCredit: 8700, monthlyCredit: 9000 };

  const categoryDisks = [
    { label: 'All', emoji: '🍔' },
    { label: 'Breakfast', emoji: '🍕' },
    { label: 'Lunch', emoji: '🍟' },
    { label: 'Dinner', emoji: '🍲' },
    { label: 'Snacks', emoji: '🥪' },
    { label: 'Drinks', emoji: '🥤' }
  ];

  const filteredPreview = todayMenuPreview?.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  }) || [];

  return (
    <div className="space-y-8 max-w-[1250px] mx-auto pb-6">
      {/* Top Greeting & Operational Quick Actions Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#242424] pb-5">
        <div>
          <span className="text-xs font-mono text-[#E50914] uppercase tracking-wider font-extrabold">INSTITUTIONAL MEAL PORTAL</span>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Good Evening, {user?.name || 'Student'} 👋
          </h1>
          <p className="text-xs text-[#A3A3A3] mt-0.5 font-mono">
            Hostel: {student?.hostel || 'Block A'} • Room: {student?.roomNumber || 'A-304'}
          </p>
        </div>

        {/* Quick Action Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/student/meals"
            className="px-3.5 py-2 rounded-xl bg-[#E50914] hover:bg-[#B91C1C] text-white text-xs font-black transition shadow-lg shadow-[#E50914]/20 flex items-center gap-1.5"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Plan Tomorrow's Meals</span>
          </Link>
          <Link
            to="/student/slots"
            className="px-3.5 py-2 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] text-white border border-[#242424] text-xs font-black transition flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-[#E50914]" />
            <span>Book Meal Slot</span>
          </Link>
          <Link
            to="/student/qr-collection"
            className="px-3.5 py-2 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] text-white border border-[#242424] text-xs font-black transition flex items-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>View QR</span>
          </Link>
          <Link
            to="/student/menu"
            className="px-3.5 py-2 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] text-white border border-[#242424] text-xs font-black transition flex items-center gap-1.5"
          >
            <Utensils className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Order Food</span>
          </Link>
        </div>
      </div>

      {/* Top Institutional Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Today's Meal Status */}
        <div className="bg-[#151515] border border-[#242424] rounded-2xl p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-[#A3A3A3] uppercase tracking-wider">TODAY'S MEAL STATUS</h3>
            <span className="text-[10px] text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded font-mono font-bold">Active Plan</span>
          </div>

          <div className="space-y-2 pt-1 text-xs">
            <div className="flex justify-between items-center bg-[#1C1C1C] p-2.5 rounded-xl border border-[#242424]">
              <span className="font-bold text-white">Breakfast</span>
              <span className="text-[#22C55E] font-bold flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Collected
              </span>
            </div>
            <div className="flex justify-between items-center bg-[#1C1C1C] p-2.5 rounded-xl border border-[#242424]">
              <span className="font-bold text-white">Lunch</span>
              <span className="text-[#F59E0B] font-bold flex items-center gap-1 text-[11px]">
                <Clock className="w-3.5 h-3.5" /> ⏳ Preparing
              </span>
            </div>
            <div className="flex justify-between items-center bg-[#1C1C1C] p-2.5 rounded-xl border border-[#242424]">
              <span className="font-bold text-white">Dinner</span>
              <span className="text-[#8E8E93] font-bold flex items-center gap-1 text-[11px]">
                ○ Not Declared
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Monthly Credits */}
        <div className="bg-[#151515] border border-[#242424] rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-[#A3A3A3] uppercase tracking-wider">MONTHLY CREDITS</h3>
              <span className="text-[10px] text-[#E50914] font-mono font-bold">August 2026</span>
            </div>

            <div className="mt-3">
              <span className="text-2xl font-black text-white font-mono">{formatCredits(creditAccount.remainingCredit)}</span>
              <span className="text-xs text-[#A3A3A3] font-mono"> / {formatCredits(creditAccount.monthlyCredit)} Limit</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-[#242424] rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-gradient-to-r from-[#E50914] to-[#B91C1C] rounded-full"
                style={{ width: `${Math.min(100, (creditAccount.remainingCredit / creditAccount.monthlyCredit) * 100)}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center text-[11px] text-[#A3A3A3] pt-2 border-t border-[#242424]">
            <span>Used: {formatCredits(creditAccount.usedCredit)}</span>
            <Link to="/student/credits" className="text-[#E50914] font-bold hover:underline">
              Wallet History →
            </Link>
          </div>
        </div>

        {/* Card 3: Today's Pickup Slot & Upcoming Declaration */}
        <div className="bg-[#151515] border border-[#242424] rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-[#A3A3A3] uppercase tracking-wider">TODAY'S PICKUP SLOT</h3>
              <span className="text-[10px] text-[#E50914] bg-[#E50914]/10 px-2 py-0.5 rounded font-mono font-bold">Lunch</span>
            </div>

            <div className="mt-3 bg-[#1C1C1C] p-3 rounded-xl border border-[#242424] flex items-center justify-between">
              <div>
                <span className="text-base font-extrabold text-white">1:00 PM – 1:15 PM</span>
                <span className="text-[10px] text-[#A3A3A3] block">Counter 1 • Reserved</span>
              </div>
              <Link to="/student/slots" className="text-xs font-bold text-[#E50914] hover:underline">
                Details →
              </Link>
            </div>
          </div>

          <div className="pt-2 border-t border-[#242424]">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[#A3A3A3]">Tomorrow's Declaration</span>
              <span className="text-[#22C55E] font-bold">2 Declared, 1 Skipped</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar at Top */}
      <form onSubmit={handleSearchSubmit} className="relative w-full max-w-2xl mx-auto">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Restaurant, Food, Cuisine or a Dish"
          className="w-full pl-5 pr-14 py-3.5 text-xs font-semibold bg-[#151515] text-white border border-[#242424] rounded-full focus:outline-none focus:border-[#E50914] transition-all placeholder:text-[#666666] shadow-xl"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#242424] hover:bg-[#E50914] text-[#8E8E93] hover:text-white flex items-center justify-center transition-colors shadow-md"
        >
          <Search className="w-4 h-4" />
        </button>
      </form>

      {/* Categories Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-white tracking-tight">Categories</h2>
            <p className="text-xs font-bold text-[#E50914]">Explore campus dining options</p>
          </div>
          <button
            onClick={() => navigate('/student/menu')}
            className="flex items-center gap-1 text-xs font-bold text-[#8E8E93] hover:text-white transition"
          >
            <span>View All</span>
            <div className="w-5 h-5 rounded-full bg-[#242424] flex items-center justify-center">
              <ChevronRight className="w-3 h-3 text-white" />
            </div>
          </button>
        </div>

        {/* Circular Disk Buttons */}
        <div className="flex items-center gap-4 overflow-x-auto pb-2 pt-1 custom-scrollbar">
          {categoryDisks.map((cat) => {
            const isSelected = selectedCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.label)}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-xl shrink-0 transition-all duration-300 shadow-xl border ${
                  isSelected
                    ? 'bg-[#E50914] text-white border-[#E50914] ring-4 ring-[#E50914]/30 scale-105'
                    : 'bg-[#151515] border-[#242424] text-white hover:border-[#E50914] hover:scale-105'
                }`}
                title={cat.label}
              >
                <span>{cat.emoji}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Popular Dishes Section */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-white tracking-tight">Today's Menu Selection</h2>
            <p className="text-xs font-bold text-[#E50914]">Prepared fresh by mess kitchen chefs</p>
          </div>
          <button
            onClick={() => navigate('/student/menu')}
            className="flex items-center gap-1 text-xs font-bold text-[#8E8E93] hover:text-white transition"
          >
            <span>Full Menu</span>
            <div className="w-5 h-5 rounded-full bg-[#242424] flex items-center justify-center">
              <ChevronRight className="w-3 h-3 text-white" />
            </div>
          </button>
        </div>

        {/* Food Cards Grid */}
        {filteredPreview.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredPreview.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-[#151515] border border-[#242424] rounded-2xl space-y-2">
            <p className="text-xs font-bold text-[#8E8E93]">No dishes found matching filter.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="px-4 py-2 bg-[#242424] text-white text-xs font-bold rounded-full hover:bg-[#E50914]"
            >
              Reset Filter
            </button>
          </div>
        )}
      </section>

      {/* Live Active Order Progress Widget */}
      {activeOrder && (
        <section className="space-y-2 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#E50914] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#E50914]" /> LIVE ORDER STATUS
            </h2>
            <Link to="/student/current-order" className="text-xs font-bold text-[#8E8E93] hover:text-white">
              Details →
            </Link>
          </div>
          <OrderProgressWidget order={activeOrder} onCancel={handleCancelOrder} />
        </section>
      )}
    </div>
  );
};
