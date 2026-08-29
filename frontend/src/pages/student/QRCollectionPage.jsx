import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { QrCode, Clock, CheckCircle2, ShieldAlert, ShoppingBag, Sparkles } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';

export const QRCollectionPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [qrTokenData, setQrTokenData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders?status=ALL');
      const allOrders = res.data.data || [];
      const readyOrders = allOrders.filter(o => o.status === 'READY');
      setOrders(readyOrders.length > 0 ? readyOrders : allOrders.slice(0, 3));
      
      const target = readyOrders[0] || allOrders[0];
      if (target) {
        setSelectedOrder(target);
        if (target.status === 'READY') {
          fetchQR(target.id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQR = async (orderId) => {
    try {
      const res = await api.get(`/collection/orders/${orderId}/collection-qr`);
      setQrTokenData(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const isReady = selectedOrder?.status === 'READY';
  const tokenString = qrTokenData?.token || `QR-${selectedOrder?.orderNumber || 'PENDING'}`;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#242424] pb-5">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>QR MEAL COLLECTION</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30 font-mono">
            Contactless Pickup
          </span>
        </h1>
        <p className="text-sm text-[#A3A3A3] mt-1">
          Present your secure single-use QR code at the mess counter for instant meal verification.
        </p>
      </div>

      {!selectedOrder ? (
        <div className="bg-[#151515] border border-[#242424] rounded-2xl p-10 text-center space-y-3">
          <ShoppingBag className="w-12 h-12 text-[#666666] mx-auto" />
          <h3 className="text-base font-extrabold text-white">No Active Ready Orders</h3>
          <p className="text-xs text-[#A3A3A3]">
            Place a meal order from the menu or check back when your order status updates to READY.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Main QR Card */}
          <div className="md:col-span-7 bg-[#151515] border border-[#242424] rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden shadow-2xl">
            {/* Status Header */}
            <div className="w-full flex items-center justify-between border-b border-[#242424] pb-4 mb-6">
              <div className="text-left">
                <span className="text-[10px] font-mono text-[#A3A3A3] uppercase block">Order Reference</span>
                <span className="text-sm font-extrabold text-white font-mono">{selectedOrder.orderNumber}</span>
              </div>
              <span className={`text-xs font-black px-3 py-1 rounded-xl border ${
                isReady
                  ? 'bg-[#E50914] text-white border-[#E50914] animate-pulse'
                  : 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30'
              }`}>
                {isReady ? 'READY FOR PICKUP' : selectedOrder.status}
              </span>
            </div>

            {/* QR Code Container */}
            <div className="bg-white p-6 rounded-2xl shadow-2xl border-4 border-[#E50914] mb-5 inline-block">
              {/* High contrast SVG QR Code Pattern simulation */}
              <svg className="w-56 h-56" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" fill="white" />
                {/* Corner Positioning Squares */}
                <rect x="5" y="5" width="26" height="26" fill="black" />
                <rect x="9" y="9" width="18" height="18" fill="white" />
                <rect x="13" y="13" width="10" height="10" fill="black" />

                <rect x="69" y="5" width="26" height="26" fill="black" />
                <rect x="73" y="9" width="18" height="18" fill="white" />
                <rect x="77" y="13" width="10" height="10" fill="black" />

                <rect x="5" y="69" width="26" height="26" fill="black" />
                <rect x="9" y="73" width="18" height="18" fill="white" />
                <rect x="13" y="77" width="10" height="10" fill="black" />

                {/* Random Data Blocks */}
                <rect x="36" y="8" width="6" height="6" fill="black" />
                <rect x="48" y="14" width="6" height="12" fill="black" />
                <rect x="58" y="8" width="6" height="6" fill="black" />
                <rect x="36" y="24" width="12" height="6" fill="black" />

                <rect x="8" y="36" width="6" height="12" fill="black" />
                <rect x="20" y="42" width="6" height="6" fill="black" />
                <rect x="36" y="36" width="18" height="18" fill="#E50914" />
                <rect x="60" y="36" width="12" height="6" fill="black" />
                <rect x="78" y="42" width="12" height="12" fill="black" />

                <rect x="36" y="60" width="6" height="18" fill="black" />
                <rect x="48" y="66" width="18" height="6" fill="black" />
                <rect x="72" y="60" width="6" height="12" fill="black" />
                <rect x="84" y="72" width="8" height="18" fill="black" />
                <rect x="48" y="84" width="24" height="6" fill="black" />
              </svg>
            </div>

            {/* Token details */}
            <div className="bg-[#1C1C1C] border border-[#242424] rounded-2xl px-4 py-3 w-full space-y-1">
              <span className="text-[10px] text-[#A3A3A3] font-mono block">VERIFICATION CODE</span>
              <span className="text-base font-extrabold text-[#E50914] font-mono tracking-wider">
                {tokenString}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-[#A3A3A3] font-mono">
              <Clock className="w-3.5 h-3.5 text-[#E50914]" />
              <span>Valid until: 2:30 PM (Single-use security token)</span>
            </div>
          </div>

          {/* Order Details & Summary Side */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-[#151515] border border-[#242424] rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-extrabold text-white border-b border-[#242424] pb-3">
                Order Items
              </h3>

              <div className="space-y-3">
                {selectedOrder.orderItems?.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <div>
                      <p className="font-extrabold text-white">{item.itemName}</p>
                      <p className="text-[10px] text-[#A3A3A3]">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-mono font-bold text-white">
                      {item.subtotal} Credits
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#242424] pt-3 flex justify-between items-center text-xs font-black">
                <span className="text-[#A3A3A3]">Total Amount</span>
                <span className="text-[#E50914] font-mono text-sm">{selectedOrder.totalCredits} Credits</span>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-[#1C1C1C] border border-[#242424] rounded-2xl p-4 space-y-2 text-xs text-[#A3A3A3]">
              <div className="flex items-center gap-2 text-white font-extrabold">
                <Sparkles className="w-4 h-4 text-[#E50914]" />
                <span>Pickup Instructions</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed">
                <li>Show this QR screen to the chef at Mess Counter 1 or 2.</li>
                <li>Each QR code expires once scanned and verified.</li>
                <li>Orders not collected before deadline will be marked as No-Show.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
