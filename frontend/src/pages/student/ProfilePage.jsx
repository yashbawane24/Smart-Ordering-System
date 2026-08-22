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
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">My Profile</h1>
        <p className="text-xs sm:text-sm text-[#A3A3A3]">Manage your personal details, phone number, and hostel room information.</p>
      </div>

      {message && (
        <div className="p-4 bg-[#450A0A] border border-[#7F1D1D] text-[#FF2D2D] text-xs font-bold rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4" /> {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#111111] border border-[#242424] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-[#242424]">
          <div className="w-16 h-16 rounded-full bg-[#450A0A] border border-[#7F1D1D] text-[#FF2D2D] flex items-center justify-center font-black text-2xl">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{user?.name}</h3>
            <span className="text-xs font-mono font-semibold text-[#E50914] block">
              Reg ID: {user?.student?.studentIdStr || '21BCE1042'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#A3A3A3] uppercase mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#0F0F0F] text-white border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#E50914]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#A3A3A3] uppercase mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#0F0F0F]/50 border border-[#2A2A2A] rounded-lg text-[#737373] cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#A3A3A3] uppercase mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]" />
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#0F0F0F] text-white border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#E50914]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#A3A3A3] uppercase mb-1">Hostel Block</label>
            <div className="relative">
              <Home className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]" />
              <input
                type="text"
                value={formData.hostel}
                onChange={(e) => setFormData({ ...formData, hostel: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#0F0F0F] text-white border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#E50914]"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#A3A3A3] uppercase mb-1">Room Number</label>
          <input
            type="text"
            value={formData.roomNumber}
            onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
            className="w-full px-4 py-2.5 text-sm bg-[#0F0F0F] text-white border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#E50914]"
          />
        </div>

        <div className="pt-4 border-t border-[#242424] flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 text-xs font-bold text-white bg-[#E50914] hover:bg-[#FF2D2D] disabled:opacity-50 rounded-lg transition shadow-md shadow-[#E50914]/20 flex items-center gap-2"
          >
            {submitting ? <LoadingSpinner size="sm" className="border-white border-t-transparent" /> : 'Save Profile Details'}
          </button>
        </div>
      </form>
    </div>
  );
};
