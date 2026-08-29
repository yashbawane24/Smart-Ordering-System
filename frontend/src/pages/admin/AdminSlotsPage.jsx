import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Layers, Clock, Users, Plus, ShieldCheck } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminSlotsPage = () => {
  const [mealType, setMealType] = useState('Lunch');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/meal-slots?mealType=${mealType}`);
      setSlots(res.data.data?.slots || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [mealType]);

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
            <span>MEAL SLOT & CAPACITY CONFIGURATION</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30 font-mono">
              Crowd Control Settings
            </span>
          </h1>
          <p className="text-sm text-[#A3A3A3] mt-1">
            Set capacity limits and timing windows for campus mess counter pickup slots.
          </p>
        </div>

        {/* Meal Filter */}
        <div className="flex items-center bg-[#151515] p-1 rounded-2xl border border-[#242424]">
          {['Breakfast', 'Lunch', 'Dinner'].map((type) => (
            <button
              key={type}
              onClick={() => setMealType(type)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                mealType === type
                  ? 'bg-[#E50914] text-white shadow-md'
                  : 'text-[#A3A3A3] hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Slots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {slots.map((slot) => (
          <div key={slot.id} className="bg-[#151515] border border-[#242424] rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono text-[#A3A3A3] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#E50914]" /> {slot.mealType}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-[#22C55E]/20 text-[#22C55E] rounded">
                ACTIVE
              </span>
            </div>

            <h3 className="text-lg font-extrabold text-white">
              {slot.startTime} – {slot.endTime}
            </h3>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-[#A3A3A3]">
                <span>Current Bookings</span>
                <span className="text-white font-mono font-bold">{slot.bookedCount} / {slot.capacity}</span>
              </div>
              <div className="w-full h-2 bg-[#242424] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#E50914]"
                  style={{ width: `${Math.min(100, (slot.bookedCount / slot.capacity) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
