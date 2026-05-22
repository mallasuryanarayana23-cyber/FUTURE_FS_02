const Lead = require('../models/Lead');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');
const FollowUp = require('../models/FollowUp');

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res) => {
  const { status, priority, source, search, sort, page = 1, limit = 10 } = req.query;

  const query = {};
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (source) query.source = source;
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
    ];
  }

  const sortOptions = {};
  if (sort === 'newest') {
    sortOptions.createdAt = -1;
  } else if (sort === 'oldest') {
    sortOptions.createdAt = 1;
  } else if (sort === 'alphabetical') {
    sortOptions.name = 1;
  } else if (sort === 'company') {
    sortOptions.company = 1;
  } else {
    sortOptions.createdAt = -1;
  }

  const leads = await Lead.find(query)
    .populate('assignedAdmin', 'name email')
    .sort(sortOptions)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const count = await Lead.countDocuments(query);

  res.status(200).json({
    leads,
    totalPages: Math.ceil(count / limit) || 1,
    currentPage: Number(page),
    totalLeads: count,
  });
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
const getLeadById = async (req, res) => {
  const lead = await Lead.findById(req.params.id).populate('assignedAdmin', 'name email');

  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  res.status(200).json(lead);
};

// @desc    Create lead
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res) => {
  const { name, email, phone, company, source, status, priority, tags, followUpDate, assignedAdmin } = req.body;

  if (!name || !email || !phone || !company) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  const leadExists = await Lead.findOne({ email });
  if (leadExists) {
    res.status(400);
    throw new Error('Lead with this email already exists');
  }

  const lead = await Lead.create({
    name,
    email,
    phone,
    company,
    source: source || 'Website Contact Form',
    status: status || 'New',
    priority: priority || 'Medium',
    tags: tags || [],
    followUpDate,
    assignedAdmin: assignedAdmin || (req.admin ? req.admin._id : null)
  });

  // Log Activity
  await Activity.create({
    leadId: lead._id,
    adminId: req.admin ? req.admin._id : null,
    adminName: req.admin ? req.admin.name : 'Public Website',
    action: 'Lead Created',
    description: `Created new lead: ${lead.name} (${lead.company})`
  });

  // Create Notification for all registered admins
  const Admin = require('../models/Admin');
  const admins = await Admin.find({});
  for (const admin of admins) {
    await Notification.create({
      adminId: admin._id,
      title: 'New Lead Generated',
      message: `${lead.name} from ${lead.company} has submitted a new inquiry.`,
      type: 'success'
    });
  }

  // If followUpDate is set and an admin is logged in, create a FollowUp entry
  if (followUpDate && req.admin) {
    await FollowUp.create({
      leadId: lead._id,
      adminId: req.admin._id,
      title: `Follow-up with ${lead.name}`,
      description: `First touch follow-up for new lead.`,
      dueDate: new Date(followUpDate)
    });
  }

  res.status(201).json(lead);
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = async (req, res) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  const oldStatus = lead.status;
  const oldFollowUpDate = lead.followUpDate;
  const oldFollowUpStatus = lead.followUpStatus;

  const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).populate('assignedAdmin', 'name email');

  // Check if status changed and log it
  if (req.body.status && req.body.status !== oldStatus) {
    await Activity.create({
      leadId: lead._id,
      adminId: req.admin._id,
      adminName: req.admin.name,
      action: 'Status Updated',
      description: `Changed status of ${lead.name} from ${oldStatus} to ${req.body.status}`
    });

    await Notification.create({
      adminId: req.admin._id,
      title: 'Lead Status Changed',
      message: `${lead.name}'s status was updated to ${req.body.status}.`,
      type: 'info'
    });
  } else {
    // Log General Edit
    await Activity.create({
      leadId: lead._id,
      adminId: req.admin._id,
      adminName: req.admin.name,
      action: 'Lead Updated',
      description: `Updated lead details for ${lead.name}`
    });
  }

  // Handle follow up updates
  if (req.body.followUpDate && req.body.followUpDate !== oldFollowUpDate) {
    // Remove old pending followups
    await FollowUp.deleteMany({ leadId: lead._id, status: 'Pending' });

    // Create new followup
    await FollowUp.create({
      leadId: lead._id,
      adminId: req.admin._id,
      title: `Follow-up with ${lead.name}`,
      description: `Scheduled touchpoint.`,
      dueDate: new Date(req.body.followUpDate)
    });

    await Activity.create({
      leadId: lead._id,
      adminId: req.admin._id,
      adminName: req.admin.name,
      action: 'Follow-Up Scheduled',
      description: `Scheduled a new follow-up touchpoint for ${lead.name} on ${new Date(req.body.followUpDate).toDateString()}`
    });
  }

  // Handle follow up status updates
  if (req.body.followUpStatus && req.body.followUpStatus !== oldFollowUpStatus) {
    if (req.body.followUpStatus === 'Completed') {
      await FollowUp.updateMany(
        { leadId: lead._id, status: 'Pending' },
        { status: 'Completed' }
      );

      await Activity.create({
        leadId: lead._id,
        adminId: req.admin._id,
        adminName: req.admin.name,
        action: 'Follow-Up Completed',
        description: `Marked follow-up as Completed for ${lead.name}`
      });
    } else if (req.body.followUpStatus === 'Pending') {
      await FollowUp.updateMany(
        { leadId: lead._id, status: 'Completed' },
        { status: 'Pending' }
      );

      await Activity.create({
        leadId: lead._id,
        adminId: req.admin._id,
        adminName: req.admin.name,
        action: 'Follow-Up Reopened',
        description: `Reopened follow-up for ${lead.name}`
      });
    }
  }

  res.status(200).json(updatedLead);
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = async (req, res) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  // Log Activity before deletion
  await Activity.create({
    adminId: req.admin._id,
    adminName: req.admin.name,
    action: 'Lead Deleted',
    description: `Deleted lead: ${lead.name} (${lead.company})`
  });

  // Delete all associated followups and database relations
  await FollowUp.deleteMany({ leadId: lead._id });

  await lead.deleteOne();

  res.status(200).json({ id: req.params.id });
};

