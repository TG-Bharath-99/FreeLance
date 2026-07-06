import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/30 bg-white dark:bg-slate-900/60 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-6 shimmer rounded-lg w-1/4"></div>
        <div className="h-6 shimmer rounded-full w-16"></div>
      </div>
      <div className="h-4 shimmer rounded w-3/4"></div>
      <div className="h-4 shimmer rounded w-5/6"></div>
      <div className="flex flex-wrap gap-2 pt-2">
        <div className="h-6 shimmer rounded-full w-14"></div>
        <div className="h-6 shimmer rounded-full w-16"></div>
        <div className="h-6 shimmer rounded-full w-12"></div>
      </div>
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full shimmer"></div>
          <div className="h-4 shimmer rounded w-20"></div>
        </div>
        <div className="h-9 shimmer rounded-xl w-24"></div>
      </div>
    </div>
  );
};

export const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/30 bg-white dark:bg-slate-900/60 shadow-sm flex items-center gap-4"
        >
          <div className="h-12 w-12 rounded-xl shimmer flex-shrink-0"></div>
          <div className="space-y-2 flex-grow">
            <div className="h-4 shimmer rounded w-1/2"></div>
            <div className="h-6 shimmer rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const ListSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/30 bg-white dark:bg-slate-900/60 shadow-sm flex items-center justify-between"
        >
          <div className="space-y-2 flex-grow max-w-md">
            <div className="h-5 shimmer rounded w-2/3"></div>
            <div className="h-4 shimmer rounded w-1/2"></div>
          </div>
          <div className="h-10 shimmer rounded-xl w-24"></div>
        </div>
      ))}
    </div>
  );
};
