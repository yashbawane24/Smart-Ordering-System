import React from 'react';
import { CreditCard as CardIcon, Sparkles } from 'lucide-react';
import { formatCredits } from '../../utils/formatters';

export const CreditCard = ({ studentName, studentIdStr, remainingCredits, usedCredits, monthlyCredits = 9000 }) => {
  const usagePercentage = Math.min(100, Math.round((usedCredits / monthlyCredits) * 100));

  return (
    <div className="relative w-full max-w-md bg-gradient-to-tr from-[#0D0D0D] via-[#111111] to-[#1C0505] text-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#331111] overflow-hidden group">
      {/* Background Red Glow */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#E50914]/15 rounded-full blur-3xl group-hover:bg-[#E50914]/25 transition-all duration-700" />
      <div className="absolute -left-10 -top-10 w-48 h-48 bg-[#B91C1C]/10 rounded-full blur-3xl" />

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between pb-6 border-b border-[#242424]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#450A0A] border border-[#7F1D1D] text-[#FF2D2D] flex items-center justify-center">
            <CardIcon className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold tracking-widest text-white uppercase block">VIT Digital Mess</span>
            <span className="text-[10px] text-[#E50914] font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Monthly Wallet Pass
            </span>
          </div>
        </div>

        {/* EMV Chip graphic */}
        <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-200 border border-amber-400/50 shadow-inner flex items-center justify-center">
          <div className="w-6 h-4 border border-amber-600/40 rounded-sm" />
        </div>
      </div>

      {/* Balance */}
      <div className="relative z-10 my-5">
        <span className="text-xs text-[#A3A3A3] uppercase tracking-wider font-semibold">Remaining Balance</span>
        <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#FF2D2D] tracking-tight">
          {formatCredits(remainingCredits)}
        </div>
      </div>

      {/* Usage Progress Bar */}
      <div className="relative z-10 my-4 space-y-1.5">
        <div className="flex justify-between text-xs text-[#A3A3A3] font-medium">
          <span>Used: {formatCredits(usedCredits)}</span>
          <span>Limit: {formatCredits(monthlyCredits)}</span>
        </div>
        <div className="w-full h-2 bg-[#1C1C1C] rounded-full overflow-hidden border border-[#242424]">
          <div
            className="h-full bg-gradient-to-r from-[#E50914] to-[#FF2D2D] rounded-full transition-all duration-500"
            style={{ width: `${usagePercentage}%` }}
          />
        </div>
      </div>

      {/* Cardholder Info */}
      <div className="relative z-10 pt-4 border-t border-[#242424] flex items-center justify-between">
        <div>
          <span className="text-[10px] text-[#A3A3A3] uppercase tracking-wider block font-medium">Student Name</span>
          <span className="text-sm font-bold text-white">{studentName || 'Student User'}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-[#A3A3A3] uppercase tracking-wider block font-medium">Registration ID</span>
          <span className="text-xs font-mono font-bold text-[#E50914] tracking-wider">{studentIdStr || '21BCE1042'}</span>
        </div>
      </div>
    </div>
  );
};