// @desc    Add note to lead
// @route   POST /api/leads/:id/notes
// @access  Private
const addNote = async (req, res) => {
  const { content } = req.body;
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  const note = {
    content,
    createdBy: req.admin.name,
  };

  lead.notes.push(note);
  await lead.save();

  // Log Activity
  await Activity.create({
    leadId: lead._id,
    adminId: req.admin._id,
    adminName: req.admin.name,
    action: 'Note Added',
    description: `Added a note to lead ${lead.name}`
  });

  res.status(201).json(lead);
};

// @desc    Get dashboard stats
// @route   GET /api/leads/stats
// @access  Private
const getStats = async (req, res) => {
  const totalLeads = await Lead.countDocuments();
  const convertedLeads = await Lead.countDocuments({ status: 'Converted' });
  const pendingFollowUps = await FollowUp.countDocuments({ status: 'Pending' });
  
  const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

  // Real Dynamic lead growth grouped by month (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const growthAgg = await Lead.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const leadGrowth = [];

  // Generate continuous last 6 months list
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const m = d.getMonth();
    const y = d.getFullYear();

    const found = growthAgg.find(g => g._id.month === (m + 1) && g._id.year === y);
    leadGrowth.push({
      month: monthNames[m],
      count: found ? found.count : 0
    });
  }

  // Dynamic Status Distribution
  const statusAgg = await Lead.aggregate([
    {
      $group: {
        _id: '$status',
        value: { $sum: 1 }
      }
    }
  ]);

  const statusColors = {
    'New': '#0ea5e9',
    'Contacted': '#f59e0b',
    'Qualified': '#8b5cf6',
    'Proposal Sent': '#ec4899',
    'Negotiation': '#f43f5e',
    'Converted': '#10b981',
    'Closed': '#64748b',
    'Lost': '#ef4444'
  };

  const statusDistribution = statusAgg.map(s => ({
    name: s._id,
    value: s.value,
    color: statusColors[s._id] || '#64748b'
  }));

  // Ensure all standard statuses exist in distribution
  Object.keys(statusColors).forEach(st => {
    if (!statusDistribution.find(s => s.name === st)) {
      statusDistribution.push({ name: st, value: 0, color: statusColors[st] });
    }
  });

  // Dynamic Source Distribution
  const sourceAgg = await Lead.aggregate([
    {
      $group: {
        _id: '$source',
        count: { $sum: 1 }
      }
    }
  ]);
  const sourceDistribution = sourceAgg.map(s => ({
    name: s._id || 'Unknown',
    count: s.count
  }));

  // Dynamic Estimated Revenue Potential
  // Converted: $10000, Proposal Sent: $6000, Negotiation: $8000, Qualified: $3000, Contacted: $1000, New: $500
  const revRates = {
    'New': 500,
    'Contacted': 1000,
    'Qualified': 3000,
    'Proposal Sent': 6000,
    'Negotiation': 8000,
    'Converted': 10000,
    'Closed': 0,
    'Lost': 0
  };

  const allLeads = await Lead.find({}, 'status');
  const revenuePotential = allLeads.reduce((sum, lead) => {
    return sum + (revRates[lead.status] || 0);
  }, 0);

  // Fetch real activities for the dashboard log feed
  const recentActivity = await Activity.find()
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    totalLeads,
    convertedLeads,
    pendingFollowUps,
    conversionRate: Number(conversionRate.toFixed(2)),
    leadGrowth,
    statusDistribution,
    sourceDistribution,
    revenuePotential,
    recentActivity,
  });
};

module.exports = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  addNote,
  getStats,
};
