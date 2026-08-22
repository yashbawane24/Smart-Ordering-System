import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { formatCredits } from '../../utils/formatters';
import { EmptyState } from '../../components/common/EmptyState';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, MapPin, Clock, Edit2, AlertCircle } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, totalCredits } = useCart();
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [orderType, setOrderType] = useState('DELIVERY');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await api.get('/credits');
        if (res.success) {
          setWallet(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch wallet:', err);
      }
    };
    fetchWallet();
  }, []);

  const currentCredits = wallet?.remainingCredit || 8700;
  const deliveryFee = orderType === 'DELIVERY' ? 10 : 0;
  const grandTotal = totalCredits + deliveryFee;
  const remainingAfterOrder = currentCredits - grandTotal;
  const isInsufficient = remainingAfterOrder < 0;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim()) setPromoApplied(true);
  };

  const handleConfirmOrder = async () => {
    if (!cart || cart.length === 0) return;
    if (isInsufficient) {
      setError(`Insufficient credit balance. You need ${Math.abs(remainingAfterOrder)} more credits.`);
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const res = await api.post('/orders', { items: cart, orderType });
      if (res.success) {
        clearCart();
        navigate('/student/current-order');
      }
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <EmptyState
        title="Your Shopping Cart is Empty"
        message="Browse our mess menu and select your favorite dishes to build your order."
        icon={ShoppingBag}
        actionLabel="Browse Menu"
        onAction={() => navigate('/student/menu')}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-[1250px] mx-auto pb-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Shopping Cart</h1>
          <p className="text-xs font-bold text-[#FF3B30]">Order ID: #1099</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-[#FF3B30] hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" /> Clear Cart
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-[#3D0A0A] border border-[#7F1D1D] rounded-2xl flex items-center gap-3 text-[#FF4D4D] text-xs font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Segmented Pill Control (Delivery / Dine in / Takeaway) */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#1A1A1A] rounded-full border border-[#2D2D2D] max-w-md">
            <button
              type="button"
              onClick={() => setOrderType('DELIVERY')}
              className={`py-2 text-[11px] font-extrabold rounded-full transition-all duration-300 ${
                orderType === 'DELIVERY' ? 'btn-red-pill text-white' : 'text-[#8E8E93] hover:text-white'
              }`}
            >
              Delivery
            </button>
            <button
              type="button"
              onClick={() => setOrderType('DINE_IN')}
              className={`py-2 text-[11px] font-extrabold rounded-full transition-all duration-300 ${
                orderType === 'DINE_IN' ? 'btn-red-pill text-white' : 'text-[#8E8E93] hover:text-white'
              }`}
            >
              Dine in
            </button>
            <button
              type="button"
              onClick={() => setOrderType('TAKEAWAY')}
              className={`py-2 text-[11px] font-extrabold rounded-full transition-all duration-300 ${
                orderType === 'TAKEAWAY' ? 'btn-red-pill text-white' : 'text-[#8E8E93] hover:text-white'
              }`}
            >
              Takeaway
            </button>
          </div>

          {/* Cart Item Cards (Reference UI styling with white circular edit buttons) */}
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.menuItemId || item.id}
                className="bg-[#222222] border border-[#2D2D2D] rounded-[24px] p-4 flex items-center justify-between gap-4 shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-[#333333] bg-[#1A1A1A]"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div>
                    <h4 className="font-extrabold text-white text-sm sm:text-base">{item.name}</h4>
                    <span className="text-xs text-[#8E8E93] block">{item.category}</span>
                    <span className="text-xs font-mono font-bold text-white mt-0.5 block">
                      {formatCredits(item.price)} each
                    </span>
                  </div>
                </div>

                {/* Quantity Controls & White Capsule Edit Icon */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#2D2D2D] rounded-full px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.menuItemId || item.id, item.quantity - 1)}
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[#8E8E93] hover:text-white"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-mono font-extrabold text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.menuItemId || item.id, item.quantity + 1)}
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[#8E8E93] hover:text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.menuItemId || item.id)}
                    className="w-9 h-9 rounded-full bg-white hover:bg-gray-200 text-black flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-md"
                    title="Remove item"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Ticket Notch Cutout Dashed Line */}
          <div className="relative my-6">
            <div className="border-t-2 border-dashed border-[#3A3A3A] w-full" />
            <div className="ticket-notch-left" />
            <div className="ticket-notch-right" />
          </div>

          {/* Promotion Code Form */}
          <form onSubmit={handleApplyPromo} className="relative flex items-center max-w-md">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Promotion Code"
              className="w-full pl-5 pr-28 py-3 text-xs bg-[#242424] text-white border border-[#333333] rounded-full focus:outline-none focus:border-[#FF3B30] placeholder-[#666666]"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-5 py-2 bg-[#2B2B2B] hover:bg-[#FF3B30] text-white text-[10px] font-black rounded-full uppercase tracking-wider transition-colors"
            >
              {promoApplied ? 'APPLIED' : 'TRYNEW'}
            </button>
          </form>

        </div>

        {/* Right Summary Box */}
        <div className="space-y-6">
          
          {/* Delivery Address Card */}
          <div className="bg-[#2B2B2B] rounded-[24px] p-5 border border-[#333333] space-y-2">
            <h4 className="text-[10px] font-black text-[#8E8E93] uppercase tracking-widest">
              DELIVERY ADDRESS
            </h4>
            <div className="flex items-start gap-2 text-xs font-bold text-white">
              <MapPin className="w-4 h-4 text-[#FF3B30] shrink-0 mt-0.5" />
              <span>Po. 1478, Street No. 52, West New York</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#8E8E93] font-semibold pt-1">
              <Clock className="w-3.5 h-3.5 text-[#8E8E93]" />
              <span>20 min prep time</span>
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="bg-[#222222] border border-[#2D2D2D] rounded-[28px] p-6 shadow-xl space-y-5">
            <h3 className="font-black text-white text-base tracking-tight">Order Summary</h3>

            <div className="space-y-2.5 text-xs font-bold text-[#8E8E93] border-b border-[#2D2D2D] pb-4">
              <div className="flex justify-between">
                <span>Sub Total</span>
                <span className="text-white font-mono">{formatCredits(totalCredits)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="text-white font-mono">{formatCredits(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-[#2D2D2D]">
                <span className="uppercase tracking-wider">TOTAL</span>
                <span className="text-white font-mono font-extrabold text-base">{formatCredits(grandTotal)}</span>
              </div>
            </div>

            {/* Confirm Order Pill CTA */}
            <button
              onClick={handleConfirmOrder}
              disabled={submitting || isInsufficient}
              className="w-full py-4 px-4 bg-[#1C1C1C] hover:bg-[#FF3B30] disabled:opacity-40 text-white font-black text-xs uppercase tracking-widest rounded-full transition-all duration-300 shadow-xl border border-[#333333] hover:border-[#FF3B30] flex items-center justify-center gap-2"
            >
              {submitting ? (
                <LoadingSpinner size="sm" className="border-white border-t-transparent" />
              ) : (
                <>
                  <span>CONFIRM ORDER</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

