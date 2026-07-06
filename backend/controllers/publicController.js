const User = require('../models/User');
const Project = require('../models/Project');
const Application = require('../models/Application');

// @desc    Get public statistics for landing page
// @route   GET /api/public/stats
// @access  Public
exports.getPublicStats = async (req, res) => {
  try {
    const totalDevelopers = await User.countDocuments({ role: 'freelancer' });
    const totalClients = await User.countDocuments({ role: 'client' });
    const totalProjects = await Project.countDocuments();
    const completedProjects = await Project.countDocuments({ status: 'completed' });
    const activeProjects = await Project.countDocuments({ status: 'open' });
    const totalApplications = await Application.countDocuments();

    // Category stats
    const categoriesAggr = await Project.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const categories = categoriesAggr.map(cat => ({
      name: cat._id,
      count: cat.count
    }));

    // Latest active projects to replace testimonials
    const latestProjects = await Project.find({ status: 'open' })
      .populate('client', 'name profileImage companyName')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      stats: {
        totalDevelopers,
        totalClients,
        totalProjects,
        completedProjects,
        activeProjects,
        totalApplications,
      },
      categories,
      latestProjects
    });
  } catch (error) {
    console.error('Get Public Stats Error:', error);
    res.status(500).json({ message: 'Server error retrieving public stats', error: error.message });
  }
};
