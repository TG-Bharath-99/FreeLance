const express = require('express');
const router = express.Router();
const {
  submitProject,
  getProjectSubmission,
  getMySubmissions,
  reviewSubmission,
  simulatePayment,
} = require('../controllers/submissionController');
const { protect, freelancerOnly, clientOnly } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// Developer submits completed work (supports multiple file uploads)
router.post('/', protect, freelancerOnly, upload.array('submissionFiles', 5), submitProject);

// Get submission for a specific project
router.get('/project/:projectId', protect, getProjectSubmission);

// Get all submissions by the logged-in developer
router.get('/my-submissions', protect, freelancerOnly, getMySubmissions);

// Client reviews submission (approve or request changes)
router.patch('/:id/review', protect, clientOnly, reviewSubmission);

// Developer resubmits (same POST endpoint handles resubmit logic)

// Simulate payment completion
router.patch('/:id/payment', protect, clientOnly, simulatePayment);

module.exports = router;
