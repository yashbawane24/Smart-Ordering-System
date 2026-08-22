import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { OrderKanbanCard } from '../../components/chef/OrderKanbanCard';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { Clock, Utensils, CheckSquare, ChefHat, RefreshCw } from 'lucide-react';

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
  const completedToday = orders.filter(o => o.status === 'COMPLETED');

  if (loading) return <SkeletonLoader count={4} type="card" />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#E50914] flex items-center gap-1.5">
            <ChefHat className="w-4 h-4" /> Mess Kitchen Display System (KDS)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Kitchen Dashboard
          </h1>
        </div>

        <button
          onClick={fetchChefOrders}
          className="px-4 py-2 text-xs font-bold text-white bg-[#E50914] hover:bg-[#FF2D2D] rounded-lg transition flex items-center gap-2 shadow-md shadow-[#E50914]/20"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Kitchen Queue
        </button>
      </div>

      {/* Metrics Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Widget title="New Orders" value={pendingOrders.length < 10 ? `0${pendingOrders.length}` : pendingOrders.length} icon={Clock} color="red" />
        <Widget title="Preparing" value={preparingOrders.length < 10 ? `0${preparingOrders.length}` : preparingOrders.length} icon={Utensils} color="red" />
        <Widget title="Ready" value={readyOrders.length < 10 ? `0${readyOrders.length}` : readyOrders.length} icon={CheckSquare} color="red" />
        <Widget title="Completed" value={completedToday.length < 10 ? `0${completedToday.length}` : completedToday.length} icon={CheckSquare} color="dark" />
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
            <div className="p-8 text-center text-xs text-[#737373] bg-[#111111] rounded-2xl border border-[#242424]">
              No new incoming orders.
            </div>
          )}
        </div>

        {/* Preparing Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#242424]">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF2D2D]" /> Preparing ({preparingOrders.length})
            </h3>
          </div>
          {preparingOrders.length > 0 ? (
            preparingOrders.map(o => <OrderKanbanCard key={o.id} order={o} onUpdateStatus={handleUpdateStatus} />)
          ) : (
            <div className="p-8 text-center text-xs text-[#737373] bg-[#111111] rounded-2xl border border-[#242424]">
              No orders in preparation.
            </div>
          )}
        </div>

        {/* Ready Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#242424]">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" /> Ready for Pickup ({readyOrders.length})
            </h3>
          </div>
          {readyOrders.length > 0 ? (
            readyOrders.map(o => <OrderKanbanCard key={o.id} order={o} onUpdateStatus={handleUpdateStatus} />)
          ) : (
            <div className="p-8 text-center text-xs text-[#737373] bg-[#111111] rounded-2xl border border-[#242424]">
              No orders ready for pickup.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Widget = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-[#111111] border border-[#242424] hover:border-[#7F1D1D] rounded-2xl p-5 shadow-sm flex items-center justify-between transition">
      <div>
        <span className="text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider block">{title}</span>
        <h3 className="text-2xl font-extrabold text-[#E50914] mt-1">{value}</h3>
      </div>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#450A0A] border border-[#7F1D1D] text-[#FF2D2D]">
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};
