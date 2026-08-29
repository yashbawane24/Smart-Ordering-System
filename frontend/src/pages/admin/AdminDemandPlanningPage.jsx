import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { TrendingUp, Users, Sliders, CheckCircle2, AlertTriangle } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminDemandPlanningPage = () => {
  const [demand, setDemand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [participationRate, setParticipationRate] = useState(60);

  const fetchDemand = async () => {
    try {
      setLoading(true);
      const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      const res = await api.get(`/demand/summary?date=${tomorrowStr}`);
      setDemand(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemand();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const { breakdown, totalStudents, itemDemand } = demand || {};

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#242424] pb-5">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>TOMORROW'S MEAL DEMAND PLANNING</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30 font-mono">
            Kitchen Preparation Range
          </span>
        </h1>
        <p className="text-sm text-[#A3A3A3] mt-1">
          Configure participation estimation models to forecast exact batch quantities for tomorrow's meals.
        </p>
      </div>

      {/* Participation Estimation Control Bar */}
      <div className="bg-[#151515] border border-[#242424] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sliders className="w-5 h-5 text-[#E50914]" />
          <div>
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
              NOT DECLARED PARTICIPATION RATE
            </h3>
            <p className="text-[11px] text-[#A3A3A3]">
              Estimated % of non-declaring students expected to attend mess
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="range"
            min="30"
            max="90"
            step="5"
            value={participationRate}
            onChange={(e) => setParticipationRate(Number(e.target.value))}
            className="w-36 accent-[#E50914]"
          />
          <span className="text-sm font-extrabold text-white font-mono bg-[#1C1C1C] px-3 py-1.5 rounded-xl border border-[#242424]">
            {participationRate}%
          </span>
        </div>
      </div>

      {/* Demand Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {['Breakfast', 'Lunch', 'Dinner'].map((meal) => {
          const raw = breakdown?.[meal] || { declared: 350, skipped: 50, notDeclared: 30 };
          const estimatedExtra = Math.round(raw.notDeclared * (participationRate / 100));
          const totalExpected = raw.declared + estimatedExtra;
          const minRange = totalExpected;
          const maxRange = Math.round(totalExpected * 1.04);

          return (
            <div key={meal} className="bg-[#151515] border border-[#242424] rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-[#242424] pb-3">
                <h3 className="text-base font-extrabold text-white">{meal}</h3>
                <span className="text-xs font-mono font-bold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded">
                  Forecast Active
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-[#1C1C1C] p-2.5 rounded-xl border border-[#242424]">
                  <span className="text-[#A3A3A3]">Declared (I Will Eat)</span>
                  <span className="font-bold text-white font-mono">{raw.declared}</span>
                </div>
                <div className="flex justify-between bg-[#1C1C1C] p-2.5 rounded-xl border border-[#242424]">
                  <span className="text-[#A3A3A3]">Declared Skipped</span>
                  <span className="font-bold text-[#A3A3A3] font-mono">{raw.skipped}</span>
                </div>
                <div className="flex justify-between bg-[#1C1C1C] p-2.5 rounded-xl border border-[#242424]">
                  <span className="text-[#A3A3A3]">Not Declared ({raw.notDeclared} × {participationRate}%)</span>
                  <span className="font-bold text-[#F59E0B] font-mono">+{estimatedExtra}</span>
                </div>
              </div>

              <div className="bg-[#450A0A]/40 border border-[#E50914]/40 rounded-xl p-3.5 text-center space-y-1">
                <span className="text-[10px] font-mono text-[#A3A3A3] uppercase block">EXPECTED PREPARATION RANGE</span>
                <span className="text-base font-extrabold text-white font-mono">{minRange} – {maxRange} servings</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
