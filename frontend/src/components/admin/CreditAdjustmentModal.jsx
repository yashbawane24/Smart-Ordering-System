import React, { useState } from 'react';
import { Modal } from '../common/Modal';

export const CreditAdjustmentModal = ({ isOpen, onClose, onSubmit, student }) => {
  const [amount, setAmount] = useState(500);
  const [description, setDescription] = useState('Admin Credit Top-up / Adjustment');

  if (!student) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      studentId: student.id,
      amount: parseFloat(amount),
      description
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Adjust Credits for ${student.user?.name || 'Student'}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 bg-[#0F0F0F] rounded-xl border border-[#2A2A2A] text-xs space-y-1">
          <p className="text-[#A3A3A3]"><span className="font-bold text-white">Student ID:</span> {student.studentIdStr}</p>
          <p className="text-[#A3A3A3]"><span className="font-bold text-white">Current Remaining:</span> <span className="text-[#E50914] font-bold">{student.creditAccount?.remainingCredit || 0} Credits</span></p>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#A3A3A3] uppercase mb-1">
            Adjustment Amount (+ or - Credits)
          </label>
          <input
            type="number"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-[#0F0F0F] text-white border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#E50914]"
            placeholder="e.g. 500 or -200"
          />
          <span className="text-[11px] text-[#737373] mt-1 block">
            Use positive numbers to add credits, negative numbers to deduct.
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#A3A3A3] uppercase mb-1">
            Audit Reason / Description
          </label>
          <textarea
            rows="2"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-[#0F0F0F] text-white border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#E50914]"
            placeholder="e.g. Mess Fee Reimbursement or Penalty"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#2A2A2A]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-[#A3A3A3] hover:text-white bg-[#151515] border border-[#242424] rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold text-white bg-[#E50914] hover:bg-[#FF2D2D] rounded-lg transition shadow-md shadow-[#E50914]/20"
          >
            Submit Adjustment
          </button>
        </div>
      </form>
    </Modal>
  );
};
