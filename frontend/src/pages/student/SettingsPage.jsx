import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Bell, KeyRound } from 'lucide-react';

export const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Preferences & Settings</h1>
        <p className="text-xs font-bold text-[#FF3B30]">Configure theme appearance, notification alerts, and security preferences.</p>
      </div>

      <div className="bg-[#222222] border border-[#2D2D2D] rounded-[28px] p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Appearance */}
        <div className="flex items-center justify-between pb-6 border-b border-[#2D2D2D]">
          <div>
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-[#FF3B30]" />}
              Appearance Mode
            </h3>
            <p className="text-xs text-[#8E8E93] mt-0.5">Switch between clean light mode and sleek dark reference theme.</p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-5 py-2 text-xs font-extrabold bg-[#1A1A1A] text-white hover:bg-[#FF3B30] rounded-full transition border border-[#333333] hover:border-[#FF3B30]"
          >
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between pb-6 border-b border-[#2D2D2D]">
          <div>
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#FF3B30]" />
              In-App Notification Alerts
            </h3>
            <p className="text-xs text-[#8E8E93] mt-0.5">Receive instant alerts when kitchen accepts or marks order as ready.</p>
          </div>
          <input
            type="checkbox"
            defaultChecked
            className="w-5 h-5 text-[#FF3B30] rounded focus:ring-[#FF3B30] cursor-pointer"
          />
        </div>

        {/* Password Security */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#FF3B30]" />
              Account Password Security
            </h3>
            <p className="text-xs text-[#8E8E93] mt-0.5">Update or reset your login authentication password.</p>
          </div>
          <button
            onClick={() => alert('Password update request submitted to VIT Mess Portal administrator.')}
            className="px-5 py-2 text-xs font-extrabold bg-[#1A1A1A] text-white hover:bg-[#FF3B30] rounded-full transition border border-[#333333] hover:border-[#FF3B30]"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

