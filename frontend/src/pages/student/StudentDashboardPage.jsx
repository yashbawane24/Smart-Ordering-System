import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FoodCard } from '../../components/student/FoodCard';
import { OrderProgressWidget } from '../../components/student/OrderProgressWidget';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { formatCredits, formatDate } from '../../utils/formatters';
import { Search, ChevronRight, Clock, Utensils } from 'lucide-react';
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

  // Category disk buttons with 3D emoji representations (matches reference image disks)
  const categoryDisks = [
    { label: 'All', emoji: '🍔', sub: 'All Foods' },
    { label: 'Breakfast', emoji: '🍕', sub: 'Morning' },
    { label: 'Lunch', emoji: '🍟', sub: 'Afternoon' },
    { label: 'Dinner', emoji: '🍲', sub: 'Night' },
    { label: 'Snacks', emoji: '🥪', sub: 'Bites' },
    { label: 'Drinks', emoji: '🍦', sub: 'Sweets' },
    { label: 'Dessert', emoji: '🍰', sub: 'Cakes' },
  ];

  // Reference Mock Order Reports data to render the exact table from reference image
  const orderReports = [
    {
      id: '1',
      customer: 'Jamsed Jhon',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      orderNumber: '01845723200573',
      address: 'Korang Teagha Hills',
      amount: '$120.45',
      status: 'Completed'
    },
    {
      id: '2',
      customer: 'Peter Parker',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
      orderNumber: '01976854823047',
      address: 'City Center, CA',
      amount: '$140.45',
      status: 'Pending'
    }
  ];

  const filteredPreview = todayMenuPreview?.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  }) || [];

  return (
    <div className="space-y-8 max-w-[1250px] mx-auto pb-6">
      
      {/* Search Bar at Top (matches reference image input box) */}
      <form onSubmit={handleSearchSubmit} className="relative w-full max-w-2xl mx-auto">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Restaurant, Food, Cuisine or a Dish"
          className="w-full pl-5 pr-14 py-3.5 text-xs font-semibold bg-[#242424] text-white border border-[#333333] rounded-full focus:outline-none focus:border-[#FF3B30] transition-all placeholder:text-[#666666] shadow-xl"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#333333] hover:bg-[#FF3B30] text-[#8E8E93] hover:text-white flex items-center justify-center transition-colors shadow-md"
        >
          <Search className="w-4 h-4" />
        </button>
      </form>

      {/* Categories Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-white tracking-tight">Categories</h2>
            <p className="text-xs font-bold text-[#FF3B30]">10+ New Categories added this week</p>
          </div>
          <button
            onClick={() => navigate('/student/menu')}
            className="flex items-center gap-1 text-xs font-bold text-[#8E8E93] hover:text-white transition"
          >
            <span>View More</span>
            <div className="w-5 h-5 rounded-full bg-[#272727] flex items-center justify-center">
              <ChevronRight className="w-3 h-3 text-white" />
            </div>
          </button>
        </div>

        {/* Circular Disk Buttons */}
        <div className="flex items-center gap-4 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {categoryDisks.map((cat) => {
            const isSelected = selectedCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.label)}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shrink-0 transition-all duration-300 shadow-xl border ${
                  isSelected
                    ? 'bg-[#FF3B30] text-white border-[#FF3B30] ring-4 ring-[#FF3B30]/30 scale-105'
                    : 'bg-[#262626] border-[#333333] text-white hover:border-[#FF3B30] hover:scale-105'
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
            <h2 className="text-base font-black text-white tracking-tight">Popular Dishes</h2>
            <p className="text-xs font-bold text-[#FF3B30]">20+ New dishes added this week</p>
          </div>
          <button
            onClick={() => navigate('/student/menu')}
            className="flex items-center gap-1 text-xs font-bold text-[#8E8E93] hover:text-white transition"
          >
            <span>View More</span>
            <div className="w-5 h-5 rounded-full bg-[#272727] flex items-center justify-center">
              <ChevronRight className="w-3 h-3 text-white" />
            </div>
          </button>
        </div>

        {/* Pop-Out 3D Food Cards Grid */}
        {filteredPreview.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredPreview.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-[#222222] border border-[#2D2D2D] rounded-[24px] space-y-2">
            <p className="text-xs font-bold text-[#8E8E93]">No dishes found matching filter.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="px-4 py-2 bg-[#2B2B2B] text-white text-xs font-bold rounded-full hover:bg-[#FF3B30]"
            >
              Reset Filter
            </button>
          </div>
        )}
      </section>

      {/* Live Active Order Progress Timeline (if student active order) */}
      {activeOrder && (
        <section className="space-y-2 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#FF3B30] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FF3B30]" /> LIVE ORDER STATUS
            </h2>
            <Link to="/student/current-order" className="text-xs font-bold text-[#8E8E93] hover:text-white">
              Details →
            </Link>
          </div>
          <OrderProgressWidget order={activeOrder} onCancel={handleCancelOrder} />
        </section>
      )}

      {/* Order Reports / Recent Activity Section (matches bottom section of reference image) */}
      <section className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-white tracking-tight">Order Reports</h2>
            <p className="text-xs font-bold text-[#FF3B30]">Wow!! 100+ New order got this week</p>
          </div>
          <button
            onClick={() => navigate('/student/history')}
            className="flex items-center gap-1 text-xs font-bold text-[#8E8E93] hover:text-white transition"
          >
            <span>View More</span>
            <div className="w-5 h-5 rounded-full bg-[#272727] flex items-center justify-center">
              <ChevronRight className="w-3 h-3 text-white" />
            </div>
          </button>
        </div>

        {/* Order Reports Table Container */}
        <div className="bg-[#222222] border border-[#2D2D2D] rounded-[24px] p-4 overflow-x-auto shadow-2xl">
          <table className="w-full text-left text-xs">
            <thead className="text-[#8E8E93] font-bold text-[11px] uppercase tracking-wider border-b border-[#2D2D2D]/80">
              <tr>
                <th className="pb-3 px-3">Customer</th>
                <th className="pb-3 px-3">Order number</th>
                <th className="pb-3 px-3">Address</th>
                <th className="pb-3 px-3">Amount</th>
                <th className="pb-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D2D2D]/50">
              {orderReports.map((row) => (
                <tr key={row.id} className="hover:bg-[#2A2A2A] transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={row.avatar}
                        alt={row.customer}
                        className="w-8 h-8 rounded-full object-cover border border-[#333333]"
                      />
                      <span className="font-bold text-white text-xs">{row.customer}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-[#8E8E93] text-xs">
                    {row.orderNumber}
                  </td>
                  <td className="py-3 px-3 text-[#8E8E93] text-xs font-medium">
                    {row.address}
                  </td>
                  <td className="py-3 px-3 text-white font-mono font-bold text-xs">
                    {row.amount}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`inline-block px-4 py-1 text-[11px] font-extrabold rounded-full text-white shadow-md ${
                        row.status === 'Completed'
                          ? 'bg-[#22C55E]'
                          : 'bg-[#F59E0B]'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};


