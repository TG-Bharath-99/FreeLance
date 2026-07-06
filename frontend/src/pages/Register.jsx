import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, Phone, Upload, Loader2, Briefcase, Building, Wrench, Sparkles, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const { register, watch, handleSubmit, formState: { errors } } = useForm();
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [role, setRole] = useState('freelancer'); // 'freelancer' or 'client'
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const passwordVal = watch('password');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('role', role);
      formData.append('phone', data.phone);
      formData.append('location', data.location || '');
      formData.append('bio', data.bio || '');

      if (role === 'client' && data.companyName) {
        formData.append('companyName', data.companyName);
      }
      if (role === 'freelancer' && data.skills) {
        formData.append('skills', data.skills);
      }
      if (selectedFile) {
        formData.append('profileImage', selectedFile);
      }

      const user = await authRegister(formData);
      toast.success(`Account created! Welcome, ${user.name}`);
      navigate(user.role === 'client' ? '/client-dashboard' : '/freelancer-dashboard');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Registration failed. Check if email is already in use.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative gradient-mesh min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 overflow-hidden">
      {/* Floating orbs */}
      <div className="floating-orb floating-orb-1" />
      <div className="floating-orb floating-orb-2" />
      <div className="floating-orb floating-orb-3" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 max-w-2xl w-full"
      >
        <div className="p-8 sm:p-10 rounded-3xl border border-slate-200/50 dark:border-slate-800/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-slate-900/5 dark:shadow-black/20 space-y-7">
          {/* Title */}
          <div className="text-center">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.05 }}
              className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-tr from-primary-600 via-primary-500 to-indigo-500 items-center justify-center text-white shadow-xl shadow-primary-500/25 mb-5"
            >
              <Briefcase className="h-7 w-7" />
            </motion.div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Create your account
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
              Join our global freelance marketplace network
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200/30 dark:border-slate-800/40">
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setRole('freelancer')}
              className={`py-2.5 text-sm font-bold rounded-xl transition-all ${
                role === 'freelancer'
                  ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-md'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              🚀 I'm a Freelancer
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setRole('client')}
              className={`py-2.5 text-sm font-bold rounded-xl transition-all ${
                role === 'client'
                  ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-md'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              💼 I'm a Client
            </motion.button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/40">
              <div className="relative h-20 w-20 rounded-full ring-4 ring-primary-500/15 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 bg-gradient-to-tr from-primary-100 to-indigo-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt="Avatar Preview" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-10 w-10 text-slate-300 dark:text-slate-500" />
                )}
              </div>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                <Upload className="h-3.5 w-3.5" />
                Upload Profile Image
                <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    {...register('name', { required: 'Name is required' })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white font-medium"
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500 mt-1 font-medium">{errors.name.message}</p>}
              </div>

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
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white font-medium"
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1 font-medium">{errors.email.message}</p>}
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
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white font-medium"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1 font-medium">{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    {...register('confirmPassword', { 
                      required: 'Confirm password is required',
                      validate: (val) => val === passwordVal || 'Passwords do not match'
                    })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white font-medium"
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1 font-medium">{errors.confirmPassword.message}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    {...register('phone', { required: 'Phone is required' })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white font-medium"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-500 mt-1 font-medium">{errors.phone.message}</p>}
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Location</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    {...register('location')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white font-medium"
                    placeholder="New York, USA"
                  />
                </div>
              </div>
            </div>

            {/* Conditional Role Fields */}
            {role === 'client' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Company Name (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    {...register('companyName')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white font-medium"
                    placeholder="Acme Corp"
                  />
                </div>
              </motion.div>
            )}

            {role === 'freelancer' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Skills (Comma separated tags)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Wrench className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    {...register('skills')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white font-medium"
                    placeholder="React, Node.js, Tailwind, MongoDB"
                  />
                </div>
              </motion.div>
            )}

            {/* Short Bio */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Professional Summary (Bio)</label>
              <textarea
                rows="3"
                {...register('bio')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white resize-none font-medium"
                placeholder="Tell clients or freelancers about your work profile..."
              ></textarea>
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
                'Create Account'
              )}
            </motion.button>
          </form>

          <div className="text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                Sign In
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

export default Register;
