const { check } = require('express-validator');

exports.registerValidator = [
  check('name', 'Name is required').notEmpty().trim(),
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  check('role', 'Role must be client or freelancer').isIn(['client', 'freelancer']),
  check('phone', 'Phone number is required').notEmpty().trim(),
];

exports.loginValidator = [
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Password is required').exists(),
];

exports.projectValidator = [
  check('title', 'Project title is required').notEmpty().trim(),
  check('description', 'Project description is required').notEmpty().trim(),
  check('category', 'Category is required').notEmpty().trim(),
  check('skillsRequired', 'Skills are required').notEmpty(),
  check('budget', 'Budget must be a positive number').isFloat({ min: 1 }),
  check('experienceLevel', 'Experience level must be entry, intermediate, or expert').isIn(['entry', 'intermediate', 'expert']),
  check('deadline', 'Deadline date is required').notEmpty(),
];

exports.applicationValidator = [
  check('proposal', 'Proposal cover letter is required').notEmpty().trim().isLength({ min: 20 }).withMessage('Proposal must be at least 20 characters long'),
  check('expectedBudget', 'Expected budget must be a positive number').isFloat({ min: 1 }),
  check('estimatedDeliveryTime', 'Estimated delivery time must be at least 1 day').isInt({ min: 1 }),
];
