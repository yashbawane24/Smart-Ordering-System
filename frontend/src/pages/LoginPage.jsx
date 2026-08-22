import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UtensilsCrossed, ArrowRight, AlertCircle, KeyRound, Mail, Sparkles } from 'lucide-react';
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
    switch (role) {
      case 'STUDENT':
        setEmail('student@vit.edu');
        setPassword('Password123');
        break;
      case 'CHEF':
        setEmail('chef@vit.edu');
        setPassword('Password123');
        break;
      case 'ADMIN':
        setEmail('admin@vit.edu');
        setPassword('Password123');
        break;
      default:
        break;
    }
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
    <div className="min-h-screen bg-ambient-glow text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Ambient Red Lighting Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#E50914]/12 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#B91C1C]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-[#141414] border border-[#222222] rounded-3xl p-8 shadow-2xl backdrop-blur-2xl">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 text-2xl font-black text-white">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF2B2B] to-[#B91C1C] text-white flex items-center justify-center shadow-lg shadow-[#E50914]/30">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <span>
              Smart <span className="text-[#FF2B2B]">Mess</span>
            </span>
          </Link>
          <p className="text-[11px] font-black tracking-widest text-[#E50914] uppercase flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-[#E50914]" /> SMART ORDERING. LESS WAITING.
          </p>
          <h2 className="text-lg font-bold text-white tracking-tight pt-1">Welcome Back</h2>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-[#0A0A0A] rounded-2xl border border-[#222222] mb-6">
          {['STUDENT', 'CHEF', 'ADMIN'].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => handleRoleSelect(role)}
              className={`py-2 text-xs font-black rounded-xl transition ${
                activeRole === role
                  ? 'bg-[#E50914] text-white shadow-md shadow-[#E50914]/30'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-[#330808] border border-[#7F1D1D] rounded-2xl flex items-center gap-3 text-[#FF4D4D] text-xs font-semibold">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-[#888888] uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666666]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-[#0B0B0B] text-white border border-[#222222] rounded-xl focus:outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914]/50 transition"
                placeholder="email@vit.edu"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-[#888888] uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666666]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-[#0B0B0B] text-white border border-[#222222] rounded-xl focus:outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914]/50 transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#E50914] hover:bg-[#FF2B2B] disabled:opacity-50 text-white font-black rounded-xl transition shadow-lg shadow-[#E50914]/25 flex items-center justify-center gap-2 text-xs uppercase tracking-wider mt-6 btn-red-glow"
          >
            {loading ? (
              <LoadingSpinner size="sm" className="border-white border-t-transparent" />
            ) : (
              <>
                <span>SIGN IN</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Quick Fill Box */}
        <div className="mt-8 pt-6 border-t border-[#1F1F1F] text-center">
          <span className="text-[11px] text-[#737373] block mb-2 font-semibold">Quick Demo Sign-In Credentials</span>
          <div className="p-3 bg-[#0A0A0A] rounded-2xl border border-[#222222] text-[11px] font-mono text-[#FF2B2B] space-y-0.5">
            <p>Email: <span className="text-white">{email}</span></p>
            <p>Password: <span className="text-white">Password123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

