import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { 
  Search, SlidersHorizontal, DollarSign, Calendar, Users, 
  MapPin, X, ArrowLeft, ArrowRight, BookOpen, Clock, Sparkles
} from 'lucide-react';
import { CardSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { getFileUrl } from '../utils/helpers';

const BrowseProjects = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minBudget, setMinBudget] = useState(searchParams.get('minBudget') || '');
  const [maxBudget, setSearchMaxBudget] = useState(searchParams.get('maxBudget') || '');
  const [experienceLevel, setExperienceLevel] = useState(searchParams.get('experienceLevel') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  const categories = [
    'Software Development',
    'UI/UX Design',
    'Mobile App Development',
    'AI & Data Science',
    'Technical Writing',
    'DevOps & Security',
  ];

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 6,
        status: 'open',
      };

      if (search) params.search = search;
      if (category) params.category = category;
      if (minBudget) params.minBudget = minBudget;
      if (maxBudget) params.maxBudget = maxBudget;
      if (experienceLevel) params.experienceLevel = experienceLevel;

      const res = await api.get('/projects', { params });
      setProjects(res.data.projects);
      setTotalPages(res.data.pages);
      setTotalCount(res.data.total);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    // Synchronize query parameters in the address bar
    const currentParams = {};
    if (search) currentParams.search = search;
    if (category) currentParams.category = category;
    if (minBudget) currentParams.minBudget = minBudget;
    if (maxBudget) currentParams.maxBudget = maxBudget;
    if (experienceLevel) currentParams.experienceLevel = experienceLevel;
    if (page > 1) currentParams.page = page;
    setSearchParams(currentParams);
  }, [search, category, minBudget, maxBudget, experienceLevel, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProjects();
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setMinBudget('');
    setSearchMaxBudget('');
    setExperienceLevel('');
    setPage(1);
  };

  const handleExpChange = (level) => {
    setPage(1);
    if (experienceLevel === level) {
      setExperienceLevel('');
    } else {
      setExperienceLevel(level);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Upper search section */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore Projects
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary-500" />
            Discover {totalCount} open freelance job contracts
          </p>
        </motion.div>
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="lg:hidden w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-bold bg-white dark:bg-slate-900 hover:bg-slate-50 transition-all dark:text-white shadow-sm"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Query Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-3">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by keywords, skills, or title..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 input-glow transition-all dark:text-white font-medium shadow-sm"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 rounded-2xl transition-all shadow-lg shadow-primary-500/15 btn-glow"
        >
          Search
        </motion.button>
      </form>

      {/* Filter and Cards Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Desktop Sidebar Filter */}
        <div className={`lg:block ${showMobileFilters ? 'block fixed inset-0 z-55 p-6 bg-white dark:bg-slate-950 overflow-y-auto' : 'hidden'} lg:static lg:h-auto lg:z-0 lg:p-0 lg:bg-transparent lg:dark:bg-transparent space-y-6`}>
          {showMobileFilters && (
            <div className="flex items-center justify-between border-b pb-4 mb-4 lg:hidden">
              <h2 className="font-bold text-lg">Filter Options</h2>
              <button onClick={() => setShowMobileFilters(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
          )}

          <div className="p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/30 bg-white dark:bg-slate-900 shadow-sm space-y-6">
            {/* Clear button */}
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Filters</h3>
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Category selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 dark:text-slate-200 font-medium"
              >
                <option value="" className="dark:bg-slate-900">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="dark:bg-slate-900">{cat}</option>
                ))}
              </select>
            </div>

            {/* Experience checkboxes */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Experience Level</label>
              <div className="space-y-2.5 text-sm">
                {['entry', 'intermediate', 'expert'].map((lvl) => (
                  <label key={lvl} className="flex items-center gap-3 capitalize cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={experienceLevel === lvl}
                      onChange={() => handleExpChange(lvl)}
                      className="rounded-md border-slate-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500 h-4 w-4 bg-transparent"
                    />
                    <span className="text-slate-600 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors font-medium">{lvl}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Budget Range */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Budget Range ($ USD)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minBudget}
                  onChange={(e) => {
                    setMinBudget(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/40 dark:text-white font-medium"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxBudget}
                  onChange={(e) => {
                    setSearchMaxBudget(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/40 dark:text-white font-medium"
                />
              </div>
            </div>
          </div>
          
          {showMobileFilters && (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowMobileFilters(false)}
              className="w-full py-3 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg"
            >
              Apply Filters
            </motion.button>
          )}
        </div>

        {/* Right Side: Search Results Cards */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
            </div>
          ) : projects.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No matching projects found"
              description="Adjust your search tags, category options, or budget range sliders to browse other open contracts."
              actionText="Reset search filters"
              onActionClick={clearFilters}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {projects.map((proj, idx) => (
                  <motion.div
                    key={proj._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/30 bg-white dark:bg-slate-900 shadow-sm card-premium flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Budget and Experience badge */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-primary-600 dark:text-primary-400 text-base">
                          ${proj.budget.toLocaleString()}
                          <span className="text-xs font-semibold text-slate-400 ml-1">USD</span>
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 capitalize text-[10px] font-bold">
                          {proj.experienceLevel}
                        </span>
                      </div>

                      {/* Title & Desc */}
                      <div className="space-y-1.5">
                        <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          <Link to={`/projects/${proj._id}`}>{proj.title}</Link>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {proj.description}
                        </p>
                      </div>

                      {/* Required skill pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {proj.skillsRequired.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-0.5 rounded-lg bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 text-[10px] font-bold border border-primary-100/50 dark:border-primary-900/30"
                          >
                            {skill}
                          </span>
                        ))}
                        {proj.skillsRequired.length > 3 && (
                          <span className="text-[10px] text-slate-400 mt-0.5 font-bold">+{proj.skillsRequired.length - 3} more</span>
                        )}
                      </div>
                    </div>

                    {/* Card footer details */}
                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/40 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full overflow-hidden bg-gradient-to-tr from-primary-500 to-indigo-500 flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
                          {proj.client?.profileImage ? (
                            <img src={getFileUrl(proj.client.profileImage)} alt={proj.client.name} className="h-full w-full object-cover" />
                          ) : (
                            proj.client?.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate">{proj.client?.companyName || proj.client?.name}</p>
                          <span className="text-[9px] text-slate-400 flex items-center gap-0.5"><Clock className="h-2 w-2" /> {new Date(proj.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-semibold">
                        <span className="text-slate-400 text-[10px] flex items-center gap-0.5"><Users className="h-3 w-3" /> {proj.applicationsCount}</span>
                        <Link
                          to={`/projects/${proj._id}`}
                          className="px-4 py-2 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white rounded-xl shadow-sm text-xs font-bold transition-all hover:shadow-md"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-slate-200/40 dark:border-slate-800/30">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 border rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-colors disabled:opacity-40"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Previous
                  </motion.button>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Page {page} of {totalPages}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 border rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-colors disabled:opacity-40"
                  >
                    Next <ArrowRight className="h-3.5 w-3.5" />
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default BrowseProjects;
