const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    proposal: {
      type: String,
      required: [true, 'Please provide a proposal cover letter'],
    },
    expectedBudget: {
      type: Number,
      required: [true, 'Please specify your expected budget'],
    },
    estimatedDeliveryTime: {
      type: Number,
      required: [true, 'Please provide an estimated delivery time in days'],
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a freelancer can apply only once per project
ApplicationSchema.index({ project: 1, freelancer: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
