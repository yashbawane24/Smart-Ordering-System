import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { formatCredits, formatDate } from '../../utils/formatters';

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      const res = await api.get(`/admin/orders?${params.toString()}`);
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
  }, [statusFilter]);

  const columns = [
    {
      header: 'Order ID',
      accessor: 'orderNumber',
      cell: (row) => <span className="font-mono font-bold text-[#E50914]">#{row.orderNumber}</span>
    },
    {
      header: 'Student',
      cell: (row) => (
        <div>
          <span className="font-bold text-white block">{row.student?.user?.name}</span>
          <span className="text-xs font-mono text-[#A3A3A3]">{row.student?.studentIdStr}</span>
        </div>
      )
    },
    {
      header: 'Items Ordered',
      cell: (row) => (
        <span className="text-xs font-medium text-white">
          {row.orderItems?.map(i => `${i.quantity}x ${i.itemName}`).join(', ')}
        </span>
      )
    },
    {
      header: 'Total Credits',
      accessor: 'totalCredits',
      cell: (row) => <span className="font-extrabold text-[#E50914]">{formatCredits(row.totalCredits)}</span>
    },
    {
      header: 'Status',
      cell: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Date & Time',
      accessor: 'createdAt',
      cell: (row) => <span className="text-xs text-[#737373]">{formatDate(row.createdAt)}</span>
    }
  ];

  if (loading) return <SkeletonLoader count={5} type="table" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">All System Orders</h1>
          <p className="text-xs sm:text-sm text-[#A3A3A3]">Audit all student orders across all statuses in real time.</p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-[#111111] border border-[#242424] p-1.5 rounded-xl">
          {['ALL', 'PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                statusFilter === st ? 'bg-[#E50914] text-white shadow-sm' : 'text-[#A3A3A3] hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <DataTable columns={columns} data={orders} searchPlaceholder="Search order ID, student name..." pageSize={10} />
    </div>
  );
};
