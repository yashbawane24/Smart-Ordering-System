import React from 'react';

export const SkeletonLoader = ({ count = 3, type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-[#111111] border border-[#242424] rounded-2xl p-5 animate-pulse space-y-4">
            <div className="h-44 bg-[#151515] rounded-xl w-full"></div>
            <div className="h-5 bg-[#151515] rounded w-3/4"></div>
            <div className="h-4 bg-[#151515] rounded w-1/2"></div>
            <div className="flex justify-between items-center pt-2">
              <div className="h-6 bg-[#151515] rounded w-1/3"></div>
              <div className="h-9 bg-[#151515] rounded-lg w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-16 bg-[#111111] border border-[#242424] rounded-xl animate-pulse"></div>
      ))}
    </div>
  );
};
