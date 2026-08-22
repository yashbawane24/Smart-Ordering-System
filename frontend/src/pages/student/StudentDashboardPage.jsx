import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FoodCard } from '../../components/student/FoodCard';
import { OrderProgressWidget } from '../../components/student/OrderProgressWidget';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { formatCredits } from '../../utils/formatters';
import { Wallet, ShoppingBag, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <SkeletonLoader count={4} type="card" />;

  const { student, credits, stats, activeOrder, todayMenuPreview } = dashboardData || {};

  return (
    <div className="space-y-8">
      {/* Welcome Banner Card */}
      <div className="relative bg-gradient-to-r from-[#1C0505] via-[#111111] to-[#0A0A0A] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#331111] overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#E50914]/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#450A0A] text-[#FF2D2D] border border-[#7F1D1D] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> VIT Student Portal
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Good Morning, <span className="text-[#FF2D2D]">{user?.name || 'Yash'}</span> 👋
            </h1>
            <p className="text-xs sm:text-sm text-[#A3A3A3]">
              Registration ID: <span className="font-mono font-bold text-white">{student?.studentIdStr || '21BCE1042'}</span> • {student?.hostel || 'Block A, Mens Hostel'} ({student?.roomNumber})
            </p>
          </div>

          <div className="bg-[#111111] border border-[#242424] rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-lg min-w-[240px]">
            <div className="w-12 h-12 rounded-xl bg-[#450A0A] border border-[#7F1D1D] text-[#FF2D2D] flex items-center justify-center font-bold text-xl">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-[#A3A3A3] font-semibold uppercase block">Remaining Credits</span>
              <span className="text-2xl font-black text-[#E50914]">{formatCredits(credits?.remaining || 8700)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Remaining Credits"
          value={formatCredits(credits?.remaining)}
          icon={Wallet}
          color="red"
          highlight
        />
        <StatCard
          title="Orders This Month"
          value={stats?.ordersThisMonth || 0}
          icon={ShoppingBag}
          color="dark"
        />
        <StatCard
          title="Completed Orders"
          value={stats?.completedOrders || 0}
          icon={CheckCircle2}
          color="dark"
        />
        <StatCard
          title="Pending Orders"
          value={stats?.pendingOrders || 0}
          icon={Clock}
          color="dark"
        />
      </div>

      {/* Active Order Progress */}
      {activeOrder && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#E50914]" /> Active Order Progress
          </h2>
          <OrderProgressWidget order={activeOrder} onCancel={handleCancelOrder} />
        </section>
      )}

      {/* Today's Menu Preview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white">Today's Fresh Menu</h2>
            <p className="text-xs text-[#A3A3A3]">Delicious Indian college mess dishes ready for token-free digital order</p>
          </div>
          <Link
            to="/student/menu"
            className="text-xs font-bold text-[#FF2D2D] hover:underline"
          >
            View Full Menu →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {todayMenuPreview?.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, highlight }) => {
  return (
    <div className={`bg-[#111111] border rounded-2xl p-5 shadow-sm flex items-center justify-between transition-all ${
      highlight ? 'border-[#7F1D1D] bg-[#140808]' : 'border-[#242424]'
    }`}>
      <div>
        <span className="text-xs text-[#A3A3A3] font-semibold uppercase tracking-wider block">{title}</span>
        <h3 className={`text-2xl font-extrabold mt-1 ${highlight ? 'text-[#FF2D2D]' : 'text-white'}`}>{value}</h3>
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
        highlight ? 'bg-[#450A0A] border-[#7F1D1D] text-[#FF2D2D]' : 'bg-[#151515] border-[#242424] text-[#A3A3A3]'
      }`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};
