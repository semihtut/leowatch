import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

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

export default function SeverityStats({ stats = {}, selectedSeverity, onSeverityClick }) {
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
    const isCurrentlySelected = selectedSeverity === severity;
    if (onSeverityClick) {
      onSeverityClick(isCurrentlySelected ? '' : severity);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(severityConfig).map(([key, config], index) => {
        const isSelected = selectedSeverity === severityMap[key];
        const isAllSelected = !selectedSeverity;

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleClick(key)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleClick(key);
              }
            }}
            className={`
              relative p-6 rounded-xl border-2 ${config.bg} ${config.border}
              ${isSelected ? 'ring-2 ring-offset-2 ring-offset-[var(--bg-primary)] ring-pink-500 scale-105' : ''}
              ${!isSelected && !isAllSelected ? 'opacity-50' : ''}
              cursor-pointer hover:scale-105 active:scale-95 transition-all select-none
            `}
          >
            <div className={`text-5xl font-bold ${config.text} mb-2`}>
              {safeStats[key]}
            </div>
            <div className="text-sm font-medium text-[var(--text-secondary)]">
              {config.label[language]}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
