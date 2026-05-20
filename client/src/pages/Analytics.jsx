import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  UserCheck, 
  PieChart as PieChartIcon, 
  BarChart as BarChartIcon,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';
import api from '../services/api';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/leads/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 ml-64 text-center">Loading analytics...</div>;

  const statusData = [
    { name: 'New', value: 35, color: '#0ea5e9' },
    { name: 'Contacted', value: 25, color: '#f59e0b' },
    { name: 'Qualified', value: 20, color: '#8b5cf6' },
    { name: 'Converted', value: 15, color: '#10b981' },
    { name: 'Closed', value: 5, color: '#64748b' },
  ];

  const sourceData = [
    { name: 'Website', count: 45 },
    { name: 'LinkedIn', count: 25 },
    { name: 'Referral', count: 15 },
    { name: 'Cold Email', count: 10 },
    { name: 'Other', count: 5 },
  ];

  return (
    <div className="p-8 ml-64 bg-secondary-50 min-h-[calc(100vh-80px)]">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-secondary-950">Deep Analytics</h1>
          <p className="text-secondary-500 mt-1">Comprehensive breakdown of your sales pipeline and lead performance.</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Filter size={18} />
          <span>Filter Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Pipeline Distribution */}
        <div className="card p-8">
          <h2 className="text-xl font-bold text-secondary-950 mb-8 flex items-center gap-2">
            <PieChartIcon size={20} className="text-primary-600" /> Pipeline Distribution
          </h2>
          <div className="h-[350px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Sources */}
        <div className="card p-8">
          <h2 className="text-xl font-bold text-secondary-950 mb-8 flex items-center gap-2">
            <BarChartIcon size={20} className="text-primary-600" /> Lead Sources
          </h2>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" fill="#0ea5e9" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card p-8">
          <h2 className="text-xl font-bold text-secondary-950 mb-8 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary-600" /> Conversion Trend
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.leadGrowth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={4} dot={{ r: 6, fill: '#8b5cf6', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-8 bg-primary-600 text-white border-none shadow-primary-200">
          <h2 className="text-xl font-bold mb-6">Quick Stats</h2>
          <div className="space-y-6">
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
              <p className="text-primary-100 text-xs font-bold uppercase tracking-wider mb-1">Total Revenue Potential</p>
              <h3 className="text-2xl font-bold">$124,500.00</h3>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
              <p className="text-primary-100 text-xs font-bold uppercase tracking-wider mb-1">Avg. Response Time</p>
              <h3 className="text-2xl font-bold">1.2 Hours</h3>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
              <p className="text-primary-100 text-xs font-bold uppercase tracking-wider mb-1">Team Efficiency</p>
              <h3 className="text-2xl font-bold">94%</h3>
            </div>
          </div>
          <button className="w-full mt-8 bg-white text-primary-600 font-bold py-3 rounded-xl hover:bg-primary-50 transition-colors shadow-lg">
            Download Full Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
