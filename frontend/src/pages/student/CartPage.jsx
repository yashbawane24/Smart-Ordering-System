import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { formatCredits } from '../../utils/formatters';
import { EmptyState } from '../../components/common/EmptyState';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, totalCredits } = useCart();
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
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

  const currentCredits = wallet?.remainingCredit || 9000;
  const remainingAfterOrder = currentCredits - totalCredits;
  const isInsufficient = remainingAfterOrder < 0;

  const handleConfirmOrder = async () => {
    if (!cart || cart.length === 0) return;
    if (isInsufficient) {
      setError(`Insufficient credit balance. You need ${Math.abs(remainingAfterOrder)} more credits.`);
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const res = await api.post('/orders', { items: cart });
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
        message="Browse our fresh Indian mess menu and add your favorite dishes to your cart."
        icon={ShoppingBag}
        actionLabel="Browse Menu"
        onAction={() => navigate('/student/menu')}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Review Your Cart</h1>
          <p className="text-xs sm:text-sm text-[#A3A3A3]">Review selected items and verify credit deduction before confirming.</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-[#EF4444] hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" /> Clear Cart
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-[#450A0A] border border-[#EF4444]/30 rounded-xl flex items-center gap-3 text-[#EF4444] text-xs font-semibold">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.menuItemId}
              className="bg-[#111111] border border-[#242424] rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover border border-[#242424]"
                />
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">{item.name}</h4>
                  <span className="text-xs text-[#A3A3A3] font-medium block">{item.category}</span>
                  <span className="text-xs font-bold text-[#E50914] mt-1 block">
                    {formatCredits(item.price)} each
                  </span>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg p-1">
                  <button
                    onClick={() => updateQuantity(item.menuItemId, -1)}
                    className="p-1 rounded text-[#A3A3A3] hover:text-white hover:bg-[#242424] transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-extrabold text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.menuItemId, 1)}
                    className="p-1 rounded text-[#A3A3A3] hover:text-white hover:bg-[#242424] transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.menuItemId)}
                  className="p-2 text-[#737373] hover:text-[#EF4444] transition"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Credit Check Box */}
        <div className="space-y-6">
          <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6 shadow-md space-y-6">
            <h3 className="font-extrabold text-white text-lg">Order Summary</h3>

            <div className="space-y-3 text-xs border-b border-[#242424] pb-4">
              <div className="flex justify-between text-[#A3A3A3]">
                <span>Current Wallet Credits</span>
                <span className="font-bold text-white">{formatCredits(currentCredits)}</span>
              </div>
              <div className="flex justify-between text-[#A3A3A3]">
                <span>Order Total</span>
                <span className="font-bold text-[#E50914]">- {formatCredits(totalCredits)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-sm font-bold text-white">Remaining Credits After</span>
              <span className={`text-xl font-black ${isInsufficient ? 'text-[#EF4444]' : 'text-[#FF2D2D]'}`}>
                {formatCredits(remainingAfterOrder)}
              </span>
            </div>

            {/* Validation Message */}
            {isInsufficient && (
              <div className="p-3 bg-[#450A0A] text-[#EF4444] border border-[#EF4444]/30 rounded-xl text-xs font-semibold">
                ⚠️ You do not have enough monthly credits to place this order.
              </div>
            )}

            {/* Confirm Order Button */}
            <button
              onClick={handleConfirmOrder}
              disabled={submitting || isInsufficient}
              className="w-full py-3.5 px-6 bg-[#E50914] hover:bg-[#FF2D2D] disabled:opacity-50 text-white font-extrabold rounded-lg transition shadow-lg shadow-[#E50914]/25 flex items-center justify-center gap-2 text-sm"
            >
              {submitting ? (
                <LoadingSpinner size="sm" className="border-white border-t-transparent" />
              ) : (
                <>
                  CONFIRM & DEDUCT CREDITS <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#737373] text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E50914]" />
              Protected by single database transaction security
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
