import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { Folder, DollarSign, Calendar, Users, Award, BookOpen, Loader2, ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const PostProject = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const categories = [
    'Software Development',
    'UI/UX Design',
    'Mobile App Development',
    'AI & Data Science',
    'Technical Writing',
    'DevOps & Security',
  ];

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      // Send post data
      await api.post('/projects', {
        title: data.title,
        description: data.description,
        category: data.category,
        skillsRequired: data.skillsRequired,
        budget: Number(data.budget),
        experienceLevel: data.experienceLevel,
        deadline: data.deadline,
        freelancersRequired: Number(data.freelancersRequired || 1),
      });

      toast.success('Project posted successfully!');
      navigate('/client-dashboard');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to post project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative gradient-mesh min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Floating orbs */}
      <div className="floating-orb floating-orb-1" />
      <div className="floating-orb floating-orb-2" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-2xl mx-auto"
      >
        <div className="p-8 sm:p-10 rounded-3xl border border-slate-200/50 dark:border-slate-800/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-slate-900/5 dark:shadow-black/20 space-y-7">
          {/* Back and Title */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-primary-600 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
            </motion.button>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Post a New Project</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary-500" />
                Create a work contract to receive developer proposals
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Project Title */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Project Title</label>
              <input
                type="text"
                required
                {...register('title', { required: 'Project title is required' })}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white font-medium"
                placeholder="e.g. Build a Responsive React/Node Dashboard"
              />
              {errors.title && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Project Scope & Details</label>
              <textarea
                rows="6"
                required
                {...register('description', { 
                  required: 'Project description is required',
                  minLength: { value: 50, message: 'Please provide a detailed description (min 50 chars)' }
                })}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white resize-none font-medium"
                placeholder="Outline the project constraints, functional features, deliverables, and architecture requirements..."
              ></textarea>
              {errors.description && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.description.message}</p>}
            </div>

            {/* Category & Experience Split */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Category</label>
                <select
                  required
                  {...register('category', { required: 'Please select a category' })}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-all dark:text-slate-200 font-medium"
                >
                  <option value="" className="dark:bg-slate-900">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="dark:bg-slate-900">{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.category.message}</p>}
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Required Experience</label>
                <select
                  required
                  {...register('experienceLevel', { required: 'Experience level is required' })}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-all dark:text-slate-200 font-medium"
                >
                  <option value="" className="dark:bg-slate-900">Select Experience level</option>
                  <option value="entry" className="dark:bg-slate-900">Entry Level</option>
                  <option value="intermediate" className="dark:bg-slate-900">Intermediate</option>
                  <option value="expert" className="dark:bg-slate-900">Expert / Senior</option>
                </select>
                {errors.experienceLevel && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.experienceLevel.message}</p>}
              </div>
            </div>

            {/* Budget, Deadline and Freelancers Required split */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Budget */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Budget ($ USD)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm font-bold">$</div>
                  <input
                    type="number"
                    required
                    {...register('budget', { 
                      required: 'Budget is required', 
                      min: { value: 5, message: 'Minimum budget is $5' } 
                    })}
                    className="w-full pl-8 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white font-medium"
                    placeholder="500"
                  />
                </div>
                {errors.budget && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.budget.message}</p>}
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Deadline Date</label>
                <input
                  type="date"
                  required
                  {...register('deadline', { 
                    required: 'Deadline date is required',
                    validate: (val) => new Date(val) > new Date() || 'Deadline must be in the future'
                  })}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-slate-200 font-medium"
                />
                {errors.deadline && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.deadline.message}</p>}
              </div>

              {/* Freelancers Required */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Positions Open</label>
                <input
                  type="number"
                  {...register('freelancersRequired', { min: 1 })}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white font-medium"
                  placeholder="1"
                  defaultValue="1"
                />
              </div>
            </div>

            {/* Skills Required */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Required Skills (Comma separated)</label>
              <input
                type="text"
                required
                {...register('skillsRequired', { required: 'Please specify required skills' })}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white font-medium"
                placeholder="React, Redux, Node.js, Express, MongoDB"
              />
              {errors.skillsRequired && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.skillsRequired.message}</p>}
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 rounded-xl transition-all shadow-lg shadow-primary-500/20 hover:shadow-xl flex items-center justify-center gap-2 btn-glow disabled:opacity-70"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Publish Project Listing'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default PostProject;
