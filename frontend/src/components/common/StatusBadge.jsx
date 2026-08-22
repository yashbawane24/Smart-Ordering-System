import React from 'react';
import { ORDER_STATUS_CONFIG } from '../../utils/constants';

export const StatusBadge = ({ status }) => {
  const config = ORDER_STATUS_CONFIG[status] || { label: status, color: 'bg-slate-500/10 text-slate-600 border-slate-500/20' };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${config.color}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {config.label}
    </span>
  );
};
