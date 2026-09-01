import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Settings,
  Leaf,
  RefreshCw,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  Scale,
  Percent,
  Layers,
  History
} from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminSustainabilityPage = () => {
  const [config, setConfig] = useState({
    historicalParticipationRate: 0.75,
    averageMealEquivalentKg: 0.45,
    breakfastCutoff: '22:00',
    lunchCutoff: '09:00',
    dinnerCutoff: '15:00',
    calculationVersion: 'v1.0'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recalculating, setRecalculating] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await api.get('/sustainability/public');
      if (res.data?.config) {
        setConfig(res.data.config);
      }
    } catch (err) {
      console.error('Failed to fetch sustainability config', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMsg(null);
      await api.put('/sustainability/config', config);
      setMsg({ type: 'success', text: 'Sustainability methodology parameters updated successfully.' });
      await fetchConfig();
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Failed to save configuration' });
    } finally {
      setSaving(false);
    }
  };

  const handleRecalculate = async () => {
    try {
      setRecalculating(true);
      setMsg(null);
      const res = await api.post('/sustainability/recalculate', { days: 30 });
      setMsg({ type: 'success', text: `Recalculated historical metrics for past 30 days based on active database records.` });
      await fetchConfig();
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Failed to recalculate metrics' });
    } finally {
      setRecalculating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#242424] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>SUSTAINABILITY METHODOLOGY SETTINGS</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 uppercase font-mono font-bold">
              Admin Configuration
            </span>
          </h1>
          <p className="text-sm text-[#A3A3A3] mt-1">
            Configure demand baseline assumptions, conversion factors, and trigger metric recalculations.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRecalculate}
          disabled={recalculating}
          className="px-4 py-2.5 bg-[#242424] hover:bg-[#333333] text-[#10B981] border border-[#10B981]/30 font-bold text-xs rounded-xl transition flex items-center gap-2 shrink-0 self-start md:self-auto shadow-md"
        >
          {recalculating ? <LoadingSpinner size="sm" /> : <RefreshCw className="w-4 h-4" />}
          <span>RECALCULATE PAST 30 DAYS</span>
        </button>
      </div>

      {msg && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-between ${
            msg.type === 'success'
              ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30'
              : 'bg-[#E50914]/15 text-[#FF6B60] border-[#E50914]/30'
          }`}
        >
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)} className="text-current font-bold text-base">
            ×
          </button>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveConfig} className="space-y-6">
        <div className="bg-[#151515] border border-[#242424] rounded-2xl p-6 md:p-8 space-y-6">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#242424] pb-3">
            <Percent className="w-4 h-4 text-[#10B981]" />
            <span>Demand Baseline & Weight Conversion Parameters</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-extrabold text-white block mb-1">
                Historical Participation Rate (0.0 – 1.0)
              </label>
              <p className="text-[11px] text-[#A3A3A3] mb-2">
                The assumed percentage of eligible students who turn up for meals under standard operation.
              </p>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  max="1.0"
                  required
                  value={config.historicalParticipationRate}
                  onChange={(e) => setConfig({ ...config, historicalParticipationRate: parseFloat(e.target.value) })}
                  className="w-full bg-[#1C1C1C] border border-[#2B2B2B] rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[#10B981] focus:outline-none font-mono"
                />
                <span className="absolute right-3 top-2.5 text-xs text-[#8E8E93] font-mono">
                  ({Math.round(config.historicalParticipationRate * 100)}%)
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-extrabold text-white block mb-1">
                Average Meal Equivalent (kg per meal)
              </label>
              <p className="text-[11px] text-[#A3A3A3] mb-2">
                Documented estimated raw food preparation weight equivalent for one institutional meal.
              </p>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  max="2.0"
                  required
                  value={config.averageMealEquivalentKg}
                  onChange={(e) => setConfig({ ...config, averageMealEquivalentKg: parseFloat(e.target.value) })}
                  className="w-full bg-[#1C1C1C] border border-[#2B2B2B] rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[#10B981] focus:outline-none font-mono"
                />
                <span className="absolute right-3 top-2.5 text-xs text-[#8E8E93] font-mono">
                  kg / meal
                </span>
              </div>
            </div>
          </div>

          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#242424] pb-3 pt-4">
            <Clock className="w-4 h-4 text-[#E50914]" />
            <span>Preparation Cutoff Times & Versioning</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-[#A3A3A3] block mb-1">Breakfast Cutoff</label>
              <input
                type="text"
                required
                value={config.breakfastCutoff}
                onChange={(e) => setConfig({ ...config, breakfastCutoff: e.target.value })}
                placeholder="22:00"
                className="w-full bg-[#1C1C1C] border border-[#2B2B2B] rounded-xl px-3 py-2 text-xs text-white focus:border-[#10B981] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#A3A3A3] block mb-1">Lunch Cutoff</label>
              <input
                type="text"
                required
                value={config.lunchCutoff}
                onChange={(e) => setConfig({ ...config, lunchCutoff: e.target.value })}
                placeholder="09:00"
                className="w-full bg-[#1C1C1C] border border-[#2B2B2B] rounded-xl px-3 py-2 text-xs text-white focus:border-[#10B981] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#A3A3A3] block mb-1">Dinner Cutoff</label>
              <input
                type="text"
                required
                value={config.dinnerCutoff}
                onChange={(e) => setConfig({ ...config, dinnerCutoff: e.target.value })}
                placeholder="15:00"
                className="w-full bg-[#1C1C1C] border border-[#2B2B2B] rounded-xl px-3 py-2 text-xs text-white focus:border-[#10B981] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#A3A3A3] block mb-1">Methodology Version</label>
              <input
                type="text"
                required
                value={config.calculationVersion}
                onChange={(e) => setConfig({ ...config, calculationVersion: e.target.value })}
                placeholder="v1.0"
                className="w-full bg-[#1C1C1C] border border-[#2B2B2B] rounded-xl px-3 py-2 text-xs text-white focus:border-[#10B981] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-[#E50914] hover:bg-[#B91C1C] text-white font-extrabold text-xs rounded-xl shadow-lg shadow-[#E50914]/30 transition flex items-center gap-2"
            >
              {saving ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
              <span>SAVE METHODOLOGY PARAMETERS</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
