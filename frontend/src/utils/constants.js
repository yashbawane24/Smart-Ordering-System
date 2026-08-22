export const MENU_CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Beverages', 'Snacks'];

export const ORDER_STATUS_CONFIG = {
  PENDING: { label: 'Pending', color: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20', step: 1 },
  ACCEPTED: { label: 'Accepted', color: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20', step: 2 },
  PREPARING: { label: 'Preparing', color: 'bg-[#450A0A] text-[#FF2D2D] border-[#7F1D1D]', step: 3 },
  READY: { label: 'Ready for Pickup', color: 'bg-[#E50914] text-white border-[#E50914]', step: 4 },
  COMPLETED: { label: 'Completed', color: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20', step: 5 },
  CANCELLED: { label: 'Cancelled', color: 'bg-[#450A0A] text-[#EF4444] border-[#EF4444]/30', step: 0 }
};

export const TRANSACTION_TYPE_LABELS = {
  MONTHLY_ALLOCATION: { label: 'Monthly Credit Grant', isPositive: true },
  ORDER_PAYMENT: { label: 'Food Order Payment', isPositive: false },
  REFUND: { label: 'Order Cancellation Refund', isPositive: true },
  ADMIN_ADJUSTMENT: { label: 'Admin Adjustment', isPositive: true }
};
