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
      className="bg-[#141414] border border-[#222222] hover:border-[#7F1D1D] rounded-3xl p-5 shadow-xl transition space-y-4"
    >
      {/* Order Header */}
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-mono font-black text-[#FF2B2B] block">
            #{order.orderNumber}
          </span>
          <h4 className="text-sm font-black text-white mt-0.5">
            {order.student?.user?.name || 'Student'}
          </h4>
          <span className="text-[11px] text-[#737373] font-medium block">
            {order.student?.studentIdStr} • {order.student?.hostel || 'Hostel'}
          </span>
        </div>
        <div className="text-right">
          <StatusBadge status={order.status} />
          <span className="text-[10px] text-[#737373] flex items-center gap-1 mt-1 justify-end font-mono">
            <Clock className="w-3 h-3 text-[#E50914]" /> {formatShortTime(order.createdAt)}
          </span>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-1.5 p-3.5 bg-[#0A0A0A] rounded-2xl border border-[#1F1F1F]">
        {order.orderItems?.map((item) => (
          <div key={item.id} className="flex justify-between items-center text-xs font-bold text-white">
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-lg bg-[#330808] text-[#FF2B2B] border border-[#7F1D1D] flex items-center justify-center font-black text-[10px] font-mono">
                {item.quantity}x
              </span>
              <span>{item.itemName}</span>
            </span>
            <span className="text-[#888888] font-mono">{formatCredits(item.subtotal)}</span>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#1F1F1F]">
        <div>
          <span className="text-[10px] text-[#666666] uppercase tracking-wider block font-bold">Total Credits</span>
          <span className="text-xs font-black text-white font-mono">{formatCredits(order.totalCredits)}</span>
        </div>

        {/* Red Action Buttons */}
        <div className="flex gap-2">
          {order.status === 'PENDING' && (
            <>
              <button
                type="button"
                onClick={() => onUpdateStatus(order.id, 'CANCELLED')}
                className="px-3 py-2 text-xs font-black text-[#FF4D4D] bg-[#2B0808] border border-[#7F1D1D] hover:bg-[#E50914] hover:text-white rounded-xl transition flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> REJECT
              </button>
              <button
                type="button"
                onClick={() => onUpdateStatus(order.id, 'ACCEPTED')}
                className="px-3 py-2 text-xs font-black text-white bg-[#E50914] hover:bg-[#FF2B2B] rounded-xl transition flex items-center gap-1 btn-red-glow"
              >
                <Check className="w-3.5 h-3.5" /> ACCEPT
              </button>
            </>
          )}

          {order.status === 'ACCEPTED' && (
            <button
              type="button"
              onClick={() => onUpdateStatus(order.id, 'PREPARING')}
              className="px-3.5 py-2 text-xs font-black text-white bg-[#E50914] hover:bg-[#FF2B2B] rounded-xl transition flex items-center gap-1 btn-red-glow"
            >
              <span>START PREPARING</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          {order.status === 'PREPARING' && (
            <button
              type="button"
              onClick={() => onUpdateStatus(order.id, 'READY')}
              className="px-3.5 py-2 text-xs font-black text-white bg-[#E50914] hover:bg-[#FF2B2B] rounded-xl transition flex items-center gap-1 btn-red-glow"
            >
              <span>MARK READY</span>
              <Check className="w-3.5 h-3.5" />
            </button>
          )}

          {order.status === 'READY' && (
            <button
              type="button"
              onClick={() => onUpdateStatus(order.id, 'COMPLETED')}
              className="px-3.5 py-2 text-xs font-black text-white bg-[#22C55E] hover:bg-[#16a34a] rounded-xl transition flex items-center gap-1 shadow-lg shadow-[#22C55E]/20"
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

