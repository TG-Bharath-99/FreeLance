const Project = require('../models/Project');
const Application = require('../models/Application');

// @desc    Create a project
// @route   POST /api/projects
// @access  Private (Client only)
exports.createProject = async (req, res) => {
  try {
    const { title, description, category, skillsRequired, budget, experienceLevel, deadline, freelancersRequired } = req.body;

    let skillsArray = [];
    if (skillsRequired) {
      skillsArray = Array.isArray(skillsRequired) 
        ? skillsRequired 
        : skillsRequired.split(',').map((s) => s.trim()).filter(Boolean);
    }

    const project = await Project.create({
      title,
      description,
      category,
      skillsRequired: skillsArray,
      budget,
      experienceLevel,
      deadline,
      freelancersRequired: freelancersRequired || 1,
      client: req.user.id,
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Create Project Error:', error);
    res.status(500).json({ message: 'Server error creating project', error: error.message });
  }
};

// @desc    Get all projects with filtering, search and pagination
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res) => {
  try {
    const {
      search,
      category,
      skills,
      experienceLevel,
      minBudget,
      maxBudget,
      status,
      client,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Filter by client if provided
    if (client) {
      query.client = client;
    }

    // By default, show open projects if not specified
    if (status && status !== 'all') {
      query.status = status;
    } else if (!status) {
      query.status = 'open';
    }

    // Search query
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Skills filter
    if (skills) {
      const skillsList = skills.split(',').map((s) => s.trim()).filter(Boolean);
      query.skillsRequired = { $in: skillsList };
    }

    // Experience Level filter
    if (experienceLevel) {
      const levels = experienceLevel.split(',').map((l) => l.trim()).filter(Boolean);
      query.experienceLevel = { $in: levels };
    }

    // Budget range filter
    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = Number(minBudget);
      if (maxBudget) query.budget.$lte = Number(maxBudget);
    }

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    let sortBy = { createdAt: -1 };
    if (sort === 'budget_asc') {
      sortBy = { budget: 1 };
    } else if (sort === 'budget_desc') {
      sortBy = { budget: -1 };
    } else if (sort === 'deadline_asc') {
      sortBy = { deadline: 1 };
    }

    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .populate('client', 'name profileImage companyName location')
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum);

    res.json({
      projects,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    console.error('Get Projects Error:', error);
    res.status(500).json({ message: 'Server error fetching projects', error: error.message });
  }
};

// @desc    Get single project details
// @route   GET /api/projects/:id
// @access  Public
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      'client',
      'name email profileImage companyName bio location phone'
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get Project By ID Error:', error);
    res.status(500).json({ message: 'Server error fetching project details', error: error.message });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (Client owner only)
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check ownership
    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    const { title, description, category, skillsRequired, budget, experienceLevel, deadline, freelancersRequired } = req.body;

    let skillsArray = project.skillsRequired;
    if (skillsRequired) {
      skillsArray = Array.isArray(skillsRequired) 
        ? skillsRequired 
        : skillsRequired.split(',').map((s) => s.trim()).filter(Boolean);
    }

    project.title = title || project.title;
    project.description = description || project.description;
    project.category = category || project.category;
    project.skillsRequired = skillsArray;
    project.budget = budget || project.budget;
    project.experienceLevel = experienceLevel || project.experienceLevel;
    project.deadline = deadline || project.deadline;
    project.freelancersRequired = freelancersRequired !== undefined ? freelancersRequired : project.freelancersRequired;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    console.error('Update Project Error:', error);
    res.status(500).json({ message: 'Server error updating project', error: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (Client owner only)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check ownership
    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    // Remove all applications linked to this project
    await Application.deleteMany({ project: req.params.id });

    // Use deleteOne() or findByIdAndDelete()
    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project and all associated applications removed successfully' });
  } catch (error) {
    console.error('Delete Project Error:', error);
    res.status(500).json({ message: 'Server error deleting project', error: error.message });
  }
};

// @desc    Change project status (open, closed, completed)
// @route   PATCH /api/projects/:id/status
// @access  Private (Client owner only)
exports.updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['open', 'closed', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check ownership
    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    project.status = status;
    const updatedProject = await project.save();

    res.json(updatedProject);
  } catch (error) {
    console.error('Update Project Status Error:', error);
    res.status(500).json({ message: 'Server error updating project status', error: error.message });
  }
};
