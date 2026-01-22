import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Activity, FileText, AlertTriangle, Calendar, Filter } from 'lucide-react';
import { useBriefings } from '../hooks/useBriefings';
import SeverityBadge from '../components/briefing/SeverityBadge';

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

  const hasCritical = (date) => {
    const dayBriefings = briefingsByDate[date.toDateString()] || [];
    return dayBriefings.some((b) => b.severity === 'Critical');
  };

  const hasHigh = (date) => {
    const dayBriefings = briefingsByDate[date.toDateString()] || [];
    return dayBriefings.some((b) => b.severity === 'High');
  };

  const getDotColor = (date) => {
    if (hasCritical(date)) return 'bg-red-500';
    if (hasHigh(date)) return 'bg-orange-500';
    return 'bg-cyan-500';
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
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-pink-500" />
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Threat Pulse</h1>
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
            All ({briefings.length})
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
              {severity} ({severityCounts[severity] || 0})
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Calendar */}
        <div className="lg:col-span-2 glass-card p-3">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={goToToday}
                className="px-2 py-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] rounded transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => navigateMonth(-1)}
                className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] rounded transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigateMonth(1)}
                className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] rounded transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 mb-0.5">
            {DAYS.map((day) => (
              <div key={day} className="text-center text-[10px] font-medium text-[var(--text-muted)] py-0.5">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              const count = getBriefingCount(day.date);
              const dotColor = getDotColor(day.date);

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(day.date)}
                  style={{ height: '24px' }}
                  className={`
                    relative rounded transition-all text-[11px]
                    ${day.isCurrentMonth ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}
                    ${isToday(day.date) ? 'ring-1 ring-pink-500' : ''}
                    ${isSelected(day.date) ? 'bg-pink-500/20' : 'hover:bg-[var(--bg-card-hover)]'}
                    ${count > 0 ? 'font-medium' : ''}
                  `}
                >
                  <span className="block">{day.date.getDate()}</span>
                  {count > 0 && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                      <span className={`block w-1 h-1 rounded-full ${dotColor}`} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 mt-2 pt-2 border-t border-[var(--border-default)]">
            <div className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)]">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              <span>Critical</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)]">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
              <span>High</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
              <span>Med/Low</span>
            </div>
          </div>
        </div>

        {/* Selected Day Briefings */}
        <div className="glass-card p-3">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-pink-500" />
            {selectedDate ? (
              <span>
                {selectedDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            ) : (
              <span>Select a date</span>
            )}
          </h3>

          {!selectedDate ? (
            <p className="text-[var(--text-muted)] text-xs">
              Click on a date to view briefings.
            </p>
          ) : selectedBriefings.length === 0 ? (
            <div className="text-center py-4">
              <Calendar className="w-8 h-8 mx-auto text-[var(--text-muted)] mb-2" />
              <p className="text-[var(--text-muted)] text-xs">
                {selectedSeverity
                  ? `No ${selectedSeverity.toLowerCase()} briefings.`
                  : 'No briefings on this date.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {selectedBriefings.map((briefing) => (
                <Link
                  key={briefing.id}
                  to={`/briefing/${briefing.id}`}
                  className="block p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-default)] hover:border-pink-500/50 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <SeverityBadge level={briefing.severity} size="sm" />
                    {briefing.severity === 'Critical' && (
                      <AlertTriangle className="w-3 h-3 text-red-500" />
                    )}
                  </div>
                  <h4 className="text-sm font-medium text-[var(--text-primary)] group-hover:text-pink-400 transition-colors line-clamp-2">
                    {briefing.title}
                  </h4>
                  {briefing.cves && briefing.cves.length > 0 && (
                    <p className="text-cyan-400 text-[10px] font-mono mt-1">
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
