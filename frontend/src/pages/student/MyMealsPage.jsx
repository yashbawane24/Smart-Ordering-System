import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle, Sparkles, HeartPulse } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';
import { StudentSickDeliveryTab } from '../../components/student/StudentSickDeliveryTab.jsx';

export const MyMealsPage = () => {
  const [activeTab, setActiveTab] = useState('tomorrow');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchDeclarations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/meals/declarations');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeclarations();
  }, []);

  const handleDeclare = async (mealType, status) => {
    try {
      setUpdating(true);
      setMsg(null);
      const dateStr = activeTab === 'today' ? data.today : data.tomorrow;
      await api.post('/meals/declarations', {
        mealDate: dateStr,
        mealType,
        status
      });
      setMsg({ type: 'success', text: `${mealType} marked as ${status === 'DECLARED' ? 'I WILL EAT' : 'SKIPPED'}` });
      await fetchDeclarations();
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Cutoff passed or declaration failed' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const selectedDate = activeTab === 'today' ? data?.today : data?.tomorrow;
  const declarationsForDate = data?.declarations?.[selectedDate] || {};

  const mealCardsConfig = [
    {
      type: 'Breakfast',
      title: 'BREAKFAST',
      time: '7:00 AM – 9:00 AM',
      deadline: 'Cutoff: 6:30 AM',
      icon: '🌅'
    },
    {
      type: 'Lunch',
      title: 'LUNCH',
      time: '12:30 PM – 2:30 PM',
      deadline: 'Cutoff: 11:00 AM',
      icon: '☀️'
    },
    {
      type: 'Dinner',
      title: 'DINNER',
      time: '7:30 PM – 9:30 PM',
      deadline: 'Cutoff: 6:30 PM',
      icon: '🌙'
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#242424] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>MY MEALS</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30 uppercase font-mono">
              Institutional Meal Management
            </span>
          </h1>
          <p className="text-sm text-[#A3A3A3] mt-1">
            Plan upcoming meal participation or request warden-approved sick meal delivery.
          </p>
        </div>

        {/* Date / Sick Delivery Selector Tabs */}
        <div className="flex items-center bg-[#151515] p-1 rounded-2xl border border-[#242424] overflow-x-auto">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap ${
              activeTab === 'today'
                ? 'bg-[#242424] text-white shadow-md'
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            Today ({data?.today})
          </button>
          <button
            onClick={() => setActiveTab('tomorrow')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap ${
              activeTab === 'tomorrow'
                ? 'bg-[#E50914] text-white shadow-md'
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            Tomorrow ({data?.tomorrow}) ★
          </button>
          <button
            onClick={() => setActiveTab('sick_delivery')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'sick_delivery'
                ? 'bg-[#E50914] text-white shadow-md'
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Sick Meal Delivery</span>
          </button>
        </div>
      </div>

      {activeTab === 'sick_delivery' ? (
        <StudentSickDeliveryTab />
      ) : (
        <>

      {msg && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
            msg.type === 'success'
              ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30'
              : 'bg-[#E50914]/10 text-[#E50914] border-[#E50914]/30'
          }`}
        >
          {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {mealCardsConfig.map((item) => {
          const state = declarationsForDate[item.type] || { status: 'NOT_DECLARED', cutoffPassed: false };
          const isDeclared = state.status === 'DECLARED';
          const isSkipped = state.status === 'SKIPPED';
          const isDisabled = state.cutoffPassed;

          return (
            <div
              key={item.type}
              className={`bg-[#151515] border rounded-2xl p-5 flex flex-col justify-between transition relative overflow-hidden ${
                isDeclared
                  ? 'border-[#E50914]/50 shadow-lg shadow-[#E50914]/10'
                  : isSkipped
                  ? 'border-[#333333]'
                  : 'border-[#242424]'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{item.icon}</span>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#A3A3A3] bg-[#1C1C1C] px-2.5 py-1 rounded-full border border-[#242424]">
                    <Clock className="w-3 h-3 text-[#E50914]" />
                    <span>{item.deadline}</span>
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-white">{item.title}</h3>
                <p className="text-xs text-[#A3A3A3] mt-0.5 font-mono">{item.time}</p>

                {/* Status Badge */}
                <div className="mt-4">
                  {isDeclared && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#22C55E] bg-[#22C55E]/10 px-3 py-1 rounded-lg border border-[#22C55E]/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Status: I WILL EAT
                    </span>
                  )}
                  {isSkipped && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A3A3A3] bg-[#222222] px-3 py-1 rounded-lg border border-[#333333]">
                      <XCircle className="w-3.5 h-3.5" />
                      Status: SKIPPED
                    </span>
                  )}
                  {!isDeclared && !isSkipped && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-3 py-1 rounded-lg border border-[#F59E0B]/20">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Status: NOT DECLARED
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2">
                {isDisabled ? (
                  <div className="p-3 bg-[#1C1C1C] rounded-xl border border-[#242424] text-center text-xs text-[#8E8E93]">
                    Cutoff deadline passed. Editing disabled.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={updating}
                      onClick={() => handleDeclare(item.type, 'DECLARED')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-black transition border flex items-center justify-center gap-1.5 ${
                        isDeclared
                          ? 'bg-[#450A0A] text-white border-[#E50914] shadow-md shadow-[#E50914]/20'
                          : 'bg-[#1C1C1C] text-white hover:bg-[#252525] border-[#242424]'
                      }`}
                    >
                      <span>I WILL EAT</span>
                    </button>

                    <button
                      type="button"
                      disabled={updating}
                      onClick={() => handleDeclare(item.type, 'SKIPPED')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-black transition border flex items-center justify-center gap-1.5 ${
                        isSkipped
                          ? 'bg-[#222222] text-white border-[#444444]'
                          : 'bg-[#1C1C1C] text-[#A3A3A3] hover:text-white border-[#242424]'
                      }`}
                    >
                      <span>SKIP MEAL</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      </>
      )}
    </div>
  );
};
