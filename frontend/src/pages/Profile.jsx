import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { 
  User, Briefcase, Mail, Phone, MapPin, Globe, Code2, 
  Users, FileText, Plus, Trash, Upload, Loader2, Award, Building2, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('general'); // 'general', 'professional'
  const [submitting, setSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  // Experience list state
  const [experiences, setExperiences] = useState(user.experience || []);
  const [newExp, setNewExp] = useState({ title: '', company: '', duration: '', description: '' });

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user.name,
      phone: user.phone,
      bio: user.bio || '',
      location: user.location || '',
      companyName: user.companyName || '',
      github: user.github || '',
      linkedin: user.linkedin || '',
      skills: user.skills ? user.skills.join(', ') : '',
      portfolioLinks: user.portfolioLinks ? user.portfolioLinks.join(', ') : '',
    }
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleResumeChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const addExperience = () => {
    if (!newExp.title || !newExp.company || !newExp.duration) {
      toast.error('Please fill in title, company, and duration for the experience item');
      return;
    }
    setExperiences([...experiences, newExp]);
    setNewExp({ title: '', company: '', duration: '', description: '' });
    toast.success('Experience item added to draft list');
  };

  const removeExperience = (idx) => {
    const list = [...experiences];
    list.splice(idx, 1);
    setExperiences(list);
    toast.success('Experience item removed');
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('phone', data.phone);
      formData.append('bio', data.bio);
      formData.append('location', data.location);
      formData.append('github', data.github);
      formData.append('linkedin', data.linkedin);
      formData.append('skills', data.skills);
      formData.append('portfolioLinks', data.portfolioLinks);

      if (user.role === 'client') {
        formData.append('companyName', data.companyName);
      } else {
        formData.append('experience', JSON.stringify(experiences));
      }

      if (avatarFile) {
        formData.append('profileImage', avatarFile);
      }
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      await updateProfile(formData);
      toast.success('Profile details updated successfully!');
      
      // Clean temporary upload refs
      setAvatarFile(null);
      setResumeFile(null);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to update profile details');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          Profile Workspace
          <Sparkles className="h-6 w-6 text-primary-500" />
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Configure your professional listings, biography context, and credentials.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Summary Context Card */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 p-7 rounded-3xl border border-slate-200/50 dark:border-slate-800/30 bg-white dark:bg-slate-900 shadow-sm space-y-5 flex flex-col items-center text-center"
        >
          {/* Gradient banner */}
          <div className="w-full h-20 rounded-2xl bg-gradient-to-r from-primary-600 via-indigo-500 to-primary-600 -mt-7 -mx-7 mb-2" style={{width: 'calc(100% + 56px)', marginTop: '-28px', borderRadius: '24px 24px 0 0'}} />
          
          {/* Avatar frame */}
          <div className="relative h-24 w-24 -mt-16 rounded-full overflow-hidden ring-4 ring-white dark:ring-slate-900 bg-gradient-to-tr from-primary-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-extrabold shadow-xl">
            {avatarPreview ? (
              <img src={avatarPreview} alt={user.name} className="h-full w-full object-cover" />
            ) : user.profileImage ? (
              <img src={user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:5000${user.profileImage}`} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{user.name}</h2>
            <div className="flex justify-center gap-2 flex-wrap">
              <span className="inline-flex px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase bg-gradient-to-r from-primary-500/10 to-indigo-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20">
                {user.role} role
              </span>
              {user.companyName && (
                <span className="inline-flex px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/30">
                  {user.companyName}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
            "{user.bio || 'Please provide a short biography to describe your credentials.'}"
          </p>

          <div className="w-full space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/40 text-left text-xs text-slate-600 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/50">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/50">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <span>{user.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/50">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <span>{user.location || 'Remote Location'}</span>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Tab Forms Panel */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-8 p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/30 bg-white dark:bg-slate-900 shadow-sm space-y-6"
        >
          {/* Tab Selector */}
          <div className="flex gap-2 border-b border-slate-100 dark:border-slate-800/40 pb-3">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-4 py-2.5 text-sm font-bold rounded-xl transition-all ${
                activeTab === 'general'
                  ? 'bg-primary-500/8 text-primary-600 dark:text-primary-400'
                  : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              General Information
            </button>
            
            {user.role === 'freelancer' && (
              <button
                onClick={() => setActiveTab('professional')}
                className={`px-4 py-2.5 text-sm font-bold rounded-xl transition-all ${
                  activeTab === 'professional'
                    ? 'bg-primary-500/8 text-primary-600 dark:text-primary-400'
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                Professional Credentials
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* -------------------- GENERAL TAB -------------------- */}
            {activeTab === 'general' && (
              <div className="space-y-5">
                {/* Uploads profile picture input */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Update Avatar</label>
                  <label className="cursor-pointer flex items-center justify-center gap-2 p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950/30 text-slate-500 transition-colors">
                    <Upload className="h-4 w-4" />
                    <span className="text-xs font-bold">{avatarFile ? avatarFile.name : 'Choose image file'}</span>
                    <input type="file" onChange={handleAvatarChange} accept="image/*" className="hidden" />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      {...register('name', { required: 'Name is required' })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white font-medium"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Phone</label>
                    <input
                      type="tel"
                      required
                      {...register('phone', { required: 'Phone is required' })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white font-medium"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Location</label>
                    <input
                      type="text"
                      {...register('location')}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white font-medium"
                      placeholder="e.g. San Francisco, USA"
                    />
                  </div>

                  {/* Company name (if Client) */}
                  {user.role === 'client' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Company Name</label>
                      <input
                        type="text"
                        {...register('companyName')}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white font-medium"
                      />
                    </div>
                  )}
                </div>

                {/* Biography */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Biography (Summary)</label>
                  <textarea
                    rows="4"
                    {...register('bio')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white resize-none font-medium"
                    placeholder="Describe your technical profile, professional experience, and service matches..."
                  ></textarea>
                </div>

                {/* Social Links split */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Code2 className="h-4 w-4" /> GitHub Username</label>
                    <input
                      type="text"
                      {...register('github')}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white font-medium"
                      placeholder="octocat"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Users className="h-4 w-4" /> LinkedIn Username</label>
                    <input
                      type="text"
                      {...register('linkedin')}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white font-medium"
                      placeholder="john-doe"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* -------------------- PROFESSIONAL CREDENTIALS TAB -------------------- */}
            {activeTab === 'professional' && user.role === 'freelancer' && (
              <div className="space-y-6">
                
                {/* Resume PDF upload */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Update PDF Resume</label>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="cursor-pointer flex items-center justify-center gap-2 p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950/30 text-slate-500 transition-colors flex-grow">
                      <Upload className="h-4 w-4" />
                      <span className="text-xs font-bold">{resumeFile ? resumeFile.name : 'Choose resume file (PDF)'}</span>
                      <input type="file" onChange={handleResumeChange} accept=".pdf,.doc,.docx" className="hidden" />
                    </label>
                    {user.resumeUrl && (
                      <a
                        href={user.resumeUrl.startsWith('http') ? user.resumeUrl : `http://localhost:5000${user.resumeUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        <FileText className="h-4 w-4" /> View active Resume
                      </a>
                    )}
                  </div>
                </div>

                {/* Skills tags field */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Skills (Comma-separated tags)</label>
                  <input
                    type="text"
                    {...register('skills')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white font-medium"
                    placeholder="React, Node.js, Express, MongoDB, Tailwind CSS"
                  />
                  <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Separate tags using commas. These skills will be used for automated project recommendations.</p>
                </div>

                {/* Portfolio URLs field */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Portfolio Links (Comma-separated)</label>
                  <input
                    type="text"
                    {...register('portfolioLinks')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white font-medium"
                    placeholder="https://mywork.com, https://dribbble.com/myname"
                  />
                </div>

                {/* Work Experience Builder */}
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/40">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-slate-400" /> Work Experience History
                  </h3>
                  
                  {/* Draft experience entries */}
                  {experiences.length > 0 && (
                    <div className="space-y-3">
                      {experiences.map((exp, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/30 bg-slate-50/50 dark:bg-slate-950/20 flex justify-between items-start gap-4"
                        >
                          <div className="space-y-1 min-w-0">
                            <h4 className="font-bold text-xs text-slate-900 dark:text-white">{exp.title}</h4>
                            <p className="text-xs text-slate-500 font-semibold">{exp.company} • {exp.duration}</p>
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mt-1">{exp.description}</p>
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => removeExperience(idx)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors flex-shrink-0"
                          >
                            <Trash className="h-4 w-4" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Form to add a new experience row */}
                  <div className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/30 space-y-3 bg-slate-50/30 dark:bg-slate-950/10">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Add Experience Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Job Title (e.g. React Developer)"
                        value={newExp.title}
                        onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                        className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Company Name (e.g. Google)"
                        value={newExp.company}
                        onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                        className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g. Jan 2024 - Present)"
                        value={newExp.duration}
                        onChange={(e) => setNewExp({ ...newExp, duration: e.target.value })}
                        className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow font-medium"
                      />
                    </div>
                    <textarea
                      rows="2"
                      placeholder="Brief role summary, tech stack, and achievements..."
                      value={newExp.description}
                      onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-xs text-slate-800 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow font-medium"
                    ></textarea>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={addExperience}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                    >
                      <Plus className="h-3.5 w-3.5" /> Save Experience Item
                    </motion.button>
                  </div>
                </div>
              </div>
            )}

            {/* Submit changes button */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/40 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={submitting}
                className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 rounded-xl transition-all shadow-lg shadow-primary-500/20 flex items-center gap-2 btn-glow disabled:opacity-70"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Profile Changes'}
              </motion.button>
            </div>
          </form>
        </motion.div>

      </div>
    </div>
  );
};

export default Profile;
