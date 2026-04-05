import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const severityColors = {
  Critical: '#ef4444',
  High: '#f97316',
  Medium: '#3b82f6',
  Low: '#22c55e',
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="glass-card p-3 border border-[var(--glass-border)] text-xs shadow-xl">
      <p className="text-[var(--text-primary)] font-medium mb-1">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[var(--text-secondary)]">{entry.name}:</span>
          <span className="text-[var(--text-primary)] font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function TrendChart({ briefings = [] }) {
  const chartData = useMemo(() => {
    // Group briefings by date
    const dateMap = {};
    briefings.forEach((b) => {
      const date = b.date;
      if (!dateMap[date]) {
        dateMap[date] = { date, Critical: 0, High: 0, Medium: 0, Low: 0, total: 0 };
      }
      const severity = b.severity || 'Low';
      dateMap[date][severity] = (dateMap[date][severity] || 0) + 1;
      dateMap[date].total += 1;
    });

    // Sort by date and take last 10 dates max
    return Object.values(dateMap)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-10)
      .map((d) => ({
        ...d,
        label: new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
      }));
  }, [briefings]);

  if (chartData.length < 2) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-card p-5"
    >
      <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-pink-500" />
        Threat Trend
      </h3>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={2}>
            <XAxis
              dataKey="label"
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              axisLine={{ stroke: 'var(--border-default)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              width={24}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(236, 72, 153, 0.08)' }} />
            <Bar dataKey="Critical" stackId="severity" fill={severityColors.Critical} radius={[0, 0, 0, 0]} />
            <Bar dataKey="High" stackId="severity" fill={severityColors.High} radius={[0, 0, 0, 0]} />
            <Bar dataKey="Medium" stackId="severity" fill={severityColors.Medium} radius={[0, 0, 0, 0]} />
            <Bar dataKey="Low" stackId="severity" fill={severityColors.Low} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3">
        {Object.entries(severityColors).map(([label, color]) => (
          <div key={label} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
            {label}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
