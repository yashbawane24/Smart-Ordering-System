import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Vote, Plus, CheckCircle2, AlertCircle, BarChart2 } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';

export const AdminPollsPage = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [optionsStr, setOptionsStr] = useState('Chicken Biryani, Butter Chicken, Paneer Butter Masala, Veg Biryani');
  const [creating, setCreating] = useState(false);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const res = await api.get('/polls');
      setPolls(res.data.data?.polls || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    const optionsArray = optionsStr.split(',').map(s => s.trim()).filter(Boolean);
    if (!title || optionsArray.length < 2) {
      alert('Please enter title and at least 2 options');
      return;
    }

    try {
      setCreating(true);
      await api.post('/polls', {
        title,
        description,
        options: optionsArray
      });
      setShowCreate(false);
      setTitle('');
      await fetchPolls();
    } catch (err) {
      alert(err.message || 'Failed to create poll');
    } finally {
      setCreating(false);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#242424] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>MENU POLL MANAGEMENT</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30 font-mono">
              Student Preference Polls
            </span>
          </h1>
          <p className="text-sm text-[#A3A3A3] mt-1">
            Create menu voting polls to gather student preferences for special weekend meals.
          </p>
        </div>

        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 text-xs font-black text-white bg-[#E50914] hover:bg-[#B91C1C] rounded-xl transition flex items-center gap-2 shadow-lg shadow-[#E50914]/20"
        >
          <Plus className="w-4 h-4" /> Create New Poll
        </button>
      </div>

      {/* Create Modal Form */}
      {showCreate && (
        <form onSubmit={handleCreatePoll} className="bg-[#151515] border border-[#242424] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-extrabold text-white">Create Menu Preference Poll</h3>
          <div>
            <label className="text-xs font-mono text-[#A3A3A3] block mb-1">Poll Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weekend Special Dish Selection"
              className="w-full bg-[#1C1C1C] border border-[#242424] rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-[#A3A3A3] block mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Vote for your favorite dish for Sunday Special Lunch"
              className="w-full bg-[#1C1C1C] border border-[#242424] rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-[#A3A3A3] block mb-1">Options (Comma Separated)</label>
            <input
              type="text"
              value={optionsStr}
              onChange={(e) => setOptionsStr(e.target.value)}
              className="w-full bg-[#1C1C1C] border border-[#242424] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={creating}
              className="py-2.5 px-4 bg-[#E50914] text-white text-xs font-bold rounded-xl"
            >
              Publish Poll
            </button>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="py-2.5 px-4 bg-[#242424] text-white text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Active Polls List */}
      <div className="space-y-6">
        {polls.map((poll) => {
          const totalVotes = poll.options.reduce((acc, opt) => acc + (opt._count?.votes || 0), 0);

          return (
            <div key={poll.id} className="bg-[#151515] border border-[#242424] rounded-2xl p-6 space-y-5">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono text-[#22C55E] uppercase font-bold">STATUS: ACTIVE</span>
                  <h2 className="text-xl font-extrabold text-white mt-1">{poll.title}</h2>
                  <p className="text-xs text-[#A3A3A3] mt-0.5">{poll.description}</p>
                </div>
                <span className="text-xs font-mono font-bold text-white bg-[#1C1C1C] px-3 py-1 rounded-xl border border-[#242424]">
                  {totalVotes} Total Student Votes
                </span>
              </div>

              {/* Vote Results Progress Bars */}
              <div className="space-y-3">
                {poll.options.map((opt) => {
                  const votes = opt._count?.votes || 0;
                  const percent = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

                  return (
                    <div key={opt.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-extrabold text-white">
                        <span>{opt.optionName}</span>
                        <span className="font-mono text-[#A3A3A3]">{votes} votes ({percent}%)</span>
                      </div>
                      <div className="w-full h-3 bg-[#1C1C1C] rounded-full overflow-hidden border border-[#242424]">
                        <div
                          className="h-full bg-gradient-to-r from-[#E50914] to-[#B91C1C] transition-all duration-500 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
