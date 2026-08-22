import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Check, ChevronRight, X } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { formatShortTime, formatCredits } from '../../utils/formatters';

export const OrderKanbanCard = ({ order, onUpdateStatus }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111111] border border-[#242424] hover:border-[#7F1D1D] rounded-2xl p-5 shadow-sm hover:shadow-red-subtle transition space-y-4"
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-mono font-bold text-[#E50914] block">
            #{order.orderNumber}
          </span>
          <h4 className="text-sm font-bold text-white">
            {order.student?.user?.name || 'Student'}
          </h4>
          <span className="text-[11px] text-[#A3A3A3]">
            {order.student?.studentIdStr} • {order.student?.hostel || 'Hostel'}
          </span>
        </div>
        <div className="text-right">
          <StatusBadge status={order.status} />
          <span className="text-[10px] text-[#737373] flex items-center gap-1 mt-1 justify-end">
            <Clock className="w-3 h-3" /> {formatShortTime(order.createdAt)}
          </span>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-1.5 p-3 bg-[#0A0A0A] rounded-xl border border-[#1C1C1C]">
        {order.orderItems?.map((item) => (
          <div key={item.id} className="flex justify-between items-center text-xs font-semibold text-white">
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-[#450A0A] text-[#FF2D2D] border border-[#7F1D1D] flex items-center justify-center font-bold text-[10px]">
                {item.quantity}x
              </span>
              {item.itemName}
            </span>
            <span className="text-[#A3A3A3] font-mono">{formatCredits(item.subtotal)}</span>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#1C1C1C]">
        <span className="text-xs font-extrabold text-white">
          Total: {formatCredits(order.totalCredits)}
        </span>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {order.status === 'PENDING' && (
            <>
              <button
                onClick={() => onUpdateStatus(order.id, 'CANCELLED')}
                className="px-3 py-1.5 text-xs font-bold text-[#EF4444] bg-[#450A0A] border border-[#EF4444]/30 hover:bg-[#B91C1C] hover:text-white rounded-lg transition flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Reject
              </button>
              <button
                onClick={() => onUpdateStatus(order.id, 'ACCEPTED')}
                className="px-3 py-1.5 text-xs font-bold text-white bg-[#E50914] hover:bg-[#FF2D2D] rounded-lg transition flex items-center gap-1 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" /> Accept
              </button>
            </>
          )}

          {order.status === 'ACCEPTED' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'PREPARING')}
              className="px-3 py-1.5 text-xs font-bold text-white bg-[#E50914] hover:bg-[#FF2D2D] rounded-lg transition flex items-center gap-1 shadow-sm"
            >
              Start Preparing <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          {order.status === 'PREPARING' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'READY')}
              className="px-3 py-1.5 text-xs font-bold text-white bg-[#E50914] hover:bg-[#FF2D2D] rounded-lg transition flex items-center gap-1 shadow-sm"
            >
              Mark Ready <Check className="w-3.5 h-3.5" />
            </button>
          )}

          {order.status === 'READY' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'COMPLETED')}
              className="px-3 py-1.5 text-xs font-bold text-white bg-[#22C55E] hover:bg-[#16a34a] rounded-lg transition flex items-center gap-1 shadow-sm"
            >
              Mark Completed <Check className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
