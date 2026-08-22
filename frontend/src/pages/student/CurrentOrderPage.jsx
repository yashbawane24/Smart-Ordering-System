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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Live Order Tracking</h1>
          <p className="text-xs sm:text-sm text-[#A3A3A3]">Track kitchen preparation progress and pickup alerts in real time.</p>
        </div>
        <button
          onClick={fetchOrders}
          className="p-2 text-xs font-semibold text-[#FF2D2D] hover:bg-[#450A0A] rounded-lg transition flex items-center gap-1.5 border border-[#7F1D1D]"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
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
          message="You don't have any orders currently being prepared by the kitchen."
          icon={Clock}
          actionLabel="Place an Order"
          onAction={() => navigate('/student/menu')}
        />
      )}
    </div>
  );
};
