import React, { useState } from 'react';
import { Modal } from '../common/Modal';

export const ChefFormModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'Password123',
    phone: '+91 ',
    chefIdStr: `CHEF-00${Math.floor(Math.random() * 90 + 10)}`
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register New Kitchen Chef">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#A3A3A3] uppercase mb-1">Chef Full Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3.5 py-2 text-sm bg-[#0F0F0F] text-white border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#E50914]"
            placeholder="e.g. Chef Ramesh Kumar"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#A3A3A3] uppercase mb-1">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-[#0F0F0F] text-white border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#E50914]"
              placeholder="chef@vit.edu"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#A3A3A3] uppercase mb-1">Chef Staff ID</label>
            <input
              type="text"
              required
              value={formData.chefIdStr}
              onChange={(e) => setFormData({ ...formData, chefIdStr: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-[#0F0F0F] text-white border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#E50914]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#A3A3A3] uppercase mb-1">Default Password</label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-3.5 py-2 text-sm bg-[#0F0F0F] text-white border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#E50914]"
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
            Create Chef Account
          </button>
        </div>
      </form>
    </Modal>
  );
};
