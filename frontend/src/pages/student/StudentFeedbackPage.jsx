import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Star, MessageSquare, CheckCircle2, AlertCircle, Send, ShieldAlert } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';

export const StudentFeedbackPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [foodQuality, setFoodQuality] = useState(5);
  const [quantity, setQuantity] = useState(5);
  const [temperature, setTemperature] = useState(5);
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [comment, setComment] = useState('');
  const [feedbacksHistory, setFeedbacksHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  const issueOptions = [
    'Too Cold',
    'Too Salty',
    'Poor Quality',
    'Less Quantity',
    'Hygiene Issue'
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, feedbackRes] = await Promise.all([
        api.get('/orders?status=ALL'),
        api.get('/feedback')
      ]);

      const allOrders = ordersRes.data.data || [];
      const collected = allOrders.filter(o => o.status === 'COLLECTED' || o.status === 'COMPLETED');
      setOrders(collected);
      if (collected.length > 0) {
        setSelectedOrderId(collected[0].id);
      }

      setFeedbacksHistory(feedbackRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleIssue = (issue) => {
    if (selectedIssues.includes(issue)) {
      setSelectedIssues(selectedIssues.filter(i => i !== issue));
    } else {
      setSelectedIssues([...selectedIssues, issue]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrderId) return;

    try {
      setSubmitting(true);
      setMsg(null);
      await api.post('/feedback', {
        orderId: selectedOrderId,
        foodQualityRating: foodQuality,
        quantityRating: quantity,
        temperatureRating: temperature,
        issues: selectedIssues,
        comment,
        createComplaint: selectedIssues.length > 0
      });

      setMsg({ type: 'success', text: 'Feedback & rating submitted successfully!' });
      setComment('');
      setSelectedIssues([]);
      await fetchData();
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Failed to submit feedback' });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, setRating) => {
    return (
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating && setRating(star)}
            className="p-1 focus:outline-none transition transform hover:scale-110"
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'fill-[#F59E0B] text-[#F59E0B]'
                  : 'text-[#333333]'
              }`}
            />
          </button>
        ))}
      </div>
    );
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
      <div className="border-b border-[#242424] pb-5">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>MEAL FEEDBACK & COMPLAINTS</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30 font-mono">
            Quality Assurance
          </span>
        </h1>
        <p className="text-sm text-[#A3A3A3] mt-1">
          Rate your collected meals and report any issues directly to the mess management team.
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Feedback Form */}
        <div className="lg:col-span-7 bg-[#151515] border border-[#242424] rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#E50914]" />
            <span>HOW WAS YOUR MEAL?</span>
          </h2>

          {orders.length === 0 ? (
            <p className="text-xs text-[#8E8E93]">No collected orders available for feedback yet.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Order Select */}
              <div>
                <label className="text-xs font-mono text-[#A3A3A3] block mb-1.5">Select Collected Order</label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#242424] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#E50914]"
                >
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      Order #{o.orderNumber} ({o.totalCredits} Credits)
                    </option>
                  ))}
                </select>
              </div>

              {/* Star Ratings */}
              <div className="space-y-3 bg-[#1C1C1C] border border-[#242424] p-4 rounded-xl">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-white">Food Quality</span>
                  {renderStars(foodQuality, setFoodQuality)}
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-white">Quantity</span>
                  {renderStars(quantity, setQuantity)}
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-white">Temperature</span>
                  {renderStars(temperature, setTemperature)}
                </div>
              </div>

              {/* Issue Tags */}
              <div>
                <label className="text-xs font-mono text-[#A3A3A3] block mb-2">Tag Any Issues (Optional)</label>
                <div className="flex flex-wrap gap-2">
                  {issueOptions.map((issue) => {
                    const isSelected = selectedIssues.includes(issue);
                    return (
                      <button
                        key={issue}
                        type="button"
                        onClick={() => toggleIssue(issue)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition ${
                          isSelected
                            ? 'bg-[#450A0A] text-[#EF4444] border-[#E50914]'
                            : 'bg-[#1C1C1C] text-[#A3A3A3] border-[#242424] hover:text-white'
                        }`}
                      >
                        {isSelected ? '✓ ' : ''}{issue}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="text-xs font-mono text-[#A3A3A3] block mb-1.5">Additional Comments</label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share feedback on taste, freshness, or service..."
                  className="w-full bg-[#1C1C1C] border border-[#242424] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-[#E50914] hover:bg-[#B91C1C] text-white font-black text-xs transition shadow-lg shadow-[#E50914]/20 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>SUBMIT FEEDBACK</span>
              </button>
            </form>
          )}
        </div>

        {/* History & Complaints */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#151515] border border-[#242424] rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-extrabold text-white border-b border-[#242424] pb-3">
              YOUR RECENT FEEDBACK
            </h3>

            {feedbacksHistory.length === 0 ? (
              <p className="text-xs text-[#8E8E93]">No feedback history submitted yet.</p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {feedbacksHistory.map((fb) => (
                  <div key={fb.id} className="bg-[#1C1C1C] border border-[#242424] rounded-xl p-3.5 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono text-[#A3A3A3]">Order #{fb.order?.orderNumber}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                        <span className="font-bold text-white text-xs">
                          {((fb.foodQualityRating + fb.quantityRating + fb.temperatureRating) / 3).toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {fb.issues && (
                      <span className="inline-block text-[10px] bg-[#450A0A] text-[#EF4444] px-2 py-0.5 rounded border border-[#E50914]/30">
                        Issues: {fb.issues}
                      </span>
                    )}

                    {fb.comment && (
                      <p className="text-xs text-[#A3A3A3] italic">"{fb.comment}"</p>
                    )}

                    {fb.complaint && (
                      <div className="mt-2 pt-2 border-t border-[#242424] flex items-center justify-between text-[10px]">
                        <span className="text-[#A3A3A3]">Complaint Status</span>
                        <span className={`font-bold uppercase px-2 py-0.5 rounded ${
                          fb.complaint.status === 'RESOLVED'
                            ? 'bg-[#22C55E]/20 text-[#22C55E]'
                            : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                        }`}>
                          {fb.complaint.status}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
