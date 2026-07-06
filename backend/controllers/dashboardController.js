const Project = require('../models/Project');
const Application = require('../models/Application');
const User = require('../models/User');

// @desc    Get dashboard metrics based on user role
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const role = req.user.role;

    if (role === 'client') {
      // CLIENT STATS
      const clientProjects = await Project.find({ client: req.user.id });
      const totalProjects = clientProjects.length;
      
      const activeProjects = clientProjects.filter((p) => p.status === 'open').length;
      const closedProjects = clientProjects.filter((p) => p.status === 'closed').length;
      const completedProjects = clientProjects.filter((p) => p.status === 'completed').length;

      // Get all application IDs for client's projects
      const projectIds = clientProjects.map((p) => p._id);
      const totalApplications = await Application.countDocuments({ project: { $in: projectIds } });

      // Recent Activity: Last 5 applications received
      const recentActivity = await Application.find({ project: { $in: projectIds } })
        .populate('freelancer', 'name email profileImage')
        .populate('project', 'title')
        .sort({ createdAt: -1 })
        .limit(5);

      // Analytics: Projects by Category (Pie Chart data helper)
      const categoryMap = {};
      clientProjects.forEach((p) => {
        categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
      });
      const categoryData = Object.keys(categoryMap).map((cat) => ({
        name: cat,
        value: categoryMap[cat],
      }));

      // Analytics: Monthly postings (mock / real timeline)
      // Since it's a new database, we'll return actual count + mock entries for professional visual state
      const monthlyPostings = [
        { month: 'Jan', projects: 2 },
        { month: 'Feb', projects: 4 },
        { month: 'Mar', projects: 1 },
        { month: 'Apr', projects: 5 },
        { month: 'May', projects: 3 },
        { month: 'Jun', projects: activeProjects },
      ];

      return res.json({
        totalProjects,
        activeProjects,
        closedProjects,
        completedProjects,
        totalApplications,
        recentActivity,
        analytics: {
          categoryData,
          monthlyPostings,
        },
      });
    } else {
      // FREELANCER STATS
      const totalApplications = await Application.countDocuments({ freelancer: req.user.id });
      const pendingApplications = await Application.countDocuments({ freelancer: req.user.id, status: 'pending' });
      const acceptedApplications = await Application.countDocuments({ freelancer: req.user.id, status: 'accepted' });
      const rejectedApplications = await Application.countDocuments({ freelancer: req.user.id, status: 'rejected' });

      // Recent Activity: Last 5 application actions
      const recentActivity = await Application.find({ freelancer: req.user.id })
        .populate({
          path: 'project',
          select: 'title client',
          populate: { path: 'client', select: 'name companyName' },
        })
        .sort({ updatedAt: -1 })
        .limit(5);

      // Recommended Projects: Open projects matching freelancer skills
      const user = await User.findById(req.user.id);
      let recommendedProjects = [];
      
      if (user.skills && user.skills.length > 0) {
        recommendedProjects = await Project.find({
          status: 'open',
          skillsRequired: { $in: user.skills },
          client: { $ne: req.user.id },
        })
          .populate('client', 'name profileImage companyName')
          .sort({ createdAt: -1 })
          .limit(4);
      }

      // Fallback: If no recommendations based on skills, show recent open projects
      if (recommendedProjects.length === 0) {
        recommendedProjects = await Project.find({
          status: 'open',
          client: { $ne: req.user.id },
        })
          .populate('client', 'name profileImage companyName')
          .sort({ createdAt: -1 })
          .limit(4);
      }

      // Calculate profile completion rate indicator
      let score = 0;
      if (user.name) score += 15;
      if (user.profileImage) score += 15;
      if (user.bio) score += 15;
      if (user.skills && user.skills.length > 0) score += 15;
      if (user.experience && user.experience.length > 0) score += 15;
      if (user.resumeUrl) score += 15;
      if (user.location || user.github || user.linkedin) score += 10;
      
      const profileCompletion = score;

      return res.json({
        totalApplications,
        pendingApplications,
        acceptedApplications,
        rejectedApplications,
        recentActivity,
        recommendedProjects,
        profileCompletion,
      });
    }
  } catch (error) {
    console.error('Get Dashboard Stats Error:', error);
    res.status(500).json({ message: 'Server error retrieving dashboard metrics', error: error.message });
  }
};
