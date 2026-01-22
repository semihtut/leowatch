import { motion } from 'framer-motion';
import { AlertTriangle, Tag, Zap } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function InsightsRow({ stats = {}, topTags = [] }) {
  const { language } = useLanguage();

  const insights = [
    {
      icon: AlertTriangle,
      label: language === 'fi' ? 'CISA KEV' : 'CISA KEV',
      value: stats?.cisaKev || 0,
      suffix: language === 'fi' ? 'lisätty KEV:iin' : 'added to KEV',
      color: 'text-red-400',
      bg: 'bg-red-500/10',
    },
    {
      icon: Tag,
      label: language === 'fi' ? 'Suosituimmat tagit' : 'Top Tags',
      value: topTags?.slice(0, 3).join(', ') || '-',
      suffix: '',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      isText: true,
    },
    {
      icon: Zap,
      label: language === 'fi' ? 'Aktiiviset hyökkäykset' : 'Active Exploits',
      value: stats?.activeExploits || 0,
      suffix: language === 'fi' ? 'aktiivinen' : 'active',
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {insights.map((insight, index) => (
        <motion.div
          key={insight.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + index * 0.1 }}
          className={`glass-card p-4 flex items-center gap-4 ${insight.bg}`}
        >
          <div className={`p-3 rounded-lg ${insight.bg}`}>
            <insight.icon className={`w-6 h-6 ${insight.color}`} />
          </div>
          <div>
            <div className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">
              {insight.label}
            </div>
            {insight.isText ? (
              <div className={`text-sm font-medium ${insight.color}`}>
                {insight.value}
              </div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold ${insight.color}`}>
                  {insight.value}
                </span>
                <span className="text-sm text-[var(--text-secondary)]">
                  {insight.suffix}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
