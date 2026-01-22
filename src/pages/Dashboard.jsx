import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useBriefings } from '../hooks/useBriefings';
import { useLanguage } from '../contexts/LanguageContext';
import DailySummary from '../components/dashboard/DailySummary';
import SeverityStats from '../components/dashboard/SeverityStats';
import InsightsRow from '../components/dashboard/InsightsRow';
import FeaturedThreat from '../components/dashboard/FeaturedThreat';
import SearchFilters from '../components/dashboard/SearchFilters';
import BriefingGrid from '../components/briefing/BriefingGrid';

export default function Dashboard() {
  const { briefings, loading, error, indexData } = useBriefings();
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('');

  // Get today's date
  const today = new Date().toISOString().split('T')[0];

  // Filter to show only today's briefings
  const todayBriefings = useMemo(() => {
    return briefings.filter(b => b.date === today);
  }, [briefings, today]);

  // Calculate stats from today's briefings
  const stats = useMemo(() => {
    if (indexData?.stats) {
      return indexData.stats;
    }
    // Fallback: calculate from briefings
    const counts = todayBriefings.reduce((acc, b) => {
      const severity = b.severity?.toLowerCase() || 'low';
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    }, { critical: 0, high: 0, medium: 0, low: 0 });
    return {
      ...counts,
      total: todayBriefings.length,
      cisaKev: 0,
      activeExploits: 0,
    };
  }, [todayBriefings, indexData]);

  // Get top tags and vendors from index data or calculate
  const topTags = indexData?.topTags || [];
  const topVendors = indexData?.topVendors || [];

  // Get featured briefing
  const featuredBriefing = useMemo(() => {
    if (indexData?.featuredBriefing) {
      return todayBriefings.find(b => b.id === indexData.featuredBriefing);
    }
    // Fallback: get first critical briefing
    return todayBriefings.find(b => b.severity === 'Critical') || todayBriefings[0];
  }, [todayBriefings, indexData]);

  // Filter briefings based on search and filters
  const filteredBriefings = useMemo(() => {
    return todayBriefings.filter(b => {
      // Exclude featured briefing from the grid
      if (featuredBriefing && b.id === featuredBriefing.id) return false;

      const matchesSeverity = !selectedSeverity || b.severity === selectedSeverity;
      const matchesVendor = !selectedVendor ||
        b.tags?.some(tag => tag.toLowerCase().includes(selectedVendor.toLowerCase()));
      const matchesSearch = !searchQuery ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        b.cves?.some(cve => cve.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesSeverity && matchesVendor && matchesSearch;
    });
  }, [todayBriefings, featuredBriefing, selectedSeverity, selectedVendor, searchQuery]);

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
      {/* 1. Daily Summary Header */}
      <DailySummary date={today} />

      {/* 2. Severity Stats Row */}
      <SeverityStats stats={stats} />

      {/* 3. Insights Row */}
      <InsightsRow stats={stats} topTags={topTags} />

      {/* 4. Featured Threat */}
      {featuredBriefing && (
        <FeaturedThreat briefing={featuredBriefing} />
      )}

      {/* 5. Briefings Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          {language === 'fi' ? 'Päivän tiedotteet' : "Today's Briefings"}
        </h2>

        {filteredBriefings.length > 0 ? (
          <BriefingGrid briefings={filteredBriefings} title="" />
        ) : (
          <div className="glass-card p-12 text-center">
            <p className="text-[var(--text-muted)]">
              {searchQuery || selectedSeverity || selectedVendor
                ? t('dashboard.noMatch')
                : t('dashboard.noBriefings')}
            </p>
          </div>
        )}
      </motion.div>

      {/* 6. Search & Filters (at the bottom) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <SearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedSeverity={selectedSeverity}
          setSelectedSeverity={setSelectedSeverity}
          selectedVendor={selectedVendor}
          setSelectedVendor={setSelectedVendor}
          vendors={topVendors}
        />
      </motion.div>
    </div>
  );
}
