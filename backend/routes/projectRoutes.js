const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  updateProjectStatus,
} = require('../controllers/projectController');
const { protect, clientOnly } = require('../middleware/authMiddleware');
const { projectValidator } = require('../utils/validators');
const validate = require('../middleware/validatorMiddleware');

// Public route to list all filtered projects
router.get('/', getProjects);

// Public route to get single project details
router.get('/:id', getProjectById);

// Protected routes for client project management
router.post('/', protect, clientOnly, projectValidator, validate, createProject);

router.put('/:id', protect, clientOnly, updateProject);

router.delete('/:id', protect, clientOnly, deleteProject);

router.patch('/:id/status', protect, clientOnly, updateProjectStatus);

module.exports = router;
