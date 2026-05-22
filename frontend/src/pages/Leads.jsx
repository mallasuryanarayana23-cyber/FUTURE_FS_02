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
  Edit2,
  FileText,
  Tag
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
  const [priority, setPriority] = useState('');
  const [source, setSource] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/leads?search=${search}&status=${status}&priority=${priority}&source=${source}&sort=${sort}&page=${page}&limit=10`
      );
      setLeads(response.data.leads);
      setTotalPages(response.data.totalPages);
      setTotalLeads(response.data.totalLeads);
    } catch (error) {
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [search, status, priority, source, sort, page]);

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
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Status', 'Priority', 'Source', 'Created At'];
    const rows = leads.map(lead => [
      lead.name,
      lead.email,
      lead.phone,
      lead.company,
      lead.status,
      lead.priority,
      lead.source,
      format(new Date(lead.createdAt), 'yyyy-MM-dd')
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nexus_leads_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV Exported');
  };

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Pop-up blocker is enabled. Please allow pop-ups to export PDF.');
      return;
    }
    
    const tableRows = leads.map(lead => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: 600;">${lead.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${lead.company}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 12px;">
          <div>${lead.email}</div>
          <div style="color: #666;">${lead.phone}</div>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">
          <span class="badge ${lead.status.toLowerCase().replace(/ /g, '-')}">${lead.status}</span>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">
          <span class="badge priority-${lead.priority.toLowerCase()}">${lead.priority}</span>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 12px; color: #444;">${lead.source}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 12px;">${format(new Date(lead.createdAt), 'MMM dd, yyyy')}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>NexusCRM Leads Report</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; margin: 40px; }
            .header-container { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0ea5e9; padding-bottom: 20px; margin-bottom: 30px; }
            h1 { color: #0f172a; margin: 0; font-size: 28px; }
            .brand { color: #0ea5e9; font-weight: bold; }
            .header-info { text-align: right; color: #64748b; font-size: 13px; line-height: 1.5; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { text-align: left; background-color: #f8fafc; padding: 12px 10px; font-weight: bold; border-bottom: 2px solid #e2e8f0; color: #475569; font-size: 12px; text-transform: uppercase; }
            .badge { padding: 4px 8px; border-radius: 9999px; font-size: 10px; font-weight: bold; text-transform: uppercase; display: inline-block; }
            
            .new { background-color: #dbeafe; color: #1e40af; }
            .contacted { background-color: #fef3c7; color: #92400e; }
            .qualified { background-color: #ede9fe; color: #5b21b6; }
            .proposal-sent { background-color: #fce7f3; color: #9d174d; }
            .negotiation { background-color: #ffe4e6; color: #9f1239; }
            .converted { background-color: #d1fae5; color: #065f46; }
            .closed { background-color: #f1f5f9; color: #334155; }
            .lost { background-color: #fee2e2; color: #991b1b; }
            
            .priority-low { background-color: #f0fdf4; color: #166534; }
            .priority-medium { background-color: #fef3c7; color: #92400e; }
            .priority-high { background-color: #fef2f2; color: #991b1b; }
            
            .footer { border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header-container">
            <div>
              <h1>Nexus<span class="brand">CRM</span> Leads Report</h1>
              <p style="margin: 5px 0 0 0; color: #64748b;">Enterprise Lead Management & Sales Pipeline</p>
            </div>
            <div class="header-info">
              <div><strong>Generated:</strong> ${format(new Date(), 'MMMM dd, yyyy HH:mm')}</div>
              <div><strong>Total Records:</strong> ${leads.length} leads in this view</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Lead Name</th>
                <th>Company</th>
                <th>Contact Info</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Source</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <div class="footer">
            NexusCRM Enterprise Lead Management Portal. Confident & Secure Client Relationships.
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    toast.success('PDF Export Initiated');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400';
      case 'Contacted': return 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400';
      case 'Qualified': return 'bg-violet-100 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400';
      case 'Proposal Sent': return 'bg-pink-100 text-pink-700 dark:bg-pink-950/30 dark:text-pink-400';
      case 'Negotiation': return 'bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400';
      case 'Converted': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400';
      case 'Closed': return 'bg-slate-100 text-slate-700 dark:bg-slate-900/50 dark:text-slate-400';
      case 'Lost': return 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400';
      default: return 'bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400';
      case 'Medium': return 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400';
      default: return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400';
    }
  };

  return (
    <div className="p-8 bg-secondary-50 min-h-[calc(100vh-80px)] dark:bg-secondary-950">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-secondary-950 dark:text-white">Customer Leads</h1>
          <p className="text-secondary-500 mt-1 dark:text-secondary-400">Manage, qualify, and track your customer pipeline.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleExportCSV} className="btn-secondary flex items-center gap-2">
            <Download size={18} />
            <span>CSV</span>
          </button>
          <button onClick={handleExportPDF} className="btn-secondary flex items-center gap-2">
            <FileText size={18} />
            <span>PDF Report</span>
          </button>
          <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
            <UserPlus size={18} />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      <div className="card dark:bg-secondary-900 dark:border-secondary-800">
        <div className="p-6 border-b border-secondary-100 dark:border-secondary-800 flex flex-wrap gap-4 items-center justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 flex-grow max-w-full">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
              <input
                type="text"
                placeholder="Search leads..."
                className="input-field pl-10 bg-secondary-50 border-secondary-200 dark:bg-secondary-850 dark:border-secondary-800"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>

            {/* Status Filter */}
            <select 
              className="bg-secondary-50 border border-secondary-200 rounded-lg px-4 py-2 text-sm outline-none font-medium text-secondary-700 dark:bg-secondary-850 dark:border-secondary-800 dark:text-secondary-300"
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Converted">Converted</option>
              <option value="Closed">Closed</option>
              <option value="Lost">Lost</option>
            </select>

            {/* Priority Filter */}
            <select 
              className="bg-secondary-50 border border-secondary-200 rounded-lg px-4 py-2 text-sm outline-none font-medium text-secondary-700 dark:bg-secondary-850 dark:border-secondary-800 dark:text-secondary-300"
              value={priority}
              onChange={(e) => { setPriority(e.target.value); setPage(1); }}
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            {/* Source Filter */}
            <select 
              className="bg-secondary-50 border border-secondary-200 rounded-lg px-4 py-2 text-sm outline-none font-medium text-secondary-700 dark:bg-secondary-850 dark:border-secondary-800 dark:text-secondary-300"
              value={source}
              onChange={(e) => { setSource(e.target.value); setPage(1); }}
            >
              <option value="">All Sources</option>
              <option value="Website Contact Form">Website Form</option>
              <option value="Email Campaign">Email Campaign</option>
              <option value="Referral">Referral</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Cold Outreach">Cold Outreach</option>
              <option value="Other">Other</option>
            </select>

            {/* Sort Filter */}
            <select 
              className="bg-secondary-50 border border-secondary-200 rounded-lg px-4 py-2 text-sm outline-none font-medium text-secondary-700 dark:bg-secondary-850 dark:border-secondary-800 dark:text-secondary-300"
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">Name (A-Z)</option>
              <option value="company">Company (A-Z)</option>
            </select>

          </div>
          <div className="text-sm text-secondary-500 font-medium dark:text-secondary-400 whitespace-nowrap">
            Showing {leads.length} of {totalLeads} leads
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary-50/50 text-secondary-500 text-xs uppercase tracking-wider font-bold dark:bg-secondary-850/50 dark:text-secondary-400">
                <th className="px-6 py-4">Lead Name</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Priority & Source</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-secondary-500 dark:text-secondary-400">Loading leads...</td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-secondary-500 dark:text-secondary-400">No leads found</td>
                </tr>
              ) : leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-secondary-50/50 transition-colors group dark:hover:bg-secondary-850/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center font-bold text-sm dark:bg-primary-950/40 dark:text-primary-400">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <Link to={`/leads/${lead._id}`} className="font-semibold text-secondary-900 hover:text-primary-600 dark:text-white dark:hover:text-primary-400">
                          {lead.name}
                        </Link>
                        {lead.tags && lead.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {lead.tags.map((tag, idx) => (
                              <span key={idx} className="text-[9px] bg-secondary-100 text-secondary-600 px-1 rounded dark:bg-secondary-800 dark:text-secondary-400">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-secondary-600 dark:text-secondary-300">
                      <Building2 size={16} className="text-secondary-400" />
                      <span className="text-sm">{lead.company}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-300">
                        <Mail size={14} className="text-secondary-400" />
                        {lead.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-300">
                        <Phone size={14} className="text-secondary-400" />
                        {lead.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(lead.priority)}`}>
                          {lead.priority}
                        </span>
                      </div>
                      <div className="text-xs text-secondary-500 dark:text-secondary-400">
                        {lead.source}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary-500 font-medium dark:text-secondary-400">
                    {format(new Date(lead.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/leads/${lead._id}`} className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors dark:hover:bg-secondary-800" title="View Details">
                        <Eye size={18} />
                      </Link>
                      <button onClick={() => handleOpenModal(lead)} className="p-2 text-secondary-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors dark:hover:bg-secondary-800" title="Edit Lead">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(lead._id)} className="p-2 text-secondary-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:hover:bg-secondary-800" title="Delete Lead">
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

        <div className="p-6 border-t border-secondary-100 dark:border-secondary-800 flex items-center justify-between">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="flex items-center gap-2 text-sm font-medium text-secondary-600 hover:text-primary-600 disabled:opacity-50 dark:text-secondary-400 dark:hover:text-primary-400"
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
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-200 dark:shadow-none' 
                  : 'text-secondary-500 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:bg-secondary-800'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="flex items-center gap-2 text-sm font-medium text-secondary-600 hover:text-primary-600 disabled:opacity-50 dark:text-secondary-400 dark:hover:text-primary-400"
          >
            Next <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leads;
