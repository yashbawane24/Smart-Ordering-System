import React from 'react';
import { motion } from 'framer-motion';

export const AnalyticsCard = ({ title, value, subtitle, icon: Icon }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-[#222222] border border-[#2D2D2D] hover:border-[#FF3B30] rounded-[24px] p-6 shadow-2xl flex items-center justify-between transition-all duration-300 relative overflow-hidden"
    >
      <div className="space-y-1">
        <span className="text-[10px] font-black text-[#8E8E93] uppercase tracking-widest block">{title}</span>
        <h3 className="text-2xl sm:text-3xl font-black text-white">{value}</h3>
        {subtitle && <p className="text-xs text-[#8E8E93] font-medium">{subtitle}</p>}
      </div>
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-[#333333] text-[#FF3B30] flex items-center justify-center shadow-lg">
          <Icon className="w-6 h-6" />
        </div>
      )}
    </motion.div>
  );
};

