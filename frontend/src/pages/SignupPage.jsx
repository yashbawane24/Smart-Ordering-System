import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Flame, User, Mail, Lock, Phone, Home, Hash, ArrowRight, Sparkles } from 'lucide-react';
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
      setError(err.message || 'Registration failed. Please check credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-reference-outer flex items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="w-full max-w-md bg-[#151515] border border-[#242424] rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E50914] to-[#B91C1C] text-white flex items-center justify-center shadow-xl shadow-[#E50914]/30 transform rotate-[-6deg]">
              <Flame className="w-7 h-7 fill-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Create Campus Account</h1>
          <p className="text-xs font-black tracking-widest text-[#E50914] uppercase">Smart Mess Operations & Meal Allowance</p>
        </div>

        {/* Role Selector Segmented Control */}
        <div className="flex bg-[#1C1C1C] p-1 rounded-full border border-[#242424]">
          <button
            type="button"
            onClick={() => setRole('STUDENT')}
            className={`flex-1 py-2 text-xs font-black rounded-full transition-all duration-300 ${
              role === 'STUDENT' ? 'bg-[#E50914] text-white shadow-lg' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole('CHEF')}
            className={`flex-1 py-2 text-xs font-black rounded-full transition-all duration-300 ${
              role === 'CHEF' ? 'bg-[#E50914] text-white shadow-lg' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            Chef Staff
          </button>
          <button
            type="button"
            onClick={() => setRole('ADMIN')}
            className={`flex-1 py-2 text-xs font-black rounded-full transition-all duration-300 ${
              role === 'ADMIN' ? 'bg-[#E50914] text-white shadow-lg' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            Admin
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-[#450A0A] border border-[#E50914] text-[#F87171] text-xs font-bold rounded-2xl text-center">
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
                placeholder="Aarav Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-11 pr-4 py-3 text-xs bg-[#1C1C1C] text-white border border-[#242424] rounded-full focus:outline-none focus:border-[#E50914] placeholder-[#666666]"
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
                placeholder="aarav@college.edu.in"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-11 pr-4 py-3 text-xs bg-[#1C1C1C] text-white border border-[#242424] rounded-full focus:outline-none focus:border-[#E50914] placeholder-[#666666]"
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
                className="w-full pl-11 pr-4 py-3 text-xs bg-[#1C1C1C] text-white border border-[#242424] rounded-full focus:outline-none focus:border-[#E50914] placeholder-[#666666]"
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
                      placeholder="23BCE1042"
                      value={formData.studentIdStr}
                      onChange={(e) => setFormData({ ...formData, studentIdStr: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#1C1C1C] text-white border border-[#242424] rounded-full focus:outline-none focus:border-[#E50914] placeholder-[#666666]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-[#8E8E93] uppercase tracking-widest mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#1C1C1C] text-white border border-[#242424] rounded-full focus:outline-none focus:border-[#E50914] placeholder-[#666666]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-[#8E8E93] uppercase tracking-widest mb-1">Hostel Block</label>
                  <div className="relative">
                    <Home className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
                    <select
                      value={formData.hostel}
                      onChange={(e) => setFormData({ ...formData, hostel: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#1C1C1C] text-white border border-[#242424] rounded-full focus:outline-none focus:border-[#E50914] appearance-none"
                    >
                      <option value="MH-A (Mens Hostel Block A)">MH-A (Mens Hostel Block A)</option>
                      <option value="MH-B (Mens Hostel Block B)">MH-B (Mens Hostel Block B)</option>
                      <option value="MH-C (Mens Hostel Block C)">MH-C (Mens Hostel Block C)</option>
                      <option value="LH-1 (Ladies Hostel Block 1)">LH-1 (Ladies Hostel Block 1)</option>
                      <option value="LH-2 (Ladies Hostel Block 2)">LH-2 (Ladies Hostel Block 2)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-[#8E8E93] uppercase tracking-widest mb-1">Room Number</label>
                  <input
                    type="text"
                    placeholder="A-304"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-[#1C1C1C] text-white border border-[#242424] rounded-full focus:outline-none focus:border-[#E50914] placeholder-[#666666]"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-2xl text-[11px] font-bold text-[#22C55E] text-center">
                🎁 New student accounts receive 9,000 Monthly Mess Credit Allowance!
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 text-xs font-black uppercase tracking-wider text-white bg-[#E50914] hover:bg-[#B91C1C] disabled:opacity-50 rounded-full transition-all duration-300 shadow-xl shadow-[#E50914]/20 flex items-center justify-center gap-2"
          >
            {loading ? <LoadingSpinner size="sm" className="border-white border-t-transparent" /> : (
              <>
                <span>CREATE ACCOUNT</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs font-bold text-[#8E8E93]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#E50914] hover:underline font-black">
              Sign In Here →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
