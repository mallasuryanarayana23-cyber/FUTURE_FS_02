const Lead = require('../models/Lead');

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res) => {
  const { status, search, sort, page = 1, limit = 10 } = req.query;

  const query = {};
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
    ];
  }

  const sortOptions = {};
  if (sort === 'newest') sortOptions.createdAt = -1;
  else if (sort === 'oldest') sortOptions.createdAt = 1;
  else sortOptions.createdAt = -1;

  const leads = await Lead.find(query)
    .sort(sortOptions)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const count = await Lead.countDocuments(query);

  res.status(200).json({
    leads,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalLeads: count,
  });
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
const getLeadById = async (req, res) => {
  const lead = await Lead.findById(req.params.id);

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
  const { name, email, phone, company, source, status, followUpDate } = req.body;

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
    source,
    status,
    followUpDate,
  });

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

  const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

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

  res.status(201).json(lead);
};

// @desc    Get dashboard stats
// @route   GET /api/leads/stats
// @access  Private
const getStats = async (req, res) => {
  const totalLeads = await Lead.countDocuments();
  const convertedLeads = await Lead.countDocuments({ status: 'Converted' });
  const pendingFollowUps = await Lead.countDocuments({ followUpStatus: 'Pending' });
  
  const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

  // Lead growth (last 6 months - placeholder logic)
  const leadGrowth = [
    { month: 'Jan', count: 12 },
    { month: 'Feb', count: 19 },
    { month: 'Mar', count: 15 },
    { month: 'Apr', count: 22 },
    { month: 'May', count: 30 },
    { month: 'Jun', count: 28 },
  ];

  const recentActivity = await Lead.find()
    .sort({ updatedAt: -1 })
    .limit(5);

  res.status(200).json({
    totalLeads,
    convertedLeads,
    pendingFollowUps,
    conversionRate: conversionRate.toFixed(2),
    leadGrowth,
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
