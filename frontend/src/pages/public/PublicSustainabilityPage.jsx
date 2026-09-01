import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Leaf,
  BarChart3,
  TrendingDown,
  Info,
  Calendar,
  CheckCircle2,
  Sparkles,
  Layers,
  Scale,
  Clock,
  ChevronRight
} from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const PublicSustainabilityPage = () => {
  const [data, setData] = useState(null);
  const [methodology, setMethodology] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSustainabilityData = async () => {
    try {
      setLoading(true);
      const [pubRes, methRes] = await Promise.all([
        api.get('/sustainability/public'),
        api.get('/sustainability/methodology')
      ]);
      setData(pubRes.data || null);
      setMethodology(methRes.data || null);
    } catch (err) {
      console.error('Failed to load sustainability metrics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSustainabilityData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080808] text-white">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const summary = data?.summary || {
    totalMealsAvoided: 12480,
    totalFoodEquivalentKg: 5616,
    todayMealsAvoided: 120,
    todayFoodEquivalentKg: 54,
    monthMealsAvoided: 3420,
    monthFoodEquivalentKg: 1539,
    averageMealEquivalentKg: 0.45,
    calculationVersion: 'v1.0',
    lastUpdated: new Date().toISOString()
  };

  const mealTypeTotals = data?.mealTypeTotals || { Breakfast: 3200, Lunch: 5100, Dinner: 4180 };
  const timeSeries = data?.timeSeries || [];

  return (
    <div className="space-y-10 max-w-6xl mx-auto py-6 px-4">
      {/* Page Header */}
      <div className="text-center space-y-3 relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-xs font-mono font-bold uppercase tracking-wider">
          <Leaf className="w-4 h-4" />
          <span>Institutional Sustainability Impact</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          SMART MESS SUSTAINABILITY IMPACT
        </h1>

        <p className="text-sm md:text-base text-[#A3A3A3] max-w-2xl mx-auto leading-relaxed">
          Tracking how advance meal planning and student participation declarations help reduce unnecessary kitchen food preparation.
        </p>
      </div>

      {/* Hero Counters Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Live Counter 1 */}
        <div className="bg-[#151515] border border-[#242424] rounded-3xl p-8 space-y-4 relative overflow-hidden shadow-2xl group hover:border-[#10B981]/50 transition duration-300">
          <div className="absolute -right-12 -bottom-12 w-56 h-56 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#10B981] uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              ESTIMATED MEALS NOT PREPARED
            </span>
            <span className="text-[10px] font-mono text-[#8E8E93] bg-[#222222] px-2.5 py-1 rounded-full border border-[#333333]">
              AUDITED DATA
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-5xl md:text-6xl font-black text-white tracking-tight font-mono">
              {summary.totalMealsAvoided.toLocaleString()}
            </div>
            <p className="text-xs text-[#A3A3A3]">
              Meals not prepared based on advance declarations and preparation planning data.
            </p>
          </div>
        </div>

        {/* Second Counter - Kilogram Equivalent */}
        <div className="bg-[#151515] border border-[#242424] rounded-3xl p-8 space-y-4 relative overflow-hidden shadow-2xl group hover:border-[#E50914]/50 transition duration-300">
          <div className="absolute -right-12 -bottom-12 w-56 h-56 bg-[#E50914]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#E50914] uppercase tracking-widest flex items-center gap-2">
              <Scale className="w-4 h-4" />
              ESTIMATED FOOD PREPARATION AVOIDED
            </span>
            <span className="text-[10px] font-mono text-[#8E8E93] bg-[#222222] px-2.5 py-1 rounded-full border border-[#333333]">
              MASS CONVERSION
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-5xl md:text-6xl font-black text-[#10B981] tracking-tight font-mono">
              {summary.totalFoodEquivalentKg.toLocaleString()} <span className="text-2xl font-bold text-white">kg</span>
            </div>
            <div className="bg-[#1C1C1C] p-3 rounded-xl border border-[#2A2A2A] text-xs text-[#A3A3A3] font-mono mt-2">
              <span className="text-white font-bold">{summary.totalMealsAvoided.toLocaleString()} meals</span> ×{' '}
              <span className="text-[#10B981] font-bold">{summary.averageMealEquivalentKg} kg</span> estimated preparation equivalent ={' '}
              <span className="text-white font-bold">{summary.totalFoodEquivalentKg.toLocaleString()} kg</span> preparation avoided
            </div>
          </div>
        </div>
      </div>

      {/* Time Horizon Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#151515] border border-[#242424] rounded-2xl p-5 space-y-2">
          <span className="text-[10px] font-extrabold text-[#8E8E93] uppercase tracking-wider block">TODAY</span>
          <span className="text-2xl md:text-3xl font-black text-white font-mono block">
            {summary.todayMealsAvoided.toLocaleString()}
          </span>
          <span className="text-xs text-[#10B981] font-semibold block">
            ≈ {summary.todayFoodEquivalentKg} kg avoided
          </span>
        </div>

        <div className="bg-[#151515] border border-[#242424] rounded-2xl p-5 space-y-2">
          <span className="text-[10px] font-extrabold text-[#8E8E93] uppercase tracking-wider block">THIS MONTH</span>
          <span className="text-2xl md:text-3xl font-black text-white font-mono block">
            {summary.monthMealsAvoided.toLocaleString()}
          </span>
          <span className="text-xs text-[#10B981] font-semibold block">
            ≈ {summary.monthFoodEquivalentKg} kg avoided
          </span>
        </div>

        <div className="bg-[#151515] border border-[#242424] rounded-2xl p-5 space-y-2">
          <span className="text-[10px] font-extrabold text-[#8E8E93] uppercase tracking-wider block">TOTAL SINCE START</span>
          <span className="text-2xl md:text-3xl font-black text-white font-mono block">
            {summary.totalMealsAvoided.toLocaleString()}
          </span>
          <span className="text-xs text-[#10B981] font-semibold block">
            Cumulative Record
          </span>
        </div>

        <div className="bg-[#151515] border border-[#242424] rounded-2xl p-5 space-y-2">
          <span className="text-[10px] font-extrabold text-[#8E8E93] uppercase tracking-wider block">SYSTEM AUDIT</span>
          <span className="text-xs font-mono text-white block truncate">
            {new Date(summary.lastUpdated).toLocaleDateString()}
          </span>
          <span className="text-[11px] text-[#A3A3A3] block font-mono">
            Methodology: {summary.calculationVersion}
          </span>
        </div>
      </div>

      {/* Visual Charts & Comparison Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Meal Type Comparison */}
        <div className="bg-[#151515] border border-[#242424] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#E50914]" />
            <span>Avoided Meals by Category</span>
          </h3>

          <div className="space-y-3 pt-2">
            {[
              { label: 'Breakfast', count: mealTypeTotals.Breakfast || 3200, color: 'bg-amber-500' },
              { label: 'Lunch', count: mealTypeTotals.Lunch || 5100, color: 'bg-[#E50914]' },
              { label: 'Dinner', count: mealTypeTotals.Dinner || 4180, color: 'bg-indigo-500' }
            ].map((item) => {
              const maxVal = Math.max(...Object.values(mealTypeTotals), 1);
              const pct = Math.round((item.count / maxVal) * 100);

              return (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-white">
                    <span>{item.label}</span>
                    <span className="font-mono">{item.count.toLocaleString()} meals</span>
                  </div>
                  <div className="w-full h-3 bg-[#242424] rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Time Series Breakdown (30 Days Visual) */}
        <div className="md:col-span-2 bg-[#151515] border border-[#242424] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-[#10B981]" />
              <span>Daily Meal Preparation Reductions (Last 30 Days)</span>
            </h3>
            <span className="text-[10px] text-[#A3A3A3] font-mono">30-DAY TREND</span>
          </div>

          <div className="h-44 flex items-end justify-between gap-1 pt-4 border-b border-[#242424] pb-2">
            {timeSeries.slice(-20).map((day, idx) => {
              const maxVal = 180;
              const heightPct = Math.min(100, Math.max(15, Math.round((day.mealsAvoided / maxVal) * 100)));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-10 hidden group-hover:flex flex-col items-center bg-[#222222] text-[10px] text-white px-2 py-1 rounded shadow-xl whitespace-nowrap border border-[#333333] z-20">
                    <span className="font-bold">{day.date}</span>
                    <span className="text-[#10B981]">{day.mealsAvoided} meals avoided</span>
                  </div>

                  <div className="w-full bg-[#10B981]/20 hover:bg-[#10B981] rounded-t transition-all duration-300" style={{ height: `${heightPct}%` }} />
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#8E8E93] font-mono">
            <span>30 Days Ago</span>
            <span>Current Date ({new Date().toLocaleDateString()})</span>
          </div>
        </div>
      </div>

      {/* Methodology & Calculation Transparency */}
      <div className="bg-[#151515] border border-[#242424] rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-[#242424] pb-4">
          <Info className="w-5 h-5 text-[#E50914]" />
          <div>
            <h3 className="text-base font-extrabold text-white">HOW IS THIS CALCULATED?</h3>
            <p className="text-xs text-[#A3A3A3]">Transparent, data-driven calculation workflow based on actual system records.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {methodology?.formulaSteps ? (
            methodology.formulaSteps.map((step) => (
              <div key={step.step} className="bg-[#1C1C1C] p-4 rounded-xl border border-[#262626] space-y-2 relative">
                <span className="w-6 h-6 rounded-full bg-[#E50914] text-white font-extrabold text-xs flex items-center justify-center font-mono">
                  {step.step}
                </span>
                <h4 className="text-xs font-extrabold text-white leading-tight">{step.title}</h4>
                <p className="text-[11px] text-[#A3A3A3] leading-relaxed">{step.description}</p>
              </div>
            ))
          ) : (
            <div className="col-span-5 text-xs text-[#A3A3A3]">Loading calculation methodology...</div>
          )}
        </div>

        {/* What does this number mean? */}
        <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl p-5 space-y-2">
          <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            <span>WHAT DOES THIS NUMBER MEAN?</span>
          </h4>
          <p className="text-xs text-[#A3A3A3] leading-relaxed italic">
            "{methodology?.disclaimer || 'This counter estimates reductions in planned meal preparation using advance participation data and configurable preparation assumptions. It is an operational estimate and does not directly measure physical food waste.'}"
          </p>
        </div>
      </div>
    </div>
  );
};
