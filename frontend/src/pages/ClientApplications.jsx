import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, FileText, Check, X, ArrowLeft, ExternalLink, Calendar, MessageSquare, DollarSign, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import EmptyState from '../components/EmptyState';
import { StatsSkeleton } from '../components/Skeleton';
import { getFileUrl } from '../utils/helpers';

const ClientApplications = () => {
  const { projectId } = useParams();
  const [applications, setApplications] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const [appRes, projRes] = await Promise.all([
          api.get(`/applications/project/${projectId}`),
          api.get(`/projects/${projectId}`)
        ]);
        setApplications(appRes.data);
        setProject(projRes.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [projectId]);

  const handleStatusUpdate = async (appId, status) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status });
      toast.success(`Application ${status}`);
      // Refresh
      const appRes = await api.get(`/applications/project/${projectId}`);
      setApplications(appRes.data);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${status} application`);
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
        <Link to="/client-dashboard" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary-600 mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Review Applications
        </h1>
        <p className="text-sm text-slate-500 mt-1 font-medium flex items-center gap-2">
          Project: <strong className="text-primary-600">{project?.title}</strong>
        </p>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No applications received yet"
          description="Candidates who apply to your project will appear here."
        />
      ) : (
        <div className="space-y-6">
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
                </div>
              </div>

              {/* Right: Proposal & Skills */}
              <div className="flex-grow space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary-500" /> Proposal
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
                    {app.status}
                  </span>

                  <div className="flex items-center gap-2">
                    {app.status === 'pending' && (
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
                        <MessageSquare className="h-4 w-4" /> Message Developer
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientApplications;
