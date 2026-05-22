const express = require('express');
const router = express.Router();
const { getFollowUps, createFollowUp, updateFollowUp } = require('../controllers/followUpController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getFollowUps);
router.post('/', createFollowUp);
router.put('/:id', updateFollowUp);

module.exports = router;
