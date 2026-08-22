import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { InvoiceModal } from '../../components/student/InvoiceModal';
import { formatCredits, formatDate } from '../../utils/formatters';
import { Eye } from 'lucide-react';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';

export const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      const res = await api.get(`/orders?${params.toString()}`);
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch order history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [statusFilter]);

  const columns = [
    {
      header: 'Order ID',
      accessor: 'orderNumber',
      cell: (row) => <span className="font-mono font-bold text-[#E50914]">#{row.orderNumber}</span>
    },
    {
      header: 'Date & Time',
      accessor: 'createdAt',
      cell: (row) => <span className="text-xs text-[#A3A3A3]">{formatDate(row.createdAt)}</span>
    },
    {
      header: 'Items',
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
      accessor: 'status',
      cell: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      cell: (row) => (
        <button
          onClick={() => {
            setSelectedOrder(row);
            setIsInvoiceOpen(true);
          }}
          className="px-3 py-1.5 text-xs font-bold text-white bg-[#151515] border border-[#242424] hover:border-[#7F1D1D] rounded-lg transition flex items-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5 text-[#FF2D2D]" /> Invoice
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Order History</h1>
          <p className="text-xs sm:text-sm text-[#A3A3A3]">View complete past mess orders, timestamps, and printable invoices.</p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 bg-[#111111] border border-[#242424] p-1.5 rounded-xl">
          {['ALL', 'COMPLETED', 'PENDING', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                statusFilter === st
                  ? 'bg-[#E50914] text-white shadow-sm'
                  : 'text-[#A3A3A3] hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <SkeletonLoader count={5} type="table" />
      ) : (
        <DataTable columns={columns} data={orders} searchPlaceholder="Search order ID or item..." pageSize={10} />
      )}

      {/* Invoice Modal */}
      <InvoiceModal isOpen={isInvoiceOpen} onClose={() => setIsInvoiceOpen(false)} order={selectedOrder} />
    </div>
  );
};
