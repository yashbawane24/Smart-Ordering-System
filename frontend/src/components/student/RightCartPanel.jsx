import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { formatCredits } from '../../utils/formatters';
import { ShoppingBag, Minus, Plus, Trash2, MapPin, Clock, Edit2, Tag, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RightCartPanel = ({ onOrderPlaced }) => {
  const { cart, updateQuantity, removeFromCart, clearCart, totalCredits, totalItemsCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState('DELIVERY'); // 'DELIVERY', 'DINE_IN', 'TAKEAWAY'
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const deliveryFee = orderType === 'DELIVERY' ? 10 : 0;
  const grandTotal = totalCredits + deliveryFee;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim()) {
      setPromoApplied(true);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setError('');
    setSubmitting(true);
    try {
      const orderItems = cart.map(item => ({
        menuItemId: item.menuItemId || item.id,
        quantity: item.quantity
      }));

      const res = await api.post('/orders', {
        items: orderItems,
        orderType: orderType,
        notes: `Placed via Dashboard (${orderType})`
      });

      if (res.success) {
        setSuccessMsg('Order placed successfully!');
        clearCart();
        if (onOrderPlaced) onOrderPlaced();
        setTimeout(() => {
          setSuccessMsg('');
          navigate('/student/current-order');
        }, 1200);
      }
    } catch (err) {
      setError(err.message || 'Failed to place order. Check credit balance.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <aside className="w-full lg:w-[350px] xl:w-[390px] bg-[#222222] border border-[#2D2D2D] rounded-[28px] p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden shrink-0">
      
      <div className="space-y-4">
        {/* Delivery Address Header Card (from reference image top) */}
        <div className="bg-[#2B2B2B] rounded-2xl p-4 border border-[#333333] space-y-2">
          <h4 className="text-[10px] font-black text-[#8E8E93] uppercase tracking-widest">
            DELIVERY ADDRESS
          </h4>
          <div className="flex items-start gap-2 text-xs font-bold text-white">
            <MapPin className="w-4 h-4 text-[#FF3B30] shrink-0 mt-0.5" />
            <span className="line-clamp-1">Po. 1478, Street No. 52, West New York</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#8E8E93] font-semibold">
            <Clock className="w-3.5 h-3.5 text-[#8E8E93]" />
            <span>20 min prep time</span>
          </div>
        </div>

        {/* Cart Title & Order ID */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-white" />
            <h3 className="text-sm font-black text-white tracking-wide">Cart</h3>
          </div>
          <span className="text-[11px] font-bold text-[#8E8E93]">
            Order ID: #1099
          </span>
        </div>

        {/* Segmented Control (Delivery / Dine in / Takeaway) matching reference red gradient pill */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#1A1A1A] rounded-full border border-[#2D2D2D]">
          <button
            type="button"
            onClick={() => setOrderType('DELIVERY')}
            className={`py-2 text-[11px] font-extrabold rounded-full transition-all duration-300 ${
              orderType === 'DELIVERY'
                ? 'btn-red-pill text-white'
                : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            Delivery
          </button>
          <button
            type="button"
            onClick={() => setOrderType('DINE_IN')}
            className={`py-2 text-[11px] font-extrabold rounded-full transition-all duration-300 ${
              orderType === 'DINE_IN'
                ? 'btn-red-pill text-white'
                : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            Dine in
          </button>
          <button
            type="button"
            onClick={() => setOrderType('TAKEAWAY')}
            className={`py-2 text-[11px] font-extrabold rounded-full transition-all duration-300 ${
              orderType === 'TAKEAWAY'
                ? 'btn-red-pill text-white'
                : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            Takeaway
          </button>
        </div>

        {/* Error / Success feedback */}
        {error && (
          <div className="p-3 rounded-xl bg-[#3D0A0A] border border-[#7F1D1D] text-[#FF4D4D] text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-xl bg-[#062D15] border border-[#166534] text-[#4ADE80] text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Cart Item List */}
        <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
          {cart.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#2B2B2B] text-[#8E8E93] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-[#8E8E93]">Your Cart is Empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.menuItemId || item.id}
                className="flex items-center justify-between gap-3 p-2.5 bg-[#2B2B2B]/60 border border-[#333333] rounded-2xl"
              >
                {/* Food Image */}
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-[#1A1A1A]">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop&q=80';
                    }}
                  />
                </div>

                {/* Name & Subtext */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-extrabold text-white truncate">{item.name}</h4>
                  <span className="text-[10px] text-[#8E8E93] block truncate">{item.category || 'Dish'}</span>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.menuItemId || item.id, item.quantity - 1)}
                      className="w-4 h-4 rounded-full bg-[#1A1A1A] text-[#8E8E93] hover:text-white flex items-center justify-center"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                    <span className="text-xs font-black text-white font-mono">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.menuItemId || item.id, item.quantity + 1)}
                      className="w-4 h-4 rounded-full bg-[#1A1A1A] text-[#8E8E93] hover:text-white flex items-center justify-center"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>

                {/* Edit / Remove Icon Button in white circle (matching reference image) */}
                <button
                  type="button"
                  onClick={() => removeFromCart(item.menuItemId || item.id)}
                  className="w-8 h-8 rounded-full bg-white hover:bg-gray-200 text-black flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-md"
                  title="Remove item"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Dashed Ticket Divider with Semicircle Sockets */}
        <div className="relative my-3">
          <div className="border-t-2 border-dashed border-[#3A3A3A] w-full" />
          <div className="ticket-notch-left" />
          <div className="ticket-notch-right" />
        </div>

        {/* Promotion Code Field */}
        <form onSubmit={handleApplyPromo} className="relative flex items-center">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Promotion Code"
            className="w-full pl-4 pr-24 py-2.5 text-xs bg-[#1A1A1A] text-white border border-[#2D2D2D] rounded-full focus:outline-none focus:border-[#FF3B30] placeholder-[#666666]"
          />
          <button
            type="submit"
            className="absolute right-1.5 px-4 py-1.5 bg-[#2B2B2B] hover:bg-[#FF3B30] text-white text-[10px] font-black rounded-full uppercase tracking-wider transition-colors"
          >
            {promoApplied ? 'APPLIED' : 'TRYNEW'}
          </button>
        </form>
      </div>

      {/* Summary Rows & Confirm Order CTA */}
      <div className="space-y-3 pt-3 border-t border-[#2D2D2D]/60 mt-2">
        <div className="space-y-2 text-xs font-bold text-[#8E8E93]">
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

        {/* Confirm Order Pill Button */}
        <button
          type="button"
          onClick={handleCheckout}
          disabled={cart.length === 0 || submitting}
          className="w-full py-4 px-4 bg-[#1C1C1C] hover:bg-[#FF3B30] disabled:opacity-40 text-white font-black text-xs uppercase tracking-widest rounded-full transition-all duration-300 shadow-xl border border-[#333333] hover:border-[#FF3B30] text-center"
        >
          {submitting ? 'PROCESSING...' : 'Confirm Order'}
        </button>
      </div>
    </aside>
  );
};

