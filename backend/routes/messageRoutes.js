const express = require('express');
const router = express.Router();
const { getMessages, sendMessage, getContacts, getUnreadCount, markRead } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.get('/contacts', protect, getContacts);
router.get('/unread-count', protect, getUnreadCount);
router.patch('/mark-read/:senderId', protect, markRead);
router.get('/:userId', protect, getMessages);
router.post('/:userId', protect, sendMessage);

module.exports = router;
