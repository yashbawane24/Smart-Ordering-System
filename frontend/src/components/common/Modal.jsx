import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={`relative w-full ${maxWidth} bg-[#111111] border border-[#2A2A2A] rounded-2xl shadow-2xl z-10 overflow-hidden my-8`}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A]">
                <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-1 text-[#A3A3A3] hover:text-white rounded-lg hover:bg-[#1C1C1C] transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Body */}
            <div className="p-6 text-white">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
