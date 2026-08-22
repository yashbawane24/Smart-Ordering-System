import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { User, Phone, Home, Mail, Check } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    hostel: user?.student?.hostel || 'Block A, Mens Hostel',
    roomNumber: user?.student?.roomNumber || 'A-304'
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setMessage('');
      const res = await api.patch('/student/profile', formData);
      if (res.success) {
        await refreshUser();
        setMessage('Profile details updated successfully!');
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">My Profile</h1>
        <p className="text-xs font-bold text-[#FF3B30]">Manage your personal details, phone number, and hostel room information.</p>
      </div>

      {message && (
        <div className="p-4 bg-[#062D15] border border-[#166534] text-[#4ADE80] text-xs font-bold rounded-2xl flex items-center gap-2">
          <Check className="w-4 h-4" /> {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#222222] border border-[#2D2D2D] rounded-[28px] p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-[#2D2D2D]">
          <div className="w-16 h-16 rounded-full bg-[#FF3B30] text-white flex items-center justify-center font-black text-2xl shadow-xl">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h3 className="text-lg font-black text-white">{user?.name}</h3>
            <span className="text-xs font-mono font-bold text-[#FF3B30] block">
              Reg ID: {user?.student?.studentIdStr || '21BCE1042'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-[#8E8E93] uppercase tracking-widest mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-11 pr-4 py-3 text-xs bg-[#1A1A1A] text-white border border-[#333333] rounded-full focus:outline-none focus:border-[#FF3B30]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-[#8E8E93] uppercase tracking-widest mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full pl-11 pr-4 py-3 text-xs bg-[#141414] border border-[#2D2D2D] rounded-full text-[#666666] cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-[#8E8E93] uppercase tracking-widest mb-1.5">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-11 pr-4 py-3 text-xs bg-[#1A1A1A] text-white border border-[#333333] rounded-full focus:outline-none focus:border-[#FF3B30]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-[#8E8E93] uppercase tracking-widest mb-1.5">Hostel Block</label>
            <div className="relative">
              <Home className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
              <input
                type="text"
                value={formData.hostel}
                onChange={(e) => setFormData({ ...formData, hostel: e.target.value })}
                className="w-full pl-11 pr-4 py-3 text-xs bg-[#1A1A1A] text-white border border-[#333333] rounded-full focus:outline-none focus:border-[#FF3B30]"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-[#8E8E93] uppercase tracking-widest mb-1.5">Room Number</label>
          <input
            type="text"
            value={formData.roomNumber}
            onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
            className="w-full px-5 py-3 text-xs bg-[#1A1A1A] text-white border border-[#333333] rounded-full focus:outline-none focus:border-[#FF3B30]"
          />
        </div>

        <div className="pt-4 border-t border-[#2D2D2D] flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 text-xs font-black text-white bg-[#1C1C1C] hover:bg-[#FF3B30] disabled:opacity-50 rounded-full transition-all duration-300 shadow-xl border border-[#333333] hover:border-[#FF3B30]"
          >
            {submitting ? <LoadingSpinner size="sm" className="border-white border-t-transparent" /> : 'SAVE PROFILE DETAILS'}
          </button>
        </div>
      </form>
    </div>
  );
};

