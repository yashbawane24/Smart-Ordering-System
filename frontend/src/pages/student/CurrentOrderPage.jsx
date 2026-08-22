import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { OrderProgressWidget } from '../../components/student/OrderProgressWidget';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { EmptyState } from '../../components/common/EmptyState';
import { Clock, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CurrentOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch current order:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      const res = await api.patch(`/orders/${orderId}/cancel`);
      if (res.success) {
        fetchOrders();
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel order.');
    }
  };

  const activeOrders = orders.filter(o => ['PENDING', 'ACCEPTED', 'PREPARING', 'READY'].includes(o.status));

  return (
    <div className="space-y-6 max-w-[1250px] mx-auto pb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Live Order Tracking</h1>
          <p className="text-xs font-bold text-[#FF3B30]">Real-time kitchen preparation status & progress alerts.</p>
        </div>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 text-xs font-extrabold bg-[#222222] hover:bg-[#FF3B30] text-white rounded-full transition border border-[#333333] hover:border-[#FF3B30] flex items-center gap-1.5 shadow-lg"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Status
        </button>
      </div>

      {loading ? (
        <SkeletonLoader count={2} type="card" />
      ) : activeOrders.length > 0 ? (
        <div className="space-y-6">
          {activeOrders.map((order) => (
            <OrderProgressWidget key={order.id} order={order} onCancel={handleCancelOrder} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Active Orders"
          message="You don't have any orders currently being prepared by the mess kitchen."
          icon={Clock}
          actionLabel="Place an Order"
          onAction={() => navigate('/student/menu')}
        />
      )}
    </div>
  );
};

