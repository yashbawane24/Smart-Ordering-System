import React from 'react';

export const StatusBadge = ({ status }) => {
  let badgeStyle = 'bg-[#8E8E93] text-white';
  let label = status;

  switch (status) {
    case 'COMPLETED':
      badgeStyle = 'bg-[#22C55E] text-white';
      label = 'Completed';
      break;
    case 'READY':
      badgeStyle = 'bg-[#22C55E] text-white';
      label = 'Ready';
      break;
    case 'PENDING':
      badgeStyle = 'bg-[#F59E0B] text-white';
      label = 'Pending';
      break;
    case 'PREPARING':
      badgeStyle = 'bg-[#F59E0B] text-white';
      label = 'Preparing';
      break;
    case 'ACCEPTED':
      badgeStyle = 'bg-[#3B82F6] text-white';
      label = 'Accepted';
      break;
    case 'CANCELLED':
    case 'REJECTED':
      badgeStyle = 'bg-[#FF3B30] text-white';
      label = 'Cancelled';
      break;
    default:
      break;
  }

  return (
    <span className={`inline-block px-3.5 py-1 text-[11px] font-extrabold rounded-full shadow-md ${badgeStyle}`}>
      {label}
    </span>
  );
};

