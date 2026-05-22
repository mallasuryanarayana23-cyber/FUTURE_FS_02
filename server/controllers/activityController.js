const Activity = require('../models/Activity');

// @desc    Get all activity logs
// @route   GET /api/activities
// @access  Private
const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(50); // Get recent 50 activities

    res.status(200).json(activities);
  } catch (error) {
    res.status(500);
    throw new Error('Failed to retrieve activity logs');
  }
};

module.exports = {
  getActivities
};
