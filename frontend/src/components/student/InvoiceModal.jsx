import React from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { formatCredits, formatDate } from '../../utils/formatters';
import { Printer, UtensilsCrossed } from 'lucide-react';

export const InvoiceModal = ({ isOpen, onClose, order }) => {
  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Order Invoice Receipt" maxWidth="max-w-xl">
      <div className="space-y-6">
        {/* Invoice Printable Content */}
        <div id="invoice-receipt" className="p-6 bg-[#0F0F0F] border border-[#2A2A2A] rounded-2xl space-y-6">
          {/* Top Header */}
          <div className="flex justify-between items-start pb-4 border-b border-[#2A2A2A]">
            <div>
              <div className="flex items-center gap-2 font-black text-lg text-white">
                <UtensilsCrossed className="w-5 h-5 text-[#E50914]" />
                <span>VIT Mess Digital System</span>
              </div>
              <p className="text-xs text-[#A3A3A3] mt-1">Official Mess Token Invoice</p>
            </div>
            <div className="text-right">
              <StatusBadge status={order.status} />
              <p className="text-xs text-[#A3A3A3] mt-2 font-mono">{formatDate(order.createdAt)}</p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[#A3A3A3] font-medium block uppercase tracking-wider">Invoice No</span>
              <span className="font-bold font-mono text-[#E50914]">{order.orderNumber}</span>
            </div>
            <div>
              <span className="text-[#A3A3A3] font-medium block uppercase tracking-wider">Student Name</span>
              <span className="font-bold text-white">{order.student?.user?.name || 'Student'}</span>
            </div>
          </div>

          {/* Table */}
          <div className="border border-[#2A2A2A] rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#151515] text-[#A3A3A3] font-semibold uppercase">
                <tr>
                  <th className="p-3">Item</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2A]">
                {order.orderItems?.map((item) => (
                  <tr key={item.id}>
                    <td className="p-3 font-medium text-white">{item.itemName}</td>
                    <td className="p-3 text-center text-[#A3A3A3]">{item.quantity}</td>
                    <td className="p-3 text-right text-[#A3A3A3]">{formatCredits(item.itemPrice)}</td>
                    <td className="p-3 text-right font-bold text-white">{formatCredits(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Summary */}
          <div className="flex justify-between items-center pt-2 border-t border-[#2A2A2A]">
            <span className="text-sm font-bold text-white">Total Credits Paid</span>
            <span className="text-lg font-black text-[#E50914]">{formatCredits(order.totalCredits)}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-xs font-bold text-white bg-[#151515] hover:bg-[#242424] border border-[#2A2A2A] rounded-lg transition flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-[#A3A3A3]" />
            Print Receipt
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-[#E50914] hover:bg-[#FF2D2D] rounded-lg transition shadow-md shadow-[#E50914]/20"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
