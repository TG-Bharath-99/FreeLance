import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Folder, Users, DollarSign, Calendar, ExternalLink, Sparkles, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatsSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { toast } from 'react-hot-toast';

const MyProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProjects = async (showToast = false) => {
    try {
      const res = await api.get(`/projects?client=${user._id}&status=all`);
      setProjects(res.data.projects);
      if (showToast) toast.success('Projects refreshed');
    } catch (err) {
      console.error(err);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user._id]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProjects(true);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-6">
        <div className="h-10 shimmer rounded w-1/4"></div>
        <StatsSkeleton />
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const classes = {
      open: 'bg-gradient-to-r from-indigo-500/10 to-primary-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
      'in-progress': 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
      submitted: 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
      completed: 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
      closed: 'bg-slate-500/10 text-slate-500 border border-slate-500/20',
    };
    return classes[status] || 'bg-slate-100 text-slate-500';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            My Projects
            <Sparkles className="h-6 w-6 text-primary-500" />
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Manage your posted projects and track their progress.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all text-slate-500 hover:text-primary-600 shadow-sm"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin text-primary-500' : ''}`} />
          </motion.button>
          <Link
            to="/post-project"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 shadow-lg shadow-primary-500/20 transition-all btn-glow"
          >
            Post a Project
          </Link>
        </div>
      </motion.div>

      {/* Main content */}
      <div>
        {projects.length === 0 ? (
          <EmptyState
            icon={Folder}
            title="You haven't posted any projects yet."
            description="Create your first project to start receiving proposals from talented freelancers."
            actionText="Post your first project"
            actionLink="/post-project"
          />
        ) : (
          <div className="grid gap-4">
            {projects.map((proj, idx) => (
              <motion.div
                key={proj._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/30 bg-white dark:bg-slate-900 shadow-sm card-premium flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-grow">
                  <h3 className="font-bold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    <Link to={`/projects/${proj._id}`}>{proj.title}</Link>
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                      <strong className="text-slate-700 dark:text-slate-300">${proj.budget.toLocaleString()} USD</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Folder className="h-3.5 w-3.5 text-indigo-500" />
                      {proj.category}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-primary-500" />
                      Posted {new Date(proj.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Link to={`/client-applications/${proj._id}`} className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg transition-colors">
                    <Users className="h-3.5 w-3.5" />
                    {proj.applicationsCount} Applicants
                  </Link>
                  <span className={`px-2.5 py-1 text-xs rounded-full font-bold capitalize ${getStatusBadge(proj.status)}`}>
                    {proj.status}
                  </span>
                  <Link
                    to={`/projects/${proj._id}`}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-primary-50 dark:hover:bg-primary-950/20 hover:border-primary-200 dark:hover:border-primary-800/30 text-slate-500 hover:text-primary-600 transition-all"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;
