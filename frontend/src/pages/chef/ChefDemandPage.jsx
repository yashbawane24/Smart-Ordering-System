import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { TrendingUp, Users, Utensils, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';

export const ChefDemandPage = () => {
  const [demandData, setDemandData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [targetDate, setTargetDate] = useState('today');

  const fetchDemand = async () => {
    try {
      setLoading(true);
      const dateStr = targetDate === 'today'
        ? new Date().toISOString().split('T')[0]
        : new Date(Date.now() + 86400000).toISOString().split('T')[0];

      const res = await api.get(`/demand/summary?date=${dateStr}`);
      setDemandData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemand();
  }, [targetDate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const { breakdown, itemDemand, totalStudents } = demandData || {};

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#242424] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>KITCHEN DEMAND PLANNING</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30 font-mono">
              Preparation Estimation
            </span>
          </h1>
          <p className="text-sm text-[#A3A3A3] mt-1">
            Advance meal declaration counts and estimated batch preparation servings for kitchen staff.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center bg-[#151515] p-1 rounded-2xl border border-[#242424]">
          <button
            onClick={() => setTargetDate('today')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              targetDate === 'today'
                ? 'bg-[#E50914] text-white shadow-md'
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            Today's Demand
          </button>
          <button
            onClick={() => setTargetDate('tomorrow')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              targetDate === 'tomorrow'
                ? 'bg-[#E50914] text-white shadow-md'
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            Tomorrow's Forecast ★
          </button>
        </div>
      </div>

      {/* Meal Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {['Breakfast', 'Lunch', 'Dinner'].map((meal) => {
          const m = breakdown?.[meal] || { declared: 0, skipped: 0, notDeclared: 0, expectedDemand: 0, preparationRange: '0 servings' };

          return (
            <div key={meal} className="bg-[#151515] border border-[#242424] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#242424] pb-3">
                <h3 className="text-base font-extrabold text-white">{meal}</h3>
                <span className="text-xs font-mono text-[#E50914] bg-[#E50914]/10 px-2.5 py-0.5 rounded font-bold">
                  {m.expectedDemand} Meals
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center bg-[#1C1C1C] p-2.5 rounded-xl border border-[#242424]">
                  <span className="text-[#A3A3A3]">Declared (I Will Eat)</span>
                  <span className="font-bold text-[#22C55E] font-mono">{m.declared}</span>
                </div>
                <div className="flex justify-between items-center bg-[#1C1C1C] p-2.5 rounded-xl border border-[#242424]">
                  <span className="text-[#A3A3A3]">Skipped</span>
                  <span className="font-bold text-[#A3A3A3] font-mono">{m.skipped}</span>
                </div>
                <div className="flex justify-between items-center bg-[#1C1C1C] p-2.5 rounded-xl border border-[#242424]">
                  <span className="text-[#A3A3A3]">Not Declared (60% Est.)</span>
                  <span className="font-bold text-[#F59E0B] font-mono">{m.notDeclared}</span>
                </div>
              </div>

              <div className="bg-[#450A0A]/40 border border-[#E50914]/40 rounded-xl p-3 text-center space-y-1">
                <span className="text-[10px] font-mono text-[#A3A3A3] uppercase block">RECOMMENDED BATCH PREPARATION</span>
                <span className="text-sm font-extrabold text-white font-mono">{m.preparationRange}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Food Item Demand Section */}
      <div className="bg-[#151515] border border-[#242424] rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <Utensils className="w-5 h-5 text-[#E50914]" />
          <span>FOOD ITEM PRE-BOOKINGS & CAPACITY</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {itemDemand?.map((item) => (
            <div key={item.id} className="bg-[#1C1C1C] border border-[#242424] rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-extrabold text-white">{item.name}</h4>
                  <span className="text-[10px] text-[#A3A3A3] font-mono">{item.category}</span>
                </div>
                {item.isSoldOut ? (
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-[#E50914] text-white rounded">SOLD OUT</span>
                ) : (
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-[#22C55E]/20 text-[#22C55E] rounded">AVAILABLE</span>
                )}
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-[#A3A3A3] font-mono text-[11px]">
                  <span>Pre-booked / Capacity</span>
                  <span className="text-white font-bold">{item.preBooked} / {item.capacity}</span>
                </div>
                <div className="w-full h-2 bg-[#242424] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.isSoldOut ? 'bg-[#333333]' : 'bg-[#E50914]'}`}
                    style={{ width: `${Math.min(100, (item.preBooked / item.capacity) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
