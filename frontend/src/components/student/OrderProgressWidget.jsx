import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, Utensils, ShoppingBag, XCircle, Check } from 'lucide-react';
import { formatCredits, formatDate } from '../../utils/formatters';

const PICKUP_STAGES = [
  { key: 'PENDING', label: 'Order Placed', icon: Clock },
  { key: 'ACCEPTED', label: 'Accepted by Kitchen', icon: CheckCircle2 },
  { key: 'PREPARING', label: 'Preparing Food', icon: Utensils },
  { key: 'READY', label: 'Ready for Pickup', icon: ShoppingBag },
  { key: 'COLLECTED', label: 'Order Collected', icon: CheckCircle2 }
];

const DELIVERY_STAGES = [
  { key: 'PENDING', label: 'Order Placed', icon: Clock },
  { key: 'ACCEPTED', label: 'Accepted by Kitchen', icon: CheckCircle2 },
  { key: 'PREPARING', label: 'Preparing Food', icon: Utensils },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: ShoppingBag },
  { key: 'DELIVERED', label: 'Delivered to Room', icon: CheckCircle2 }
];

export const OrderProgressWidget = ({ order, onCancel }) => {
  if (!order) return null;

  const isSickDelivery = order.fulfillmentType === 'SICK_DELIVERY';
  const STAGES = isSickDelivery ? DELIVERY_STAGES : PICKUP_STAGES;

  const currentStageIndex = STAGES.findIndex(s => s.key === order.status || s.key === order.deliveryStatus);
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="bg-[#141414] border border-[#222222] rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-6">
      {/* Order Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1F1F1F] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#737373] font-black uppercase tracking-widest block">ACTIVE TRACKING</span>
            {isSickDelivery ? (
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30 font-bold uppercase">
                ✓ Sick Delivery Approved ({order.deliveryHostel} {order.deliveryRoomNumber})
              </span>
            ) : (
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#242424] text-[#A3A3A3] font-bold uppercase">
                Counter Pickup
              </span>
            )}
          </div>
          <h3 className="text-xl font-black text-white font-mono tracking-tight mt-1">{order.orderNumber}</h3>
          <p className="text-xs text-[#888888] mt-0.5">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-black text-[#FF2B2B] bg-[#2E0808] border border-[#7F1D1D] px-3.5 py-1.5 rounded-xl font-mono">
            {formatCredits(order.totalCredits)}
          </span>
          {order.status === 'PENDING' && onCancel && (
            <button
              onClick={() => onCancel(order.id)}
              className="px-3.5 py-1.5 text-xs font-extrabold text-[#FF4D4D] bg-[#290808] hover:bg-[#E50914] hover:text-white border border-[#7F1D1D] rounded-xl transition-all"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Cancelled Alert Banner */}
      {isCancelled ? (
        <div className="p-4 bg-[#330808] border border-[#7F1D1D] rounded-2xl flex items-center gap-3 text-[#FF4D4D]">
          <XCircle className="w-6 h-6 shrink-0" />
          <div>
            <h4 className="font-extrabold text-sm">Order Cancelled</h4>
            <p className="text-xs text-[#A3A3A3]">Credits have been refunded back to your account.</p>
          </div>
        </div>
      ) : (
        /* Progress Timeline */
        <div className="py-3">
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
            {/* Background Line for Desktop */}
            <div className="hidden md:block absolute top-5 left-10 right-10 h-1 bg-[#222222] -z-0">
              <motion.div
                className="h-full bg-gradient-to-r from-[#B91C1C] via-[#E50914] to-[#FF2B2B] rounded-full"
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
                    className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      isCurrent
                        ? 'bg-[#E50914] text-white ring-4 ring-[#E50914]/40 shadow-lg shadow-[#E50914]/50 animate-pulse'
                        : isPassed
                        ? 'bg-[#B91C1C] text-white shadow-md'
                        : 'bg-[#181818] text-[#555555] border border-[#262626]'
                    }`}
                  >
                    {isPassed && !isCurrent ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </motion.div>
                  <div className="text-left md:text-center">
                    <p className={`text-xs font-bold ${isCurrent ? 'text-[#FF2B2B] font-extrabold' : isPassed ? 'text-white' : 'text-[#666666]'}`}>
                      {stage.label}
                    </p>
                    {isCurrent && (
                      <span className="text-[10px] text-[#FF2B2B] font-black uppercase tracking-wider block">
                        IN PROGRESS
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
      <div className="pt-4 border-t border-[#1F1F1F]">
        <h4 className="text-[10px] font-black text-[#737373] uppercase tracking-widest mb-2">Order Items</h4>
        <div className="space-y-1.5">
          {order.orderItems?.map((item) => (
            <div key={item.id} className="flex justify-between text-xs text-white font-semibold">
              <span>{item.quantity}× {item.itemName}</span>
              <span className="font-mono text-[#FF2B2B]">{formatCredits(item.subtotal)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

