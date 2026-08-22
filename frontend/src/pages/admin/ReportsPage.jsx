import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid
} from 'recharts';
import { Download, BarChart3, TrendingUp, Clock, PieChart as PieIcon } from 'lucide-react';

const RED_COLORS = ['#E50914', '#FF2D2D', '#B91C1C', '#7F1D1D', '#450A0A', '#991B1B'];

export const ReportsPage = () => {
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/reports');
        if (res.success) {
          setReportsData(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const exportCSV = () => {
    if (!reportsData) return;
    let csv = 'Food Item,Orders Count,Total Credits\n';
    reportsData.mostOrderedItems.forEach(i => {
      csv += `"${i.name}",${i.ordersCount},${i.totalCredits}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Mess_Analytics_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  if (loading) return <SkeletonLoader count={4} type="card" />;

  const { mostOrderedItems, statusDistribution, dailyOrdersData, peakHoursData } = reportsData || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Analytics & Reports</h1>
          <p className="text-xs sm:text-sm text-[#A3A3A3]">Interactive visual charts on daily order trends, popular dishes, peak hours, and status ratios.</p>
        </div>
        <button
          onClick={exportCSV}
          className="px-4 py-2.5 text-xs font-bold text-white bg-[#E50914] hover:bg-[#FF2D2D] rounded-lg transition shadow-md shadow-[#E50914]/20 flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export CSV Report
        </button>
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Daily Orders & Credit Usage */}
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#E50914]" />
            <h3 className="font-extrabold text-white text-base">Daily Order Volume & Credits</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyOrdersData}>
                <CartesianGrid stroke="#1F1F1F" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#737373" fontSize={11} />
                <YAxis stroke="#737373" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#111111', borderColor: '#2A2A2A', borderRadius: '10px', color: '#fff' }} />
                <Line type="monotone" dataKey="totalOrders" stroke="#E50914" strokeWidth={3} name="Total Orders" />
                <Line type="monotone" dataKey="totalCredits" stroke="#FF2D2D" strokeWidth={2} name="Credits Processed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Most Ordered Food Items */}
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#FF2D2D]" />
            <h3 className="font-extrabold text-white text-base">Most Popular Food Items</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mostOrderedItems} layout="vertical">
                <CartesianGrid stroke="#1F1F1F" strokeDasharray="3 3" />
                <XAxis type="number" stroke="#737373" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#737373" fontSize={10} width={110} />
                <Tooltip contentStyle={{ backgroundColor: '#111111', borderColor: '#2A2A2A', borderRadius: '10px', color: '#fff' }} />
                <Bar dataKey="ordersCount" fill="#E50914" radius={[0, 6, 6, 0]} name="Orders Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Order Status Distribution */}
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-[#E50914]" />
            <h3 className="font-extrabold text-white text-base">Order Status Breakdown</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {statusDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={RED_COLORS[index % RED_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#111111', borderColor: '#2A2A2A', borderRadius: '10px', color: '#fff' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Peak Ordering Hours */}
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#FF2D2D]" />
            <h3 className="font-extrabold text-white text-base">Peak Ordering Meal Slots</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHoursData}>
                <CartesianGrid stroke="#1F1F1F" strokeDasharray="3 3" />
                <XAxis dataKey="timeSlot" stroke="#737373" fontSize={10} />
                <YAxis stroke="#737373" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#111111', borderColor: '#2A2A2A', borderRadius: '10px', color: '#fff' }} />
                <Bar dataKey="ordersCount" fill="#E50914" radius={[6, 6, 0, 0]} name="Orders Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
