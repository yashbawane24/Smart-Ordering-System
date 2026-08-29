import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Clock, Users, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';

export const MealSlotsPage = () => {
  const [mealType, setMealType] = useState('Lunch');
  const [slots, setSlots] = useState([]);
  const [myBooking, setMyBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingInProcess, setBookingInProcess] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/meal-slots?mealType=${mealType}`);
      setSlots(res.data.slots || []);
      setMyBooking(res.data.myBooking || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [mealType]);

  const handleBook = async (slotId) => {
    try {
      setBookingInProcess(true);
      setMsg(null);
      await api.post('/meal-slots/book', { slotId });
      setMsg({ type: 'success', text: 'Meal pickup slot booked successfully!' });
      await fetchSlots();
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Failed to book slot' });
    } finally {
      setBookingInProcess(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#242424] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>MEAL PICKUP SLOTS</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30 font-mono">
              Crowd Control
            </span>
          </h1>
          <p className="text-sm text-[#A3A3A3] mt-1">
            Reserve a 15-minute pickup window to avoid peak counter crowding and ensure hot meal service.
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

      {msg && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
            msg.type === 'success'
              ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30'
              : 'bg-[#E50914]/10 text-[#E50914] border-[#E50914]/30'
          }`}
        >
          {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Active Booking Banner if any */}
      {myBooking && (
        <div className="bg-[#450A0A]/40 border border-[#E50914]/40 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E50914] text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#E50914]">Your Confirmed Slot</span>
              <h3 className="text-base font-extrabold text-white">
                {myBooking.slot.startTime} – {myBooking.slot.endTime} ({myBooking.slot.mealType})
              </h3>
            </div>
          </div>
          <span className="text-xs text-[#22C55E] bg-[#22C55E]/10 px-3 py-1.5 rounded-xl font-bold border border-[#22C55E]/30">
            ✓ Booked
          </span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[250px]">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {slots.map((slot) => {
            const isBookedByMe = myBooking?.slotId === slot.id;
            const percent = Math.min(100, Math.round((slot.bookedCount / slot.capacity) * 100));
            const isFull = slot.bookedCount >= slot.capacity;
            const isAlmostFull = percent >= 80 && !isFull;

            return (
              <div
                key={slot.id}
                className={`bg-[#151515] border rounded-2xl p-4 flex flex-col justify-between transition relative overflow-hidden ${
                  isBookedByMe
                    ? 'border-[#E50914] bg-[#1C1C1C] shadow-lg shadow-[#E50914]/10'
                    : isFull
                    ? 'border-[#242424] opacity-70'
                    : 'border-[#242424] hover:border-[#333333]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-[#A3A3A3] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#E50914]" />
                      Slot
                    </span>
                    {isBookedByMe ? (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#E50914] text-white">
                        YOUR SLOT
                      </span>
                    ) : isFull ? (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#222222] text-[#8E8E93]">
                        FULL
                      </span>
                    ) : isAlmostFull ? (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30">
                        ALMOST FULL
                      </span>
                    ) : (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30">
                        AVAILABLE
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-extrabold text-white tracking-tight">
                    {slot.startTime} – {slot.endTime}
                  </h3>

                  <div className="mt-3 space-y-1.5">
                    <div className="flex justify-between text-xs font-mono text-[#A3A3A3]">
                      <span>Booked</span>
                      <span className="font-bold text-white">
                        {slot.bookedCount} / {slot.capacity}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-[#242424] rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isFull
                            ? 'bg-[#333333]'
                            : isAlmostFull
                            ? 'bg-[#F59E0B]'
                            : 'bg-[#E50914]'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  {isBookedByMe ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-2.5 px-3 rounded-xl bg-[#450A0A] text-[#E50914] border border-[#E50914] text-xs font-black text-center cursor-default"
                    >
                      SELECTED
                    </button>
                  ) : isFull ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-2.5 px-3 rounded-xl bg-[#1C1C1C] text-[#666666] border border-[#242424] text-xs font-black text-center cursor-not-allowed"
                    >
                      SLOT FULL
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={bookingInProcess}
                      onClick={() => handleBook(slot.id)}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#E50914] hover:bg-[#B91C1C] text-white text-xs font-black transition shadow-md shadow-[#E50914]/20 text-center"
                    >
                      RESERVE SLOT
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
