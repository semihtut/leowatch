import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useBriefings } from '../hooks/useBriefings';
import { useLanguage } from '../contexts/LanguageContext';
import DailySummary from '../components/dashboard/DailySummary';
import SeverityStats from '../components/dashboard/SeverityStats';
import InsightsRow from '../components/dashboard/InsightsRow';
import FeaturedThreat from '../components/dashboard/FeaturedThreat';
import BriefingGrid from '../components/briefing/BriefingGrid';

export default function Dashboard() {
  const { briefings, loading, error, indexData } = useBriefings();
  const { t, language } = useLanguage();
  const [selectedSeverity, setSelectedSeverity] = useState('');

  // Get today's date
  const today = new Date().toISOString().split('T')[0];

  // Filter to show only today's briefings
  const todayBriefings = useMemo(() => {
    return briefings.filter(b => b.date === today);
  }, [briefings, today]);

  // Calculate stats from today's briefings
  const stats = useMemo(() => {
    // Debug logging
    console.log('indexData:', indexData);
    console.log('indexData.stats:', indexData?.stats);

    if (indexData?.stats) {
      return indexData.stats;
    }
    // Fallback: calculate from all briefings (not just today)
    const allBriefings = indexData?.briefings || briefings || [];
    const counts = allBriefings.reduce((acc, b) => {
      const severity = b.severity?.toLowerCase() || 'low';
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    }, { critical: 0, high: 0, medium: 0, low: 0 });

    // Count CISA KEV and active exploits from briefings
    const cisaKev = allBriefings.filter(b =>
      b.tags?.some(tag => tag.toLowerCase().includes('kev') || tag.toLowerCase().includes('cisa'))
    ).length;

    return {
      ...counts,
      total: allBriefings.length,
      cisaKev: cisaKev || 0,
      activeExploits: counts.critical || 0,
    };
  }, [briefings, indexData]);

  // Get top tags from index data or calculate
  const topTags = indexData?.topTags || [];

  // Get featured briefing
  const featuredBriefing = useMemo(() => {
    if (indexData?.featuredBriefing) {
      return todayBriefings.find(b => b.id === indexData.featuredBriefing);
    }
    // Fallback: get first critical briefing
    return todayBriefings.find(b => b.severity === 'Critical') || todayBriefings[0];
  }, [todayBriefings, indexData]);

  // Filter briefings based on selected severity
  const filteredBriefings = useMemo(() => {
    return todayBriefings.filter(b => {
      // Exclude featured briefing from the grid
      if (featuredBriefing && b.id === featuredBriefing.id) return false;

      const matchesSeverity = !selectedSeverity || b.severity === selectedSeverity;

      return matchesSeverity;
    });
  }, [todayBriefings, featuredBriefing, selectedSeverity]);

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

      {/* 2. Severity Stats Row - Clickable */}
      <SeverityStats
        stats={stats}
        selectedSeverity={selectedSeverity}
        onSeverityClick={setSelectedSeverity}
      />

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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            {selectedSeverity
              ? `${selectedSeverity} ${language === 'fi' ? 'Tiedotteet' : 'Briefings'}`
              : (language === 'fi' ? 'Päivän tiedotteet' : "Today's Briefings")}
          </h2>
          {selectedSeverity && (
            <button
              onClick={() => setSelectedSeverity('')}
              className="text-sm text-pink-400 hover:text-pink-300 transition-colors"
            >
              {language === 'fi' ? 'Näytä kaikki' : 'Show all'}
            </button>
          )}
        </div>

        {filteredBriefings.length > 0 ? (
          <BriefingGrid briefings={filteredBriefings} title="" />
        ) : (
          <div className="glass-card p-12 text-center">
            <p className="text-[var(--text-muted)]">
              {selectedSeverity
                ? t('dashboard.noMatch')
                : t('dashboard.noBriefings')}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
