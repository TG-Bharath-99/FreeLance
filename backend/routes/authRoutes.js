const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../utils/validators');
const validate = require('../middleware/validatorMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// Route for register (includes profile image upload parsed before validation)
router.post('/register', upload.single('profileImage'), registerValidator, validate, register);

// Route for login
router.post('/login', loginValidator, validate, login);

// Route for current user details
router.get('/me', protect, getMe);

module.exports = router;
