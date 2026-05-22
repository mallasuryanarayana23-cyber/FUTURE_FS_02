import React, { useState, useEffect } from 'react';
import { Clock, User, Filter, AlertCircle, History } from 'lucide-react';
import api from '../services/api';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

const ActivityLogs = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await api.get('/activities');
        setActivities(response.data);
      } catch (error) {
        toast.error('Failed to load activity timeline');
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const getActionStyles = (action) => {
    switch (action) {
      case 'Lead Created': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400';
      case 'Status Updated': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400';
      case 'Follow-Up Scheduled': return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400';
      case 'Note Added': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400';
      case 'Lead Deleted': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400';
      default: return 'bg-secondary-100 text-secondary-700 border-secondary-200 dark:bg-secondary-800 dark:text-secondary-300';
    }
  };

  if (loading) return <div className="p-8 text-center dark:text-white">Loading audit timeline...</div>;

  return (
    <div className="p-8 bg-secondary-50 min-h-[calc(100vh-80px)] dark:bg-secondary-950">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-secondary-950 dark:text-white flex items-center gap-2">
            <History size={28} className="text-primary-600" /> Audit Activity Logs
          </h1>
          <p className="text-secondary-500 mt-1 dark:text-secondary-400">Complete historical timeline of all client lead modifications.</p>
        </div>
      </div>

      <div className="card p-8">
        {activities.length === 0 ? (
          <div className="text-center py-16">
            <AlertCircle size={48} className="mx-auto text-secondary-300 mb-4" />
            <h3 className="text-lg font-bold text-secondary-700 dark:text-secondary-300">No activity logged yet</h3>
            <p className="text-secondary-400 text-sm mt-1">Activities are automatically tracked when leads are edited, created, or updated.</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-secondary-200 dark:border-secondary-800 ml-4 space-y-8">
            {activities.map((act) => (
              <div key={act._id} className="relative pl-8 group">
                {/* Timeline Dot Indicator */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 bg-white rounded-full border-2 border-primary-500 group-hover:scale-125 transition-transform dark:bg-secondary-900"></div>
                
                <div className="bg-secondary-50/50 hover:bg-secondary-50 p-5 rounded-2xl border border-secondary-100 dark:bg-secondary-900/50 dark:border-secondary-800 dark:hover:bg-secondary-900 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${getActionStyles(act.action)}`}>
                      {act.action}
                    </span>
                    <span className="text-xs text-secondary-400 flex items-center gap-1 font-medium">
                      <Clock size={14} />
                      {format(new Date(act.createdAt), 'MMM dd, yyyy · hh:mm a')}
                    </span>
                  </div>

                  <p className="text-secondary-900 text-sm font-medium dark:text-white leading-relaxed">
                    {act.description}
                  </p>

                  <div className="flex items-center gap-2 mt-4 text-xs text-secondary-500 dark:text-secondary-400">
                    <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-[10px]">
                      {act.adminName ? act.adminName.charAt(0) : 'A'}
                    </div>
                    <span>Modified by <span className="font-semibold text-secondary-700 dark:text-secondary-300">{act.adminName || 'Admin'}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogs;
