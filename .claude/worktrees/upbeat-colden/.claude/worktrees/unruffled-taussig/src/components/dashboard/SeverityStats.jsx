import { useLanguage } from '../../contexts/LanguageContext';
import useCountUp from '../../hooks/useCountUp';

const severityConfig = {
  critical: {
    label: { en: 'Critical', fi: 'Kriittinen' },
    bg: 'bg-red-500/10',
    border: 'border-red-500/50',
    text: 'text-red-400',
  },
  high: {
    label: { en: 'High', fi: 'Korkea' },
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/50',
    text: 'text-orange-400',
  },
  medium: {
    label: { en: 'Medium', fi: 'Keskitaso' },
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/50',
    text: 'text-blue-400',
  },
  low: {
    label: { en: 'Low', fi: 'Matala' },
    bg: 'bg-green-500/10',
    border: 'border-green-500/50',
    text: 'text-green-400',
  },
};

// Map lowercase keys to capitalized severity values
const severityMap = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export default function SeverityStats({ stats = {}, selectedSeverities = [], onSeverityClick }) {
  const { language } = useLanguage();

  // Ensure stats has default values
  const safeStats = {
    critical: stats?.critical || 0,
    high: stats?.high || 0,
    medium: stats?.medium || 0,
    low: stats?.low || 0,
  };

  const handleClick = (key) => {
    const severity = severityMap[key];
    if (onSeverityClick) {
      onSeverityClick(severity);
    }
  };

  const criticalCount = useCountUp(safeStats.critical);
  const highCount = useCountUp(safeStats.high);
  const mediumCount = useCountUp(safeStats.medium);
  const lowCount = useCountUp(safeStats.low);

  const animatedValues = { critical: criticalCount, high: highCount, medium: mediumCount, low: lowCount };
  const hasSelection = selectedSeverities.length > 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(severityConfig).map(([key, config]) => {
        const isSelected = selectedSeverities.includes(severityMap[key]);

        return (
          <button
            key={key}
            type="button"
            onClick={() => handleClick(key)}
            className={`
              relative p-6 rounded-xl border-2 text-left
              ${config.bg} ${config.border}
              ${isSelected ? 'ring-2 ring-offset-2 ring-offset-[var(--bg-primary)] ring-pink-500 scale-105' : ''}
              ${!isSelected && hasSelection ? 'opacity-40' : ''}
              cursor-pointer hover:scale-[1.03] hover:shadow-lg hover:shadow-black/20 active:scale-95 transition-all duration-200
            `}
          >
            <div className={`text-5xl font-bold ${config.text} mb-2`}>
              {animatedValues[key]}
            </div>
            <div className="text-sm font-medium text-[var(--text-secondary)]">
              {config.label[language]}
            </div>
          </button>
        );
      })}
    </div>
  );
}
