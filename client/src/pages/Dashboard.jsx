import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  Clock, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  MoreVertical,
  ExternalLink
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import { format } from 'date-fns';
import LeadModal from '../components/LeadModal';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/leads/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  const cards = [
    { name: 'Total Leads', value: stats?.totalLeads, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', change: '+12.5%', up: true },
    { name: 'Converted', value: stats?.convertedLeads, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', change: '+8.2%', up: true },
    { name: 'Pending Follow-ups', value: stats?.pendingFollowUps, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', change: '-2.4%', up: false },
    { name: 'Conversion Rate', value: `${stats?.conversionRate}%`, icon: BarChart3, color: 'text-violet-600', bg: 'bg-violet-50', change: '+4.1%', up: true },
  ];

  return (
    <div className="p-8 ml-64 bg-secondary-50 min-h-[calc(100vh-80px)]">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-secondary-950 dark:text-white">Analytics Overview</h1>
          <p className="text-secondary-500 mt-1 dark:text-secondary-400">Monitor your lead performance and business growth.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 py-3 px-6 shadow-md"
        >
          <Plus size={20} />
          <span>New Lead</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <div key={card.name} className="card p-6 flex flex-col justify-between hover:border-primary-200 transition-colors cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}>
                <card.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${card.up ? 'text-emerald-600' : 'text-red-600'}`}>
                {card.change} {card.up ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              </div>
            </div>
            <div>
              <p className="text-secondary-500 font-medium">{card.name}</p>
              <h3 className="text-3xl font-bold text-secondary-950 mt-1">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 card p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-secondary-950">Lead Growth</h2>
            <select className="bg-secondary-50 border border-secondary-200 rounded-lg px-3 py-1.5 text-sm outline-none">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
            </select>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.leadGrowth}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-8 flex flex-col">
          <h2 className="text-xl font-bold text-secondary-950 mb-6">Recent Activity</h2>
          <div className="space-y-6 flex-grow">
            {stats?.recentActivity.map((activity, idx) => (
              <div key={idx} className="flex gap-4 group cursor-pointer">
                <div className="relative">
                  <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-600 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    <Users size={18} />
                  </div>
                  {idx !== stats.recentActivity.length - 1 && (
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-secondary-100"></div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">{activity.name}</p>
                  <p className="text-xs text-secondary-500 mt-0.5">Status changed to <span className="text-secondary-700 font-medium">{activity.status}</span></p>
                  <p className="text-[10px] text-secondary-400 mt-1 uppercase tracking-wider font-bold">
                    {format(new Date(activity.updatedAt), 'MMM dd, hh:mm a')}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-8 text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center justify-center gap-2 group">
            View all activity <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      <LeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={() => window.location.reload()} 
      />
    </div>
  );
};

export default Dashboard;
