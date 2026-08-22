import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UtensilsCrossed, ArrowRight, AlertCircle, KeyRound, Mail } from 'lucide-react';
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
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle Red Gradient Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#E50914]/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-[#111111] border border-[#2A2A2A] rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-xl font-extrabold text-white">
            <div className="w-10 h-10 rounded-lg bg-[#E50914] text-white flex items-center justify-center shadow-lg shadow-[#E50914]/30">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            Smart <span className="text-[#E50914]">Mess</span>
          </Link>
          <h2 className="text-xl font-bold text-white tracking-tight">Sign In to Dashboard</h2>
          <p className="text-xs text-[#A3A3A3]">Select account role & enter credentials to access portal</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-[#0A0A0A] rounded-xl border border-[#242424] mb-6">
          {['STUDENT', 'CHEF', 'ADMIN'].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => handleRoleSelect(role)}
              className={`py-2 text-xs font-bold rounded-lg transition ${
                activeRole === role
                  ? 'bg-[#E50914] text-white shadow-md'
                  : 'text-[#A3A3A3] hover:text-white'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-[#450A0A] border border-[#EF4444]/30 rounded-xl flex items-center gap-3 text-[#EF4444] text-xs font-semibold">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#A3A3A3] uppercase mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm bg-[#0F0F0F] text-white border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914]/50"
                placeholder="email@vit.edu"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#A3A3A3] uppercase mb-1.5">Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm bg-[#0F0F0F] text-white border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914]/50"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#E50914] hover:bg-[#FF2D2D] disabled:opacity-50 text-white font-extrabold rounded-lg transition shadow-lg shadow-[#E50914]/20 flex items-center justify-center gap-2 text-sm mt-6"
          >
            {loading ? (
              <LoadingSpinner size="sm" className="border-white border-t-transparent" />
            ) : (
              <>
                SIGN IN <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Quick Fill Box */}
        <div className="mt-8 pt-6 border-t border-[#242424] text-center">
          <span className="text-[11px] text-[#A3A3A3] block mb-2 font-medium">Quick Demo Sign-In Credentials</span>
          <div className="p-3 bg-[#0A0A0A] rounded-xl border border-[#242424] text-[11px] font-mono text-[#FF2D2D] space-y-0.5">
            <p>Email: <span className="text-white">{email}</span></p>
            <p>Password: <span className="text-white">Password123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};
