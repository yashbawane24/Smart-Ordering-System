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
      cell: (row) => <span className="font-mono font-black text-white">#{row.orderNumber}</span>
    },
    {
      header: 'Date & Time',
      accessor: 'createdAt',
      cell: (row) => <span className="text-xs text-[#8E8E93] font-medium">{formatDate(row.createdAt)}</span>
    },
    {
      header: 'Items',
      cell: (row) => (
        <span className="text-xs font-bold text-white">
          {row.orderItems?.map(i => `${i.quantity}x ${i.itemName}`).join(', ')}
        </span>
      )
    },
    {
      header: 'Total Credits',
      accessor: 'totalCredits',
      cell: (row) => <span className="font-black text-white font-mono">{formatCredits(row.totalCredits)}</span>
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
          className="px-3 py-1.5 text-xs font-extrabold text-white bg-[#1A1A1A] hover:bg-[#FF3B30] border border-[#333333] hover:border-[#FF3B30] rounded-full transition flex items-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5" /> Invoice
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 max-w-[1250px] mx-auto pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Order History</h1>
          <p className="text-xs font-bold text-[#FF3B30]">View past mess orders & printable receipt invoices.</p>
        </div>

        {/* Segmented Status Pill Filter */}
        <div className="flex items-center gap-1 bg-[#1A1A1A] border border-[#2D2D2D] p-1 rounded-full">
          {['ALL', 'COMPLETED', 'PENDING', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-[11px] font-extrabold rounded-full transition-all duration-300 ${
                statusFilter === st
                  ? 'btn-red-pill text-white'
                  : 'text-[#8E8E93] hover:text-white'
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
        <div className="bg-[#222222] border border-[#2D2D2D] rounded-[24px] p-4 shadow-2xl overflow-hidden">
          <DataTable columns={columns} data={orders} searchPlaceholder="Search order number or item..." pageSize={10} />
        </div>
      )}

      {/* Invoice Modal */}
      <InvoiceModal isOpen={isInvoiceOpen} onClose={() => setIsInvoiceOpen(false)} order={selectedOrder} />
    </div>
  );
};

