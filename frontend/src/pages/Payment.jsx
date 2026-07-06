import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const Payment = () => {
  const { id } = useParams(); // Freelancer ID we are paying
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handlePayment = (e) => {
    e.preventDefault();
    setProcessing(true);
    
    // Simulate network delay for payment
    setTimeout(() => {
      setProcessing(false);
      setCompleted(true);
      toast.success('Payment Completed Successfully!');
    }, 2000);
  };

  if (completed) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-3xl shadow-xl flex flex-col items-center"
        >
          <div className="h-20 w-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Payment Confirmed</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
            The milestone has been successfully funded and the developer has been notified.
          </p>
          <Link
            to={`/chat/${id}`}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-bold rounded-xl hover:from-primary-700 hover:to-indigo-700 transition-all shadow-md"
          >
            Return to Chat
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <Link to={`/chat/${id}`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary-600 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Chat
      </Link>
      
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-8 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary-500" />
            Secure Payment Checkout
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Fund the project milestone securely. Funds will be held in escrow until approval.
          </p>
        </div>

        <form onSubmit={handlePayment} className="p-8 space-y-6">
          <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <span className="font-bold text-slate-700 dark:text-slate-300">Total Amount</span>
            <span className="text-2xl font-extrabold text-primary-600 dark:text-primary-400">$1,500.00</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cardholder Name</label>
              <input type="text" required placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-2 focus:ring-primary-500/40 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Card Number</label>
              <input type="text" required placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-2 focus:ring-primary-500/40 dark:text-white" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Expiry Date</label>
                <input type="text" required placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-2 focus:ring-primary-500/40 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">CVC</label>
                <input type="text" required placeholder="123" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-2 focus:ring-primary-500/40 dark:text-white" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Payments are 100% secure and encrypted.
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full py-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Processing Payment...
              </>
            ) : (
              'Payment Completed (Demo)'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
