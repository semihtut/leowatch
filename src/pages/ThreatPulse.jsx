import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Activity, FileText, AlertTriangle, Calendar } from 'lucide-react';
import { useBriefings } from '../hooks/useBriefings';
import SeverityBadge from '../components/briefing/SeverityBadge';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function ThreatPulse() {
  const { briefings, loading, error } = useBriefings();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Get briefings grouped by date
  const briefingsByDate = useMemo(() => {
    const grouped = {};
    briefings.forEach((briefing) => {
      const date = new Date(briefing.date).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(briefing);
    });
    return grouped;
  }, [briefings]);

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
    return dayBriefings.some((b) => b.severity?.toLowerCase() === 'critical' || b.severity === 'Critical');
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3">
          <Activity className="w-8 h-8 text-pink-500" />
          Threat Pulse
        </h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          Track the heartbeat of cyber threats
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 glass-card p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={goToToday}
                className="px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] rounded-lg transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-[var(--text-muted)] py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const count = getBriefingCount(day.date);
              const critical = hasCritical(day.date);

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(day.date)}
                  className={`
                    relative aspect-square p-1 rounded-lg transition-all text-sm
                    ${day.isCurrentMonth ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}
                    ${isToday(day.date) ? 'ring-2 ring-pink-500' : ''}
                    ${isSelected(day.date) ? 'bg-pink-500/20' : 'hover:bg-[var(--bg-card-hover)]'}
                    ${count > 0 ? 'font-medium' : ''}
                  `}
                >
                  <span className="block">{day.date.getDate()}</span>
                  {count > 0 && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          critical ? 'bg-red-500' : 'bg-cyan-500'
                        }`}
                      />
                      {count > 1 && (
                        <span className="text-[10px] text-[var(--text-secondary)]">+{count - 1}</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--border-default)]">
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
              <span>Has briefings</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>Has critical</span>
            </div>
          </div>
        </div>

        {/* Selected Day Briefings */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-pink-500" />
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
            <p className="text-[var(--text-muted)] text-sm">
              Click on a date to view briefings published that day.
            </p>
          ) : selectedBriefings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-3" />
              <p className="text-[var(--text-muted)] text-sm">No briefings on this date.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedBriefings.map((briefing) => (
                <Link
                  key={briefing.id}
                  to={`/briefing/${briefing.id}`}
                  className="block p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-default)] hover:border-pink-500/50 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <SeverityBadge level={briefing.severity} size="sm" />
                    {briefing.severity?.toLowerCase() === 'critical' && (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <h4 className="font-medium text-[var(--text-primary)] group-hover:text-pink-400 transition-colors line-clamp-2">
                    {briefing.title}
                  </h4>
                  {briefing.cves && briefing.cves.length > 0 && (
                    <p className="text-cyan-400 text-xs font-mono mt-2">
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
