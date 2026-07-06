const express = require('express');
const router = express.Router();
const {
  applyToProject,
  getProjectApplications,
  getMyApplications,
  withdrawApplication,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, freelancerOnly, clientOnly } = require('../middleware/authMiddleware');
const { applicationValidator } = require('../utils/validators');
const validate = require('../middleware/validatorMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// Route to apply for a project (freelancer only, optionally parses a resume file)
router.post(
  '/',
  protect,
  freelancerOnly,
  upload.single('resume'),
  applicationValidator,
  validate,
  applyToProject
);

// Route to fetch all applications submitted by the logged-in freelancer
router.get('/my-applications', protect, freelancerOnly, getMyApplications);

// Route to fetch all applications for a specific project (client owner only)
router.get('/project/:projectId', protect, clientOnly, getProjectApplications);

// Route to withdraw an application (freelancer owner only)
router.delete('/:id', protect, freelancerOnly, withdrawApplication);

// Route to accept/reject an application status (client owner only)
router.patch('/:id/status', protect, clientOnly, updateApplicationStatus);

module.exports = router;
