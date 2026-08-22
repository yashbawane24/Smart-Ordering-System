import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Settings, Moon, Sun, Database, ShieldAlert } from 'lucide-react';

export const AdminSettingsPage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">System Settings</h1>
        <p className="text-xs sm:text-sm text-slate-400">Configure global mess parameters, theme styling, and database sync.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-emerald-500" />}
              Appearance Mode
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Toggle admin dashboard dark/light theme.</p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl transition hover:bg-slate-200"
          >
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-500" /> Default Monthly Credit Limit
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Base credit allowance granted to students each month.</p>
          </div>
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm bg-emerald-500/10 px-3 py-1.5 rounded-xl">
            9,000 Credits
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" /> System Database Maintenance
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">SQLite Prisma ORM engine health & relation verification.</p>
          </div>
          <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-xl">
            Operational
          </span>
        </div>
      </div>
    </div>
  );
};
