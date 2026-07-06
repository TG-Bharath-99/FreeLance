import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, Loader2, ArrowRight, Briefcase, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Redirect target if any, otherwise default dashboard redirect after routing
  const from = location.state?.from?.pathname || '';

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const user = await login(data.email, data.password);
      toast.success(`Welcome back, ${user.name}!`);
      
      // Route based on role if no specific redirect was saved
      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate(user.role === 'client' ? '/client-dashboard' : '/freelancer-dashboard', { replace: true });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative gradient-mesh min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 overflow-hidden">
      {/* Floating orbs */}
      <div className="floating-orb floating-orb-1" />
      <div className="floating-orb floating-orb-2" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 max-w-md w-full"
      >
        {/* Glass card */}
        <div className="p-8 sm:p-10 rounded-3xl border border-slate-200/50 dark:border-slate-800/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-slate-900/5 dark:shadow-black/20 space-y-7">
          {/* Branding Logo */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.05 }}
              className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-primary-600 via-primary-500 to-indigo-500 items-center justify-center text-white shadow-xl shadow-primary-500/25 mb-5 flex"
            >
              <Briefcase className="h-7 w-7" />
            </motion.div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Welcome back
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
              Sign in to access your workspace
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  {...register('email', { 
                    required: 'Email is required', 
                    pattern: { value: /^\S+@\S+$/i, message: 'Please enter a valid email' } 
                  })}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white font-medium"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  {...register('password', { required: 'Password is required' })}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white font-medium"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 rounded-xl transition-all shadow-lg shadow-primary-500/20 hover:shadow-xl flex items-center justify-center gap-2 btn-glow disabled:opacity-70"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>

          <div className="text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                Create account
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom decorative badge */}
        <div className="flex justify-center mt-6">
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
            <Sparkles className="h-3 w-3" />
            Secured with 256-bit encryption
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
