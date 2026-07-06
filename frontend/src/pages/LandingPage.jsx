import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, Laptop, PenTool, Layout, Database, Terminal, ArrowRight, 
  CheckCircle2, Users, Star, MessageSquare, ChevronDown, ChevronUp, Mail, Phone, MapPin, Sparkles, Zap, Globe, Briefcase, Clock
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const LandingPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [publicData, setPublicData] = useState({ stats: null, categories: [], latestProjects: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const response = await api.get('/public/stats');
        setPublicData(response.data);
      } catch (error) {
        console.error('Error fetching public stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicData();
  }, []);

  const getCategoryIcon = (categoryName) => {
    const lower = categoryName.toLowerCase();
    if (lower.includes('software') || lower.includes('web')) return Code;
    if (lower.includes('design') || lower.includes('ui')) return PenTool;
    if (lower.includes('mobile') || lower.includes('app')) return Laptop;
    if (lower.includes('data') || lower.includes('ai')) return Database;
    if (lower.includes('writing') || lower.includes('content')) return Layout;
    if (lower.includes('devops') || lower.includes('security')) return Terminal;
    return Briefcase;
  };

  const getCategoryColor = (idx) => {
    const colors = [
      { color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-500/8 dark:bg-blue-500/5' },
      { color: 'from-purple-500 to-pink-600', bg: 'bg-purple-500/8 dark:bg-purple-500/5' },
      { color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-500/8 dark:bg-emerald-500/5' },
      { color: 'from-amber-500 to-orange-600', bg: 'bg-amber-500/8 dark:bg-amber-500/5' },
      { color: 'from-cyan-500 to-blue-600', bg: 'bg-cyan-500/8 dark:bg-cyan-500/5' },
      { color: 'from-rose-500 to-pink-600', bg: 'bg-rose-500/8 dark:bg-rose-500/5' },
    ];
    return colors[idx % colors.length];
  };

  const steps = [
    { title: 'Create your profile', desc: 'Sign up as a freelancer or client. Set up your bio, portfolio, and skills to highlight your expertise.', icon: Users, num: '01' },
    { title: 'Post or Apply to projects', desc: 'Clients publish details and budget scopes. Freelancers submit proposals with custom pricing and delivery windows.', icon: Zap, num: '02' },
    { title: 'Collaborate and Get Paid', desc: 'Secure project tracking and application approvals lock contracts into active delivery states.', icon: CheckCircle2, num: '03' },
  ];

  const faqs = [
    { q: "How does the contract system work?", a: "Clients post project criteria, budgets, and experience tiers. Once a client accepts a freelancer's proposal, the project automatically closes to new applicants, initiating the delivery workflow." },
    { q: "Is there a platform fee?", a: "We keep standard commissions transparent. Joining and browsing is completely free for both freelancers and clients." },
    { q: "Can I register as both a Client and Freelancer?", a: "Each account is mapped to a specific role. However, you can register separate accounts using different email addresses to manage both roles." },
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error('Please fill in all contact fields');
      return;
    }
    toast.success('Thank you! Our support team will reach out shortly.');
    setContactForm({ name: '', email: '', message: '' });
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 14 } }
  };

  return (
    <div className="min-h-screen">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative gradient-mesh overflow-hidden">
        {/* Floating orbs */}
        <div className="floating-orb floating-orb-1" />
        <div className="floating-orb floating-orb-2" />
        <div className="floating-orb floating-orb-3" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-24 pb-20 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-500/20 bg-primary-500/8 text-primary-600 dark:text-primary-400 text-xs font-bold mb-8 backdrop-blur-sm shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Designed & Developed by Bharath
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl leading-[1.1]"
          >
            <span className="text-slate-900 dark:text-white">Discover Elite Talent.</span>
            <br />
            <span className="text-slate-900 dark:text-white">Build Visionary </span>
            <span className="bg-gradient-to-r from-primary-600 via-indigo-500 to-primary-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient-shift_3s_linear_infinite]">
              Digital Products.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-7 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed font-medium"
          >
            LancerFlow connects world-class developers, designers, and writers with companies looking to build scalable technology solutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 rounded-2xl shadow-xl shadow-primary-500/20 hover:shadow-2xl hover:shadow-primary-500/30 transition-all gap-2 btn-glow"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/projects"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/40 bg-white/60 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800/60 rounded-2xl backdrop-blur-sm transition-all shadow-sm hover:shadow-md"
              >
                Browse Projects
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="mt-20 w-full grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
          >
            {[
              { value: publicData.stats?.totalDevelopers || 0, label: 'Registered Developers', color: 'text-primary-600 dark:text-primary-400' },
              { value: publicData.stats?.totalClients || 0, label: 'Registered Clients', color: 'text-indigo-500 dark:text-indigo-400' },
              { value: publicData.stats?.totalProjects || 0, label: 'Total Projects Posted', color: 'text-emerald-500 dark:text-emerald-400' },
              { value: publicData.stats?.totalApplications || 0, label: 'Applications Submitted', color: 'text-amber-500 dark:text-amber-400' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -2 }}
                className="p-5 sm:p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/20 bg-white/50 dark:bg-slate-900/30 backdrop-blur-md shadow-sm card-premium"
              >
                <h3 className={`text-2xl sm:text-3xl font-extrabold ${stat.color} stat-number`}>{loading ? '-' : stat.value}</h3>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-semibold">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== CATEGORIES ==================== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-950 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/8 dark:bg-primary-500/5 text-primary-600 dark:text-primary-400 text-xs font-bold mb-4">
              <Globe className="h-3 w-3" /> Popular Categories
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Explore Service Categories
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
              Explore job contracts matching your tech stack or hire top specialist talent.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {loading ? (
              <p className="text-center text-slate-500 col-span-full">Loading categories...</p>
            ) : publicData.categories.length === 0 ? (
              <p className="text-center text-slate-500 col-span-full">No projects available.</p>
            ) : (
              publicData.categories.map((cat, idx) => {
                const IconComp = getCategoryIcon(cat.name);
                const theme = getCategoryColor(idx);
                return (
                  <motion.div
                    key={idx}
                    variants={cardVariants}
                    whileHover={{ y: -4 }}
                    className="group p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/30 bg-white dark:bg-slate-900/60 shadow-sm card-premium flex items-start gap-4"
                  >
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${theme.color} text-white flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow`}>
                      <IconComp className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100">{cat.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5 font-medium">{cat.count} open {cat.count === 1 ? 'project' : 'projects'}</p>
                      <Link
                        to={`/projects?category=${encodeURIComponent(cat.name)}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 dark:text-primary-400 mt-3 group/link hover:gap-2 transition-all"
                      >
                        View Jobs
                        <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section id="how-it-works" className="py-24 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/8 dark:bg-primary-500/5 text-primary-600 dark:text-primary-400 text-xs font-bold mb-4">
              <Zap className="h-3 w-3" /> Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              How LancerFlow Works
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
              Fast, automated, and secure collaboration cycle from project brief to milestone payouts.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary-500/30 via-indigo-500/30 to-emerald-500/30" />
            
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="relative p-7 rounded-3xl border border-slate-200/40 dark:border-slate-800/20 bg-white/70 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm card-premium space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shadow-lg shadow-primary-500/20">
                      {step.num}
                    </div>
                    <div className="h-8 w-8 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                      <StepIcon className="h-4 w-4" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{step.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== RECENT PROJECTS ==================== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-950 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/8 dark:bg-amber-500/5 text-amber-600 dark:text-amber-400 text-xs font-bold mb-4">
              <Star className="h-3 w-3 fill-current" /> Latest Opportunities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Latest Active Projects
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
              Find the perfect project that matches your skills and start collaborating.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {loading ? (
              <p className="text-center text-slate-500 col-span-full">Loading projects...</p>
            ) : publicData.latestProjects.length === 0 ? (
              <p className="text-center text-slate-500 col-span-full">No active projects available yet.</p>
            ) : (
              publicData.latestProjects.map((project, idx) => (
                <motion.div
                  key={project._id}
                  variants={cardVariants}
                  whileHover={{ y: -4 }}
                  className="p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/30 bg-white dark:bg-slate-900/60 shadow-sm card-premium flex flex-col h-full"
                >
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <span className="inline-block px-2.5 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        {project.category}
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                        ${project.budget}
                      </span>
                    </div>
                    <Link to={`/projects/${project._id}`} className="block mb-2 group-hover:text-primary-600 transition-colors">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2">
                        {project.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4">
                      {project.description}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-xs">
                        {project.client?.name?.charAt(0) || 'C'}
                      </div>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate max-w-[100px]">
                        {project.client?.name || 'Client'}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* ==================== FAQs ==================== */}
      <section id="faq" className="py-24 gradient-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/8 dark:bg-primary-500/5 text-primary-600 dark:text-primary-400 text-xs font-bold mb-4">
              <MessageSquare className="h-3 w-3" /> Support
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
              Got queries? We have answers to help you navigate our workspace pipeline.
            </p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-2xl border border-slate-200/50 dark:border-slate-800/30 bg-white dark:bg-slate-900/60 overflow-hidden shadow-sm card-premium"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-900 dark:text-slate-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <motion.div
                    animate={{ rotate: activeFaq === idx ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className={`h-5 w-5 flex-shrink-0 ${activeFaq === idx ? 'text-primary-500' : 'text-slate-400'}`} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-slate-100 dark:border-slate-800/40"
                    >
                      <p className="p-5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-slate-950/20">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CONTACT ==================== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-950 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-6"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/8 dark:bg-primary-500/5 text-primary-600 dark:text-primary-400 text-xs font-bold">
              <Mail className="h-3 w-3" /> Contact Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Get in touch
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Have customized developer project needs or support inquiries? Drop a message below and our account managers will coordinate matching structures.
            </p>
            <div className="space-y-4 pt-4">
              {[
                { icon: Mail, text: 'ummadibharath07@gmail.com', color: 'text-primary-500' },
                { icon: MapPin, text: 'SASTRA Deemed University, Tamil Nadu, India', color: 'text-emerald-500' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/50">
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/30 bg-white dark:bg-slate-900 shadow-xl"
          >
            <form onSubmit={handleContactSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Message</label>
                <textarea
                  rows="4"
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white resize-none"
                  placeholder="How can LancerFlow help you?"
                ></textarea>
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="w-full py-3.5 text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 rounded-xl transition-all shadow-lg shadow-primary-500/15 hover:shadow-xl btn-glow"
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
