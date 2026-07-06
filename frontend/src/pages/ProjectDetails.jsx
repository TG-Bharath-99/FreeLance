import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, DollarSign, Calendar, Users, Award, Shield, FileText, 
  Clock, CheckCircle2, AlertTriangle, ExternalLink, Bookmark, Share2, Upload, Loader2, X, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import EmptyState from '../components/EmptyState';
import { getFileUrl } from '../utils/helpers';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [project, setProject] = useState(null);
  const [applications, setApplications] = useState([]);
  const [userApplication, setUserApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modal toggle
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submittingProposal, setSubmittingProposal] = useState(false);
  const [actioningApplicationId, setActioningApplicationId] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const fetchProjectDetails = async () => {
    try {
      const projRes = await api.get(`/projects/${id}`);
      setProject(projRes.data);

      if (isAuthenticated) {
        // If owner client, fetch applications
        if (projRes.data.client._id === user._id) {
          const appsRes = await api.get(`/applications/project/${id}`);
          setApplications(appsRes.data);
        } else if (user.role === 'freelancer') {
          // If freelancer, check if they applied
          const appsRes = await api.get('/applications/my-applications');
          const foundApp = appsRes.data.find((app) => app.project._id === id);
          setUserApplication(foundApp || null);
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
    fetchProjectDetails();
  }, [id, isAuthenticated, user?._id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Project link copied to clipboard!');
  };

  const handleBookmark = () => {
    toast.success('Project bookmarked!');
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const onProposalSubmit = async (data) => {
    setSubmittingProposal(true);
    try {
      const formData = new FormData();
      formData.append('projectId', id);
      formData.append('proposal', data.proposal);
      formData.append('expectedBudget', data.expectedBudget);
      formData.append('estimatedDeliveryTime', data.estimatedDeliveryTime);
      if (selectedFile) {
        formData.append('resume', selectedFile);
      }

      await api.post('/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Proposal submitted successfully!');
      setShowApplyModal(false);
      reset();
      setSelectedFile(null);
      fetchProjectDetails();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to submit proposal');
    } finally {
      setSubmittingProposal(false);
    }
  };

  const handleWithdraw = async () => {
    if (!window.confirm('Are you sure you want to withdraw your proposal?')) return;
    try {
      await api.delete(`/applications/${userApplication._id}`);
      toast.success('Proposal withdrawn successfully');
      setUserApplication(null);
      fetchProjectDetails();
    } catch (err) {
      console.error(err);
      toast.error('Failed to withdraw proposal');
    }
  };

  const handleApplicationStatus = async (appId, status) => {
    setActioningApplicationId(appId);
    try {
      await api.patch(`/applications/${appId}/status`, { status });
      toast.success(`Application successfully ${status}`);
      fetchProjectDetails();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to update application status');
    } finally {
      setActioningApplicationId(null);
    }
  };

  const handleProjectStatusToggle = async (newStatus) => {
    try {
      await api.patch(`/projects/${id}/status`, { status: newStatus });
      toast.success(`Project status updated to ${newStatus}`);
      fetchProjectDetails();
    } catch (err) {
      console.error(err);
      toast.error('Failed to change project status');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary-600 dark:text-primary-400" />
          <p className="text-sm text-slate-500 font-medium">Loading project details...</p>
        </div>
      </div>
    );
  }

  const isOwner = isAuthenticated && project.client._id === user._id;

  const getStatusBadge = (status) => {
    const classes = {
      open: 'bg-gradient-to-r from-indigo-500/10 to-primary-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
      closed: 'bg-slate-500/10 text-slate-500 border border-slate-500/20',
      completed: 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    };
    return classes[status] || 'bg-slate-100 text-slate-500 border border-slate-200';
  };

  const getAppStatusClass = (status) => {
    const classes = {
      pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
      accepted: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
      rejected: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
    };
    return classes[status] || 'bg-slate-100 text-slate-500 border border-slate-200';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Back and actions toolbar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between pb-4 border-b border-slate-200/40 dark:border-slate-800/30"
      >
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Listings
        </button>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBookmark}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-primary-50 dark:hover:bg-primary-950/20 hover:border-primary-200 dark:hover:border-primary-800/30 transition-all text-slate-500 hover:text-primary-600"
            title="Bookmark"
          >
            <Bookmark className="h-4 w-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-primary-50 dark:hover:bg-primary-950/20 hover:border-primary-200 dark:hover:border-primary-800/30 transition-all text-slate-500 hover:text-primary-600"
            title="Share"
          >
            <Share2 className="h-4 w-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Split grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Project Scope */}
        <div className="lg:col-span-8 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-7 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/30 bg-white dark:bg-slate-900 shadow-sm space-y-6"
          >
            {/* Header info */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-3 py-1 text-xs rounded-full font-bold uppercase ${getStatusBadge(project.status)}`}>
                  {project.status} project
                </span>
                <span className="px-3 py-1 text-xs rounded-full font-bold border border-slate-200 dark:border-slate-800 capitalize text-slate-600 dark:text-slate-400">
                  Tier: {project.experienceLevel}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {project.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400 border-y border-slate-100 dark:border-slate-800/40 py-4 font-medium">
                <span className="flex items-center gap-1.5"><DollarSign className="h-4 w-4 text-emerald-500" /> Budget: <strong className="text-slate-800 dark:text-slate-200">${project.budget.toLocaleString()} USD</strong></span>
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary-500" /> Deadline: <strong className="text-slate-800 dark:text-slate-200">{new Date(project.deadline).toLocaleDateString()}</strong></span>
                <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-indigo-500" /> Bids: <strong className="text-slate-800 dark:text-slate-200">{project.applicationsCount} applicants</strong></span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-400" /> Project Scope
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>

            {/* Skills */}
            <div className="space-y-3">
              <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="h-4 w-4 text-slate-400" /> Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.skillsRequired.map((skill) => (
                  <span
                    key={skill}
                    className="px-3.5 py-1.5 bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 text-xs font-bold rounded-xl border border-primary-100/50 dark:border-primary-900/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Application Review Panel (Owner) */}
          {isOwner && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Applicant Proposal Reviews</h2>
              
              {applications.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No applicants yet"
                  description="Your job posting is open. Once freelancers apply, their details and proposals will appear here."
                />
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <motion.div
                      key={app._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/30 bg-white dark:bg-slate-900 shadow-sm space-y-4"
                    >
                      {/* Freelancer Profile Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-3">
                          <div className="h-11 w-11 rounded-full overflow-hidden bg-gradient-to-tr from-primary-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {app.freelancer.profileImage ? (
                              <img src={getFileUrl(app.freelancer.profileImage)} alt={app.freelancer.name} className="h-full w-full object-cover" />
                            ) : (
                              app.freelancer.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">{app.freelancer.name}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize font-medium">{app.freelancer.location || 'Remote Location'}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-xs rounded-full font-bold capitalize ${getAppStatusClass(app.status)}`}>
                          {app.status}
                        </span>
                      </div>

                      {/* Proposal */}
                      <div className="text-sm bg-slate-50/80 dark:bg-slate-950/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/40 border-l-4 border-l-primary-500">
                        <h5 className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Cover Letter</h5>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-xs">
                          {app.proposal}
                        </p>
                      </div>

                      {/* Bid Info */}
                      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <div className="flex items-center gap-4">
                          <span>Bid: <strong className="text-slate-800 dark:text-slate-200">${app.expectedBudget} USD</strong></span>
                          <span>Delivery: <strong className="text-slate-800 dark:text-slate-200">{app.estimatedDeliveryTime} days</strong></span>
                        </div>
                        {app.resumeUrl ? (
                          <a
                            href={getFileUrl(app.resumeUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-bold text-primary-600 dark:text-primary-400 hover:underline"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            View Resume
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 italic flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5" />
                            Resume not uploaded.
                          </span>
                        )}
                      </div>

                      {/* Accept / Reject */}
                      {app.status === 'pending' && (
                        <div className="flex items-center gap-2 pt-2 justify-end">
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleApplicationStatus(app._id, 'rejected')}
                            disabled={actioningApplicationId !== null}
                            className="px-4 py-2 border rounded-xl text-xs font-bold border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 transition-colors"
                          >
                            Reject
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleApplicationStatus(app._id, 'accepted')}
                            disabled={actioningApplicationId !== null}
                            className="px-4 py-2 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                          >
                            Accept Developer
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Client Details */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/30 bg-white dark:bg-slate-900 shadow-sm space-y-5"
          >
            <h3 className="font-bold text-xs text-slate-500 uppercase tracking-widest">About the Client</h3>
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-primary-500 to-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-lg">
                {project.client.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{project.client.name}</h4>
                <p className="text-xs text-slate-500 font-medium">{project.client.companyName || 'Individual Client'}</p>
              </div>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed italic border-t border-slate-100 dark:border-slate-800/40 pt-3">
              "{project.client.bio || 'This client has not added a professional bio yet.'}"
            </p>

            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/40 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span>{project.client.location || 'Remote Location'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" />
                <span>Verified Client Account</span>
              </div>
            </div>
          </motion.div>

          {/* Status Controls (Owner) */}
          {isOwner && (
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/30 bg-white dark:bg-slate-900 shadow-sm space-y-4"
            >
              <h3 className="font-bold text-xs text-slate-500 uppercase tracking-widest">Contract Status</h3>
              <div className="space-y-2">
                {['open', 'closed', 'completed'].map((status) => {
                  const isCurrentStatus = project.status === status;
                  const colors = {
                    open: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
                    closed: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
                    completed: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
                  };
                  return (
                    <button
                      key={status}
                      onClick={() => handleProjectStatusToggle(status)}
                      disabled={isCurrentStatus}
                      className={`w-full py-2.5 text-xs font-bold rounded-xl border transition-all capitalize ${
                        isCurrentStatus
                          ? colors[status]
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Mark as {status}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Action Card (Freelancer / Guest) */}
          {!isOwner && (
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/30 bg-white dark:bg-slate-900 shadow-md space-y-4"
            >
              {userApplication ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/10 border border-emerald-100 dark:border-emerald-900/30 text-center space-y-2">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Proposal Submitted</p>
                    <div className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${getAppStatusClass(userApplication.status)}`}>
                      {userApplication.status}
                    </div>
                  </div>
                  
                  <div className="text-xs space-y-2 border-t border-slate-100 dark:border-slate-800/40 pt-3 font-medium">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Your bid:</span>
                      <strong className="text-slate-900 dark:text-white">${userApplication.expectedBudget} USD</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Timeline:</span>
                      <strong className="text-slate-900 dark:text-white">{userApplication.estimatedDeliveryTime} days</strong>
                    </div>
                  </div>

                  {userApplication.status === 'pending' && (
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleWithdraw}
                      className="w-full py-3 border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 text-sm font-bold rounded-xl transition-all"
                    >
                      Withdraw Proposal
                    </motion.button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Submit a tailored proposal showing your relevant skills to start working on this project.
                  </p>
                  
                  {project.status !== 'open' ? (
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-500 border border-slate-200 dark:border-slate-700 text-center text-xs font-bold">
                      Applications closed
                    </div>
                  ) : !isAuthenticated ? (
                    <Link
                      to="/login"
                      className="w-full inline-flex justify-center py-3.5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white rounded-xl text-center shadow-lg text-sm font-bold btn-glow"
                    >
                      Log In to Apply
                    </Link>
                  ) : user.role === 'client' ? (
                    <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-center text-xs font-bold flex items-center gap-2 justify-center">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                      Clients cannot apply
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setShowApplyModal(true)}
                      className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-500/20 btn-glow"
                    >
                      Apply for Project
                    </motion.button>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-lg w-full bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/30 rounded-3xl p-7 shadow-2xl relative space-y-6"
            >
              <button
                onClick={() => setShowApplyModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-1">
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Apply for {project.title}</h3>
                <p className="text-xs text-slate-500 font-medium">Provide your bid details, timeline, and cover letter</p>
              </div>

              <form onSubmit={handleSubmit(onProposalSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Expected Budget ($)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm font-bold">$</div>
                    <input
                      type="number"
                      required
                      {...register('expectedBudget', { 
                        required: 'Please state your bid',
                        min: { value: 1, message: 'Bid must be greater than 0' }
                      })}
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white font-medium"
                      placeholder="e.g. 450"
                      defaultValue={project.budget}
                    />
                  </div>
                  {errors.expectedBudget && <p className="text-xs text-red-500 mt-1 font-medium">{errors.expectedBudget.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Delivery Time (Days)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><Clock className="h-4 w-4" /></div>
                    <input
                      type="number"
                      required
                      {...register('estimatedDeliveryTime', { 
                        required: 'Please estimate delivery',
                        min: { value: 1, message: 'Min 1 day' }
                      })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white font-medium"
                      placeholder="e.g. 14"
                    />
                  </div>
                  {errors.estimatedDeliveryTime && <p className="text-xs text-red-500 mt-1 font-medium">{errors.estimatedDeliveryTime.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Cover Letter</label>
                  <textarea
                    rows="4"
                    required
                    {...register('proposal', { 
                      required: 'Cover letter is required',
                      minLength: { value: 20, message: 'Min 20 characters' }
                    })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white resize-none font-medium"
                    placeholder="Describe your relevant experience and approach..."
                  ></textarea>
                  {errors.proposal && <p className="text-xs text-red-500 mt-1 font-medium">{errors.proposal.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Resume (Optional)</label>
                  <label className="cursor-pointer flex items-center justify-center gap-2 p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950/30 text-slate-500 transition-colors">
                    <Upload className="h-4 w-4" />
                    <span className="text-xs font-bold">
                      {selectedFile ? selectedFile.name : 'Upload PDF resume'}
                    </span>
                    <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" className="hidden" />
                  </label>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={submittingProposal}
                  className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm btn-glow disabled:opacity-70"
                >
                  {submittingProposal ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Proposal'}
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetails;
