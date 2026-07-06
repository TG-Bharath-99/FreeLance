const Application = require('../models/Application');
const Project = require('../models/Project');
const { handleUpload } = require('../middleware/uploadMiddleware');

// @desc    Apply to a project
// @route   POST /api/applications
// @access  Private (Freelancer only)
exports.applyToProject = async (req, res) => {
  try {
    const { projectId, proposal, expectedBudget, estimatedDeliveryTime } = req.body;

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check project status
    if (project.status !== 'open') {
      return res.status(400).json({ message: 'Cannot apply. This project is closed or completed.' });
    }

    // Prevent client from applying to their own project
    if (project.client.toString() === req.user.id) {
      return res.status(400).json({ message: 'Clients cannot apply to their own projects' });
    }

    // Check for duplicate application
    const alreadyApplied = await Application.findOne({
      project: projectId,
      freelancer: req.user.id,
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied to this project' });
    }

    // Handle resume upload
    let resumeUrl = req.user.resumeUrl || '';
    if (req.file) {
      const uploadedResume = await handleUpload(req.file);
      if (uploadedResume) resumeUrl = uploadedResume;
    }

    // Create application
    const application = await Application.create({
      project: projectId,
      freelancer: req.user.id,
      proposal,
      expectedBudget: Number(expectedBudget),
      estimatedDeliveryTime: Number(estimatedDeliveryTime),
      resumeUrl,
    });

    // Increment project applications count
    project.applicationsCount += 1;
    await project.save();

    res.status(201).json(application);
  } catch (error) {
    console.error('Apply to Project Error:', error);
    res.status(500).json({ message: 'Server error submitting application', error: error.message });
  }
};

// @desc    Get applications for a project
// @route   GET /api/applications/project/:projectId
// @access  Private (Client owner of project only)
exports.getProjectApplications = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check ownership
    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view applications for this project' });
    }

    const applications = await Application.find({ project: req.params.projectId })
      .populate('freelancer', 'name email profileImage skills bio location phone experience github linkedin resumeUrl')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get Project Applications Error:', error);
    res.status(500).json({ message: 'Server error retrieving applications', error: error.message });
  }
};

// @desc    Get current freelancer's applications
// @route   GET /api/applications/my-applications
// @access  Private (Freelancer only)
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ freelancer: req.user.id })
      .populate({
        path: 'project',
        populate: {
          path: 'client',
          select: 'name companyName profileImage email',
        },
      })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get My Applications Error:', error);
    res.status(500).json({ message: 'Server error retrieving your applications', error: error.message });
  }
};

// @desc    Withdraw application
// @route   DELETE /api/applications/:id
// @access  Private (Freelancer owner only)
exports.withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check ownership
    if (application.freelancer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to withdraw this application' });
    }

    const project = await Project.findById(application.project);
    if (project) {
      project.applicationsCount = Math.max(0, project.applicationsCount - 1);
      await project.save();
    }

    await Application.findByIdAndDelete(req.params.id);

    res.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    console.error('Withdraw Application Error:', error);
    res.status(500).json({ message: 'Server error withdrawing application', error: error.message });
  }
};

// @desc    Accept or Reject an applicant
// @route   PATCH /api/applications/:id/status
// @access  Private (Client owner of project only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status update option' });
    }

    const application = await Application.findById(req.params.id).populate('project');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const project = application.project;

    // Check client ownership of the project
    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to manage applications for this project' });
    }

    application.status = status;
    await application.save();

    // If accepted, set project to in-progress, assign developer, and auto-reject other applicants
    if (status === 'accepted') {
      project.status = 'in-progress';
      project.assignedDeveloper = application.freelancer;
      await project.save();

      // Automatically reject other pending applications for this project
      await Application.updateMany(
        { project: project._id, _id: { $ne: application._id }, status: 'pending' },
        { status: 'rejected' }
      );
    }

    res.json({
      message: `Application successfully ${status}`,
      application,
    });
  } catch (error) {
    console.error('Update Application Status Error:', error);
    res.status(500).json({ message: 'Server error updating application status', error: error.message });
  }
};
