import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { formatCredits } from '../../utils/formatters';
import { ShoppingBag, Minus, Plus, Trash2, Utensils, Package, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RightCartPanel = ({ onOrderPlaced }) => {
  const { cart, updateQuantity, removeFromCart, clearCart, totalCredits, totalItemsCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState('DINE_IN'); // 'DINE_IN' or 'TAKEAWAY'
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Calculate monthly credits simulation/user state
  const totalAllocated = 9000;
  const remainingCredits = (user?.studentProfile?.credits || 8700) - totalCredits;
  const usedPercentage = Math.min(100, Math.max(0, ((totalAllocated - Math.max(0, remainingCredits)) / totalAllocated) * 100));

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
        orderType: orderType === 'TAKEAWAY' ? 'TAKEAWAY' : 'DINE_IN',
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
    <aside className="w-full lg:w-[340px] xl:w-[380px] bg-[#111111] border border-[#222222] rounded-3xl p-5 flex flex-col justify-between shadow-2xl backdrop-blur-xl relative overflow-hidden shrink-0">
      {/* Background Ambient Red Accent */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#E50914]/10 blur-3xl pointer-events-none rounded-full" />

      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#450A0A] border border-[#7F1D1D] text-[#FF2B2B] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white tracking-wide uppercase">YOUR CART</h3>
              <p className="text-[10px] text-[#A3A3A3] font-mono">Order ID: #ORD-10489</p>
            </div>
          </div>
          <span className="px-2.5 py-1 text-[11px] font-black rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#FF2B2B]">
            {totalItemsCount} {totalItemsCount === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        {/* Dine-In / Takeaway Segment Control */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#090909] rounded-xl border border-[#1F1F1F]">
          <button
            type="button"
            onClick={() => setOrderType('DINE_IN')}
            className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
              orderType === 'DINE_IN'
                ? 'bg-[#E50914] text-white shadow-md shadow-[#E50914]/30'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Dine In</span>
          </button>

          <button
            type="button"
            onClick={() => setOrderType('TAKEAWAY')}
            className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
              orderType === 'TAKEAWAY'
                ? 'bg-[#E50914] text-white shadow-md shadow-[#E50914]/30'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Takeaway</span>
          </button>
        </div>

        {/* Monthly Credits Progress Bar Widget */}
        <div className="bg-[#161616] border border-[#242424] rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[#A3A3A3] uppercase tracking-wider text-[10px] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#E50914]" /> Monthly Credits
            </span>
            <span className="text-white font-mono">
              <span className="text-[#FF2B2B]">{formatCredits(Math.max(0, remainingCredits))}</span> / {formatCredits(totalAllocated)}
            </span>
          </div>

          <div className="w-full h-2.5 bg-[#090909] rounded-full overflow-hidden border border-[#242424]">
            <div
              className="h-full bg-gradient-to-r from-[#B91C1C] via-[#E50914] to-[#FF2B2B] rounded-full transition-all duration-500"
              style={{ width: `${usedPercentage}%` }}
            />
          </div>
        </div>

        {/* Notification Feedback */}
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
        <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 no-scrollbar">
          {cart.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#181818] text-[#555555] flex items-center justify-center mx-auto border border-[#222222]">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-[#888888]">Your cart is empty</p>
              <p className="text-[10px] text-[#555555]">Select dishes from the menu to build your order</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.menuItemId || item.id}
                className="flex items-center justify-between gap-3 p-3 bg-[#171717] border border-[#242424] hover:border-[#381010] rounded-xl transition"
              >
                {/* Image */}
                <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-[#090909] border border-[#242424]">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop&q=80';
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                  <p className="text-[10px] font-mono font-bold text-[#E50914]">
                    {formatCredits(item.price * item.quantity)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1.5 bg-[#0D0D0D] border border-[#222222] rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.menuItemId || item.id, item.quantity - 1)}
                    className="w-5 h-5 rounded flex items-center justify-center text-[#888888] hover:text-white hover:bg-[#222222] transition"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold text-white w-4 text-center font-mono">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.menuItemId || item.id, item.quantity + 1)}
                    className="w-5 h-5 rounded flex items-center justify-center text-[#888888] hover:text-white hover:bg-[#222222] transition"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeFromCart(item.menuItemId || item.id)}
                  className="text-[#666666] hover:text-[#FF2B2B] p-1 transition"
                  title="Remove item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Cart Summary & CTA Footer */}
      <div className="border-t border-[#1F1F1F] pt-4 mt-4 space-y-3">
        <div className="space-y-1.5 text-xs font-semibold">
          <div className="flex justify-between text-[#888888]">
            <span>Subtotal</span>
            <span className="text-white font-mono">{formatCredits(totalCredits)}</span>
          </div>
          <div className="flex justify-between text-[#888888]">
            <span>Remaining Balance</span>
            <span className="text-white font-mono">{formatCredits(Math.max(0, remainingCredits))}</span>
          </div>
          <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-[#1F1F1F]">
            <span>Total</span>
            <span className="text-[#FF2B2B] font-mono">{formatCredits(totalCredits)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCheckout}
          disabled={cart.length === 0 || submitting || remainingCredits < 0}
          className="w-full py-3.5 px-4 bg-[#E50914] hover:bg-[#FF2B2B] disabled:opacity-40 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#E50914]/25 flex items-center justify-center gap-2 btn-red-glow"
        >
          {submitting ? 'PROCESSING...' : 'CONFIRM ORDER'}
        </button>
      </div>
    </aside>
  );
};
