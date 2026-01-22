import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Activity, FileText, AlertTriangle, Calendar, Filter } from 'lucide-react';
import { useBriefings } from '../hooks/useBriefings';
import SeverityBadge from '../components/briefing/SeverityBadge';
import { useLanguage } from '../contexts/LanguageContext';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const severityColors = {
  Critical: 'bg-red-500/20 text-red-400 border-red-500/50',
  High: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  Medium: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  Low: 'bg-green-500/20 text-green-400 border-green-500/50',
};

export default function ThreatPulse() {
  const { briefings, loading, error } = useBriefings();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSeverity, setSelectedSeverity] = useState(null);
  const { t, language } = useLanguage();

  // Filter briefings by severity first
  const filteredBriefings = useMemo(() => {
    if (!selectedSeverity) return briefings;
    return briefings.filter(b => b.severity === selectedSeverity);
  }, [briefings, selectedSeverity]);

  // Count by severity (total)
  const severityCounts = useMemo(() => {
    return briefings.reduce((acc, b) => {
      acc[b.severity] = (acc[b.severity] || 0) + 1;
      return acc;
    }, {});
  }, [briefings]);

  // Get briefings grouped by date (filtered)
  const briefingsByDate = useMemo(() => {
    const grouped = {};
    filteredBriefings.forEach((briefing) => {
      const date = new Date(briefing.date).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(briefing);
    });
    return grouped;
  }, [filteredBriefings]);

  // Get calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentDate]);

  // Get briefings for selected date
  const selectedBriefings = useMemo(() => {
    if (!selectedDate) return [];
    return briefingsByDate[selectedDate.toDateString()] || [];
  }, [selectedDate, briefingsByDate]);

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const getBriefingCount = (date) => {
    return briefingsByDate[date.toDateString()]?.length || 0;
  };

  // Get severity breakdown for a specific date
  const getSeverityBreakdown = (date) => {
    const dayBriefings = briefingsByDate[date.toDateString()] || [];
    const breakdown = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };
    dayBriefings.forEach((b) => {
      const severity = b.severity?.toLowerCase() || 'low';
      if (breakdown[severity] !== undefined) {
        breakdown[severity]++;
      }
    });
    return breakdown;
  };

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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-pink-500" />
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">{t('threatPulse.title')}</h1>
        </div>
        {/* Severity Filter - inline */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedSeverity(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              !selectedSeverity
                ? 'bg-pink-500/20 text-pink-400 border-pink-500/50'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-default)] hover:border-pink-500/30'
            }`}
          >
            {t('common.all')} ({briefings.length})
          </button>
          {['Critical', 'High', 'Medium', 'Low'].map((severity) => (
            <button
              key={severity}
              onClick={() => setSelectedSeverity(selectedSeverity === severity ? null : severity)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                selectedSeverity === severity
                  ? severityColors[severity]
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-default)] hover:border-[var(--border-accent)]'
              }`}
              disabled={!severityCounts[severity]}
              style={{ opacity: severityCounts[severity] ? 1 : 0.4 }}
            >
              {t(`threatPulse.${severity.toLowerCase()}`)} ({severityCounts[severity] || 0})
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {/* Calendar - Full Width */}
        <div className="glass-card p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-[var(--text-primary)]">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={goToToday}
                className="px-4 py-2 text-base font-medium text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 rounded-xl transition-colors"
              >
                {t('threatPulse.today')}
              </button>
              <button
                onClick={() => navigateMonth(-1)}
                className="p-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] rounded-xl transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => navigateMonth(1)}
                className="p-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] rounded-xl transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 mb-3">
            {DAYS.map((day) => (
              <div key={day} className="text-center text-base font-semibold text-[var(--text-muted)] py-3">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              const count = getBriefingCount(day.date);
              const breakdown = getSeverityBreakdown(day.date);

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(day.date)}
                  className={`
                    relative rounded-xl transition-all text-xl py-6 min-h-[80px]
                    ${day.isCurrentMonth ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}
                    ${isToday(day.date) ? 'ring-2 ring-pink-500 ring-offset-2 ring-offset-[var(--bg-primary)]' : ''}
                    ${isSelected(day.date) ? 'bg-pink-500/20 scale-105' : 'hover:bg-[var(--bg-card-hover)]'}
                    ${count > 0 ? 'font-bold' : 'font-medium'}
                  `}
                >
                  <span className="block text-2xl">{day.date.getDate()}</span>
                  {count > 0 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 flex-wrap">
                      {breakdown.critical > 0 && (
                        <span className="flex items-center gap-0.5">
                          <span className="block w-2 h-2 rounded-full bg-red-500" />
                          <span className="text-[10px] text-red-400 font-medium">{breakdown.critical}</span>
                        </span>
                      )}
                      {breakdown.high > 0 && (
                        <span className="flex items-center gap-0.5">
                          <span className="block w-2 h-2 rounded-full bg-orange-500" />
                          <span className="text-[10px] text-orange-400 font-medium">{breakdown.high}</span>
                        </span>
                      )}
                      {(breakdown.medium > 0 || breakdown.low > 0) && (
                        <span className="flex items-center gap-0.5">
                          <span className="block w-2 h-2 rounded-full bg-cyan-500" />
                          <span className="text-[10px] text-cyan-400 font-medium">{breakdown.medium + breakdown.low}</span>
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-[var(--border-default)]">
            <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-red-400 font-medium">n</span>
              <span>= {t('threatPulse.critical')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
              <span className="w-3 h-3 rounded-full bg-orange-500"></span>
              <span className="text-orange-400 font-medium">n</span>
              <span>= {t('threatPulse.high')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
              <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
              <span className="text-cyan-400 font-medium">n</span>
              <span>= {t('threatPulse.medLow')}</span>
            </div>
          </div>
        </div>

        {/* Selected Day Briefings - Horizontal Grid */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-pink-500" />
            {selectedDate ? (
              <span>
                {selectedDate.toLocaleDateString(language === 'fi' ? 'fi-FI' : 'en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            ) : (
              <span>{t('threatPulse.selectDate')}</span>
            )}
          </h3>

          {!selectedDate ? (
            <p className="text-[var(--text-muted)] text-base text-center py-8">
              {t('threatPulse.clickToView')}
            </p>
          ) : selectedBriefings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-3" />
              <p className="text-[var(--text-muted)] text-base">
                {selectedSeverity
                  ? t('threatPulse.noSeverityBriefings').replace('{severity}', t(`threatPulse.${selectedSeverity.toLowerCase()}`).toLowerCase())
                  : t('threatPulse.noBriefings')
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {selectedBriefings.map((briefing) => (
                <Link
                  key={briefing.id}
                  to={`/briefing/${briefing.id}`}
                  className="block p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-default)] hover:border-pink-500/50 hover:scale-[1.02] transition-all group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <SeverityBadge level={briefing.severity} />
                    {briefing.severity === 'Critical' && (
                      <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                    )}
                  </div>
                  <h4 className="text-base font-medium text-[var(--text-primary)] group-hover:text-pink-400 transition-colors line-clamp-2 mb-2">
                    {briefing.title}
                  </h4>
                  {briefing.cves && briefing.cves.length > 0 && (
                    <p className="text-cyan-400 text-xs font-mono">
                      {briefing.cves.slice(0, 2).join(', ')}
                      {briefing.cves.length > 2 && ` +${briefing.cves.length - 2}`}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
