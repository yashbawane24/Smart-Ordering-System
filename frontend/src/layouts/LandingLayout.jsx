import React from 'react';
import { Outlet } from 'react-router-dom';

export const LandingLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      <Outlet />
    </div>
  );
};
