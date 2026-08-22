import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, Utensils, ShoppingBag, XCircle } from 'lucide-react';
import { formatCredits, formatDate } from '../../utils/formatters';

const STAGES = [
  { key: 'PENDING', label: 'Order Placed', icon: Clock },
  { key: 'ACCEPTED', label: 'Accepted by Kitchen', icon: CheckCircle2 },
  { key: 'PREPARING', label: 'Preparing Food', icon: Utensils },
  { key: 'READY', label: 'Ready for Pickup', icon: ShoppingBag },
  { key: 'COMPLETED', label: 'Order Completed', icon: CheckCircle2 }
];

export const OrderProgressWidget = ({ order, onCancel }) => {
  if (!order) return null;

  const currentStageIndex = STAGES.findIndex(s => s.key === order.status);
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6 shadow-md space-y-6">
      {/* Order Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#242424] gap-2">
        <div>
          <span className="text-xs text-[#A3A3A3] font-semibold uppercase tracking-wider block">Active Order</span>
          <h3 className="text-lg font-extrabold text-white">{order.orderNumber}</h3>
          <p className="text-xs text-[#A3A3A3] mt-0.5">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-[#FF2D2D] bg-[#450A0A] border border-[#7F1D1D] px-3 py-1.5 rounded-lg">
            {formatCredits(order.totalCredits)}
          </span>
          {order.status === 'PENDING' && onCancel && (
            <button
              onClick={() => onCancel(order.id)}
              className="px-3 py-1.5 text-xs font-bold text-[#EF4444] bg-[#450A0A] hover:bg-[#B91C1C] hover:text-white border border-[#EF4444]/30 rounded-lg transition"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Cancelled Alert Banner */}
      {isCancelled ? (
        <div className="p-4 bg-[#450A0A] border border-[#EF4444]/30 rounded-xl flex items-center gap-3 text-[#EF4444]">
          <XCircle className="w-6 h-6 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-sm">Order Cancelled</h4>
            <p className="text-xs opacity-90">Credits have been refunded back to your wallet account.</p>
          </div>
        </div>
      ) : (
        /* Progress Timeline */
        <div className="py-2">
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
            {/* Background Line for Desktop */}
            <div className="hidden md:block absolute top-5 left-8 right-8 h-1 bg-[#242424] -z-0">
              <motion.div
                className="h-full bg-[#E50914] rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${(Math.max(0, currentStageIndex) / (STAGES.length - 1)) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>

            {STAGES.map((stage, idx) => {
              const Icon = stage.icon;
              const isPassed = currentStageIndex >= idx;
              const isCurrent = currentStageIndex === idx;

              return (
                <div key={stage.key} className="flex md:flex-col items-center gap-4 md:gap-2 z-10 w-full md:w-auto">
                  <motion.div
                    animate={{ scale: isCurrent ? 1.15 : 1 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      isPassed
                        ? 'bg-[#E50914] text-white shadow-lg shadow-[#E50914]/30 ring-4 ring-[#E50914]/20'
                        : 'bg-[#151515] text-[#737373] border border-[#242424]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  <div className="text-left md:text-center">
                    <p className={`text-xs font-bold ${isPassed ? 'text-white' : 'text-[#737373]'}`}>
                      {stage.label}
                    </p>
                    {isCurrent && (
                      <span className="text-[10px] text-[#FF2D2D] font-semibold animate-pulse block">
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Order Items Preview */}
      <div className="pt-4 border-t border-[#242424]">
        <h4 className="text-xs font-bold text-[#A3A3A3] uppercase tracking-wider mb-2">Order Summary</h4>
        <div className="space-y-1.5">
          {order.orderItems?.map((item) => (
            <div key={item.id} className="flex justify-between text-xs text-white font-medium">
              <span>{item.quantity}x {item.itemName}</span>
              <span className="font-mono text-[#A3A3A3]">{formatCredits(item.subtotal)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
