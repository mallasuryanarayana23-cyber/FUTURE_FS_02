import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  UserCheck, 
  PieChart as PieChartIcon, 
  BarChart as BarChartIcon,
  ArrowUpRight,
  Filter,
  DollarSign,
  Zap,
  Activity
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';
import api from '../services/api';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center dark:text-white">Loading analytics...</div>;

  // Filter out status items with 0 count to make the Pie chart look super premium
  const activeStatusDistribution = stats?.statusDistribution 
    ? stats.statusDistribution.filter(item => item.value > 0)
    : [];

  return (
    <div className="p-8 bg-secondary-50 min-h-[calc(100vh-80px)] dark:bg-secondary-950">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-secondary-950 dark:text-white">Deep Analytics</h1>
          <p className="text-secondary-500 mt-1 dark:text-secondary-400">Comprehensive breakdown of your sales pipeline and lead performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Pipeline Distribution */}
        <div className="card p-8 dark:bg-secondary-900 dark:border-secondary-800">
          <h2 className="text-xl font-bold text-secondary-950 dark:text-white mb-8 flex items-center gap-2">
            <PieChartIcon size={20} className="text-primary-600" /> Pipeline Distribution
          </h2>
          <div className="h-[350px] flex items-center justify-center">
            {activeStatusDistribution.length === 0 ? (
              <div className="text-secondary-500 dark:text-secondary-400 italic">No status data to display</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activeStatusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {activeStatusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{backgroundColor: '#1e293b', color: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  />
                  <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-secondary-700 dark:text-secondary-300 text-xs font-semibold">{value}</span>}/>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Lead Sources */}
        <div className="card p-8 dark:bg-secondary-900 dark:border-secondary-800">
          <h2 className="text-xl font-bold text-secondary-950 dark:text-white mb-8 flex items-center gap-2">
            <BarChartIcon size={20} className="text-primary-600" /> Lead Sources
          </h2>
          <div className="h-[350px]">
            {!stats?.sourceDistribution || stats.sourceDistribution.length === 0 ? (
              <div className="flex h-full items-center justify-center text-secondary-500 dark:text-secondary-400 italic">No source data to display</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.sourceDistribution}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-secondary-800" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc', opacity: 0.05}}
                    contentStyle={{backgroundColor: '#1e293b', color: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="count" fill="#0ea5e9" radius={[6, 6, 0, 0]} barSize={35} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card p-8 dark:bg-secondary-900 dark:border-secondary-800">
          <h2 className="text-xl font-bold text-secondary-950 dark:text-white mb-8 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary-600" /> Lead Conversion Trend
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.leadGrowth || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-secondary-800" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', color: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={4} dot={{ r: 6, fill: '#8b5cf6', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-8 bg-gradient-to-br from-primary-600 to-indigo-700 text-white border-none shadow-xl shadow-primary-100 dark:shadow-none">
          <h2 className="text-xl font-bold mb-6">Financial & Performance Stats</h2>
          <div className="space-y-6">
            <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/10">
              <p className="text-primary-100 text-[10px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <DollarSign size={12} /> Total Revenue Potential
              </p>
              <h3 className="text-3xl font-extrabold">
                ${stats?.revenuePotential ? stats.revenuePotential.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
              </h3>
            </div>
            
            <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/10">
              <p className="text-primary-100 text-[10px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Zap size={12} /> Conversion Efficiency
              </p>
              <h3 className="text-3xl font-extrabold">
                {stats?.conversionRate}%
              </h3>
            </div>

            <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/10">
              <p className="text-primary-100 text-[10px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Activity size={12} /> System Admin Engagement
              </p>
              <h3 className="text-3xl font-extrabold">
                Active
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
