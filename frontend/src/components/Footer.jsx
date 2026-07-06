import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Code2, Users, MessageCircle, ShieldCheck, MessageSquare, HelpCircle, Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-white dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-800/30 transition-colors duration-300 overflow-hidden">
      {/* Gradient top line */}
      <div className="gradient-line" />
      
      {/* Subtle background orbs */}
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-500/5 dark:bg-primary-500/3 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-60 h-60 bg-indigo-500/5 dark:bg-indigo-500/3 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Logo Section */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary-600 via-primary-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-primary-500/20">
                <Briefcase className="h-4 w-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">
                <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Lancer</span>
                <span className="bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent">Flow</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              The premier freelance hub connecting elite creators with visionary clients globally. Built for developers, designers, and scaling companies.
            </p>
            <div className="flex space-x-2">
              {[
                { Icon: MessageCircle, label: 'Twitter' },
                { Icon: Users, label: 'LinkedIn' },
                { Icon: Code2, label: 'GitHub' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="p-2.5 rounded-xl text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/20 border border-transparent hover:border-primary-200/50 dark:hover:border-primary-800/30 transition-all"
                  aria-label={label}
                >
                  <Icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>
          </div>

          {/* For Clients */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-5 flex items-center gap-2">
              <div className="h-1 w-4 rounded-full bg-gradient-to-r from-primary-500 to-indigo-500" />
              For Clients
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/post-project" className="text-sm text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors font-medium">
                  Post a Project
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-sm text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors font-medium">
                  Browse Freelancers
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors font-medium">
                  Client Enterprise
                </a>
              </li>
            </ul>
          </div>

          {/* For Freelancers */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-5 flex items-center gap-2">
              <div className="h-1 w-4 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500" />
              For Freelancers
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/projects" className="text-sm text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors font-medium">
                  Find Projects
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-sm text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors font-medium">
                  Build Portfolio
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors font-medium">
                  Freelancer Resources
                </a>
              </li>
            </ul>
          </div>

          {/* Trust & Security */}
          <div className="space-y-5">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-5 flex items-center gap-2">
              <div className="h-1 w-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
              Secure Platform
            </h3>
            <div className="space-y-3.5">
              <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                </div>
                <span className="font-medium">SSL & data encryption active</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <div className="p-1.5 rounded-lg bg-primary-50 dark:bg-primary-950/30">
                  <MessageSquare className="h-4 w-4 text-primary-500" />
                </div>
                <span className="font-medium">24/7 dedicated support</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/30">
                  <Zap className="h-4 w-4 text-indigo-500" />
                </div>
                <span className="font-medium">99.9% uptime guarantee</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-slate-200/50 dark:border-slate-800/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} LancerFlow Inc. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            {['Privacy Policy', 'Terms of Service', 'Trust & Safety'].map((item) => (
              <a key={item} href="#" className="text-xs text-slate-400 dark:text-slate-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
