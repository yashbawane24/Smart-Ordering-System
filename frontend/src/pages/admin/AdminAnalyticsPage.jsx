import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, LineChart, Line
} from 'recharts';
import { PieChart, TrendingUp, Users, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/analytics/consumption');
      setAnalytics(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const { metrics, charts } = analytics || {};

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#242424] pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>MESS OPERATIONS ANALYTICS</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30 font-mono">
              Consumption Intelligence
            </span>
          </h1>
          <p className="text-sm text-[#A3A3A3] mt-1">
            Monitor institutional meal demand, actual collection rates, no-show trends, and slot capacity metrics.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 text-xs font-bold text-white bg-[#1C1C1C] hover:bg-[#252525] border border-[#242424] rounded-xl transition flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4 text-[#E50914]" /> Refresh Data
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#151515] border border-[#242424] rounded-2xl p-5 space-y-1">
          <span className="text-xs font-mono text-[#A3A3A3] uppercase block">EXPECTED MEALS</span>
          <h3 className="text-3xl font-black text-white font-mono">{metrics?.expectedMeals || 420}</h3>
          <span className="text-[10px] text-[#A3A3A3] block">Declarations + Confirmed Orders</span>
        </div>

        <div className="bg-[#151515] border border-[#242424] rounded-2xl p-5 space-y-1">
          <span className="text-xs font-mono text-[#A3A3A3] uppercase block">ACTUAL COLLECTED</span>
          <h3 className="text-3xl font-black text-[#22C55E] font-mono">{metrics?.actualCollected || 385}</h3>
          <span className="text-[10px] text-[#22C55E] block">Collection Rate: {metrics?.collectionRate || '91.6%'}</span>
        </div>

        <div className="bg-[#151515] border border-[#242424] rounded-2xl p-5 space-y-1">
          <span className="text-xs font-mono text-[#A3A3A3] uppercase block">NO-SHOW MEALS</span>
          <h3 className="text-3xl font-black text-[#E50914] font-mono">{metrics?.noShows || 35}</h3>
          <span className="text-[10px] text-[#E50914] block">No-Show Rate: {metrics?.noShowRate || '8.4%'}</span>
        </div>

        <div className="bg-[#151515] border border-[#242424] rounded-2xl p-5 space-y-1">
          <span className="text-xs font-mono text-[#A3A3A3] uppercase block">COLLECTION EFFICIENCY</span>
          <h3 className="text-3xl font-black text-white font-mono">{metrics?.collectionRate || '91.6%'}</h3>
          <span className="text-[10px] text-[#22C55E] block">Target: &gt; 90%</span>
        </div>
      </div>

      {/* 4 Minimal Red Dark Recharts Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Expected vs Actual */}
        <div className="bg-[#151515] border border-[#242424] rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
            1. Expected vs Actual Consumption
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.expectedVsActualChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#242424" />
                <XAxis dataKey="category" stroke="#8E8E93" fontSize={11} />
                <YAxis stroke="#8E8E93" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1C1C1C', borderColor: '#242424', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#E50914" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Meal-Wise Consumption */}
        <div className="bg-[#151515] border border-[#242424] rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
            2. Meal-Wise Consumption Breakdown
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.mealWiseChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#242424" />
                <XAxis dataKey="name" stroke="#8E8E93" fontSize={11} />
                <YAxis stroke="#8E8E93" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1C1C1C', borderColor: '#242424', color: '#fff', fontSize: '12px' }}
                />
                <Legend />
                <Bar dataKey="expected" fill="#444444" name="Expected" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collected" fill="#22C55E" name="Collected" radius={[4, 4, 0, 0]} />
                <Bar dataKey="noShow" fill="#E50914" name="No Show" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Time Slot Demand */}
        <div className="bg-[#151515] border border-[#242424] rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
            3. Time Slot Demand (15-min Intervals)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.slotDemandChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#242424" />
                <XAxis dataKey="time" stroke="#8E8E93" fontSize={11} />
                <YAxis stroke="#8E8E93" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1C1C1C', borderColor: '#242424', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="booked" fill="#E50914" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Weekly Consumption Trend */}
        <div className="bg-[#151515] border border-[#242424] rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
            4. Weekly Consumption Trend (7 Days)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts?.weeklyTrendChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#242424" />
                <XAxis dataKey="day" stroke="#8E8E93" fontSize={11} />
                <YAxis stroke="#8E8E93" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1C1C1C', borderColor: '#242424', color: '#fff', fontSize: '12px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="expected" stroke="#8E8E93" strokeWidth={2} name="Expected" />
                <Line type="monotone" dataKey="collected" stroke="#E50914" strokeWidth={3} name="Collected" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
