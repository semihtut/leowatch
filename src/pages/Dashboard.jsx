import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useBriefings } from '../hooks/useBriefings';
import { useLanguage } from '../contexts/LanguageContext';
import DailySummary from '../components/dashboard/DailySummary';
import SeverityStats from '../components/dashboard/SeverityStats';
import InsightsRow from '../components/dashboard/InsightsRow';
import FeaturedThreat from '../components/dashboard/FeaturedThreat';
import TrendChart from '../components/dashboard/TrendChart';
import BriefingGrid from '../components/briefing/BriefingGrid';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function Dashboard() {
  const { briefings, loading, error, indexData } = useBriefings();
  const { t, language } = useLanguage();
  const [selectedSeverities, setSelectedSeverities] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'today'

  useDocumentMeta({
    title: 'Dashboard',
    description: 'Daily cybersecurity threat intelligence dashboard with severity stats, trends, and featured threats.',
    path: '/',
  });

  // Get today's date
  const today = new Date().toISOString().split('T')[0];

  // Extract published date from briefing ID (TB-2026-01-23-002 -> 2026-01-23)
  const getPublishedDate = (id) => {
    const match = id?.match(/TB-(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : null;
  };

  // Sort all briefings by event date (newest first)
  const sortedBriefings = useMemo(() => {
    return [...briefings].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [briefings]);

  // Filter briefings added today (by published date from ID)
  const todayAddedBriefings = useMemo(() => {
    return sortedBriefings.filter(b => getPublishedDate(b.id) === today);
  }, [sortedBriefings, today]);

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
      return sortedBriefings.find(b => b.id === indexData.featuredBriefing);
    }
    // Fallback: get first critical briefing
    return sortedBriefings.find(b => b.severity === 'Critical') || sortedBriefings[0];
  }, [sortedBriefings, indexData]);

  // Filter briefings based on active tab and selected severity
  const filteredBriefings = useMemo(() => {
    const baseBriefings = activeTab === 'today' ? todayAddedBriefings : sortedBriefings;

    return baseBriefings.filter(b => {
      // Exclude featured briefing from the grid
      if (featuredBriefing && b.id === featuredBriefing.id) return false;

      const matchesSeverity = selectedSeverities.length === 0 || selectedSeverities.includes(b.severity);

      return matchesSeverity;
    });
  }, [sortedBriefings, todayAddedBriefings, activeTab, featuredBriefing, selectedSeverities]);

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
        selectedSeverities={selectedSeverities}
        onSeverityClick={(severity) => {
          setSelectedSeverities(prev =>
            prev.includes(severity)
              ? prev.filter(s => s !== severity)
              : [...prev, severity]
          );
        }}
      />

      {/* 3. Insights Row */}
      <InsightsRow stats={stats} topTags={topTags} />

      {/* 4. Threat Trend Chart */}
      <TrendChart briefings={sortedBriefings} />

      {/* 5. Featured Threat */}
      {featuredBriefing && (
        <FeaturedThreat briefing={featuredBriefing} />
      )}

      {/* 5. Briefings Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        {/* Tab Navigation */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex bg-[var(--glass-bg)] rounded-lg p-1 border border-[var(--glass-border)]">
            <button
              onClick={() => { setActiveTab('all'); setSelectedSeverities([]); }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {language === 'fi' ? 'Kaikki' : 'All Briefings'}
            </button>
            <button
              onClick={() => { setActiveTab('today'); setSelectedSeverities([]); }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'today'
                  ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {language === 'fi' ? 'Tänään lisätyt' : 'Added Today'}
              {todayAddedBriefings.length > 0 && (
                <span className="bg-pink-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {todayAddedBriefings.length}
                </span>
              )}
            </button>
          </div>

          {selectedSeverities.length > 0 && (
            <button
              onClick={() => setSelectedSeverities([])}
              className="text-sm text-pink-400 hover:text-pink-300 transition-colors"
            >
              Clear filters: {selectedSeverities.join(', ')}
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            {selectedSeverities.length > 0
              ? `${selectedSeverities.join(' & ')} Briefings`
              : activeTab === 'today'
                ? (language === 'fi' ? 'Tänään lisätyt' : "Added Today")
                : (language === 'fi' ? 'Kaikki tiedotteet' : "All Briefings")}
          </h2>
        </div>

        {filteredBriefings.length > 0 ? (
          <BriefingGrid briefings={filteredBriefings} title="" />
        ) : (
          <div className="glass-card p-12 text-center">
            <p className="text-[var(--text-muted)]">
              {selectedSeverities.length > 0
                ? t('dashboard.noMatch')
                : activeTab === 'today'
                  ? (language === 'fi' ? 'Ei tänään lisättyjä tiedotteita' : 'No briefings added today')
                  : t('dashboard.noBriefings')}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
