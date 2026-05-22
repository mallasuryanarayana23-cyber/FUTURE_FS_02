const Notification = require('../models/Notification');

// @desc    Get recent notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ adminId: req.admin._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500);
    throw new Error('Failed to retrieve notifications');
  }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, adminId: req.admin._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      res.status(404);
      throw new Error('Notification not found');
    }

    res.status(200).json(notification);
  } catch (error) {
    res.status(500);
    throw new Error('Failed to mark notification as read');
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { adminId: req.admin._id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500);
    throw new Error('Failed to mark notifications as read');
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead
};
