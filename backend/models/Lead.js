const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
  },
  company: {
    type: String,
    required: [true, 'Please add a company name'],
  },
  source: {
    type: String,
    default: 'Website Contact Form',
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Converted', 'Closed', 'Lost'],
    default: 'New',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  assignedAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  tags: {
    type: [String],
    default: [],
  },
  notes: [noteSchema],
  followUpDate: {
    type: Date,
  },
  followUpStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Overdue'],
    default: 'Pending',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Lead', leadSchema);
