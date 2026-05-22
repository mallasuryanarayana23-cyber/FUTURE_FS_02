const express = require('express');
const router = express.Router();
const {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  addNote,
  getStats,
} = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');

// Public route (Contact Form submissions)
router.post('/', createLead);

// Protected routes (Admin operations)
router.get('/', protect, getLeads);
router.get('/stats', protect, getStats);
router.get('/:id', protect, getLeadById);
router.put('/:id', protect, updateLead);
router.delete('/:id', protect, deleteLead);
router.post('/:id/notes', protect, addNote);

module.exports = router;
