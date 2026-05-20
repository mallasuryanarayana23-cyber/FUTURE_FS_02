import React, { useState, useEffect } from 'react';
import { X, Save, User, Mail, Phone, Building2, Calendar, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const LeadModal = ({ isOpen, onClose, lead, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'Website Contact Form',
    status: 'New',
    followUpDate: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        source: lead.source || 'Website Contact Form',
        status: lead.status || 'New',
        followUpDate: lead.followUpDate ? new Date(lead.followUpDate).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        source: 'Website Contact Form',
        status: 'New',
        followUpDate: '',
      });
    }
  }, [lead, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (lead) {
        const response = await api.put(`/leads/${lead._id}`, formData);
        toast.success('Lead updated successfully');
        onSave(response.data);
      } else {
        const response = await api.post('/leads', formData);
        toast.success('Lead created successfully');
        onSave(response.data);
      }
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-secondary-950/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-secondary-100 flex justify-between items-center bg-secondary-50/50">
          <div>
            <h2 className="text-xl font-bold text-secondary-900">{lead ? 'Edit Lead' : 'Create New Lead'}</h2>
            <p className="text-xs text-secondary-500 mt-0.5">Fill in the information below to manage your contact.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary-200 rounded-full transition-colors">
            <X size={20} className="text-secondary-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-secondary-700 flex items-center gap-2">
                <User size={14} className="text-primary-600" /> Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                className="input-field"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-secondary-700 flex items-center gap-2">
                <Mail size={14} className="text-primary-600" /> Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                className="input-field"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-secondary-700 flex items-center gap-2">
                <Phone size={14} className="text-primary-600" /> Phone Number
              </label>
              <input
                type="text"
                name="phone"
                required
                className="input-field"
                placeholder="+1 234 567 890"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-secondary-700 flex items-center gap-2">
                <Building2 size={14} className="text-primary-600" /> Company Name
              </label>
              <input
                type="text"
                name="company"
                required
                className="input-field"
                placeholder="Tech Solutions Inc."
                value={formData.company}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-secondary-700 flex items-center gap-2">
                <Send size={14} className="text-primary-600" /> Lead Source
              </label>
              <select
                name="source"
                className="input-field"
                value={formData.source}
                onChange={handleChange}
              >
                <option value="Website Contact Form">Website Contact Form</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Referral">Referral</option>
                <option value="Cold Email">Cold Email</option>
                <option value="Inbound Call">Inbound Call</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-secondary-700 flex items-center gap-2">
                <Calendar size={14} className="text-primary-600" /> Follow-up Date
              </label>
              <input
                type="date"
                name="followUpDate"
                className="input-field"
                value={formData.followUpDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-secondary-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary px-6"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2 px-8"
            >
              {loading ? 'Processing...' : lead ? 'Update Lead' : 'Create Lead'}
              {!loading && <Save size={18} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
