import React, { useState } from 'react';
import api from '../../services/api';
import { QrCode, CheckCircle2, AlertCircle, Scan, ArrowRight, Sparkles } from 'lucide-react';

export const ChefVerifyQRPage = () => {
  const [tokenInput, setTokenInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;

    try {
      setLoading(true);
      setErrorMsg(null);
      setVerificationResult(null);

      const res = await api.post('/collection/verify', { token: tokenInput.trim() });
      setVerificationResult(res.data.data);
      setTokenInput('');
    } catch (err) {
      setErrorMsg(err.message || 'Verification failed. Token invalid, expired, or already used.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#242424] pb-5">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>SCAN & VERIFY COLLECTION QR</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30 font-mono">
            Mess Staff Counter
          </span>
        </h1>
        <p className="text-sm text-[#A3A3A3] mt-1">
          Scan student meal QR code or enter Order Number to verify entitlement and mark as collected.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Verification Form */}
        <div className="md:col-span-6 bg-[#151515] border border-[#242424] rounded-3xl p-6 space-y-6">
          <div className="flex items-center gap-3 bg-[#1C1C1C] p-4 rounded-2xl border border-[#242424]">
            <div className="w-10 h-10 rounded-xl bg-[#E50914]/10 text-[#E50914] flex items-center justify-center border border-[#E50914]/20">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider">COUNTER SCANNER</h3>
              <p className="text-[11px] text-[#A3A3A3]">Camera / Barcode Reader input mode</p>
            </div>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="text-xs font-mono text-[#A3A3A3] block mb-1.5">
                Scan QR Token or Enter Order ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="e.g. QR-492019 or ORD-202608-1003"
                  className="w-full bg-[#1C1C1C] border border-[#242424] rounded-xl px-4 py-3.5 text-sm text-white font-mono font-bold focus:outline-none focus:border-[#E50914] placeholder:text-[#666666]"
                />
                <QrCode className="w-5 h-5 text-[#8E8E93] absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !tokenInput.trim()}
              className="w-full py-3.5 rounded-xl bg-[#E50914] hover:bg-[#B91C1C] text-white font-black text-xs transition shadow-lg shadow-[#E50914]/20 flex items-center justify-center gap-2"
            >
              <span>VERIFY & MARK COLLECTED</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {errorMsg && (
            <div className="p-4 bg-[#450A0A]/40 border border-[#E50914] rounded-2xl text-xs font-bold text-[#EF4444] flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Verification Result Display */}
        <div className="md:col-span-6">
          {verificationResult ? (
            <div className="bg-[#151515] border-2 border-[#22C55E] rounded-3xl p-6 text-center space-y-4 relative overflow-hidden shadow-2xl animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-[#22C55E]/20 text-[#22C55E] border-2 border-[#22C55E] flex items-center justify-center mx-auto shadow-lg shadow-[#22C55E]/30">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-black text-[#22C55E] tracking-widest uppercase block">
                  ✓ MEAL COLLECTED
                </span>
                <h2 className="text-xl font-black text-white mt-1">
                  {verificationResult.studentName}
                </h2>
                <p className="text-xs text-[#A3A3A3] font-mono mt-0.5">
                  ID: {verificationResult.studentIdStr}
                </p>
              </div>

              <div className="bg-[#1C1C1C] border border-[#242424] rounded-2xl p-4 text-left space-y-2">
                <div className="flex justify-between items-center text-xs border-b border-[#242424] pb-2">
                  <span className="text-[#A3A3A3]">Order Number</span>
                  <span className="font-mono font-extrabold text-white">{verificationResult.orderNumber}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#A3A3A3]">Collected At</span>
                  <span className="font-mono font-bold text-[#22C55E]">{verificationResult.collectedAt}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setVerificationResult(null)}
                className="w-full py-2.5 bg-[#242424] hover:bg-[#333333] text-white text-xs font-black rounded-xl"
              >
                Scan Next Meal
              </button>
            </div>
          ) : (
            <div className="bg-[#151515] border border-[#242424] rounded-3xl p-8 text-center space-y-3 h-full flex flex-col justify-center items-center">
              <QrCode className="w-12 h-12 text-[#444444]" />
              <h3 className="text-sm font-extrabold text-white">Awaiting Scan Input</h3>
              <p className="text-xs text-[#A3A3A3] max-w-xs">
                Scan student's QR code or enter their Order ID on the left to verify entitlement.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
