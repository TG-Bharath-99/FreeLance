const User = require('../models/User');
const { handleUpload } = require('../middleware/uploadMiddleware');

// @desc    Update user profile details (text fields + files)
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const {
      name,
      phone,
      bio,
      location,
      companyName,
      github,
      linkedin,
      skills,
      portfolioLinks,
      experience,
    } = req.body;

    // Update basic string fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    
    if (user.role === 'client' && companyName !== undefined) {
      user.companyName = companyName;
    }

    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;

    // Handle array fields
    if (skills !== undefined) {
      user.skills = Array.isArray(skills)
        ? skills
        : skills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    if (portfolioLinks !== undefined) {
      user.portfolioLinks = Array.isArray(portfolioLinks)
        ? portfolioLinks
        : portfolioLinks.split(',').map((l) => l.trim()).filter(Boolean);
    }

    // Handle experience lists (which might be sent as JSON string due to multipart form-data uploads)
    if (experience !== undefined) {
      try {
        const parsedExp = typeof experience === 'string' ? JSON.parse(experience) : experience;
        user.experience = parsedExp;
      } catch (err) {
        console.error('Error parsing experience data:', err);
      }
    }

    // Check for file uploads
    if (req.files) {
      if (req.files['profileImage'] && req.files['profileImage'][0]) {
        const profileImageUrl = await handleUpload(req.files['profileImage'][0]);
        if (profileImageUrl) user.profileImage = profileImageUrl;
      }
      if (req.files['resume'] && req.files['resume'][0]) {
        const resumeUrl = await handleUpload(req.files['resume'][0]);
        if (resumeUrl) user.resumeUrl = resumeUrl;
      }
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: 'Server error updating profile', error: error.message });
  }
};
