import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  UserPlus,
  Mail,
  Phone,
  Building2,
  Download,
  Trash2,
  Eye,
  Edit2
} from 'lucide-react';
import api from '../services/api';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import LeadModal from '../components/LeadModal';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/leads?search=${search}&status=${status}&page=${page}`);
      setLeads(response.data.leads);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [search, status, page]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await api.delete(`/leads/${id}`);
        toast.success('Lead deleted successfully');
        fetchLeads();
      } catch (error) {
        toast.error('Failed to delete lead');
      }
    }
  };

  const handleOpenModal = (lead = null) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Status', 'Source', 'Created At'];
    const rows = leads.map(lead => [
      lead.name,
      lead.email,
      lead.phone,
      lead.company,
      lead.status,
      lead.source,
      format(new Date(lead.createdAt), 'yyyy-MM-dd')
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nexus_leads_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV Exported');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-700';
      case 'Contacted': return 'bg-amber-100 text-amber-700';
      case 'Qualified': return 'bg-violet-100 text-violet-700';
      case 'Converted': return 'bg-emerald-100 text-emerald-700';
      case 'Closed': return 'bg-secondary-100 text-secondary-700';
      default: return 'bg-secondary-100 text-secondary-700';
    }
  };

  return (
    <div className="p-8 ml-64 bg-secondary-50 min-h-[calc(100vh-80px)]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-secondary-950">Customer Leads</h1>
          <p className="text-secondary-500 mt-1">Manage and track your customer relationships.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExportCSV} className="btn-secondary flex items-center gap-2">
            <Download size={18} />
            <span>Export CSV</span>
          </button>
          <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
            <UserPlus size={18} />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      <div className="card">
        <div className="p-6 border-b border-secondary-100 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-[300px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
              <input
                type="text"
                placeholder="Search name, email, company..."
                className="input-field pl-10 bg-secondary-50 border-secondary-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select 
              className="bg-secondary-50 border border-secondary-200 rounded-lg px-4 py-2 text-sm outline-none font-medium text-secondary-700"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Converted">Converted</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div className="text-sm text-secondary-500 font-medium">
            Showing {leads.length} of {totalPages * 10} leads
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary-50/50 text-secondary-500 text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-4">Lead Name</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-secondary-500">Loading leads...</td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-secondary-500">No leads found</td>
                </tr>
              ) : leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-secondary-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center font-bold text-sm">
                        {lead.name.charAt(0)}
                      </div>
                      <Link to={`/leads/${lead._id}`} className="font-semibold text-secondary-900 hover:text-primary-600">
                        {lead.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-secondary-600">
                      <Building2 size={16} className="text-secondary-400" />
                      <span className="text-sm">{lead.company}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-secondary-600">
                        <Mail size={14} className="text-secondary-400" />
                        {lead.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-secondary-600">
                        <Phone size={14} className="text-secondary-400" />
                        {lead.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary-500 font-medium">
                    {format(new Date(lead.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/leads/${lead._id}`} className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="View Details">
                        <Eye size={18} />
                      </Link>
                      <button onClick={() => handleOpenModal(lead)} className="p-2 text-secondary-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Lead">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(lead._id)} className="p-2 text-secondary-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Lead">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        <LeadModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          lead={selectedLead}
          onSave={fetchLeads}
        />

        <div className="p-6 border-t border-secondary-100 flex items-center justify-between">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="flex items-center gap-2 text-sm font-medium text-secondary-600 hover:text-primary-600 disabled:opacity-50"
          >
            <ChevronLeft size={18} /> Previous
          </button>
          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                  page === i + 1 
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-200' 
                  : 'text-secondary-500 hover:bg-secondary-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="flex items-center gap-2 text-sm font-medium text-secondary-600 hover:text-primary-600 disabled:opacity-50"
          >
            Next <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leads;
