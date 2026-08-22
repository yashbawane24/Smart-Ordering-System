import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Flame, User, Mail, Lock, Phone, Home, Hash, ArrowRight } from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const SignupPage = () => {
  const [role, setRole] = useState('STUDENT');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    studentIdStr: '',
    hostel: 'Block A, Mens Hostel',
    roomNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const res = await register({
        ...formData,
        role
      });
      if (res?.success) {
        if (role === 'STUDENT') navigate('/student');
        else if (role === 'CHEF') navigate('/chef');
        else navigate('/admin');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-reference-outer flex items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="w-full max-w-md bg-[#1A1A1A] border border-[#2B2B2B] rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF3B30] via-[#E62E00] to-[#FF9500] text-white flex items-center justify-center shadow-xl shadow-[#FF3B30]/30 transform rotate-[-6deg]">
              <Flame className="w-7 h-7 fill-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-black text-white tracking-tight">Create Official Account</h1>
          <p className="text-xs font-extrabold text-[#FF3B30]">Smart Digital Mess & Credit Allowance Portal</p>
        </div>

        {/* Role Selector Segmented Pill Control */}
        <div className="flex bg-[#272727] p-1 rounded-full border border-[#333333]">
          <button
            type="button"
            onClick={() => setRole('STUDENT')}
            className={`flex-1 py-2 text-xs font-black rounded-full transition-all duration-300 ${
              role === 'STUDENT' ? 'bg-[#FF3B30] text-white shadow-lg' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole('CHEF')}
            className={`flex-1 py-2 text-xs font-black rounded-full transition-all duration-300 ${
              role === 'CHEF' ? 'bg-[#FF3B30] text-white shadow-lg' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            Chef Staff
          </button>
          <button
            type="button"
            onClick={() => setRole('ADMIN')}
            className={`flex-1 py-2 text-xs font-black rounded-full transition-all duration-300 ${
              role === 'ADMIN' ? 'bg-[#FF3B30] text-white shadow-lg' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            Admin
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-[#3D0A0A] border border-[#7F1D1D] text-[#FF4D4D] text-xs font-bold rounded-2xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-[#8E8E93] uppercase tracking-widest mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
              <input
                type="text"
                required
                placeholder="Alex Johnson"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-11 pr-4 py-3 text-xs bg-[#222222] text-white border border-[#2D2D2D] rounded-full focus:outline-none focus:border-[#FF3B30] placeholder-[#666666]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-[#8E8E93] uppercase tracking-widest mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
              <input
                type="email"
                required
                placeholder="student@vit.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-11 pr-4 py-3 text-xs bg-[#222222] text-white border border-[#2D2D2D] rounded-full focus:outline-none focus:border-[#FF3B30] placeholder-[#666666]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-[#8E8E93] uppercase tracking-widest mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-11 pr-4 py-3 text-xs bg-[#222222] text-white border border-[#2D2D2D] rounded-full focus:outline-none focus:border-[#FF3B30] placeholder-[#666666]"
              />
            </div>
          </div>

          {role === 'STUDENT' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-[#8E8E93] uppercase tracking-widest mb-1">Student Reg ID</label>
                  <div className="relative">
                    <Hash className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
                    <input
                      type="text"
                      placeholder="21BCE1042"
                      value={formData.studentIdStr}
                      onChange={(e) => setFormData({ ...formData, studentIdStr: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#222222] text-white border border-[#2D2D2D] rounded-full focus:outline-none focus:border-[#FF3B30] placeholder-[#666666]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-[#8E8E93] uppercase tracking-widest mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
                    <input
                      type="text"
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#222222] text-white border border-[#2D2D2D] rounded-full focus:outline-none focus:border-[#FF3B30] placeholder-[#666666]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-[#8E8E93] uppercase tracking-widest mb-1">Hostel Block</label>
                  <div className="relative">
                    <Home className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
                    <input
                      type="text"
                      placeholder="Block A, Mens Hostel"
                      value={formData.hostel}
                      onChange={(e) => setFormData({ ...formData, hostel: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#222222] text-white border border-[#2D2D2D] rounded-full focus:outline-none focus:border-[#FF3B30] placeholder-[#666666]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-[#8E8E93] uppercase tracking-widest mb-1">Room Number</label>
                  <input
                    type="text"
                    placeholder="A-304"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-[#222222] text-white border border-[#2D2D2D] rounded-full focus:outline-none focus:border-[#FF3B30] placeholder-[#666666]"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#062D15] border border-[#166534] rounded-2xl text-[11px] font-bold text-[#4ADE80] flex items-center gap-2">
                <span>🎁 New accounts automatically receive 9,000 monthly credits wallet allowance!</span>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-[#FF3B30] to-[#D32F2F] hover:brightness-110 disabled:opacity-50 rounded-full transition-all duration-300 shadow-xl shadow-[#FF3B30]/30 flex items-center justify-center gap-2"
          >
            {loading ? <LoadingSpinner size="sm" className="border-white border-t-transparent" /> : (
              <>
                <span>CREATE OFFICIAL ACCOUNT</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs font-bold text-[#8E8E93]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#FF3B30] hover:underline font-black">
              Sign In Here →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
