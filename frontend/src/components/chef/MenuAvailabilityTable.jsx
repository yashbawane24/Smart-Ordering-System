import React from 'react';
import { formatCredits } from '../../utils/formatters';

export const MenuAvailabilityTable = ({ items, onToggleAvailability, onUpdateQuantity }) => {
  return (
    <div className="bg-[#111111] border border-[#242424] rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#151515] text-[#A3A3A3] uppercase font-bold border-b border-[#242424]">
            <tr>
              <th className="px-6 py-4">Food Item</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock Quantity</th>
              <th className="px-6 py-4 text-center">Availability Toggle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C1C1C]">
            {items.map((item) => {
              const isOut = !item.isAvailable || item.availableQuantity <= 0;
              return (
                <tr key={item.id} className="bg-[#0F0F0F] hover:bg-[#181010] transition">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover border border-[#242424]"
                    />
                    <div>
                      <span className="font-bold text-white block">{item.name}</span>
                      <span className="text-xs text-[#A3A3A3] line-clamp-1">{item.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#151515] text-[#A3A3A3] border border-[#242424]">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#E50914]">
                    {formatCredits(item.price)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={item.availableQuantity}
                        onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 0)}
                        className="w-20 px-3 py-1 text-xs font-bold bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg text-white text-center focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914]/50"
                      />
                      <span className="text-xs text-[#737373] font-medium">units</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onToggleAvailability(item.id, !item.isAvailable, item.availableQuantity)}
                      className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
                        isOut
                          ? 'bg-[#181818] text-[#737373] border border-[#242424] hover:bg-[#450A0A] hover:text-[#FF2D2D]'
                          : 'bg-[#450A0A] text-[#FF2D2D] border border-[#7F1D1D] hover:bg-[#E50914] hover:text-white'
                      }`}
                    >
                      {isOut ? 'Mark Available' : 'Mark SOLD OUT'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
