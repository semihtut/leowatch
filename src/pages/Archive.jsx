import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar } from 'lucide-react';
import { useBriefings } from '../hooks/useBriefings';
import BriefingCard from '../components/briefing/BriefingCard';
import { useLanguage } from '../contexts/LanguageContext';

const severityOptions = ['All', 'Critical', 'High', 'Medium', 'Low'];

export default function Archive() {
  const { briefings, loading, error } = useBriefings();
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const { t } = useLanguage();

  const filteredBriefings = useMemo(() => {
    return briefings.filter((briefing) => {
      const matchesSearch =
        search === '' ||
        briefing.title.toLowerCase().includes(search.toLowerCase()) ||
        briefing.tags?.some((tag) => tag.toLowerCase().includes(search.toLowerCase())) ||
        briefing.cves?.some((cve) => cve.toLowerCase().includes(search.toLowerCase()));

      const matchesSeverity =
        severityFilter === 'All' || briefing.severity === severityFilter;

      return matchesSearch && matchesSeverity;
    });
  }, [briefings, search, severityFilter]);

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
    <div className="space-y-8">
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

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder={t('archive.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-pink-500/50 transition-colors"
          />
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
        </div>
      )}
    </div>
  );
}
