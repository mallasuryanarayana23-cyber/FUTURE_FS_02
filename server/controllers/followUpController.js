const FollowUp = require('../models/FollowUp');
const Lead = require('../models/Lead');
const Activity = require('../models/Activity');

// @desc    Get all follow-ups
// @route   GET /api/followups
// @access  Private
const getFollowUps = async (req, res) => {
  try {
    const followUps = await FollowUp.find({ adminId: req.admin._id })
      .populate('leadId', 'name company email phone')
      .sort({ dueDate: 1 });

    res.status(200).json(followUps);
  } catch (error) {
    res.status(500);
    throw new Error('Failed to retrieve follow-up list');
  }
};

// @desc    Create a new follow-up
// @route   POST /api/followups
// @access  Private
const createFollowUp = async (req, res) => {
  const { leadId, title, description, dueDate } = req.body;

  if (!leadId || !title || !dueDate) {
    res.status(400);
    throw new Error('Please add lead, title and due date');
  }

  try {
    const lead = await Lead.findById(leadId);
    if (!lead) {
      res.status(404);
      throw new Error('Lead not found');
    }

    const followUp = await FollowUp.create({
      leadId,
      adminId: req.admin._id,
      title,
      description,
      dueDate: new Date(dueDate)
    });

    // Update Lead model date as well
    lead.followUpDate = new Date(dueDate);
    lead.followUpStatus = 'Pending';
    await lead.save();

    // Log Activity
    await Activity.create({
      leadId,
      adminId: req.admin._id,
      adminName: req.admin.name,
      action: 'Follow-Up Scheduled',
      description: `Scheduled follow-up: "${title}"`
    });

    res.status(201).json(followUp);
  } catch (error) {
    res.status(500);
    throw new Error('Failed to create follow-up reminder');
  }
};

// @desc    Update follow-up status
// @route   PUT /api/followups/:id
// @access  Private
const updateFollowUp = async (req, res) => {
  const { status } = req.body;

  try {
    const followUp = await FollowUp.findById(req.params.id);
    if (!followUp) {
      res.status(404);
      throw new Error('Follow-up schedule not found');
    }

    followUp.status = status || followUp.status;
    await followUp.save();

    // Update lead model status if matching
    const lead = await Lead.findById(followUp.leadId);
    if (lead) {
      lead.followUpStatus = followUp.status;
      await lead.save();
    }

    // Log Activity
    await Activity.create({
      leadId: followUp.leadId,
      adminId: req.admin._id,
      adminName: req.admin.name,
      action: 'Follow-Up Updated',
      description: `Follow-up mark status updated to ${followUp.status}`
    });

    res.status(200).json(followUp);
  } catch (error) {
    res.status(500);
    throw new Error('Failed to update follow-up');
  }
};

module.exports = {
  getFollowUps,
  createFollowUp,
  updateFollowUp
};
