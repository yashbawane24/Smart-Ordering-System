import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Star, MessageSquare, AlertCircle, CheckCircle2, ShieldAlert, Edit2, X } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminFeedbackPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModalComplaint, setActiveModalComplaint] = useState(null);
  const [statusInput, setStatusInput] = useState('UNDER_REVIEW');
  const [noteInput, setNoteInput] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const res = await api.get('/feedback');
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!activeModalComplaint) return;

    try {
      setUpdating(true);
      await api.put(`/complaints/${activeModalComplaint.id}/status`, {
        status: statusInput,
        resolutionNote: noteInput
      });
      setActiveModalComplaint(null);
      await fetchFeedback();
    } catch (err) {
      alert(err.message || 'Failed to update complaint');
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

  const { avgRating, totalFeedbackCount, openComplaintsCount, mostCommonIssue, complaints, feedbacks } = data || {};

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#242424] pb-5">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>FEEDBACK & COMPLAINT MANAGEMENT</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30 font-mono">
            Auditing Workflow
          </span>
        </h1>
        <p className="text-sm text-[#A3A3A3] mt-1">
          Review student ratings, inspect flagged meal issues, and resolve complaints.
        </p>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#151515] border border-[#242424] rounded-2xl p-5 space-y-1">
          <span className="text-xs font-mono text-[#A3A3A3] uppercase block">AVERAGE MEAL RATING</span>
          <div className="flex items-center gap-2">
            <h3 className="text-3xl font-black text-white font-mono">{avgRating || 4.2}</h3>
            <div className="flex items-center text-[#F59E0B]">
              <Star className="w-5 h-5 fill-[#F59E0B]" />
              <span className="text-xs font-extrabold text-[#A3A3A3] ml-1">/ 5.0</span>
            </div>
          </div>
          <span className="text-[10px] text-[#A3A3A3] block">Based on {totalFeedbackCount || 0} reviews</span>
        </div>

        <div className="bg-[#151515] border border-[#242424] rounded-2xl p-5 space-y-1">
          <span className="text-xs font-mono text-[#A3A3A3] uppercase block">MOST COMMON ISSUE</span>
          <h3 className="text-xl font-black text-[#E50914] font-mono">{mostCommonIssue || 'Food Temperature'}</h3>
          <span className="text-[10px] text-[#A3A3A3] block">Flagged during peak lunch hours</span>
        </div>

        <div className="bg-[#151515] border border-[#242424] rounded-2xl p-5 space-y-1">
          <span className="text-xs font-mono text-[#A3A3A3] uppercase block">OPEN COMPLAINTS</span>
          <h3 className="text-3xl font-black text-[#F59E0B] font-mono">{openComplaintsCount || 0}</h3>
          <span className="text-[10px] text-[#F59E0B] block">Requires action</span>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-[#151515] border border-[#242424] rounded-2xl p-5 space-y-4">
        <h3 className="text-base font-extrabold text-white">STUDENT COMPLAINTS QUEUE</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[#A3A3A3] font-bold text-[11px] uppercase tracking-wider border-b border-[#242424]">
              <tr>
                <th className="pb-3 px-3">Student</th>
                <th className="pb-3 px-3">Issue Type</th>
                <th className="pb-3 px-3">Description</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242424]">
              {complaints?.map((c) => (
                <tr key={c.id} className="hover:bg-[#1C1C1C] transition">
                  <td className="py-3 px-3">
                    <span className="font-extrabold text-white">{c.student?.user?.name}</span>
                    <span className="text-[10px] text-[#A3A3A3] block font-mono">{c.student?.user?.email}</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-[#E50914]">{c.issueType}</td>
                  <td className="py-3 px-3 text-[#A3A3A3] max-w-xs truncate">{c.description}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase ${
                      c.status === 'RESOLVED'
                        ? 'bg-[#22C55E]/20 text-[#22C55E]'
                        : c.status === 'UNDER_REVIEW'
                        ? 'bg-[#3B82F6]/20 text-[#3B82F6]'
                        : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        setActiveModalComplaint(c);
                        setStatusInput(c.status);
                        setNoteInput(c.resolutionNote || '');
                      }}
                      className="px-3 py-1 bg-[#242424] hover:bg-[#333333] text-white rounded text-xs font-bold transition flex items-center gap-1 ml-auto"
                    >
                      <Edit2 className="w-3 h-3" /> Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resolution Modal */}
      {activeModalComplaint && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#151515] border border-[#242424] rounded-2xl p-6 w-full max-w-md space-y-4 relative">
            <div className="flex justify-between items-center border-b border-[#242424] pb-3">
              <h3 className="text-sm font-extrabold text-white">Update Complaint Status</h3>
              <button onClick={() => setActiveModalComplaint(null)} className="text-[#8E8E93] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-[#A3A3A3] block mb-1">Status Workflow</label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#242424] rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-[#A3A3A3] block mb-1">Resolution Note</label>
                <textarea
                  rows={3}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Details of action taken by kitchen management..."
                  className="w-full bg-[#1C1C1C] border border-[#242424] rounded-xl p-3 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full py-2.5 bg-[#E50914] text-white font-black text-xs rounded-xl"
              >
                SAVE COMPLAINT STATUS
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
