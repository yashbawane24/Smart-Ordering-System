import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { OrderKanbanCard } from '../../components/chef/OrderKanbanCard';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { EmptyState } from '../../components/common/EmptyState';
import { Clock } from 'lucide-react';

export const ChefFilteredOrdersPage = ({ targetStatus, title, description }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/chef/orders?status=${targetStatus}`);
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [targetStatus]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await api.patch(`/chef/orders/${orderId}/status`, { status: newStatus });
      if (res.success) {
        fetchOrders();
      }
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  if (loading) return <SkeletonLoader count={3} type="card" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">{title}</h1>
        <p className="text-xs sm:text-sm text-slate-400">{description}</p>
      </div>

      {orders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map(o => (
            <OrderKanbanCard key={o.id} order={o} onUpdateStatus={handleUpdateStatus} />
          ))}
        </div>
      ) : (
        <EmptyState title="No Orders in Queue" message={`There are currently no orders in ${title} status.`} icon={Clock} />
      )}
    </div>
  );
};
