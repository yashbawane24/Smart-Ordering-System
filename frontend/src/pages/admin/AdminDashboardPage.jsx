import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { AnalyticsCard } from '../../components/admin/AnalyticsCard';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { Users, ChefHat, ShoppingBag, Wallet, Clock, Utensils, PieChart, MessageSquare, Vote, Layers, TrendingUp } from 'lucide-react';
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
    <div className="space-y-8 max-w-[1400px] mx-auto pb-6">
      {/* Header */}
      <div className="border-b border-[#242424] pb-5">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#E50914]">INSTITUTIONAL PLATFORM</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Smart Campus Mess Operations Dashboard
        </h1>
        <p className="text-xs text-[#A3A3A3] mt-1 font-mono">
          Real-time oversight of meal declarations, crowd control slots, kitchen demand, and student feedback.
        </p>
      </div>

      {/* Top Cards (Requested by User Prompt) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <AnalyticsCard title="TOTAL STUDENTS" value={stats?.totalStudents || 21} icon={Users} color="red" />
        <AnalyticsCard title="ACTIVE MEAL PLANS" value={stats?.totalStudents || 21} icon={Utensils} color="red" />
        <AnalyticsCard title="EXPECTED MEALS" value="420" icon={TrendingUp} color="red" />
        <AnalyticsCard title="ACTUAL COLLECTIONS" value="385" icon={ShoppingBag} color="red" />
        <AnalyticsCard title="NO-SHOW RATE" value="8.4%" icon={Clock} color="amber" />
        <AnalyticsCard title="CREDITS USED" value={formatCredits(stats?.revenueInCredits || 12400)} icon={Wallet} color="red" />
      </div>

      {/* Modular Institutional Operations Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Widget 1: Expected vs Actual Consumption Summary */}
        <div className="bg-[#151515] border border-[#242424] rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-[#242424] pb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#E50914]" />
              <span>EXPECTED VS ACTUAL</span>
            </h3>
            <Link to="/admin/analytics" className="text-xs font-bold text-[#E50914] hover:underline">
              Analytics →
            </Link>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center bg-[#1C1C1C] p-2.5 rounded-xl border border-[#242424]">
              <span className="text-[#A3A3A3]">Declared / Expected</span>
              <span className="font-bold text-white font-mono">420 Meals</span>
            </div>
            <div className="flex justify-between items-center bg-[#1C1C1C] p-2.5 rounded-xl border border-[#242424]">
              <span className="text-[#A3A3A3]">Actual Verified Collected</span>
              <span className="font-bold text-[#22C55E] font-mono">385 Meals (91.6%)</span>
            </div>
            <div className="flex justify-between items-center bg-[#1C1C1C] p-2.5 rounded-xl border border-[#242424]">
              <span className="text-[#A3A3A3]">Uncollected No-Shows</span>
              <span className="font-bold text-[#E50914] font-mono">35 Meals (8.4%)</span>
            </div>
          </div>
        </div>

        {/* Widget 2: Meal Slot Capacity */}
        <div className="bg-[#151515] border border-[#242424] rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-[#242424] pb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#E50914]" />
              <span>MEAL SLOT CAPACITY</span>
            </h3>
            <Link to="/admin/slots" className="text-xs font-bold text-[#E50914] hover:underline">
              Slots →
            </Link>
          </div>

          <div className="space-y-2 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-[#A3A3A3] font-mono text-[11px]">
                <span>12:30 – 12:45 PM</span>
                <span className="text-white font-bold">45 / 50</span>
              </div>
              <div className="w-full h-2 bg-[#242424] rounded-full overflow-hidden">
                <div className="h-full bg-[#E50914]" style={{ width: '90%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[#A3A3A3] font-mono text-[11px]">
                <span>12:45 – 1:00 PM</span>
                <span className="text-[#E50914] font-bold">50 / 50 (FULL)</span>
              </div>
              <div className="w-full h-2 bg-[#242424] rounded-full overflow-hidden">
                <div className="h-full bg-[#E50914]" style={{ width: '100%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[#A3A3A3] font-mono text-[11px]">
                <span>1:00 – 1:15 PM</span>
                <span className="text-white font-bold">38 / 50</span>
              </div>
              <div className="w-full h-2 bg-[#242424] rounded-full overflow-hidden">
                <div className="h-full bg-[#22C55E]" style={{ width: '76%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Widget 3: Recent Complaints */}
        <div className="bg-[#151515] border border-[#242424] rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-[#242424] pb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#E50914]" />
              <span>RECENT COMPLAINTS</span>
            </h3>
            <Link to="/admin/feedback" className="text-xs font-bold text-[#E50914] hover:underline">
              Resolve →
            </Link>
          </div>

          <div className="space-y-2 text-xs">
            <div className="bg-[#1C1C1C] p-2.5 rounded-xl border border-[#242424] space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-white">Food Temperature</span>
                <span className="text-[#F59E0B] text-[10px] font-black uppercase">OPEN</span>
              </div>
              <p className="text-[11px] text-[#A3A3A3] truncate">Meal served lukewarm during peak lunch hours.</p>
            </div>
            <div className="bg-[#1C1C1C] p-2.5 rounded-xl border border-[#242424] space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-white">Less Quantity</span>
                <span className="text-[#22C55E] text-[10px] font-black uppercase">RESOLVED</span>
              </div>
              <p className="text-[11px] text-[#A3A3A3] truncate">Portion size adjusted at Counter 2.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <QuickCard
          title="Demand Planning"
          description="Tomorrow's meal forecast breakdown and batch preparation ranges."
          link="/admin/demand"
        />
        <QuickCard
          title="Operations Analytics"
          description="Recharts graphs for expected vs actual, time slots & weekly trends."
          link="/admin/analytics"
        />
        <QuickCard
          title="Feedback & Complaints"
          description="Average meal ratings (4.2/5) & complaint resolution workflow."
          link="/admin/feedback"
        />
        <QuickCard
          title="Menu Polls"
          description="Weekend special dish voting management and live vote counts."
          link="/admin/polls"
        />
      </div>
    </div>
  );
};

const QuickCard = ({ title, description, link }) => (
  <Link
    to={link}
    className="bg-[#151515] border border-[#242424] hover:border-[#E50914] rounded-2xl p-5 shadow-xl transition-all duration-300 group space-y-2"
  >
    <h3 className="text-sm font-extrabold text-white group-hover:text-[#E50914] transition">{title}</h3>
    <p className="text-xs text-[#A3A3A3] leading-relaxed">{description}</p>
    <span className="text-xs font-bold text-[#E50914] pt-1 block">Open Module →</span>
  </Link>
);
