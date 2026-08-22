import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, AlertCircle, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCredits } from '../../utils/formatters';

export const FoodCard = ({ item }) => {
  const { cart, addToCart } = useCart();
  const isSoldOut = !item.isAvailable || item.availableQuantity <= 0;
  const inCart = cart.find(i => i.menuItemId === item.id);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.015 }}
      transition={{ duration: 0.2 }}
      className={`group relative bg-[#141414] border border-[#222222] hover:border-[#7F1D1D] rounded-3xl overflow-hidden shadow-xl hover:shadow-[#E50914]/15 transition-all duration-300 flex flex-col justify-between ${
        isSoldOut ? 'opacity-50 grayscale-[30%]' : ''
      }`}
    >
      {/* Food Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-[#0A0A0A]">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-90" />

        {/* Category Pill */}
        <span className="absolute top-3 left-3 px-3 py-1 text-[10px] font-black tracking-wider uppercase rounded-full bg-[#080808]/90 text-[#A3A3A3] border border-[#242424] backdrop-blur-md">
          {item.category}
        </span>

        {/* Stock / Availability Badge */}
        <span
          className={`absolute top-3 right-3 px-3 py-1 text-[10px] font-extrabold rounded-full border backdrop-blur-md ${
            isSoldOut
              ? 'bg-[#181818]/90 text-[#737373] border-[#2A2A2A]'
              : 'bg-[#3A0808]/90 text-[#FF4D4D] border-[#7F1D1D]'
          }`}
        >
          {isSoldOut ? 'SOLD OUT' : `${item.availableQuantity} Left`}
        </span>
      </div>

      {/* Food Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h4 className="text-base font-extrabold text-white group-hover:text-[#FF2B2B] transition-colors line-clamp-1">
            {item.name}
          </h4>
          <p className="text-xs text-[#888888] line-clamp-2 mt-1.5 min-h-[32px] leading-relaxed">
            {item.description || 'Delicious, freshly prepared college mess dish made with premium ingredients.'}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between pt-3 border-t border-[#1F1F1F]">
          <div>
            <span className="text-[10px] text-[#666666] uppercase tracking-wider block font-bold">Credit Cost</span>
            <span className="text-base font-black text-[#FF2B2B] font-mono">
              {formatCredits(item.price)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => !isSoldOut && addToCart(item)}
            disabled={isSoldOut}
            className={`px-4 py-2.5 text-xs font-black rounded-xl flex items-center gap-1.5 transition-all shadow-md ${
              isSoldOut
                ? 'bg-[#1A1A1A] text-[#555555] cursor-not-allowed border border-[#242424]'
                : inCart
                ? 'bg-[#E50914] text-white shadow-[#E50914]/30 hover:bg-[#FF2B2B]'
                : 'bg-[#210909] text-[#FF2B2B] border border-[#7F1D1D] hover:bg-[#E50914] hover:text-white hover:border-[#E50914] btn-red-glow'
            }`}
          >
            {inCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>In Cart ({inCart.quantity})</span>
              </>
            ) : isSoldOut ? (
              <>
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Sold Out</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

