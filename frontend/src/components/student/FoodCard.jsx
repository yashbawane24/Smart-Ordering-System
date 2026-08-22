import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, Star, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCredits } from '../../utils/formatters';

export const FoodCard = ({ item }) => {
  const { cart, addToCart } = useCart();
  const isSoldOut = !item.isAvailable || item.availableQuantity <= 0;
  const inCart = cart.find(i => i.menuItemId === item.id);

  // Generate rating & sales numbers for reference UI meta row
  const rating = item.rating || (4.0 + (item.name.length % 10) * 0.1).toFixed(1);
  const totalSale = item.sales || (800 + (item.price * 12));

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className={`group relative bg-[#222222] border border-[#2D2D2D] hover:border-[#FF3B30] rounded-[24px] p-4 pt-12 mt-10 text-center shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer ${
        isSoldOut ? 'opacity-50 grayscale-[20%]' : ''
      }`}
      onClick={() => !isSoldOut && addToCart(item)}
    >
      {/* 3D Pop-Out Floating Food Thumbnail (matches reference image overflow) */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-28 h-28 flex items-center justify-center z-10">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover rounded-full food-popout-img shadow-2xl border-2 border-[#333333]"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80';
          }}
        />
      </div>

      {/* Card Content */}
      <div className="space-y-1.5 mt-2">
        <h4 className="text-sm font-black text-white group-hover:text-[#FF3B30] transition-colors truncate">
          {item.name}
        </h4>
        <p className="text-[11px] text-[#8E8E93] font-semibold">
          Starting From
        </p>
        <div className="text-base font-black text-white font-mono">
          {formatCredits(item.price)}
        </div>
      </div>

      {/* Meta Row: Star Rating & Total Sale (matches reference card bottom) */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#2D2D2D] text-[10px] font-bold text-[#8E8E93]">
        <div className="flex items-center gap-1 text-white">
          <Star className="w-3 h-3 text-[#FFCC00] fill-[#FFCC00]" />
          <span>{rating}</span>
        </div>
        <div>
          <span className="text-white font-mono font-extrabold">{totalSale}</span> Total Sale
        </div>
      </div>

      {/* Quick Add Pill Indicator */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (!isSoldOut) addToCart(item);
        }}
        disabled={isSoldOut}
        className={`w-full mt-3 py-2 text-[11px] font-extrabold rounded-full transition-all flex items-center justify-center gap-1 ${
          inCart
            ? 'btn-red-pill text-white'
            : isSoldOut
            ? 'bg-[#1C1C1C] text-[#666666] cursor-not-allowed'
            : 'bg-[#1C1C1C] hover:bg-[#FF3B30] text-white border border-[#333333] hover:border-[#FF3B30]'
        }`}
      >
        {inCart ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>Added ({inCart.quantity})</span>
          </>
        ) : isSoldOut ? (
          <span>Sold Out</span>
        ) : (
          <>
            <Plus className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </>
        )}
      </button>
    </motion.div>
  );
};


