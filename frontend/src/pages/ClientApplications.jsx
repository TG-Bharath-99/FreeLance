import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Users, FileText, Check, X, ArrowLeft, ExternalLink, Calendar, MessageSquare, DollarSign, Clock, Download, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import EmptyState from '../components/EmptyState';
import { StatsSkeleton } from '../components/Skeleton';
import { getFileUrl } from '../utils/helpers';

const ClientApplications = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [project, setProject] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState(''); // 'approve' or 'request-changes'
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [reviewing, setReviewing] = useState(false);

  const fetchProjectData = async () => {
    try {
      const [appRes, projRes] = await Promise.all([
        api.get(`/applications/project/${projectId}`),
        api.get(`/projects/${projectId}`)
      ]);
      setApplications(appRes.data);
      setProject(projRes.data);

      // Check for a submission if project is in-progress, submitted, or completed
      if (['in-progress', 'submitted', 'completed'].includes(projRes.data.status)) {
        try {
          const subRes = await api.get(`/submissions/project/${projectId}`);
          setSubmission(subRes.data);
        } catch (subErr) {
          // 404 is expected if no submission yet
          if (subErr.response?.status !== 404) {
            console.error('Error fetching submission:', subErr);
          }
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const handleStatusUpdate = async (appId, status) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status });
      toast.success(`Application ${status}`);
      fetchProjectData(); // Refresh all data to get updated project status
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${status} application`);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (reviewAction === 'request-changes' && !reviewFeedback.trim()) {
      toast.error('Feedback is required when requesting changes');
      return;
    }

    setReviewing(true);
    try {
      await api.patch(`/submissions/${submission._id}/review`, {
        action: reviewAction,
        feedback: reviewFeedback
      });
      toast.success(reviewAction === 'approve' ? 'Submission approved!' : 'Changes requested');
      setShowReviewModal(false);
      fetchProjectData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit review');
    } finally {
      setReviewing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <StatsSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div>
        <Link to="/my-projects" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary-600 mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to My Projects
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Review Applications & Deliverables
        </h1>
        <p className="text-sm text-slate-500 mt-1 font-medium flex items-center gap-2">
          Project: <strong className="text-primary-600">{project?.title}</strong>
        </p>
      </div>

      {/* SUBMISSION REVIEW SECTION (if a submission exists) */}
      {submission && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl border-2 border-primary-500/30 bg-primary-50/50 dark:bg-primary-950/10 shadow-lg"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Project Submission 
                {submission.status === 'submitted' && <span className="px-3 py-1 bg-amber-500/10 text-amber-600 text-xs rounded-full uppercase">Needs Review</span>}
                {submission.status === 'approved' && <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-xs rounded-full uppercase">Approved</span>}
                {submission.status === 'changes-requested' && <span className="px-3 py-1 bg-rose-500/10 text-rose-600 text-xs rounded-full uppercase">Changes Requested</span>}
              </h2>
              <p className="text-sm text-slate-500">Submitted by {submission.developer.name} on {new Date(submission.submittedAt).toLocaleDateString()}</p>
            </div>
            
            {submission.status === 'approved' && submission.paymentStatus === 'unpaid' && (
              <Link
                to={`/payment/${submission._id}`}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 btn-glow"
              >
                <DollarSign className="h-5 w-5" />
                Proceed to Payment
              </Link>
            )}
            {submission.status === 'approved' && submission.paymentStatus === 'paid' && (
              <div className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-500 font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" /> Payment Complete
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">Deliverables</h3>
              
              {submission.githubRepoLink && (
                <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-sm font-medium">GitHub Repository</span>
                  <a href={submission.githubRepoLink} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline flex items-center gap-1 text-sm font-bold">
                    View <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
              
              {submission.liveDemoLink && (
                <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-sm font-medium">Live Demo</span>
                  <a href={submission.liveDemoLink} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline flex items-center gap-1 text-sm font-bold">
                    View <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}

              {submission.submissionFiles?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm font-medium block">Uploaded Files</span>
                  {submission.submissionFiles.map((file, i) => (
                    <a key={i} href={getFileUrl(file)} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary-500 transition-colors group">
                      <span className="text-sm text-slate-600 dark:text-slate-400 truncate">File {i + 1}</span>
                      <Download className="h-4 w-4 text-slate-400 group-hover:text-primary-500" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">Developer Notes</h3>
              <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap min-h-[100px]">
                {submission.notes || "No additional notes provided."}
              </div>

              {submission.status === 'submitted' && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => { setReviewAction('request-changes'); setShowReviewModal(true); }}
                    className="flex-1 py-3 border border-amber-500 text-amber-600 font-bold rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                  >
                    Request Changes
                  </button>
                  <button
                    onClick={() => { setReviewAction('approve'); setShowReviewModal(true); }}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl shadow-md transition-all"
                  >
                    Approve Work
                  </button>
                </div>
              )}

              {submission.status === 'changes-requested' && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/30">
                  <h4 className="text-sm font-bold text-amber-800 dark:text-amber-500 mb-1 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> You requested changes
                  </h4>
                  <p className="text-xs text-amber-700 dark:text-amber-600 italic">"{submission.clientFeedback}"</p>
                  <p className="text-xs text-amber-600 mt-2">Waiting for developer to resubmit.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* APPLICATIONS LIST */}
      {applications.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No applications received yet"
          description="Candidates who apply to your project will appear here."
        />
      ) : (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Applicants ({applications.length})</h2>
          {applications.map((app, idx) => (
            <motion.div
              key={app._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/30 bg-white dark:bg-slate-900 shadow-sm card-premium flex flex-col md:flex-row gap-6"
            >
              {/* Left: Dev Info */}
              <div className="flex-shrink-0 flex flex-col items-center md:items-start w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 pb-6 md:pb-0 md:pr-6">
                <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-500 flex items-center justify-center text-2xl text-white font-bold overflow-hidden mb-3 shadow-md">
                  {app.freelancer.profileImage ? (
                    <img src={getFileUrl(app.freelancer.profileImage)} alt={app.freelancer.name} className="h-full w-full object-cover" />
                  ) : (
                    app.freelancer.name.charAt(0).toUpperCase()
                  )}
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white text-center md:text-left">
                  {app.freelancer.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center md:text-left mb-3">
                  {app.freelancer.email}
                </p>
                <div className="w-full space-y-2">
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 gap-2">
                    <Calendar className="h-3.5 w-3.5" /> Applied on {new Date(app.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 gap-2">
                    <DollarSign className="h-3.5 w-3.5" /> Bid: ${app.expectedBudget}
                  </div>
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 gap-2">
                    <Clock className="h-3.5 w-3.5" /> {app.estimatedDeliveryTime} Days
                  </div>
                  {app.resumeUrl && (
                    <div className="flex items-center text-xs text-primary-600 gap-2 font-bold pt-2">
                      <FileText className="h-3.5 w-3.5" /> 
                      <a href={getFileUrl(app.resumeUrl)} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        View Resume
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Proposal & Skills */}
              <div className="flex-grow space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary-500" /> Cover Letter
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    {app.proposal}
                  </p>
                </div>

                {app.freelancer.skills && app.freelancer.skills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {app.freelancer.skills.map((skill) => (
                        <span key={skill} className="px-2.5 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs font-bold rounded-lg border border-primary-100 dark:border-primary-800/30">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                  <span className={`px-3 py-1.5 text-xs rounded-full font-bold capitalize border ${
                    app.status === 'pending' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                    app.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                    'bg-rose-500/10 text-rose-600 border-rose-500/20'
                  }`}>
                    {app.status === 'accepted' ? 'Hired Developer' : app.status}
                  </span>

                  <div className="flex items-center gap-2">
                    {app.status === 'pending' && !submission && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(app._id, 'rejected')}
                          className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-slate-600 text-sm font-bold rounded-xl transition-all"
                        >
                          <X className="h-4 w-4" /> Reject
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(app._id, 'accepted')}
                          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-bold rounded-xl shadow-md transition-all"
                        >
                          <Check className="h-4 w-4" /> Accept
                        </button>
                      </>
                    )}
                    {app.status === 'accepted' && (
                      <Link
                        to={`/chat/${app.freelancer._id}`}
                        className="flex items-center gap-1.5 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl transition-colors shadow-md shadow-primary-500/20"
                      >
                        <MessageSquare className="h-4 w-4" /> Message
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/30 rounded-3xl p-7 shadow-2xl space-y-6"
            >
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
                {reviewAction === 'approve' ? 'Approve Work?' : 'Request Changes'}
              </h3>
              
              {reviewAction === 'approve' ? (
                <p className="text-sm text-slate-500">
                  By approving this work, you acknowledge that the developer has met the requirements. You will then proceed to final payment.
                </p>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-slate-500">Provide feedback to the developer on what needs to be changed before you can approve the work.</p>
                  <textarea
                    rows="4"
                    required
                    value={reviewFeedback}
                    onChange={(e) => setReviewFeedback(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-all dark:text-white resize-none"
                    placeholder="E.g. Please fix the responsive layout on the contact page..."
                  ></textarea>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReview}
                  disabled={reviewing}
                  className={`flex-1 py-3 text-white font-bold rounded-xl shadow-md transition-all text-sm ${
                    reviewAction === 'approve' 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
                      : 'bg-amber-500 hover:bg-amber-600'
                  }`}
                >
                  {reviewing ? 'Processing...' : reviewAction === 'approve' ? 'Yes, Approve' : 'Submit Feedback'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientApplications;
