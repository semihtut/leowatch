import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

const severityConfig = {
  critical: {
    label: { en: 'Critical', fi: 'Kriittinen' },
    bg: 'bg-red-500/10',
    border: 'border-red-500/50',
    text: 'text-red-400',
    pulse: true,
  },
  high: {
    label: { en: 'High', fi: 'Korkea' },
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/50',
    text: 'text-orange-400',
    pulse: false,
  },
  medium: {
    label: { en: 'Medium', fi: 'Keskitaso' },
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/50',
    text: 'text-blue-400',
    pulse: false,
  },
  low: {
    label: { en: 'Low', fi: 'Matala' },
    bg: 'bg-green-500/10',
    border: 'border-green-500/50',
    text: 'text-green-400',
    pulse: false,
  },
};

export default function SeverityStats({ stats = {} }) {
  const { language } = useLanguage();

  // Ensure stats has default values
  const safeStats = {
    critical: stats?.critical || 0,
    high: stats?.high || 0,
    medium: stats?.medium || 0,
    low: stats?.low || 0,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(severityConfig).map(([key, config], index) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`
            relative p-6 rounded-xl border-2 ${config.bg} ${config.border}
            ${config.pulse && safeStats[key] > 0 ? 'pulse-critical' : ''}
          `}
        >
          <div className={`text-5xl font-bold ${config.text} mb-2`}>
            {safeStats[key]}
          </div>
          <div className="text-sm font-medium text-[var(--text-secondary)]">
            {config.label[language]}
          </div>
          {config.pulse && safeStats[key] > 0 && (
            <div className="absolute top-3 right-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
