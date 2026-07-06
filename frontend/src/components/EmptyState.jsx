import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const EmptyState = ({
  icon: Icon = HelpCircle,
  title = 'No records found',
  description = 'There is currently no data to display here.',
  actionText,
  actionLink,
  onActionClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center p-14 text-center rounded-3xl border border-dashed border-slate-200/60 dark:border-slate-800/40 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900/60 dark:to-slate-950/30 backdrop-blur-sm transition-all duration-300"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-primary-500/15 to-indigo-500/10 dark:from-primary-500/10 dark:to-indigo-500/5 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-5 shadow-sm border border-primary-200/20 dark:border-primary-800/10"
      >
        <Icon className="h-8 w-8" />
      </motion.div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-7 leading-relaxed">
        {description}
      </p>

      {actionText && (
        actionLink ? (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to={actionLink}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-primary-500/15 hover:shadow-xl hover:shadow-primary-500/25 transition-all btn-glow"
            >
              {actionText}
            </Link>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onActionClick}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-primary-500/15 hover:shadow-xl hover:shadow-primary-500/25 transition-all btn-glow"
          >
            {actionText}
          </motion.button>
        )
      )}
    </motion.div>
  );
};

export default EmptyState;
