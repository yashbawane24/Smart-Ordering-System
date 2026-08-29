import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Flame, ArrowRight, AlertCircle, KeyRound, Mail, Sparkles, UserCheck } from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const LoginPage = () => {
  const [email, setEmail] = useState('student@vit.edu');
  const [password, setPassword] = useState('Password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState('STUDENT');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setActiveRole(role);
    setError('');
    if (role === 'STUDENT') {
      setEmail('student@vit.edu');
      setPassword('Password123');
    } else if (role === 'CHEF') {
      setEmail('chef@vit.edu');
      setPassword('Password123');
    } else if (role === 'ADMIN') {
      setEmail('admin@vit.edu');
      setPassword('Password123');
    }
  };

  const handleQuickDemo = (demoEmail, demoPassword, role) => {
    setActiveRole(role);
    setEmail(demoEmail);
    setPassword(demoPassword);
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
      <div className="relative z-10 w-full max-w-md bg-[#151515] border border-[#242424] rounded-[32px] p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5 text-2xl font-black text-white">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E50914] to-[#B91C1C] text-white flex items-center justify-center shadow-lg shadow-[#E50914]/40 transform rotate-[-6deg]">
              <Flame className="w-6 h-6 fill-white" />
            </div>
            <span>
              Smart <span className="text-[#E50914]">Campus</span>
            </span>
          </Link>
          <p className="text-[11px] font-black tracking-widest text-[#E50914] uppercase flex items-center justify-center gap-1 pt-1">
            <Sparkles className="w-3.5 h-3.5 text-[#E50914]" /> MESS MANAGEMENT PORTAL
          </p>
          <h2 className="text-lg font-extrabold text-white tracking-tight pt-1">Sign In to Account</h2>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#1C1C1C] rounded-full border border-[#242424] mb-4">
          {['STUDENT', 'CHEF', 'ADMIN'].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => handleRoleSelect(role)}
              className={`py-2 text-[11px] font-black rounded-full transition-all duration-300 ${
                activeRole === role
                  ? 'bg-[#E50914] text-white shadow-md'
                  : 'text-[#8E8E93] hover:text-white'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Quick Demo Credentials Autofill Banner */}
        <div className="bg-[#1C1C1C] border border-[#242424] p-3 rounded-2xl mb-5 text-center space-y-2">
          <span className="text-[10px] font-mono text-[#A3A3A3] uppercase block font-bold">Quick Demo Login</span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemo('student@vit.edu', 'Password123', 'STUDENT')}
              className="py-1.5 px-2 bg-[#242424] hover:bg-[#E50914] text-white text-[10px] font-black rounded-xl transition border border-[#333333]"
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('chef@vit.edu', 'Password123', 'CHEF')}
              className="py-1.5 px-2 bg-[#242424] hover:bg-[#E50914] text-white text-[10px] font-black rounded-xl transition border border-[#333333]"
            >
              Chef
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin@vit.edu', 'Password123', 'ADMIN')}
              className="py-1.5 px-2 bg-[#242424] hover:bg-[#E50914] text-white text-[10px] font-black rounded-xl transition border border-[#333333]"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-4 bg-[#450A0A] border border-[#E50914] rounded-2xl flex items-center gap-3 text-[#F87171] text-xs font-semibold">
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
                className="w-full pl-11 pr-4 py-3 text-xs bg-[#1C1C1C] text-white border border-[#242424] rounded-full focus:outline-none focus:border-[#E50914] transition placeholder:text-[#666666]"
                placeholder="student@vit.edu"
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
                className="w-full pl-11 pr-4 py-3 text-xs bg-[#1C1C1C] text-white border border-[#242424] rounded-full focus:outline-none focus:border-[#E50914] transition placeholder:text-[#666666]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#E50914] hover:bg-[#B91C1C] disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest rounded-full transition-all duration-300 shadow-xl border border-[#E50914] flex items-center justify-center gap-2 mt-6"
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
        <div className="mt-6 pt-5 border-t border-[#242424] text-center">
          <p className="text-xs font-bold text-[#8E8E93]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#E50914] hover:underline font-black">
              Register Here →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
