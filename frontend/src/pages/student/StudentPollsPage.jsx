import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Vote, CheckCircle2, AlertCircle, Award } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const StudentPollsPage = () => {
  const [poll, setPoll] = useState(null);
  const [myVote, setMyVote] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchPoll = async () => {
    try {
      setLoading(true);
      const res = await api.get('/polls');
      const activePolls = res.data.data?.polls || [];
      const currentMyVote = res.data.data?.myVote || null;
      if (activePolls.length > 0) {
        setPoll(activePolls[0]);
      }
      setMyVote(currentMyVote);
      if (currentMyVote) {
        setSelectedOptionId(currentMyVote.optionId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoll();
  }, []);

  const handleVoteSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOptionId || !poll) return;

    try {
      setSubmitting(true);
      setMsg(null);
      await api.post(`/polls/${poll.id}/vote`, { optionId: selectedOptionId });
      setMsg({ type: 'success', text: 'Your vote has been submitted!' });
      await fetchPoll();
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Failed to submit vote' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const totalVotes = poll?.options?.reduce((acc, curr) => acc + (curr._count?.votes || 0), 0) || 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#242424] pb-5">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>MENU PREFERENCE POLLS</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30 font-mono">
            Student Voice
          </span>
        </h1>
        <p className="text-sm text-[#A3A3A3] mt-1">
          Vote for weekend special dishes to influence upcoming institutional mess menu planning.
        </p>
      </div>

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

      {!poll ? (
        <div className="bg-[#151515] border border-[#242424] rounded-2xl p-8 text-center space-y-2">
          <Award className="w-10 h-10 text-[#666666] mx-auto" />
          <h3 className="text-base font-extrabold text-white">No Active Menu Polls</h3>
          <p className="text-xs text-[#A3A3A3]">Check back later when admin publishes new menu voting polls.</p>
        </div>
      ) : (
        <div className="bg-[#151515] border border-[#242424] rounded-3xl p-6 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#E50914] uppercase tracking-wider font-extrabold">WEEKEND SPECIAL POLL</span>
              <span className="text-xs text-[#A3A3A3] font-mono">{totalVotes} Total Votes</span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">{poll.title}</h2>
            {poll.description && (
              <p className="text-xs text-[#A3A3A3] mt-1">{poll.description}</p>
            )}
          </div>

          <form onSubmit={handleVoteSubmit} className="space-y-4">
            <div className="space-y-3">
              {poll.options?.map((opt) => {
                const votesCount = opt._count?.votes || 0;
                const percent = totalVotes > 0 ? Math.round((votesCount / totalVotes) * 100) : 0;
                const isSelected = selectedOptionId === opt.id;

                return (
                  <label
                    key={opt.id}
                    className={`block bg-[#1C1C1C] border rounded-2xl p-4 cursor-pointer transition relative overflow-hidden ${
                      isSelected
                        ? 'border-[#E50914] bg-[#221010]'
                        : 'border-[#242424] hover:border-[#333333]'
                    }`}
                  >
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="menuOption"
                          value={opt.id}
                          checked={isSelected}
                          onChange={() => setSelectedOptionId(opt.id)}
                          className="w-4 h-4 accent-[#E50914]"
                        />
                        <span className="text-sm font-extrabold text-white">{opt.optionName}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#A3A3A3]">
                        {votesCount} votes ({percent}%)
                      </span>
                    </div>

                    {/* Background Progress Bar */}
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-[#E50914]/15 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </label>
                );
              })}
            </div>

            <button
              type="submit"
              disabled={submitting || !selectedOptionId}
              className="w-full py-3 rounded-xl bg-[#E50914] hover:bg-[#B91C1C] text-white font-black text-xs transition shadow-lg shadow-[#E50914]/20 flex items-center justify-center gap-2"
            >
              <Vote className="w-4 h-4" />
              <span>{myVote ? 'CHANGE VOTE' : 'SUBMIT VOTE'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
