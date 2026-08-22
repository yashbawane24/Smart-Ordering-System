import React from 'react';
import { PackageOpen } from 'lucide-react';

export const EmptyState = ({ title = 'No Data Available', message = 'There are no items to display right now.', icon: Icon = PackageOpen, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[#111111] border border-[#242424] rounded-2xl my-4">
      <div className="w-16 h-16 rounded-2xl bg-[#450A0A] border border-[#7F1D1D] text-[#FF2D2D] flex items-center justify-center mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-xs text-[#A3A3A3] max-w-sm mb-6">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-[#E50914] hover:bg-[#FF2D2D] text-white font-bold text-xs rounded-lg transition shadow-md shadow-[#E50914]/20"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
