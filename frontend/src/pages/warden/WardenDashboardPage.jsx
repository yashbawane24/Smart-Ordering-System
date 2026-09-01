import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Calendar,
  User,
  Building2,
  FileText,
  Check,
  X,
  Sparkles
} from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const WardenDashboardPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('PENDING');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // Approval Modal State
  const [selectedReqForApprove, setSelectedReqForApprove] = useState(null);
  const [approvalConfig, setApprovalConfig] = useState({
    approvalStartDate: '',
    approvalEndDate: '',
    allowedMeals: ['Breakfast', 'Lunch', 'Dinner'],
    maxDeliveriesPerDay: 3
  });

  // Rejection Modal State
  const [selectedReqForReject, setSelectedReqForReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const targetStatus = activeTab === 'PENDING' ? 'PENDING_WARDEN_APPROVAL' : activeTab;
      const res = await api.get('/sick-delivery/requests', {
        params: { status: targetStatus, search }
      });
      setRequests(res.data || []);
    } catch (err) {
      console.error('Failed to load warden requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [activeTab, search]);

  const openApproveModal = (req) => {
    setSelectedReqForApprove(req);
    setApprovalConfig({
      approvalStartDate: new Date(req.requestedStartDate).toISOString().split('T')[0],
      approvalEndDate: new Date(req.requestedEndDate).toISOString().split('T')[0],
      allowedMeals: req.requestedMeals ? req.requestedMeals.split(',') : ['Breakfast', 'Lunch', 'Dinner'],
      maxDeliveriesPerDay: 3
    });
  };

  const handleApproveSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReqForApprove) return;

    try {
      setActionLoading(true);
      setMsg(null);
      await api.put(`/sick-delivery/requests/${selectedReqForApprove.id}/approve`, approvalConfig);
      setMsg({ type: 'success', text: `Sick meal delivery approved for ${selectedReqForApprove.student?.user?.name}` });
      setSelectedReqForApprove(null);
      await fetchRequests();
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Failed to approve request' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReqForReject || !rejectionReason.trim()) {
      setMsg({ type: 'error', text: 'Please enter a rejection reason.' });
      return;
    }

    try {
      setActionLoading(true);
      setMsg(null);
      await api.put(`/sick-delivery/requests/${selectedReqForReject.id}/reject`, { rejectionReason });
      setMsg({ type: 'success', text: `Request #${selectedReqForReject.id.slice(0, 8)} rejected.` });
      setSelectedReqForReject(null);
      setRejectionReason('');
      await fetchRequests();
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Failed to reject request' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleMealToggle = (meal) => {
    setApprovalConfig((prev) => {
      const exists = prev.allowedMeals.includes(meal);
      const updated = exists
        ? prev.allowedMeals.filter((m) => m !== meal)
        : [...prev.allowedMeals, meal];
      return { ...prev, allowedMeals: updated };
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#242424] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>SICK MEAL DELIVERY REQUESTS</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30 uppercase font-mono font-bold">
              Warden Portal
            </span>
          </h1>
          <p className="text-sm text-[#A3A3A3] mt-1">
            Review student sick delivery applications and grant time-limited authorized meal delivery access.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-[#8E8E93] absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student, ID, room..."
            className="w-full bg-[#151515] border border-[#242424] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:border-[#E50914] focus:outline-none"
          />
        </div>
      </div>

      {msg && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-between ${
            msg.type === 'success'
              ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30'
              : 'bg-[#E50914]/10 text-[#FF6B60] border-[#E50914]/30'
          }`}
        >
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)} className="text-current font-bold text-base">
            ×
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#242424] pb-3 overflow-x-auto">
        {[
          { key: 'PENDING', label: 'PENDING APPROVAL', icon: Clock },
          { key: 'APPROVED', label: 'APPROVED', icon: CheckCircle2 },
          { key: 'REJECTED', label: 'REJECTED', icon: XCircle },
          { key: 'ALL', label: 'ALL REQUESTS', icon: Filter }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-[#E50914] text-white shadow-lg shadow-[#E50914]/20'
                  : 'bg-[#151515] text-[#A3A3A3] hover:text-white border border-[#242424]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <LoadingSpinner size="lg" />
        </div>
      ) : requests.length === 0 ? (
        <div className="p-12 text-center bg-[#151515] rounded-2xl border border-[#242424] text-sm text-[#A3A3A3]">
          No sick meal delivery requests found matching tab status "{activeTab}".
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {requests.map((req) => {
            const studentName = req.student?.user?.name || 'Unknown Student';
            const studentIdStr = req.student?.studentIdStr || 'N/A';
            const phone = req.student?.user?.phone || 'N/A';
            const startDate = new Date(req.requestedStartDate).toLocaleDateString();
            const endDate = new Date(req.requestedEndDate).toLocaleDateString();

            const isPending = req.status === 'PENDING_WARDEN_APPROVAL';

            return (
              <div
                key={req.id}
                className="bg-[#151515] border border-[#242424] rounded-2xl p-5 space-y-4 shadow-xl relative overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Card Top Banner */}
                  <div className="flex items-start justify-between gap-3 border-b border-[#242424] pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#242424] border border-[#333333] text-white flex items-center justify-center font-bold text-sm">
                        {studentName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-white">{studentName}</h3>
                        <span className="text-[11px] text-[#A3A3A3] font-mono">
                          {studentIdStr} • {phone}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
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

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-[#1C1C1C] p-3 rounded-xl border border-[#262626]">
                    <div>
                      <span className="text-[10px] text-[#A3A3A3] uppercase font-bold block">Hostel & Room</span>
                      <span className="text-white font-semibold block mt-0.5">
                        {req.hostel} (Room {req.roomNumber})
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#A3A3A3] uppercase font-bold block">Requested Period</span>
                      <span className="text-white font-semibold block mt-0.5">
                        {startDate} – {endDate}
                      </span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-[#262626]">
                      <span className="text-[10px] text-[#A3A3A3] uppercase font-bold block">Affected Meals</span>
                      <span className="text-white font-semibold block mt-0.5">
                        {req.requestedMeals}
                      </span>
                    </div>
                  </div>

                  {/* Student Provided Reason */}
                  <div className="bg-[#181818] p-3 rounded-xl border border-[#242424] text-xs">
                    <span className="text-[#A3A3A3] font-bold block text-[10px] uppercase tracking-wider mb-1">
                      Student Reason:
                    </span>
                    <p className="text-white italic">"{req.reason}"</p>
                  </div>

                  {req.rejectionReason && (
                    <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/30 text-xs text-red-300">
                      <span className="font-bold block text-[10px] uppercase tracking-wider mb-1 text-red-400">
                        Rejection Note:
                      </span>
                      <p>"{req.rejectionReason}"</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {isPending && (
                  <div className="pt-3 border-t border-[#242424] flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedReqForReject(req)}
                      className="flex-1 py-2.5 bg-[#242424] hover:bg-[#333333] text-[#FF6B60] font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 border border-[#333333]"
                    >
                      <X className="w-4 h-4" />
                      <span>REJECT</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openApproveModal(req)}
                      className="flex-1 py-2.5 bg-[#E50914] hover:bg-[#B91C1C] text-white font-extrabold text-xs rounded-xl shadow-lg shadow-[#E50914]/30 transition flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>APPROVE</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Approval Modal */}
      {selectedReqForApprove && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#151515] border border-[#2B2B2B] rounded-2xl p-6 w-full max-w-md space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#242424] pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                <span>Configure Sick Delivery Access</span>
              </h3>
              <button
                onClick={() => setSelectedReqForApprove(null)}
                className="text-[#8E8E93] hover:text-white font-bold text-lg"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleApproveSubmit} className="space-y-4 text-xs">
              <div className="bg-[#1C1C1C] p-3 rounded-xl border border-[#262626]">
                <span className="text-[10px] text-[#A3A3A3] uppercase font-bold block">Student</span>
                <span className="text-white font-bold text-sm block">
                  {selectedReqForApprove.student?.user?.name} ({selectedReqForApprove.student?.studentIdStr})
                </span>
                <span className="text-[#A3A3A3] block text-[11px] mt-0.5">
                  Hostel: {selectedReqForApprove.hostel} • Room {selectedReqForApprove.roomNumber}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#A3A3A3] font-bold block mb-1">Approval Start Date</label>
                  <input
                    type="date"
                    required
                    value={approvalConfig.approvalStartDate}
                    onChange={(e) => setApprovalConfig({ ...approvalConfig, approvalStartDate: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-[#2B2B2B] rounded-xl px-3 py-2 text-white focus:border-[#E50914] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#A3A3A3] font-bold block mb-1">Approval End Date</label>
                  <input
                    type="date"
                    required
                    value={approvalConfig.approvalEndDate}
                    onChange={(e) => setApprovalConfig({ ...approvalConfig, approvalEndDate: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-[#2B2B2B] rounded-xl px-3 py-2 text-white focus:border-[#E50914] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#A3A3A3] font-bold block mb-2">Allowed Meals</label>
                <div className="flex items-center gap-4 bg-[#1C1C1C] p-3 rounded-xl border border-[#2B2B2B]">
                  {['Breakfast', 'Lunch', 'Dinner'].map((meal) => (
                    <label key={meal} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={approvalConfig.allowedMeals.includes(meal)}
                        onChange={() => handleMealToggle(meal)}
                        className="accent-[#E50914] w-4 h-4 rounded"
                      />
                      <span className="text-white font-medium">{meal}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[#A3A3A3] font-bold block mb-1">Max Deliveries Per Day</label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={approvalConfig.maxDeliveriesPerDay}
                  onChange={(e) => setApprovalConfig({ ...approvalConfig, maxDeliveriesPerDay: e.target.value })}
                  className="w-full bg-[#1C1C1C] border border-[#2B2B2B] rounded-xl px-3 py-2 text-white focus:border-[#E50914] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedReqForApprove(null)}
                  className="px-4 py-2.5 bg-[#272727] text-[#A3A3A3] hover:text-white rounded-xl font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-[#E50914] hover:bg-[#B91C1C] text-white font-extrabold rounded-xl shadow-lg shadow-[#E50914]/30 transition flex items-center gap-2"
                >
                  {actionLoading ? <LoadingSpinner size="sm" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>APPROVE DELIVERY ACCESS</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {selectedReqForReject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#151515] border border-[#2B2B2B] rounded-2xl p-6 w-full max-w-md space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#242424] pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <span>Reject Sick Delivery Request</span>
              </h3>
              <button
                onClick={() => setSelectedReqForReject(null)}
                className="text-[#8E8E93] hover:text-white font-bold text-lg"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleRejectSubmit} className="space-y-4 text-xs">
              <p className="text-[#A3A3A3]">
                Please state the official reason for declining delivery access for{' '}
                <strong className="text-white">{selectedReqForReject.student?.user?.name}</strong>.
              </p>

              <div>
                <label className="text-[#A3A3A3] font-bold block mb-1">Rejection Reason *</label>
                <textarea
                  rows={3}
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Request does not meet institutional sick leave guidelines or missing room verification."
                  className="w-full bg-[#1C1C1C] border border-[#2B2B2B] rounded-xl p-3 text-white focus:border-[#E50914] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedReqForReject(null)}
                  className="px-4 py-2.5 bg-[#272727] text-[#A3A3A3] hover:text-white rounded-xl font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-lg transition flex items-center gap-2"
                >
                  {actionLoading ? <LoadingSpinner size="sm" /> : <X className="w-4 h-4" />}
                  <span>REJECT REQUEST</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
