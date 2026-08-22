import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FoodCard } from '../../components/student/FoodCard';
import { OrderProgressWidget } from '../../components/student/OrderProgressWidget';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { formatCredits } from '../../utils/formatters';
import { Wallet, ShoppingBag, CheckCircle2, Clock, Sparkles, Search, ArrowRight, Utensils, Coffee, Sun, Moon, Pizza, GlassWater } from 'lucide-react';
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

  const { student, credits, stats, activeOrder, todayMenuPreview } = dashboardData || {};

  // Categories list with circular design icons
  const categories = [
    { label: 'All', icon: Utensils, count: 'Menu' },
    { label: 'Breakfast', icon: Sun, count: 'Morning' },
    { label: 'Lunch', icon: Utensils, count: 'Afternoon' },
    { label: 'Dinner', icon: Moon, count: 'Night' },
    { label: 'Snacks', icon: Pizza, count: 'Bites' },
    { label: 'Drinks', icon: GlassWater, count: 'Beverages' },
  ];

  const filteredPreview = todayMenuPreview?.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  }) || [];

  return (
    <div className="space-y-8 max-w-[1300px] mx-auto">
      {/* Top Greeting & Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#330808] border border-[#7F1D1D] text-[#FF2B2B] text-[11px] font-black tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" /> SMART DIGITAL MESS
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Good Evening, <span className="text-[#FF2B2B]">{user?.name || 'Yash'}</span> 👋
          </h1>
          <p className="text-xs text-[#888888]">
            What's on the menu today? Order your daily meal instantly with Monthly Credits.
          </p>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search food, category or dish..."
            className="w-full pl-4 pr-10 py-3 text-xs bg-[#121212] text-white border border-[#222222] rounded-2xl focus:outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914]/50 transition-all placeholder:text-[#555555]"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#FF2B2B] transition">
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Horizontal Circular Categories Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#888888]">Meal Categories</h3>
          <span className="text-[11px] text-[#555555]">Scroll horizontally →</span>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.label)}
                className="flex flex-col items-center gap-2 shrink-0 group transition"
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isSelected
                      ? 'bg-[#E50914] text-white ring-4 ring-[#E50914]/30 shadow-lg shadow-[#E50914]/40 scale-105'
                      : 'bg-[#141414] border border-[#222222] text-[#737373] group-hover:border-[#7F1D1D] group-hover:text-white'
                  }`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <span className={`text-xs font-bold transition ${isSelected ? 'text-white font-extrabold' : 'text-[#888888]'}`}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Order Tracking Timeline Widget (if order present) */}
      {activeOrder && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2 uppercase tracking-wide">
              <Clock className="w-4 h-4 text-[#E50914]" /> CURRENT ORDER STATUS
            </h2>
            <Link to="/student/current-order" className="text-xs font-bold text-[#FF2B2B] hover:underline">
              Live Order Page →
            </Link>
          </div>
          <OrderProgressWidget order={activeOrder} onCancel={handleCancelOrder} />
        </section>
      )}

      {/* Popular Dishes Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight">Popular Dishes</h2>
            <p className="text-xs text-[#888888]">Freshly cooked meal options available for immediate pickup</p>
          </div>
          <Link
            to="/student/menu"
            className="text-xs font-extrabold text-[#FF2B2B] hover:underline flex items-center gap-1"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {filteredPreview.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPreview.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-[#141414] border border-[#222222] rounded-3xl space-y-2">
            <p className="text-xs font-bold text-[#888888]">No food items match the selected filter.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="px-4 py-2 bg-[#1F1F1F] text-white text-xs font-bold rounded-xl hover:bg-[#330808] hover:text-[#FF2B2B]"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

