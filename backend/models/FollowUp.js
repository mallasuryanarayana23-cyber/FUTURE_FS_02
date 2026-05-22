const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Overdue'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FollowUp', followUpSchema);
