import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { OrderKanbanCard } from '../../components/chef/OrderKanbanCard';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { Clock, Utensils, CheckSquare, ChefHat, RefreshCw, QrCode, TrendingUp, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ChefDashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChefOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/chef/orders');
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch chef orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChefOrders();
    const interval = setInterval(fetchChefOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await api.patch(`/chef/orders/${orderId}/status`, { status: newStatus });
      if (res.success) {
        fetchChefOrders();
      }
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'PENDING');
  const preparingOrders = orders.filter(o => o.status === 'PREPARING' || o.status === 'ACCEPTED');
  const readyOrders = orders.filter(o => o.status === 'READY');
  const completedToday = orders.filter(o => o.status === 'COLLECTED' || o.status === 'COMPLETED');

  if (loading) return <SkeletonLoader count={4} type="card" />;

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#242424] pb-5">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#E50914] flex items-center gap-1.5">
            <ChefHat className="w-4 h-4" /> Mess Kitchen Display System (KDS)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Kitchen Operations & Meal Queue
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/chef/verify-qr"
            className="px-4 py-2 text-xs font-black text-white bg-[#E50914] hover:bg-[#B91C1C] rounded-xl transition flex items-center gap-2 shadow-md shadow-[#E50914]/20"
          >
            <QrCode className="w-4 h-4" /> Verify QR
          </Link>
          <Link
            to="/chef/demand"
            className="px-4 py-2 text-xs font-black text-white bg-[#1C1C1C] hover:bg-[#252525] border border-[#242424] rounded-xl transition flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4 text-[#E50914]" /> Demand Planning
          </Link>
          <button
            onClick={fetchChefOrders}
            className="p-2 text-xs font-bold text-[#8E8E93] hover:text-white bg-[#1C1C1C] rounded-xl border border-[#242424]"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Institutional Demand & Current Slot Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Today's Demand Card */}
        <div className="bg-[#151515] border border-[#242424] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-[#A3A3A3] uppercase tracking-wider">TODAY'S MEAL DEMAND</h3>
            <span className="text-[10px] text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded font-mono font-bold">Confirmed</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
            <div className="bg-[#1C1C1C] p-2 rounded-xl border border-[#242424]">
              <span className="text-[10px] text-[#A3A3A3] block">Breakfast</span>
              <span className="font-extrabold text-white font-mono text-sm">350</span>
            </div>
            <div className="bg-[#1C1C1C] p-2 rounded-xl border border-[#242424]">
              <span className="text-[10px] text-[#A3A3A3] block">Lunch</span>
              <span className="font-extrabold text-[#E50914] font-mono text-sm">438</span>
            </div>
            <div className="bg-[#1C1C1C] p-2 rounded-xl border border-[#242424]">
              <span className="text-[10px] text-[#A3A3A3] block">Dinner</span>
              <span className="font-extrabold text-white font-mono text-sm">400</span>
            </div>
          </div>
        </div>

        {/* Current Slot Card */}
        <div className="bg-[#151515] border border-[#242424] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-[#A3A3A3] uppercase tracking-wider">CURRENT PICKUP SLOT</h3>
            <span className="text-[10px] text-[#E50914] font-mono font-bold">12:45 – 1:00 PM</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
            <div className="bg-[#1C1C1C] p-2 rounded-xl border border-[#242424]">
              <span className="text-[10px] text-[#A3A3A3] block">Expected</span>
              <span className="font-extrabold text-white font-mono text-sm">50</span>
            </div>
            <div className="bg-[#1C1C1C] p-2 rounded-xl border border-[#242424]">
              <span className="text-[10px] text-[#A3A3A3] block">Ready</span>
              <span className="font-extrabold text-[#F59E0B] font-mono text-sm">42</span>
            </div>
            <div className="bg-[#1C1C1C] p-2 rounded-xl border border-[#242424]">
              <span className="text-[10px] text-[#A3A3A3] block">Collected</span>
              <span className="font-extrabold text-[#22C55E] font-mono text-sm">35</span>
            </div>
          </div>
        </div>

        {/* Kitchen Status Metrics */}
        <div className="bg-[#151515] border border-[#242424] rounded-2xl p-5 flex items-center justify-around">
          <div className="text-center">
            <span className="text-[10px] text-[#A3A3A3] uppercase tracking-wider block font-extrabold">IN QUEUE</span>
            <span className="text-2xl font-black text-[#E50914] font-mono">{pendingOrders.length}</span>
          </div>
          <div className="w-[1px] h-10 bg-[#242424]" />
          <div className="text-center">
            <span className="text-[10px] text-[#A3A3A3] uppercase tracking-wider block font-extrabold">PREPARING</span>
            <span className="text-2xl font-black text-[#F59E0B] font-mono">{preparingOrders.length}</span>
          </div>
          <div className="w-[1px] h-10 bg-[#242424]" />
          <div className="text-center">
            <span className="text-[10px] text-[#A3A3A3] uppercase tracking-wider block font-extrabold">READY</span>
            <span className="text-2xl font-black text-[#22C55E] font-mono">{readyOrders.length}</span>
          </div>
        </div>
      </div>

      {/* Actionable Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#242424]">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E50914]" /> New Orders ({pendingOrders.length})
            </h3>
          </div>
          {pendingOrders.length > 0 ? (
            pendingOrders.map(o => <OrderKanbanCard key={o.id} order={o} onUpdateStatus={handleUpdateStatus} />)
          ) : (
            <div className="p-8 text-center text-xs text-[#737373] bg-[#151515] rounded-2xl border border-[#242424]">
              No new incoming orders.
            </div>
          )}
        </div>

        {/* Preparing Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#242424]">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /> Preparing ({preparingOrders.length})
            </h3>
          </div>
          {preparingOrders.length > 0 ? (
            preparingOrders.map(o => <OrderKanbanCard key={o.id} order={o} onUpdateStatus={handleUpdateStatus} />)
          ) : (
            <div className="p-8 text-center text-xs text-[#737373] bg-[#151515] rounded-2xl border border-[#242424]">
              No orders in preparation.
            </div>
          )}
        </div>

        {/* Ready Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#242424]">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" /> Ready for Collection ({readyOrders.length})
            </h3>
          </div>
          {readyOrders.length > 0 ? (
            readyOrders.map(o => <OrderKanbanCard key={o.id} order={o} onUpdateStatus={handleUpdateStatus} />)
          ) : (
            <div className="p-8 text-center text-xs text-[#737373] bg-[#151515] rounded-2xl border border-[#242424]">
              No orders ready for pickup.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
