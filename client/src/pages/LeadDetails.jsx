import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Plus,
  Save,
  Trash2,
  CheckCircle2,
  MoreVertical
} from 'lucide-react';
import api from '../services/api';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import LeadModal from '../components/LeadModal';

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await api.get(`/leads/${id}`);
        setLead(response.data);
      } catch (error) {
        toast.error('Failed to fetch lead details');
        navigate('/leads');
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [id, navigate]);

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      const response = await api.put(`/leads/${id}`, { status: newStatus });
      setLead(response.data);
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await api.delete(`/leads/${id}`);
        toast.success('Lead deleted successfully');
        navigate('/leads');
      } catch (error) {
        toast.error('Failed to delete lead');
      }
    }
  };

  const handleUpdateLead = (updatedLead) => {
    setLead(updatedLead);
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      setUpdating(true);
      const response = await api.post(`/leads/${id}/notes`, { content: newNote });
      setLead(response.data);
      setNewNote('');
      toast.success('Note added');
    } catch (error) {
      toast.error('Failed to add note');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-8 text-center dark:text-white">Loading lead details...</div>;
  if (!lead) return null;

  return (
    <div className="p-8 bg-secondary-50 min-h-[calc(100vh-80px)]">
      <button 
        onClick={() => navigate('/leads')}
        className="flex items-center gap-2 text-secondary-500 hover:text-secondary-900 transition-colors mb-6 font-medium"
      >
        <ArrowLeft size={20} /> Back to Leads
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Header Card */}
          <div className="card p-8 flex flex-wrap justify-between items-start gap-6">
            <div className="flex gap-6">
              <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center font-bold text-3xl shadow-sm border border-primary-200">
                {lead.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-secondary-950">{lead.name}</h1>
                <p className="text-secondary-500 flex items-center gap-2 mt-1">
                  <Building2 size={16} /> {lead.company}
                </p>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 text-sm text-secondary-600 bg-secondary-50 px-3 py-1.5 rounded-lg border border-secondary-100">
                    <Mail size={14} className="text-secondary-400" />
                    {lead.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-secondary-600 bg-secondary-50 px-3 py-1.5 rounded-lg border border-secondary-100">
                    <Phone size={14} className="text-secondary-400" />
                    {lead.phone}
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="text-xs font-bold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors border border-primary-100"
                  >
                    Edit Info
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <select 
                className="bg-primary-600 text-white rounded-xl px-4 py-2.5 font-bold text-sm outline-none cursor-pointer hover:bg-primary-700 transition-colors shadow-lg shadow-primary-100"
                value={lead.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updating}
              >
                <option value="New">New Lead</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Converted">Converted</option>
                <option value="Closed">Closed</option>
              </select>
              <p className="text-[10px] text-secondary-400 uppercase tracking-widest font-bold">
                Last updated: {format(new Date(lead.updatedAt), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>

          {/* Notes Section */}
          <div className="card">
            <div className="p-6 border-b border-secondary-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-secondary-950 flex items-center gap-2">
                <MessageSquare size={20} className="text-primary-600" /> Notes & Activity
              </h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleAddNote} className="mb-8">
                <textarea
                  className="input-field min-h-[120px] resize-none mb-4 p-4 text-secondary-900 bg-secondary-50 border-secondary-200"
                  placeholder="Type a new note about this client..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                ></textarea>
                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    className="btn-primary flex items-center gap-2 px-6"
                    disabled={updating || !newNote.trim()}
                  >
                    <Plus size={18} /> Add Note
                  </button>
                </div>
              </form>

              <div className="space-y-6">
                {lead.notes.length === 0 ? (
                  <p className="text-center text-secondary-500 py-10 italic">No notes added yet</p>
                ) : (
                  lead.notes.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map((note, idx) => (
                    <div key={idx} className="flex gap-4 p-5 bg-secondary-50/50 rounded-2xl border border-secondary-100 group">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-secondary-400 border border-secondary-100 shadow-sm">
                        <MessageSquare size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <p className="text-sm font-bold text-secondary-900">{note.createdBy}</p>
                          <p className="text-xs text-secondary-400">{format(new Date(note.createdAt), 'MMM dd, yyyy · hh:mm a')}</p>
                        </div>
                        <p className="text-secondary-600 text-sm leading-relaxed">{note.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Follow-up Card */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-secondary-950 mb-6 flex items-center gap-2">
              <Calendar size={18} className="text-primary-600" /> Follow-up Schedule
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-primary-50 border border-primary-100 rounded-xl">
                <p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-1">Next Follow-up</p>
                <p className="text-lg font-bold text-primary-900">
                  {lead.followUpDate ? format(new Date(lead.followUpDate), 'MMMM dd, yyyy') : 'No date set'}
                </p>
              </div>
              <div className="flex items-center justify-between p-4 bg-secondary-50 border border-secondary-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-secondary-700">{lead.followUpStatus}</span>
                </div>
                <button className="text-xs font-bold text-primary-600 hover:underline">Change</button>
              </div>
              <button className="w-full btn-secondary py-3 flex items-center justify-center gap-2">
                <CheckCircle2 size={18} /> Mark as Completed
              </button>
            </div>
          </div>

          {/* Lead Info Card */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-secondary-950 mb-6 flex items-center gap-2">
              <Plus size={18} className="text-primary-600" /> Additional Info
            </h3>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-secondary-400 uppercase tracking-widest mb-1">Lead Source</p>
                <p className="text-sm font-semibold text-secondary-900">{lead.source}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-secondary-400 uppercase tracking-widest mb-1">Created On</p>
                <p className="text-sm font-semibold text-secondary-900">{format(new Date(lead.createdAt), 'MMMM dd, yyyy')}</p>
              </div>
              <div className="pt-4 border-t border-secondary-100">
                <button 
                  onClick={handleDelete}
                  className="w-full text-red-600 bg-red-50 hover:bg-red-100 py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} /> Delete Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        lead={lead}
        onSave={handleUpdateLead}
      />
    </div>
  );
};

export default LeadDetails;
