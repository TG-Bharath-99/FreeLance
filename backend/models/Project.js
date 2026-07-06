const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a project title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a project description'],
    },
    category: {
      type: String,
      required: [true, 'Please select a project category'],
      index: true,
    },
    skillsRequired: {
      type: [String],
      required: [true, 'Please add required skills'],
      index: true,
    },
    budget: {
      type: Number,
      required: [true, 'Please specify a budget'],
    },
    experienceLevel: {
      type: String,
      enum: ['entry', 'intermediate', 'expert'],
      required: [true, 'Please specify required experience level'],
    },
    deadline: {
      type: Date,
      required: [true, 'Please specify a deadline date'],
    },
    freelancersRequired: {
      type: Number,
      default: 1,
    },
    attachments: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'completed'],
      default: 'open',
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for text search
ProjectSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Project', ProjectSchema);
