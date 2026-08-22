import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
          <UtensilsCrossed className="w-8 h-8" />
        </div>
        <h1 className="text-6xl font-black text-white">404</h1>
        <h2 className="text-xl font-bold text-slate-200">Page Not Found</h2>
        <p className="text-xs text-slate-400">The page you are looking for doesn't exist or has been moved.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Home
        </Link>
      </div>
    </div>
  );
};
