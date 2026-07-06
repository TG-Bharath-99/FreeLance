import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Briefcase, DollarSign, Calendar, Upload, Link as LinkIcon, ExternalLink, Sparkles, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatsSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { toast } from 'react-hot-toast';

const ActiveProjects = () => {
  const { user } = useAuth();
  const [activeApps, setActiveApps] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Submission form state
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formFiles, setFormFiles] = useState([]);
  const [formGithub, setFormGithub] = useState('');
  const [formLiveLink, setFormLiveLink] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const fetchData = async () => {
    try {
      // Fetch accepted applications
      const appsRes = await api.get('/applications/my-applications');
      const accepted = appsRes.data.filter(app => app.status === 'accepted');
      setActiveApps(accepted);

      // Fetch my submissions
      const subsRes = await api.get('/submissions/my-submissions');
      setSubmissions(subsRes.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load active projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openSubmitModal = (app, submission = null) => {
    setSelectedProject(app);
    if (submission) {
      // Populate if it's a resubmit
      setFormGithub(submission.githubRepoLink || '');
      setFormLiveLink(submission.liveDemoLink || '');
      setFormNotes(submission.notes || '');
      setFormFiles([]); // Have to re-upload files or skip
    } else {
      setFormGithub('');
      setFormLiveLink('');
      setFormNotes('');
      setFormFiles([]);
    }
    setShowSubmitModal(true);
  };

  const handleFileChange = (e) => {
    setFormFiles(Array.from(e.target.files));
  };

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    if (!formGithub && !formLiveLink && formFiles.length === 0) {
      toast.error('Please provide at least a file, github link, or live demo link.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('projectId', selectedProject.project._id);
      formData.append('githubRepoLink', formGithub);
      formData.append('liveDemoLink', formLiveLink);
      formData.append('notes', formNotes);
      
      formFiles.forEach(file => {
        formData.append('submissionFiles', file);
      });

      await api.post('/submissions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Project work submitted successfully!');
      setShowSubmitModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit work');
    } finally {
      setSubmitting(false);
    }
  };

  const getSubmissionForProject = (projectId) => {
    return submissions.find(sub => sub.project._id === projectId);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-6">
        <div className="h-10 shimmer rounded w-1/4"></div>
        <StatsSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          My Active Projects
          <Sparkles className="h-6 w-6 text-primary-500" />
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Manage your accepted projects and submit your deliverables.
        </p>
      </motion.div>

      {/* Main content */}
      <div>
        {activeApps.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No active projects right now"
            description="Apply to more projects to get hired and start working."
            actionText="Find Projects"
            actionLink="/projects"
          />
        ) : (
          <div className="grid gap-6">
            {activeApps.map((app, idx) => {
              const submission = getSubmissionForProject(app.project._id);
              
              return (
                <motion.div
                  key={app._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/30 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row gap-6"
                >
                  <div className="flex-grow space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          <Link to={`/projects/${app.project._id}`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                            {app.project.title}
                          </Link>
                        </h3>
                        <span className="px-2.5 py-1 text-[10px] rounded-full font-bold uppercase bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                          {app.project.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Client: {app.project.client?.name}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                      <span className="flex items-center gap-1.5"><DollarSign className="h-4 w-4 text-emerald-500" /> Agreed Budget: <strong>${app.expectedBudget}</strong></span>
                      <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary-500" /> Deadline: <strong>{new Date(app.project.deadline).toLocaleDateString()}</strong></span>
                    </div>
                  </div>
                  
                  {/* Submission Action Panel */}
                  <div className="w-full md:w-72 flex-shrink-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800/50 pt-4 md:pt-0 md:pl-6 flex flex-col justify-center">
                    {!submission ? (
                      <div className="space-y-3">
                        <p className="text-xs text-slate-500 font-medium text-center md:text-left">Project is currently in progress.</p>
                        <button
                          onClick={() => openSubmitModal(app)}
                          className="w-full py-2.5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-md btn-glow flex items-center justify-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          Submit Work
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {submission.status === 'submitted' && (
                          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                            <CheckCircle2 className="h-5 w-5 text-amber-500 mx-auto mb-1" />
                            <p className="text-xs font-bold text-amber-600 dark:text-amber-400">Work Submitted</p>
                            <p className="text-[10px] text-amber-600/70 dark:text-amber-400/70 mt-0.5">Waiting for client review</p>
                          </div>
                        )}
                        
                        {submission.status === 'approved' && (
                          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
                            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Work Approved!</p>
                            <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 mt-0.5">
                              {submission.paymentStatus === 'paid' ? 'Payment processed' : 'Pending payment'}
                            </p>
                          </div>
                        )}

                        {submission.status === 'changes-requested' && (
                          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                            <div className="text-center">
                              <AlertTriangle className="h-5 w-5 text-rose-500 mx-auto mb-1" />
                              <p className="text-xs font-bold text-rose-600 dark:text-rose-400">Changes Requested</p>
                            </div>
                            <div className="text-[10px] bg-white/50 dark:bg-slate-900/50 p-2 rounded border border-rose-500/10 text-rose-700 dark:text-rose-300 italic">
                              "{submission.clientFeedback}"
                            </div>
                            <button
                              onClick={() => openSubmitModal(app, submission)}
                              className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-lg transition-all"
                            >
                              Resubmit Work
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Submit Modal */}
      <AnimatePresence>
        {showSubmitModal && selectedProject && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-lg w-full bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/30 rounded-3xl p-7 shadow-2xl space-y-6"
            >
              <div className="space-y-1">
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Submit Deliverables</h3>
                <p className="text-xs text-slate-500 font-medium">Project: {selectedProject.project.title}</p>
              </div>

              <form onSubmit={handleSubmitWork} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">GitHub Repository (Optional)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><LinkIcon className="h-4 w-4" /></div>
                    <input
                      type="url"
                      value={formGithub}
                      onChange={(e) => setFormGithub(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-all dark:text-white"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Live Demo URL (Optional)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><ExternalLink className="h-4 w-4" /></div>
                    <input
                      type="url"
                      value={formLiveLink}
                      onChange={(e) => setFormLiveLink(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-all dark:text-white"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Submission Files (.zip, .pdf, .jpg)</label>
                  <label className="cursor-pointer flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-500 transition-colors">
                    <Upload className="h-6 w-6 text-slate-400" />
                    <span className="text-xs font-bold text-center">
                      {formFiles.length > 0 ? `${formFiles.length} file(s) selected` : 'Click to upload project files'}
                    </span>
                    <input type="file" multiple onChange={handleFileChange} className="hidden" />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Submission Notes</label>
                  <textarea
                    rows="3"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-all dark:text-white resize-none"
                    placeholder="Provide any instructions or comments for the client..."
                  ></textarea>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="flex-1 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all text-sm flex justify-center items-center gap-2 disabled:opacity-70"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Now'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActiveProjects;
