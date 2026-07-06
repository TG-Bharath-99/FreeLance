import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, FileText, CheckCircle, Clock, XCircle, DollarSign, 
  ArrowRight, RefreshCw, ExternalLink, AlertCircle, Sparkles, TrendingUp, Bookmark
} from 'lucide-react';
import { motion } from 'framer-motion';
import { StatsSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { toast } from 'react-hot-toast';

const FreelancerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async (showToast = false) => {
    try {
      const statsRes = await api.get('/dashboard/stats');
      setStats(statsRes.data);

      const appsRes = await api.get('/applications/my-applications');
      setApplications(appsRes.data);

      if (showToast) {
        toast.success('Dashboard metrics updated');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData(true);
  };

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this proposal?')) return;
    try {
      await api.delete(`/applications/${appId}`);
      toast.success('Proposal withdrawn successfully');
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to withdraw proposal');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-6">
        <div className="h-10 shimmer rounded w-1/4"></div>
        <StatsSkeleton />
        <div className="h-60 shimmer rounded-2xl mt-6"></div>
      </div>
    );
  }

  const getAppStatusBadge = (status) => {
    const classes = {
      pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
      accepted: 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
      rejected: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
    };
    return classes[status] || 'bg-slate-100 text-slate-500';
  };

  const statCards = [
    { label: 'Total Applications', value: stats.totalApplications, icon: FileText, color: 'from-primary-500 to-indigo-500' },
    { label: 'Pending', value: stats.pendingApplications, icon: Clock, color: 'from-amber-500 to-orange-500' },
    { label: 'Accepted', value: stats.acceptedApplications, icon: CheckCircle, color: 'from-emerald-500 to-teal-500' },
    { label: 'Rejected', value: stats.rejectedApplications, icon: XCircle, color: 'from-rose-500 to-pink-500' },
  ];

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
            Welcome back, {user.name.split(' ')[0]}
            <Sparkles className="h-6 w-6 text-primary-500" />
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Track your applications and find new matching projects.
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
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 shadow-lg shadow-primary-500/20 hover:shadow-xl transition-all btn-glow"
            >
              <Briefcase className="h-4 w-4" />
              Browse Projects
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const StatIcon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -2 }}
              className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/30 bg-white dark:bg-slate-900 shadow-sm card-premium"
            >
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-3 shadow-md`}>
                <StatIcon className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{stat.value}</h3>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Applications</h2>
        </div>

        {applications.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No applications submitted"
            description="Browse available projects and submit your first proposal."
            actionText="Browse open projects"
            actionLink="/projects"
          />
        ) : (
          <div className="space-y-3">
            {applications.map((app, idx) => (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/30 bg-white dark:bg-slate-900 shadow-sm card-premium"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 min-w-0 flex-grow">
                    <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      <Link to={`/projects/${app.project._id}`}>{app.project.title}</Link>
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-emerald-500" />
                        Your bid: <strong className="text-slate-700 dark:text-slate-300">${app.expectedBudget}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-primary-500" />
                        {app.estimatedDeliveryTime} days
                      </span>
                      <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">•</span>
                      <span>
                        Submitted {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <span className={`px-2.5 py-1 text-xs rounded-full font-bold capitalize ${getAppStatusBadge(app.status)}`}>
                      {app.status}
                    </span>
                    {app.status === 'pending' && (
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleWithdraw(app._id)}
                        className="px-3 py-1.5 border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 text-xs font-bold rounded-xl transition-colors"
                      >
                        Withdraw
                      </motion.button>
                    )}
                    <Link
                      to={`/projects/${app.project._id}`}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-primary-50 dark:hover:bg-primary-950/20 hover:border-primary-200 dark:hover:border-primary-800/30 text-slate-500 hover:text-primary-600 transition-all"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Projects */}
      {stats.recommendedProjects && stats.recommendedProjects.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary-500" />
              Recommended for You
            </h2>
            <Link to="/projects" className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.recommendedProjects.slice(0, 3).map((proj, idx) => (
              <motion.div
                key={proj._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -3 }}
                className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/30 bg-white dark:bg-slate-900 shadow-sm card-premium flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-extrabold text-primary-600 dark:text-primary-400">
                      ${proj.budget.toLocaleString()}
                    </span>
                    <Bookmark className="h-4 w-4 text-slate-400 hover:text-primary-500 cursor-pointer transition-colors" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                    <Link to={`/projects/${proj._id}`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      {proj.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{proj.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.skillsRequired.slice(0, 2).map((skill) => (
                      <span key={skill} className="px-2 py-0.5 rounded-lg bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 text-[10px] font-bold border border-primary-100/50 dark:border-primary-900/30">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  to={`/projects/${proj._id}`}
                  className="mt-4 w-full py-2.5 text-center text-xs font-bold text-primary-600 dark:text-primary-400 border border-primary-200/50 dark:border-primary-800/30 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-950/20 transition-all"
                >
                  View Details
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FreelancerDashboard;
