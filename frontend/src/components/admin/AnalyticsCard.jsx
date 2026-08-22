import React from 'react';
import { motion } from 'framer-motion';

export const AnalyticsCard = ({ title, value, subtitle, icon: Icon, color = 'red' }) => {
  const colorStyles = {
    red: 'bg-[#450A0A] text-[#FF2D2D] border-[#7F1D1D]',
    emerald: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
    blue: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20',
    amber: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-[#111111] border border-[#242424] hover:border-[#7F1D1D] rounded-2xl p-6 shadow-sm flex items-center justify-between transition-all duration-300"
    >
      <div>
        <span className="text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider block">{title}</span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{value}</h3>
        {subtitle && <p className="text-xs text-[#737373] mt-1">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorStyles[color] || colorStyles.red}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </motion.div>
  );
};
