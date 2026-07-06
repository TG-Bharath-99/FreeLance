import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Folder, FileText, CheckCircle, Power, Users, PlusCircle, 
  ArrowRight, Calendar, ExternalLink, RefreshCw, AlertCircle, Sparkles, TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { StatsSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { toast } from 'react-hot-toast';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async (showToast = false) => {
    try {
      const statsRes = await api.get('/dashboard/stats');
      setStats(statsRes.data);

      const projectsRes = await api.get(`/projects?client=${user._id}&status=all&limit=5`);
      setProjects(projectsRes.data.projects);
      
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
  }, [user._id]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData(true);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-6">
        <div className="h-10 shimmer rounded w-1/4"></div>
        <StatsSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
          <div className="lg:col-span-2 h-60 shimmer rounded-2xl"></div>
          <div className="h-60 shimmer rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const classes = {
      open: 'bg-gradient-to-r from-indigo-500/10 to-primary-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
      closed: 'bg-slate-500/10 text-slate-500 border border-slate-500/20',
      completed: 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    };
    return classes[status] || 'bg-slate-100 text-slate-500';
  };

  const statCards = [
    { label: 'Total Posts', value: stats.totalProjects, icon: Folder, color: 'from-primary-500 to-indigo-500', bg: 'bg-primary-500/8' },
    { label: 'Active', value: stats.activeProjects, icon: Power, color: 'from-indigo-500 to-blue-500', bg: 'bg-indigo-500/8' },
    { label: 'Closed', value: stats.closedProjects, icon: FileText, color: 'from-slate-500 to-gray-500', bg: 'bg-slate-500/8' },
    { label: 'Completed', value: stats.completedProjects, icon: CheckCircle, color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/8' },
    { label: 'Applicants', value: stats.totalApplications, icon: Users, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/8' },
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
            Manage your project openings and review candidate proposals.
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
              to="/post-project"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 shadow-lg shadow-primary-500/20 hover:shadow-xl transition-all btn-glow"
            >
              <PlusCircle className="h-4 w-4" />
              Post a Project
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Project Postings</h2>
            {projects.length > 0 && (
              <Link to="/projects?status=all" className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>

          {projects.length === 0 ? (
            <EmptyState
              icon={Folder}
              title="No projects posted yet"
              description="Post a project to start receiving proposals."
              actionText="Post your first project"
              actionLink="/post-project"
            />
          ) : (
            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <motion.div
                  key={proj._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/30 bg-white dark:bg-slate-900 shadow-sm card-premium flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      <Link to={`/projects/${proj._id}`}>{proj.title}</Link>
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <span className="font-bold text-slate-700 dark:text-slate-300">${proj.budget.toLocaleString()} USD</span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span>{proj.category}</span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <Link to={`/client-applications/${proj._id}`} className="flex items-center gap-1 hover:text-primary-600 transition-colors">
                        <Users className="h-3 w-3" /> {proj.applicationsCount} Applications
                      </Link>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
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

        {/* Right: Activity & Analytics */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/30 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-primary-500" /> Recent Applicants
            </h2>
            
            {stats.recentActivity.length === 0 ? (
              <div className="text-center py-6 text-sm text-slate-500 dark:text-slate-400 flex flex-col items-center gap-2">
                <AlertCircle className="h-5 w-5 text-slate-400" />
                <span className="font-medium">No applicants yet</span>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentActivity.map((act) => (
                  <div key={act._id} className="flex items-start gap-3 text-sm">
                    <div className="h-8 w-8 rounded-full overflow-hidden bg-gradient-to-tr from-primary-500 to-indigo-500 flex items-center justify-center text-xs text-white font-bold flex-shrink-0 mt-0.5 shadow-sm">
                      {act.freelancer.profileImage ? (
                        <img src={act.freelancer.profileImage.startsWith('http') ? act.freelancer.profileImage : `http://localhost:5000${act.freelancer.profileImage}`} alt={act.freelancer.name} className="h-full w-full object-cover" />
                      ) : (
                        act.freelancer.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="space-y-1 min-w-0 flex-grow">
                      <p className="text-slate-800 dark:text-slate-200 text-xs">
                        <span className="font-bold">{act.freelancer.name}</span>
                        <span className="text-slate-400"> applied for </span>
                        <span className="font-bold text-primary-600 dark:text-primary-400 truncate block sm:inline">{act.project.title}</span>
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Bid: <strong className="text-slate-700 dark:text-slate-300">${act.expectedBudget}</strong></span>
                        <span className={`capitalize px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          act.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                          act.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-500' :
                          'bg-rose-500/10 text-rose-500'
                        }`}>{act.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/30 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-500" /> Category Breakdown
            </h2>
            
            {stats.analytics.categoryData.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center font-medium">No categories yet</p>
            ) : (
              <div className="space-y-3">
                {stats.analytics.categoryData.map((cat, idx) => {
                  const percentage = Math.round((cat.value / stats.totalProjects) * 100);
                  const colors = ['bg-gradient-to-r from-primary-500 to-indigo-500', 'bg-gradient-to-r from-indigo-500 to-blue-500', 'bg-gradient-to-r from-emerald-500 to-teal-500', 'bg-gradient-to-r from-amber-500 to-orange-500', 'bg-gradient-to-r from-rose-500 to-pink-500'];
                  const color = colors[idx % colors.length];

                  return (
                    <div key={cat.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-slate-700 dark:text-slate-300 truncate pr-2 font-bold">{cat.name}</span>
                        <span className="text-slate-500 dark:text-slate-400 flex-shrink-0">{cat.value} ({percentage}%)</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.1 }}
                          className={`h-full ${color} rounded-full`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
