import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCredits } from '../../utils/formatters';

export const FoodCard = ({ item }) => {
  const { cart, addToCart } = useCart();
  const isSoldOut = !item.isAvailable || item.availableQuantity <= 0;
  const inCart = cart.find(i => i.menuItemId === item.id);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`relative bg-[#111111] border border-[#242424] hover:border-[#7F1D1D] rounded-2xl overflow-hidden shadow-md hover:shadow-red-subtle transition-all duration-300 flex flex-col justify-between ${
        isSoldOut ? 'opacity-65' : ''
      }`}
    >
      {/* Image Container */}
      <div className="relative h-44 w-full overflow-hidden bg-[#0A0A0A]">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />

        {/* Category Pill */}
        <span className="absolute top-3 left-3 px-3 py-1 text-[11px] font-bold rounded-full bg-[#050505]/90 text-[#A3A3A3] border border-[#242424]">
          {item.category}
        </span>

        {/* Availability Badge */}
        <span
          className={`absolute top-3 right-3 px-3 py-1 text-[11px] font-bold rounded-full border ${
            isSoldOut
              ? 'bg-[#181818] text-[#737373] border-[#242424]'
              : 'bg-[#450A0A] text-[#FF2D2D] border-[#7F1D1D]'
          }`}
        >
          {isSoldOut ? 'SOLD OUT' : `${item.availableQuantity} Left`}
        </span>
      </div>

      {/* Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-base font-bold text-white line-clamp-1">{item.name}</h4>
          <p className="text-xs text-[#A3A3A3] line-clamp-2 mt-1 min-h-[32px]">{item.description}</p>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#1C1C1C]">
          <div>
            <span className="text-[10px] text-[#737373] uppercase tracking-wider block font-semibold">Price</span>
            <span className="text-base font-extrabold text-[#E50914]">
              {formatCredits(item.price)}
            </span>
          </div>

          <button
            onClick={() => !isSoldOut && addToCart(item)}
            disabled={isSoldOut}
            className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition ${
              isSoldOut
                ? 'bg-[#181818] text-[#666666] cursor-not-allowed border border-[#242424]'
                : inCart
                ? 'bg-[#E50914] text-white shadow-md hover:bg-[#FF2D2D]'
                : 'bg-[#151515] text-[#FF2D2D] border border-[#7F1D1D] hover:bg-[#E50914] hover:text-white'
            }`}
          >
            {inCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                In Cart ({inCart.quantity})
              </>
            ) : isSoldOut ? (
              <>
                <AlertCircle className="w-3.5 h-3.5" />
                SOLD OUT
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
