import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';

export const StudentFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    studentIdStr: '',
    hostel: 'Block A, Mens Hostel',
    roomNumber: '101'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.user?.name || '',
        email: initialData.user?.email || '',
        password: '',
        phone: initialData.user?.phone || '',
        studentIdStr: initialData.studentIdStr || '',
        hostel: initialData.hostel || 'Block A, Mens Hostel',
        roomNumber: initialData.roomNumber || '101'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '+91 ',
        studentIdStr: `23BCE${Math.floor(1000 + Math.random() * 9000)}`,
        hostel: 'MH-A (Mens Hostel Block A)',
        roomNumber: 'A-101'
      });
    }
  }, [initialData, isOpen]);


  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Student Details' : 'Register New Student'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#A3A3A3] uppercase mb-1">Full Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3.5 py-2 text-sm bg-[#0F0F0F] text-white border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914]/50"
            placeholder="e.g. Yash Sharma"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#A3A3A3] uppercase mb-1">Email Address</label>
            <input
              type="email"
              required
              disabled={!!initialData}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-[#0F0F0F] text-white border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#E50914] disabled:opacity-50"
              placeholder="student@vit.edu"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#A3A3A3] uppercase mb-1">Student Reg ID</label>
            <input
              type="text"
              required
              disabled={!!initialData}
              value={formData.studentIdStr}
              onChange={(e) => setFormData({ ...formData, studentIdStr: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-[#0F0F0F] text-white border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#E50914] disabled:opacity-50"
              placeholder="21BCE1042"
            />
          </div>
        </div>

        {!initialData && (
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
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#A3A3A3] uppercase mb-1">Hostel Block</label>
            <input
              type="text"
              value={formData.hostel}
              onChange={(e) => setFormData({ ...formData, hostel: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-[#0F0F0F] text-white border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#E50914]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#A3A3A3] uppercase mb-1">Room Number</label>
            <input
              type="text"
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-[#0F0F0F] text-white border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#E50914]"
            />
          </div>
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
            {initialData ? 'Save Changes' : 'Create Student'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
