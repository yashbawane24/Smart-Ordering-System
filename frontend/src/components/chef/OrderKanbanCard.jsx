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
      className="bg-[#222222] border border-[#2D2D2D] hover:border-[#FF3B30] rounded-[24px] p-5 shadow-2xl transition space-y-4"
    >
      {/* Order Header */}
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-mono font-black text-white block">
            #{order.orderNumber}
          </span>
          <h4 className="text-sm font-black text-white mt-0.5">
            {order.student?.user?.name || 'Student'}
          </h4>
          <span className="text-[11px] text-[#8E8E93] font-semibold block">
            {order.student?.studentIdStr} • {order.student?.hostel || 'Hostel'}
          </span>
        </div>
        <div className="text-right">
          <StatusBadge status={order.status} />
          <span className="text-[10px] text-[#8E8E93] flex items-center gap-1 mt-1 justify-end font-mono font-bold">
            <Clock className="w-3 h-3 text-[#FF3B30]" /> {formatShortTime(order.createdAt)}
          </span>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-1.5 p-3.5 bg-[#1A1A1A] rounded-2xl border border-[#2D2D2D]">
        {order.orderItems?.map((item) => (
          <div key={item.id} className="flex justify-between items-center text-xs font-bold text-white">
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#FF3B30] text-white flex items-center justify-center font-black text-[10px] font-mono">
                {item.quantity}x
              </span>
              <span>{item.itemName}</span>
            </span>
            <span className="text-[#8E8E93] font-mono">{formatCredits(item.subtotal)}</span>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#2D2D2D]">
        <div>
          <span className="text-[10px] text-[#8E8E93] uppercase tracking-wider block font-black">TOTAL</span>
          <span className="text-xs font-black text-white font-mono">{formatCredits(order.totalCredits)}</span>
        </div>

        {/* Red Action Buttons */}
        <div className="flex gap-2">
          {order.status === 'PENDING' && (
            <>
              <button
                type="button"
                onClick={() => onUpdateStatus(order.id, 'CANCELLED')}
                className="px-3 py-1.5 text-xs font-black text-white bg-[#1C1C1C] hover:bg-[#FF3B30] rounded-full border border-[#333333] transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onUpdateStatus(order.id, 'ACCEPTED')}
                className="btn-red-pill px-4 py-2 text-xs font-black uppercase text-white tracking-wider"
              >
                ACCEPT
              </button>
            </>
          )}

          {order.status === 'ACCEPTED' && (
            <button
              type="button"
              onClick={() => onUpdateStatus(order.id, 'PREPARING')}
              className="btn-red-pill px-4 py-2 text-xs font-black uppercase text-white tracking-wider flex items-center gap-1"
            >
              <span>PREPARING</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          {order.status === 'PREPARING' && (
            <button
              type="button"
              onClick={() => onUpdateStatus(order.id, 'READY')}
              className="btn-red-pill px-4 py-2 text-xs font-black uppercase text-white tracking-wider flex items-center gap-1"
            >
              <span>MARK READY</span>
              <Check className="w-3.5 h-3.5" />
            </button>
          )}

          {order.status === 'READY' && (
            <button
              type="button"
              onClick={() => onUpdateStatus(order.id, 'COMPLETED')}
              className="px-4 py-2 text-xs font-black text-white bg-[#22C55E] hover:bg-[#16a34a] rounded-full transition flex items-center gap-1 shadow-lg"
            >
              <span>COMPLETE</span>
              <Check className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};


