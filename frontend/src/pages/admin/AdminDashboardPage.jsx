import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { AnalyticsCard } from '../../components/admin/AnalyticsCard';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { Users, ChefHat, ShoppingBag, Wallet, Clock, Utensils } from 'lucide-react';
import { formatCredits } from '../../utils/formatters';
import { Link } from 'react-router-dom';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/dashboard');
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <SkeletonLoader count={4} type="card" />;

  return (
    <div className="space-y-8 max-w-[1250px] mx-auto pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Admin Control Center</h1>
        <p className="text-xs font-bold text-[#FF3B30]">Overview of student registrations, kitchen staff, daily orders, and processed credits.</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnalyticsCard title="Total Students" value={stats?.totalStudents || 0} icon={Users} color="red" />
        <AnalyticsCard title="Active Kitchen Chefs" value={stats?.totalChefs || 0} icon={ChefHat} color="red" />
        <AnalyticsCard title="Orders Placed Today" value={stats?.ordersToday || 0} icon={ShoppingBag} color="red" />
        <AnalyticsCard title="Revenue (Total Credits Spent)" value={formatCredits(stats?.revenueInCredits || 0)} icon={Wallet} color="red" />
        <AnalyticsCard title="Pending / Active Orders" value={stats?.pendingOrders || 0} icon={Clock} color="amber" />
        <AnalyticsCard title="Available Menu Items" value={stats?.availableMenuItems || 0} icon={Utensils} color="blue" />
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickCard
          title="Student Management"
          description="View, edit, deactivate or add new student mess accounts."
          link="/admin/students"
        />
        <QuickCard
          title="Credit Management"
          description="Manually adjust student balances and trigger 9,000 monthly credit resets."
          link="/admin/credits"
        />
        <QuickCard
          title="Reports & Analytics"
          description="Interactive Recharts graphs for daily order volume, top food items & peak hours."
          link="/admin/reports"
        />
      </div>
    </div>
  );
};

const QuickCard = ({ title, description, link }) => (
  <Link
    to={link}
    className="bg-[#222222] border border-[#2D2D2D] hover:border-[#FF3B30] rounded-[24px] p-6 shadow-xl transition-all duration-300 group space-y-2"
  >
    <h3 className="text-base font-black text-white group-hover:text-[#FF3B30] transition">{title}</h3>
    <p className="text-xs text-[#8E8E93] leading-relaxed">{description}</p>
    <span className="text-xs font-bold text-[#FF3B30] pt-2 block">Open Module →</span>
  </Link>
);

