const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { handleUpload } = require('../middleware/uploadMiddleware');

// Generate JWT
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, companyName, skills, bio, location } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Process profile image if uploaded
    let profileImageUrl = '';
    if (req.file) {
      profileImageUrl = await handleUpload(req.file);
    }

    // Process skills array
    let skillsArray = [];
    if (skills) {
      skillsArray = Array.isArray(skills) ? skills : skills.split(',').map((s) => s.trim());
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      companyName: role === 'client' ? companyName : '',
      profileImage: profileImageUrl,
      skills: role === 'freelancer' ? skillsArray : [],
      bio: bio || '',
      location: location || '',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        companyName: user.companyName,
        skills: user.skills,
        bio: user.bio,
        location: user.location,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email (explicitly selecting password)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profileImage: user.profileImage,
      companyName: user.companyName,
      skills: user.skills,
      bio: user.bio,
      location: user.location,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// @desc    Get user profile details
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('getMe Error:', error);
    res.status(500).json({ message: 'Server error fetching user details', error: error.message });
  }
};
