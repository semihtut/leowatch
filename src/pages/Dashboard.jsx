import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { useBriefings } from '../hooks/useBriefings';
import BriefingGrid from '../components/briefing/BriefingGrid';
import { useLanguage } from '../contexts/LanguageContext';

const severityColors = {
  Critical: 'bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30',
  High: 'bg-orange-500/20 text-orange-400 border-orange-500/50 hover:bg-orange-500/30',
  Medium: 'bg-blue-500/20 text-blue-400 border-blue-500/50 hover:bg-blue-500/30',
  Low: 'bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30',
};

export default function Dashboard() {
  const { briefings, loading, error } = useBriefings();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState(null);
  const { t, language } = useLanguage();

  // Filter to show only today's briefings
  const today = new Date().toISOString().split('T')[0];
  const todayBriefings = briefings.filter(b => b.date === today);

  // Count by severity
  const severityCounts = useMemo(() => {
    return todayBriefings.reduce((acc, b) => {
      acc[b.severity] = (acc[b.severity] || 0) + 1;
      return acc;
    }, {});
  }, [todayBriefings]);

  // Filter briefings
  const filteredBriefings = useMemo(() => {
    return todayBriefings.filter(b => {
      const matchesSeverity = !selectedSeverity || b.severity === selectedSeverity;
      const matchesSearch = !searchQuery ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        b.cves?.some(cve => cve.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSeverity && matchesSearch;
    });
  }, [todayBriefings, selectedSeverity, searchQuery]);

  const todayFormatted = new Date().toLocaleDateString(language === 'fi' ? 'fi-FI' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          {t('dashboard.title')}
        </h1>
        <p className="mt-1 text-[var(--text-secondary)]">{todayFormatted}</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="glass-card p-4 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder={t('dashboard.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Severity Filter Chips */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedSeverity(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
              !selectedSeverity
                ? 'bg-pink-500/20 text-pink-400 border-pink-500/50'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-default)] hover:border-pink-500/30'
            }`}
          >
            {t('dashboard.all')} ({todayBriefings.length})
          </button>
          {['Critical', 'High', 'Medium', 'Low'].map((severity) => (
            <button
              key={severity}
              onClick={() => setSelectedSeverity(selectedSeverity === severity ? null : severity)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                selectedSeverity === severity
                  ? severityColors[severity]
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-default)] hover:border-[var(--border-accent)]'
              }`}
              disabled={!severityCounts[severity]}
              style={{ opacity: severityCounts[severity] ? 1 : 0.4 }}
            >
              {severity} ({severityCounts[severity] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filteredBriefings.length > 0 ? (
        <BriefingGrid briefings={filteredBriefings} title="" />
      ) : (
        <div className="glass-card p-12 text-center">
          <p className="text-[var(--text-muted)]">
            {searchQuery || selectedSeverity
              ? t('dashboard.noMatch')
              : t('dashboard.noBriefings')}
          </p>
        </div>
      )}
    </div>
  );
}
