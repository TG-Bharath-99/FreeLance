import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, DollarSign, Clock, ExternalLink, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import EmptyState from '../components/EmptyState';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications/my-applications');
      setApplications(response.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchApplications();
  };

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this proposal?')) return;
    try {
      await api.delete(`/applications/${appId}`);
      toast.success('Proposal withdrawn successfully');
      fetchApplications();
    } catch (err) {
      console.error(err);
      toast.error('Failed to withdraw proposal');
    }
  };

  const getStatusBadge = (status) => {
    const classes = {
      pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      accepted: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      rejected: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    };
    return classes[status] || 'bg-slate-100 text-slate-500';
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="h-10 shimmer rounded w-1/4 mb-8"></div>
        <div className="space-y-4">
          <div className="h-24 shimmer rounded-2xl"></div>
          <div className="h-24 shimmer rounded-2xl"></div>
          <div className="h-24 shimmer rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Applications
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Manage your project proposals and view their status.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all text-slate-500 hover:text-primary-600 shadow-sm"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin text-primary-500' : ''}`} />
        </motion.button>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No applications submitted."
          description="You haven't applied to any projects yet. Start browsing to find your next gig."
          actionText="Browse Projects"
          actionLink="/projects"
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app, idx) => (
            <motion.div
              key={app._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/30 bg-white dark:bg-slate-900 shadow-sm card-premium flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-grow">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white hover:text-primary-600 transition-colors">
                  <Link to={`/projects/${app.project._id}`}>{app.project.title}</Link>
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{app.project.client.name}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-emerald-500" />
                    Bid: ${app.expectedBudget}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-primary-500" />
                    Applied on: {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-3 py-1.5 text-xs rounded-full font-bold capitalize border ${getStatusBadge(app.status)}`}>
                  {app.status}
                </span>
                {app.status === 'pending' && (
                  <button
                    onClick={() => handleWithdraw(app._id)}
                    className="px-3 py-1.5 border border-red-200 text-red-500 text-xs font-bold rounded-xl hover:bg-red-50 transition-colors"
                  >
                    Withdraw
                  </button>
                )}
                {app.status === 'accepted' && (
                  <Link
                    to={`/chat/${app.project.client._id}`}
                    className="px-4 py-1.5 bg-primary-600 text-white text-xs font-bold rounded-xl hover:bg-primary-700 transition-colors"
                  >
                    Chat
                  </Link>
                )}
                <Link
                  to={`/projects/${app.project._id}`}
                  className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
