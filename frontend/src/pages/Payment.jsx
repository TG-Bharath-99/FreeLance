import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CreditCard, CheckCircle, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const Payment = () => {
  const { id } = useParams(); // Project ID
  const navigate = useNavigate();
  
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchSubmissionDetails = async () => {
      try {
        const res = await api.get(`/submissions/project/${id}`);
        setSubmission(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load payment details');
        navigate('/client-dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissionDetails();
  }, [id, navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    
    try {
      // Simulate network delay for payment gateway
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Call backend to update payment status
      await api.patch(`/submissions/${submission._id}/payment`);
      
      setCompleted(true);
      toast.success('Payment Completed Successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 flex justify-center items-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
      </div>
    );
  }

  if (completed) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-3xl shadow-xl flex flex-col items-center"
        >
          <div className="h-20 w-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Payment Confirmed</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
            The milestone has been successfully funded. The project is now marked as completed and {submission?.developer?.name} has been notified.
          </p>
          <div className="flex gap-4">
            <Link
              to="/client-dashboard"
              className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              Dashboard
            </Link>
            <Link
              to={`/projects/${id}`}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-bold rounded-xl hover:from-primary-700 hover:to-indigo-700 transition-all shadow-md btn-glow"
            >
              View Project
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!submission) return null;

  const amount = submission.application?.expectedBudget || submission.project?.budget || 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary-600 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </button>
      
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl card-premium">
        <div className="p-8 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary-500" />
            Secure Payment Checkout
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Fund the completed work for <strong>{submission.project?.title}</strong>
          </p>
        </div>

        <form onSubmit={handlePayment} className="p-8 space-y-6">
          <div className="bg-primary-50 dark:bg-primary-950/20 p-5 rounded-2xl border border-primary-100 dark:border-primary-900/30 flex justify-between items-center">
            <div>
              <span className="block font-bold text-slate-700 dark:text-slate-300 text-sm">Total Payment to</span>
              <span className="text-sm text-slate-500">{submission.developer?.name}</span>
            </div>
            <span className="text-3xl font-extrabold text-primary-600 dark:text-primary-400">${amount.toLocaleString()}</span>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Payment Details (Simulation)</h3>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cardholder Name</label>
              <input type="text" required defaultValue="Jane Doe" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:ring-2 focus:ring-primary-500/40 dark:text-white input-glow" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Card Number</label>
              <input type="text" required defaultValue="4242 4242 4242 4242" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:ring-2 focus:ring-primary-500/40 dark:text-white input-glow" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Expiry Date</label>
                <input type="text" required defaultValue="12/25" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:ring-2 focus:ring-primary-500/40 dark:text-white input-glow" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">CVC</label>
                <input type="text" required defaultValue="123" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:ring-2 focus:ring-primary-500/40 dark:text-white input-glow" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Payments are 100% secure and encrypted.
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full py-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 btn-glow disabled:opacity-70"
          >
            {processing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Processing...
              </>
            ) : (
              `Pay $${amount.toLocaleString()}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
