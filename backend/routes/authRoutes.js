const express = require('express');
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  getMe,
  getAdmins,
  updateAdmin,
  forgotPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/forgot-password', forgotPassword);
router.get('/me', protect, getMe);
router.get('/admins', protect, getAdmins);
router.put('/me', protect, updateAdmin);

module.exports = router;
