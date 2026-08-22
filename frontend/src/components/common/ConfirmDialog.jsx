import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title = 'Confirm Action', message = 'Are you sure you want to proceed?', confirmText = 'Confirm', isDestructive = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDestructive ? 'bg-[#450A0A] text-[#EF4444]' : 'bg-[#450A0A] text-[#FF2D2D]'}`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        <p className="text-xs text-[#A3A3A3] leading-relaxed">{message}</p>
        <div className="flex justify-end gap-3 w-full pt-4 border-t border-[#2A2A2A]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#A3A3A3] hover:text-white bg-[#151515] hover:bg-[#242424] border border-[#242424] rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-xs font-bold text-white rounded-lg transition shadow-md ${
              isDestructive ? 'bg-[#B91C1C] hover:bg-[#EF4444]' : 'bg-[#E50914] hover:bg-[#FF2D2D]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
