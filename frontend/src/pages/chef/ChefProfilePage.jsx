import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ChefHat, Mail, Phone, ShieldCheck } from 'lucide-react';

export const ChefProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">Chef Profile</h1>
        <p className="text-xs sm:text-sm text-slate-400">VIT Mess Kitchen Head Staff Account Profile.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center font-black text-2xl">
            <ChefHat className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{user?.name}</h3>
            <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 block">
              Staff ID: CHEF-001
            </span>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 font-medium flex items-center gap-2"><Mail className="w-4 h-4" /> Email</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{user?.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 font-medium flex items-center gap-2"><Phone className="w-4 h-4" /> Phone</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{user?.phone || '+91 9876543211'}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-400 font-medium flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> System Role</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">{user?.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
