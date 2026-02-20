import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Calendar, X, Tag } from 'lucide-react';
import Fuse from 'fuse.js';
import { useBriefings } from '../hooks/useBriefings';
import BriefingCard from '../components/briefing/BriefingCard';
import { useLanguage } from '../contexts/LanguageContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const severityOptions = ['All', 'Critical', 'High', 'Medium', 'Low'];

const severityColors = {
  Critical: 'bg-red-500/15 text-red-400 border-red-500/30',
  High: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  Medium: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  Low: 'bg-green-500/15 text-green-400 border-green-500/30',
};

export default function Archive() {
  const { briefings, loading, error } = useBriefings();
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [selectedTags, setSelectedTags] = useState([]);
  const { t, language } = useLanguage();

  useDocumentMeta({
    title: 'Briefing Archive',
    description: 'Browse and search all cybersecurity threat intelligence briefings with fuzzy search and tag filtering.',
    path: '/archive',
  });

  // Build Fuse.js index for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(briefings, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'tags', weight: 0.25 },
        { name: 'cves', weight: 0.2 },
        { name: 'excerpt', weight: 0.15 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
      includeScore: true,
    });
  }, [briefings]);

  // Extract all unique tags from briefings, sorted by frequency
  const allTags = useMemo(() => {
    const tagCount = {};
    briefings.forEach((b) => {
      b.tags?.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
  }, [briefings]);

  // Filter briefings with fuzzy search + severity + tags
  const filteredBriefings = useMemo(() => {
    // Start with fuzzy search or all briefings
    let results = search.trim()
      ? fuse.search(search).map((r) => r.item)
      : [...briefings];

    // Apply severity filter
    if (severityFilter !== 'All') {
      results = results.filter((b) => b.severity === severityFilter);
    }

    // Apply tag filter (AND logic - must have ALL selected tags)
    if (selectedTags.length > 0) {
      results = results.filter((b) =>
        selectedTags.every((tag) => b.tags?.includes(tag))
      );
    }

    // Sort by date (newest first) if not fuzzy search (preserve relevance order for search)
    if (!search.trim()) {
      results.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return results;
  }, [briefings, fuse, search, severityFilter, selectedTags]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSearch('');
    setSeverityFilter('All');
    setSelectedTags([]);
  };

  const hasActiveFilters = search.trim() || severityFilter !== 'All' || selectedTags.length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Error loading briefings: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">{t('archive.title')}</h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          {t('archive.subtitle')}
        </p>
      </motion.div>

      {/* Search + Severity Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        {/* Fuzzy Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder={t('archive.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-pink-500/50 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Severity Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-primary)] focus:outline-none focus:border-pink-500/50 transition-colors appearance-none cursor-pointer"
          >
            {severityOptions.map((option) => (
              <option key={option} value={option}>
                {option === 'All' ? t('archive.allSeverities') : t(`threatPulse.${option.toLowerCase()}`)}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Tag Filter Pills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Tag className="w-4 h-4 text-[var(--text-muted)]" />
          <span className="text-sm font-medium text-[var(--text-muted)]">{t('archive.tags')}</span>
        </div>
        <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto scrollbar-thin">
          {allTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-pink-500/20 text-pink-400 border-pink-500/40 shadow-sm shadow-pink-500/10'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-default)] hover:border-pink-500/30 hover:text-[var(--text-primary)]'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Active Filters Bar */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center flex-wrap gap-2 p-3 rounded-lg bg-pink-500/5 border border-pink-500/20">
              <span className="text-xs font-medium text-[var(--text-muted)] mr-1">
                {t('archive.activeFilters')}:
              </span>

              {search.trim() && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/15 text-purple-400 border border-purple-500/30">
                  "{search}"
                  <button onClick={() => setSearch('')} className="hover:text-purple-300">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {severityFilter !== 'All' && (
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${severityColors[severityFilter]}`}>
                  {severityFilter}
                  <button onClick={() => setSeverityFilter('All')} className="hover:opacity-70">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-pink-500/15 text-pink-400 border border-pink-500/30"
                >
                  {tag}
                  <button onClick={() => toggleTag(tag)} className="hover:text-pink-300">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <button
                onClick={clearAllFilters}
                className="ml-auto text-xs font-medium text-pink-400 hover:text-pink-300 transition-colors"
              >
                {t('archive.clearAll')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      <p className="text-sm text-[var(--text-muted)]">
        {t('archive.showing')} {filteredBriefings.length} {t('archive.of')} {briefings.length} {t('archive.briefings')}
      </p>

      {/* Briefings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBriefings.map((briefing, index) => (
          <BriefingCard key={briefing.id} briefing={briefing} index={index} />
        ))}
      </div>

      {filteredBriefings.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-4" />
          <p className="text-[var(--text-muted)]">{t('archive.noMatch')}</p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="mt-3 text-sm text-pink-400 hover:text-pink-300 transition-colors"
            >
              {t('archive.clearAll')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
