const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    developer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },
    submissionFiles: {
      type: [String],
      default: [],
    },
    githubRepoLink: {
      type: String,
      default: '',
    },
    liveDemoLink: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['submitted', 'approved', 'changes-requested'],
      default: 'submitted',
    },
    clientFeedback: {
      type: String,
      default: '',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// One submission per project-developer pair
SubmissionSchema.index({ project: 1, developer: 1 }, { unique: true });

module.exports = mongoose.model('Submission', SubmissionSchema);
