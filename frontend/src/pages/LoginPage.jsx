import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Flame, ArrowRight, AlertCircle, KeyRound, Mail, Sparkles } from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState('STUDENT');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setActiveRole(role);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'STUDENT') navigate('/student');
      else if (loggedUser.role === 'CHEF') navigate('/chef');
      else if (loggedUser.role === 'ADMIN') navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid email or password credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-reference-outer text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      
      <div className="relative z-10 w-full max-w-md bg-[#1A1A1A] border border-[#2B2B2B] rounded-[32px] p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 text-2xl font-black text-white">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF3B30] to-[#FF6B60] text-white flex items-center justify-center shadow-lg shadow-[#FF3B30]/40">
              <Flame className="w-6 h-6 fill-white" />
            </div>
            <span>
              Smart <span className="text-[#FF3B30]">Mess</span>
            </span>
          </Link>
          <p className="text-[11px] font-black tracking-widest text-[#FF3B30] uppercase flex items-center justify-center gap-1 pt-1">
            <Sparkles className="w-3.5 h-3.5 text-[#FF3B30]" /> SMART ORDERING. ZERO WAITING.
          </p>
          <h2 className="text-lg font-black text-white tracking-tight pt-1">Sign In to Portal</h2>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#141414] rounded-full border border-[#2D2D2D] mb-6">
          {['STUDENT', 'CHEF', 'ADMIN'].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => handleRoleSelect(role)}
              className={`py-2 text-[11px] font-extrabold rounded-full transition-all duration-300 ${
                activeRole === role
                  ? 'btn-red-pill text-white'
                  : 'text-[#8E8E93] hover:text-white'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-[#3D0A0A] border border-[#7F1D1D] rounded-2xl flex items-center gap-3 text-[#FF4D4D] text-xs font-semibold">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-[#8E8E93] uppercase tracking-widest mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 text-xs bg-[#242424] text-white border border-[#333333] rounded-full focus:outline-none focus:border-[#FF3B30] transition placeholder:text-[#666666]"
                placeholder="student@college.edu.in"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-[#8E8E93] uppercase tracking-widest mb-1.5">Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 text-xs bg-[#242424] text-white border border-[#333333] rounded-full focus:outline-none focus:border-[#FF3B30] transition placeholder:text-[#666666]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-4 bg-[#FF3B30] hover:brightness-110 disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest rounded-full transition-all duration-300 shadow-xl border border-[#FF3B30] flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" className="border-white border-t-transparent" />
                <span>SIGNING IN...</span>
              </div>
            ) : (
              <>
                <span>SIGN IN TO PORTAL</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Registration Link */}
        <div className="mt-8 pt-6 border-t border-[#2D2D2D] text-center">
          <p className="text-xs font-bold text-[#8E8E93]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#FF3B30] hover:underline font-black">
              Register Here →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};




