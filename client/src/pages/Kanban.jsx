import React, { useState, useEffect } from 'react';
import { Mail, Phone, Building2, User, ChevronRight, Plus, Eye, MoreHorizontal } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Kanban = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status columns defined in requirements
  const columns = [
    { id: 'New', title: 'New Leads', color: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50/50' },
    { id: 'Contacted', title: 'Contacted', color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50/50' },
    { id: 'Qualified', title: 'Qualified', color: 'bg-violet-500', text: 'text-violet-700', bg: 'bg-violet-50/50' },
    { id: 'Proposal Sent', title: 'Proposal Sent', color: 'bg-pink-500', text: 'text-pink-700', bg: 'bg-pink-50/50' },
    { id: 'Negotiation', title: 'Negotiation', color: 'bg-rose-500', text: 'text-rose-700', bg: 'bg-rose-50/50' },
    { id: 'Converted', title: 'Converted', color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50/50' },
    { id: 'Closed', title: 'Closed', color: 'bg-slate-500', text: 'text-slate-700', bg: 'bg-slate-50/50' },
    { id: 'Lost', title: 'Lost', color: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50/50' }
  ];

  const fetchLeads = async () => {
    try {
      const response = await api.get('/leads?limit=100'); // Fetch a large batch to show on board
      setLeads(response.data.leads);
    } catch (error) {
      toast.error('Failed to load Kanban board leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const onDragStart = (e, leadId) => {
    e.dataTransfer.setData('leadId', leadId);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = async (e, targetStatus) => {
    const leadId = e.dataTransfer.getData('leadId');
    if (!leadId) return;

    // Find the lead and check if status changed
    const targetLead = leads.find(l => l._id === leadId);
    if (!targetLead || targetLead.status === targetStatus) return;

    // Optimistically update the UI status
    const previousLeads = [...leads];
    setLeads(leads.map(l => l._id === leadId ? { ...l, status: targetStatus } : l));

    try {
      await api.put(`/leads/${leadId}`, { status: targetStatus });
      toast.success(`Moved lead to ${targetStatus}`);
    } catch (error) {
      toast.error('Failed to update lead status');
      // Revert optimism on error
      setLeads(previousLeads);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400';
      case 'Medium': return 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400';
      default: return 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400';
    }
  };

  if (loading) return <div className="p-8 text-center dark:text-white">Loading Lead Board...</div>;

  return (
    <div className="p-8 bg-secondary-50 min-h-[calc(100vh-80px)] dark:bg-secondary-950">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-950 dark:text-white">Kanban Pipeline</h1>
        <p className="text-secondary-500 mt-1 dark:text-secondary-400">Drag and drop leads to seamlessly progress them through your sales stages.</p>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-6 select-none max-w-full">
        {columns.map(col => {
          const colLeads = leads.filter(l => l.status === col.id);
          return (
            <div
              key={col.id}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, col.id)}
              className={`flex-shrink-0 w-72 rounded-3xl p-4 flex flex-col border border-secondary-200/60 dark:border-secondary-800 ${col.bg} min-h-[600px]`}
            >
              {/* Column Header */}
              <div className="flex justify-between items-center mb-4 px-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.color}`}></div>
                  <h3 className="font-bold text-secondary-900 text-sm dark:text-white">{col.title}</h3>
                </div>
                <span className="text-xs bg-white text-secondary-500 px-2 py-0.5 rounded-full font-bold border border-secondary-100 dark:bg-secondary-800 dark:text-secondary-300 dark:border-secondary-700">
                  {colLeads.length}
                </span>
              </div>

              {/* Lead Cards list */}
              <div className="space-y-3 flex-grow overflow-y-auto max-h-[550px] pr-1">
                {colLeads.length === 0 ? (
                  <div className="border border-dashed border-secondary-200 dark:border-secondary-800 rounded-2xl p-6 text-center text-secondary-400 text-xs italic">
                    Drop leads here
                  </div>
                ) : (
                  colLeads.map(lead => (
                    <motion.div
                      key={lead._id}
                      draggable
                      onDragStart={(e) => onDragStart(e, lead._id)}
                      layoutId={lead._id}
                      className="bg-white p-4 rounded-2xl shadow-sm border border-secondary-200/80 hover:border-primary-400 transition-colors cursor-grab active:cursor-grabbing group dark:bg-secondary-900 dark:border-secondary-800 dark:hover:border-primary-500"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getPriorityColor(lead.priority)}`}>
                          {lead.priority}
                        </span>
                        <Link 
                          to={`/leads/${lead._id}`} 
                          className="p-1 text-secondary-400 hover:text-primary-600 hover:bg-secondary-50 rounded-lg transition-colors dark:hover:bg-secondary-800"
                        >
                          <Eye size={14} />
                        </Link>
                      </div>

                      <h4 className="font-bold text-secondary-900 text-sm group-hover:text-primary-600 transition-colors dark:text-white">
                        {lead.name}
                      </h4>
                      <p className="text-xs text-secondary-500 flex items-center gap-1 mt-1 dark:text-secondary-400">
                        <Building2 size={12} /> {lead.company}
                      </p>

                      {lead.tags && lead.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {lead.tags.slice(0, 2).map((t, i) => (
                            <span key={i} className="text-[9px] bg-secondary-100 text-secondary-600 px-1.5 py-0.5 rounded dark:bg-secondary-800 dark:text-secondary-300">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Kanban;
