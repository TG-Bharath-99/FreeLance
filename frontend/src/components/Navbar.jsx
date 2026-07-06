import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu, X, Briefcase, User, LogOut, ChevronDown, PlusCircle, Sparkles, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

import { getFileUrl } from '../utils/helpers';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchUnread = async () => {
      try {
        const res = await api.get('/messages/unread-count');
        setUnreadCount(res.data.unreadCount || 0);
      } catch (err) {
        console.error('Failed to fetch unread messages', err);
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const guestLinks = [
    { name: 'Browse Projects', path: '/projects' },
    { name: 'How it Works', path: '/#how-it-works' },
    { name: 'FAQ', path: '/#faq' },
  ];

  const freelancerLinks = [
    { name: 'Dashboard', path: '/freelancer-dashboard' },
    { name: 'Browse Projects', path: '/projects' },
    { name: 'My Applications', path: '/my-applications' },
  ];

  const clientLinks = [
    { name: 'Dashboard', path: '/client-dashboard' },
    { name: 'Post a Project', path: '/post-project' },
  ];

  const navLinks = isAuthenticated
    ? user.role === 'client'
      ? clientLinks
      : freelancerLinks
    : guestLinks;

  return (
    <nav className="sticky top-0 z-50 glass transition-all duration-300">
      {/* Animated gradient line at top */}
      <div className="gradient-line" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ rotate: 8, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary-600 via-primary-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/25"
              >
                <Briefcase className="h-5 w-5" />
              </motion.div>
              <span className="font-extrabold text-xl tracking-tight">
                <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Lancer</span>
                <span className="bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent">Flow</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-500/8 dark:bg-primary-400/8'
                    : 'text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-gradient-to-r from-primary-600 to-indigo-500"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Action Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-all border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700/30"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            </motion.button>

            {isAuthenticated && (
              <Link to="/chat" className="relative p-2.5 rounded-xl text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-all">
                <MessageCircle className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-white dark:border-slate-900">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              /* User Dropdown */
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-all focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full overflow-hidden ring-2 ring-primary-500/30 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 bg-gradient-to-tr from-primary-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    {user.profileImage ? (
                      <img
                        src={getFileUrl(user.profileImage)}
                        alt={user.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-[120px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <>
                      {/* Overlay backdrop to close dropdown */}
                      <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200/60 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-900/10 dark:shadow-black/30 z-20 overflow-hidden"
                      >
                        <div className="px-4 py-3.5 bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-950/30 dark:to-indigo-950/20 border-b border-slate-100 dark:border-slate-800/50">
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate capitalize flex items-center gap-1.5 mt-0.5">
                            <Sparkles className="h-3 w-3 text-primary-500" />
                            {user.role} Account
                          </p>
                        </div>
                        
                        <div className="py-1.5">
                          <Link
                            to="/profile"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50 transition-colors font-medium"
                          >
                            <User className="h-4 w-4 text-slate-400" />
                            View Profile
                          </Link>
                          
                          {user.role === 'client' && (
                            <Link
                              to="/post-project"
                              onClick={() => setShowDropdown(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50 transition-colors font-medium"
                            >
                              <PlusCircle className="h-4 w-4 text-slate-400" />
                              Post a Project
                            </Link>
                          )}
                        </div>

                        <hr className="border-slate-100 dark:border-slate-800/50" />
                        <div className="py-1.5">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition-colors text-left font-medium"
                          >
                            <LogOut className="h-4 w-4" />
                            Log Out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Auth Buttons */
              <div className="flex items-center space-x-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-800/30"
                >
                  Log In
                </Link>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 transition-all btn-glow"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden border-t border-slate-200/30 dark:border-slate-800/30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-3 pt-3 pb-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-all ${
                    isActive(link.path)
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-500/8 dark:bg-primary-400/8'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2.5 rounded-xl text-base font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/40"
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left block px-4 py-2.5 rounded-xl text-base font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50 flex flex-col gap-2 px-1">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-2.5 text-base font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-2.5 text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-indigo-600 rounded-xl shadow-lg shadow-primary-500/20"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
