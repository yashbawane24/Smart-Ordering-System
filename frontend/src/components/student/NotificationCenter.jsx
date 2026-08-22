import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, Info, RefreshCw, AlertCircle } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { formatDate } from '../../utils/formatters';

export const NotificationCenter = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();

  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'ORDER_UPDATE': return <RefreshCw className="w-4 h-4 text-[#FF2D2D]" />;
      case 'REFUND': return <CheckCheck className="w-4 h-4 text-[#3B82F6]" />;
      case 'CREDIT_ALERT': return <AlertCircle className="w-4 h-4 text-[#F59E0B]" />;
      default: return <Info className="w-4 h-4 text-[#737373]" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-[#111111] border border-[#2A2A2A] rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-[#1C1C1C]">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#E50914]" />
            <h4 className="font-bold text-white text-sm">Notifications</h4>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-[#E50914] text-white rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs font-medium text-[#FF2D2D] hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-[#1C1C1C]">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`p-4 flex gap-3 cursor-pointer hover:bg-[#181010] transition ${
                  !n.isRead ? 'bg-[#450A0A]/30 border-l-2 border-[#E50914]' : ''
                }`}
              >
                <div className="mt-1">{getIcon(n.type)}</div>
                <div className="flex-1 min-w-0">
                  <h5 className={`text-xs font-semibold text-white ${!n.isRead ? 'font-bold text-[#FF2D2D]' : ''}`}>
                    {n.title}
                  </h5>
                  <p className="text-xs text-[#A3A3A3] line-clamp-2 mt-0.5">{n.message}</p>
                  <span className="text-[10px] text-[#737373] mt-1 block">
                    {formatDate(n.createdAt)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-[#737373]">
              No notifications yet.
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
