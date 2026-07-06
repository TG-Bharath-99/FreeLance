const Submission = require('../models/Submission');
const Project = require('../models/Project');
const Application = require('../models/Application');
const { handleUpload } = require('../middleware/uploadMiddleware');

// @desc    Submit completed project work
// @route   POST /api/submissions
// @access  Private (Freelancer only)
exports.submitProject = async (req, res) => {
  try {
    const { projectId, githubRepoLink, liveDemoLink, notes } = req.body;

    // Verify the project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Verify developer was accepted for this project
    const application = await Application.findOne({
      project: projectId,
      freelancer: req.user.id,
      status: 'accepted',
    });

    if (!application) {
      return res.status(403).json({ message: 'You are not assigned to this project' });
    }

    // Check if a submission already exists
    let submission = await Submission.findOne({
      project: projectId,
      developer: req.user.id,
    });

    // Handle file uploads
    const submissionFiles = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadedUrl = await handleUpload(file);
        if (uploadedUrl) submissionFiles.push(uploadedUrl);
      }
    }

    if (submission) {
      // Update existing submission (resubmit after changes requested)
      if (submission.status !== 'changes-requested') {
        return res.status(400).json({ message: 'You have already submitted this project. Wait for client review.' });
      }

      submission.submissionFiles = submissionFiles.length > 0 ? submissionFiles : submission.submissionFiles;
      submission.githubRepoLink = githubRepoLink || submission.githubRepoLink;
      submission.liveDemoLink = liveDemoLink || submission.liveDemoLink;
      submission.notes = notes || submission.notes;
      submission.status = 'submitted';
      submission.submittedAt = new Date();
      submission.clientFeedback = '';

      await submission.save();
    } else {
      // Create new submission
      submission = await Submission.create({
        project: projectId,
        developer: req.user.id,
        application: application._id,
        submissionFiles,
        githubRepoLink: githubRepoLink || '',
        liveDemoLink: liveDemoLink || '',
        notes: notes || '',
        status: 'submitted',
        submittedAt: new Date(),
      });
    }

    // Update project status to submitted
    project.status = 'submitted';
    await project.save();

    res.status(201).json(submission);
  } catch (error) {
    console.error('Submit Project Error:', error);
    res.status(500).json({ message: 'Server error submitting project', error: error.message });
  }
};

// @desc    Get submission for a specific project
// @route   GET /api/submissions/project/:projectId
// @access  Private
exports.getProjectSubmission = async (req, res) => {
  try {
    const submission = await Submission.findOne({ project: req.params.projectId })
      .populate('developer', 'name email profileImage skills bio location phone github linkedin')
      .populate('project', 'title budget status client assignedDeveloper')
      .populate('application', 'expectedBudget estimatedDeliveryTime');

    if (!submission) {
      return res.status(404).json({ message: 'No submission found for this project' });
    }

    res.json(submission);
  } catch (error) {
    console.error('Get Project Submission Error:', error);
    res.status(500).json({ message: 'Server error fetching submission', error: error.message });
  }
};

// @desc    Get all submissions by the logged-in developer
// @route   GET /api/submissions/my-submissions
// @access  Private (Freelancer only)
exports.getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ developer: req.user.id })
      .populate({
        path: 'project',
        select: 'title budget status client deadline category',
        populate: { path: 'client', select: 'name companyName profileImage email' },
      })
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    console.error('Get My Submissions Error:', error);
    res.status(500).json({ message: 'Server error fetching submissions', error: error.message });
  }
};

// @desc    Client reviews a submission (approve or request changes)
// @route   PATCH /api/submissions/:id/review
// @access  Private (Client only)
exports.reviewSubmission = async (req, res) => {
  try {
    const { action, feedback } = req.body; // action: 'approve' or 'request-changes'

    if (!['approve', 'request-changes'].includes(action)) {
      return res.status(400).json({ message: 'Invalid review action. Use "approve" or "request-changes".' });
    }

    const submission = await Submission.findById(req.params.id).populate('project');
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    const project = submission.project;

    // Verify client ownership
    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to review this submission' });
    }

    if (action === 'approve') {
      submission.status = 'approved';
      submission.reviewedAt = new Date();
      // Project stays as 'submitted' until payment; will become 'completed' after payment
    } else {
      submission.status = 'changes-requested';
      submission.clientFeedback = feedback || 'Please review and make the requested changes.';
      submission.reviewedAt = new Date();

      // Move project back to in-progress
      await Project.findByIdAndUpdate(project._id, { status: 'in-progress' });
    }

    await submission.save();

    res.json({
      message: action === 'approve' ? 'Submission approved' : 'Changes requested',
      submission,
    });
  } catch (error) {
    console.error('Review Submission Error:', error);
    res.status(500).json({ message: 'Server error reviewing submission', error: error.message });
  }
};

// @desc    Simulate payment completion
// @route   PATCH /api/submissions/:id/payment
// @access  Private (Client only)
exports.simulatePayment = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id).populate('project');
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    const project = submission.project;

    // Verify client ownership
    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to process payment for this submission' });
    }

    if (submission.status !== 'approved') {
      return res.status(400).json({ message: 'Submission must be approved before payment can be processed' });
    }

    // Simulate payment
    submission.paymentStatus = 'paid';
    await submission.save();

    // Update project status to completed
    await Project.findByIdAndUpdate(project._id, { status: 'completed' });

    res.json({
      message: 'Payment processed successfully (simulated)',
      submission,
    });
  } catch (error) {
    console.error('Simulate Payment Error:', error);
    res.status(500).json({ message: 'Server error processing payment', error: error.message });
  }
};
