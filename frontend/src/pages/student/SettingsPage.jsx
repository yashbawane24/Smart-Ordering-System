import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Bell, Shield, KeyRound } from 'lucide-react';

export const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">Preferences & Settings</h1>
        <p className="text-xs sm:text-sm text-slate-400">Configure theme appearance, notification alerts, and security preferences.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Appearance */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-emerald-500" />}
              Appearance Mode
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Switch between clean light mode and sleek dark theme.</p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl transition hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-500" />
              In-App Notification Alerts
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Receive instant alerts when kitchen accepts or marks order as ready.</p>
          </div>
          <input
            type="checkbox"
            defaultChecked
            className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
          />
        </div>

        {/* Password Security */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-blue-500" />
              Account Password Security
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Update or reset your login authentication password.</p>
          </div>
          <button
            onClick={() => alert('Password update request submitted to VIT Mess Portal administrator.')}
            className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl transition hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};
