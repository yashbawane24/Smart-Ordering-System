import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Lock,
  Unlock,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Calendar,
  Building2,
  ShieldCheck,
  Send,
  Sparkles
} from 'lucide-react';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const StudentSickDeliveryTab = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [accessStatus, setAccessStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [msg, setMsg] = useState(null);

  const [formData, setFormData] = useState({
    roomNumber: user?.student?.roomNumber || '',
    hostel: user?.student?.hostel || 'Block A, Mens Hostel',
    requestedStartDate: new Date().toISOString().split('T')[0],
    requestedEndDate: new Date(Date.now() + 2 * 86400 * 1000).toISOString().split('T')[0],
    requestedMeals: ['Breakfast', 'Lunch', 'Dinner'],
    reason: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reqRes, accessRes] = await Promise.all([
        api.get('/sick-delivery/requests/me'),
        api.get('/sick-delivery/access/me')
      ]);
      setRequests(reqRes.data || []);
      setAccessStatus(accessRes.data || null);
    } catch (err) {
      console.error('Failed to load sick delivery info', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMealCheckbox = (meal) => {
    setFormData((prev) => {
      const exists = prev.requestedMeals.includes(meal);
      const updated = exists
        ? prev.requestedMeals.filter((m) => m !== meal)
        : [...prev.requestedMeals, meal];
      return { ...prev, requestedMeals: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.reason.trim()) {
      setMsg({ type: 'error', text: 'Please provide a reason for your delivery request.' });
      return;
    }
    if (formData.requestedMeals.length === 0) {
      setMsg({ type: 'error', text: 'Please select at least one affected meal.' });
      return;
    }

    try {
      setSubmitting(true);
      setMsg(null);
      await api.post('/sick-delivery/requests', formData);
      setMsg({ type: 'success', text: 'Sick delivery request submitted successfully for Warden review.' });
      setShowModal(false);
      await fetchData();
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Failed to submit request' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const latestRequest = requests[0];
  const isUnlocked = accessStatus?.isUnlocked;
  const activeApproval = accessStatus?.approval;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#151515] border border-[#242424] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#E50914]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">SICK MEAL DELIVERY</h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/40 uppercase font-mono font-bold">
                Warden Approved
              </span>
            </div>
            <p className="text-xs text-[#A3A3A3] mt-1 max-w-xl">
              Request temporary meal delivery assistance when you are genuinely sick and unable to visit the mess hall.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-[#E50914] hover:bg-[#B91C1C] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#E50914]/30 transition flex items-center gap-2 shrink-0 self-start md:self-auto"
          >
            <Send className="w-4 h-4" />
            <span>REQUEST DELIVERY ASSISTANCE</span>
          </button>
        </div>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between ${
            msg.type === 'success'
              ? 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30'
              : 'bg-[#E50914]/15 text-[#FF6B60] border border-[#E50914]/30'
          }`}
        >
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)} className="text-current hover:opacity-80">
            ×
          </button>
        </div>
      )}

      {/* Main Lock / Status Display Card */}
      <div className="bg-[#151515] border border-[#242424] rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[#242424] pb-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                isUnlocked
                  ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40'
                  : latestRequest?.status === 'PENDING_WARDEN_APPROVAL'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/40'
              }`}
            >
              {isUnlocked ? (
                <Unlock className="w-7 h-7" />
              ) : latestRequest?.status === 'PENDING_WARDEN_APPROVAL' ? (
                <Clock className="w-7 h-7 animate-pulse" />
              ) : (
                <Lock className="w-7 h-7" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-black text-white tracking-wide">DELIVERY ACCESS</h3>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    isUnlocked
                      ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40'
                      : latestRequest?.status === 'PENDING_WARDEN_APPROVAL'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-[#242424] text-[#A3A3A3] border border-[#333333]'
                  }`}
                >
                  {isUnlocked ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>✓ UNLOCKED</span>
                    </>
                  ) : latestRequest?.status === 'PENDING_WARDEN_APPROVAL' ? (
                    <>
                      <Clock className="w-3.5 h-3.5" />
                      <span>⏳ PENDING WARDEN APPROVAL</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>🔒 LOCKED</span>
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs text-[#A3A3A3] mt-1.5 leading-relaxed">
                {isUnlocked
                  ? 'Your Warden approval is ACTIVE. You are authorized to select Sick Delivery during order checkout.'
                  : latestRequest?.status === 'PENDING_WARDEN_APPROVAL'
                  ? 'Your sick leave delivery request has been logged and is under Warden review.'
                  : 'Meal delivery requires official Warden approval. Standard mess orders are pickup only.'}
              </p>
            </div>
          </div>

          {!isUnlocked && (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="w-full md:w-auto px-6 py-3 bg-[#E50914] hover:bg-[#B91C1C] text-white font-extrabold text-xs rounded-xl shadow-lg shadow-[#E50914]/30 transition"
            >
              REQUEST DELIVERY ASSISTANCE
            </button>
          )}
        </div>

        {/* Active Approval Details (if unlocked) */}
        {isUnlocked && activeApproval && (
          <div className="bg-[#1C1C1C] border border-[#22C55E]/30 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#22C55E] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Active Warden Authorization Details
              </span>
              <span className="text-[11px] text-[#A3A3A3]">
                Max Deliveries: {activeApproval.deliveriesUsedToday} / {activeApproval.maxDeliveriesPerDay} used today
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-[#151515] p-3 rounded-lg border border-[#2A2A2A]">
                <span className="text-[#A3A3A3] block text-[10px] uppercase tracking-wider font-bold">Approved Period</span>
                <span className="text-white font-semibold mt-1 block">
                  {new Date(activeApproval.approvalStartDate).toLocaleDateString()} – {new Date(activeApproval.approvalEndDate).toLocaleDateString()}
                </span>
              </div>
              <div className="bg-[#151515] p-3 rounded-lg border border-[#2A2A2A]">
                <span className="text-[#A3A3A3] block text-[10px] uppercase tracking-wider font-bold">Allowed Meals</span>
                <span className="text-white font-semibold mt-1 block">
                  {activeApproval.allowedMeals}
                </span>
              </div>
              <div className="bg-[#151515] p-3 rounded-lg border border-[#2A2A2A]">
                <span className="text-[#A3A3A3] block text-[10px] uppercase tracking-wider font-bold">Delivery Room</span>
                <span className="text-white font-semibold mt-1 block">
                  {activeApproval.hostel} • Room {activeApproval.roomNumber}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Request History / Status Timeline */}
        <div className="space-y-4">
          <h4 className="text-xs font-extrabold text-[#A3A3A3] uppercase tracking-wider">
            Your Delivery Assistance Requests
          </h4>

          {requests.length === 0 ? (
            <div className="p-8 text-center bg-[#181818] rounded-xl border border-[#242424] text-xs text-[#8E8E93]">
              No previous sick delivery requests found. Click "REQUEST DELIVERY ASSISTANCE" to submit a request.
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => {
                const startDate = new Date(req.requestedStartDate).toLocaleDateString();
                const endDate = new Date(req.requestedEndDate).toLocaleDateString();

                return (
                  <div key={req.id} className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#E50914] font-bold">#{req.id.slice(0, 8)}</span>
                        <span className="text-xs font-semibold text-white">• {req.hostel} (Room {req.roomNumber})</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto ${
                          req.status === 'APPROVED'
                            ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40'
                            : req.status === 'REJECTED'
                            ? 'bg-[#E50914]/20 text-[#FF6B60] border border-[#E50914]/40'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}
                      >
                        {req.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#A3A3A3] bg-[#151515] p-3 rounded-lg">
                      <div>
                        <span className="font-semibold text-white">Period:</span> {startDate} to {endDate}
                      </div>
                      <div>
                        <span className="font-semibold text-white">Meals:</span> {req.requestedMeals}
                      </div>
                      <div className="sm:col-span-2">
                        <span className="font-semibold text-white">Reason:</span> "{req.reason}"
                      </div>
                      {req.rejectionReason && (
                        <div className="sm:col-span-2 text-red-400">
                          <span className="font-semibold text-white">Rejection Note:</span> {req.rejectionReason}
                        </div>
                      )}
                    </div>

                    {/* Timeline Flow Visualizer */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-[10px] text-[#8E8E93] max-w-md mx-auto relative">
                        <div className="flex flex-col items-center gap-1 z-10">
                          <div className="w-5 h-5 rounded-full bg-[#E50914] text-white flex items-center justify-center font-bold">1</div>
                          <span className="text-white font-semibold">REQUESTED</span>
                        </div>

                        <div className={`h-0.5 flex-1 ${req.status !== 'PENDING_WARDEN_APPROVAL' ? 'bg-[#E50914]' : 'bg-[#333333]'}`} />

                        <div className="flex flex-col items-center gap-1 z-10">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold ${req.status !== 'PENDING_WARDEN_APPROVAL' ? 'bg-[#E50914] text-white' : 'bg-[#333333] text-[#8E8E93]'}`}>2</div>
                          <span>UNDER REVIEW</span>
                        </div>

                        <div className={`h-0.5 flex-1 ${req.status === 'APPROVED' ? 'bg-[#22C55E]' : req.status === 'REJECTED' ? 'bg-red-500' : 'bg-[#333333]'}`} />

                        <div className="flex flex-col items-center gap-1 z-10">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center font-bold ${
                              req.status === 'APPROVED'
                                ? 'bg-[#22C55E] text-white'
                                : req.status === 'REJECTED'
                                ? 'bg-red-500 text-white'
                                : 'bg-[#333333] text-[#8E8E93]'
                            }`}
                          >
                            3
                          </div>
                          <span className={req.status === 'APPROVED' ? 'text-[#22C55E] font-bold' : req.status === 'REJECTED' ? 'text-red-400 font-bold' : ''}>
                            {req.status === 'APPROVED' ? 'APPROVED' : req.status === 'REJECTED' ? 'REJECTED' : 'DECISION'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Request Application Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#151515] border border-[#2B2B2B] rounded-2xl p-6 w-full max-w-lg space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#242424] pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#E50914]" />
                <span>Sick Meal Delivery Request</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#8E8E93] hover:text-white text-lg font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Student Auto-filled Info */}
              <div className="grid grid-cols-2 gap-3 bg-[#1C1C1C] p-3 rounded-xl border border-[#262626]">
                <div>
                  <label className="text-[10px] text-[#A3A3A3] uppercase font-bold block">Student Name</label>
                  <input
                    type="text"
                    disabled
                    value={user?.name || ''}
                    className="w-full bg-transparent text-white font-semibold focus:outline-none pt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#A3A3A3] uppercase font-bold block">Student ID</label>
                  <input
                    type="text"
                    disabled
                    value={user?.student?.studentIdStr || 'N/A'}
                    className="w-full bg-transparent text-white font-semibold focus:outline-none pt-1"
                  />
                </div>
              </div>

              {/* Location Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#A3A3A3] font-bold block mb-1">Hostel / Block</label>
                  <input
                    type="text"
                    value={formData.hostel}
                    onChange={(e) => setFormData({ ...formData, hostel: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-[#2B2B2B] rounded-xl px-3 py-2 text-white focus:border-[#E50914] focus:outline-none"
                    placeholder="e.g. Block A, Mens Hostel"
                  />
                </div>
                <div>
                  <label className="text-[#A3A3A3] font-bold block mb-1">Room Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-[#2B2B2B] rounded-xl px-3 py-2 text-white focus:border-[#E50914] focus:outline-none"
                    placeholder="e.g. A-304"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#A3A3A3] font-bold block mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.requestedStartDate}
                    onChange={(e) => setFormData({ ...formData, requestedStartDate: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-[#2B2B2B] rounded-xl px-3 py-2 text-white focus:border-[#E50914] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#A3A3A3] font-bold block mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.requestedEndDate}
                    onChange={(e) => setFormData({ ...formData, requestedEndDate: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-[#2B2B2B] rounded-xl px-3 py-2 text-white focus:border-[#E50914] focus:outline-none"
                  />
                </div>
              </div>

              {/* Affected Meals Checkboxes */}
              <div>
                <label className="text-[#A3A3A3] font-bold block mb-2">Affected Meals *</label>
                <div className="flex items-center gap-4 bg-[#1C1C1C] p-3 rounded-xl border border-[#2B2B2B]">
                  {['Breakfast', 'Lunch', 'Dinner'].map((meal) => (
                    <label key={meal} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.requestedMeals.includes(meal)}
                        onChange={() => handleMealCheckbox(meal)}
                        className="accent-[#E50914] w-4 h-4 rounded"
                      />
                      <span className="text-white font-medium">{meal}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reason Textarea */}
              <div>
                <label className="text-[#A3A3A3] font-bold block mb-1">Reason for Sick Delivery *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Briefly explain why you are unable to visit the mess (e.g. High fever, doctor prescribed room rest)."
                  className="w-full bg-[#1C1C1C] border border-[#2B2B2B] rounded-xl p-3 text-white focus:border-[#E50914] focus:outline-none placeholder-[#666666]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 bg-[#272727] text-[#A3A3A3] hover:text-white rounded-xl font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-[#E50914] hover:bg-[#B91C1C] text-white font-extrabold rounded-xl shadow-lg shadow-[#E50914]/30 transition flex items-center gap-2"
                >
                  {submitting ? <LoadingSpinner size="sm" /> : <Send className="w-4 h-4" />}
                  <span>SUBMIT FOR WARDEN APPROVAL</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
