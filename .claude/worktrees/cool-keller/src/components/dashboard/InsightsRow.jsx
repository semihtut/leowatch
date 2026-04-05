import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Tag, Zap, Info } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import useCountUp from '../../hooks/useCountUp';

function Tooltip({ children, text }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="cursor-help"
      >
        {children}
      </div>
      {show && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs text-[var(--text-primary)] bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg shadow-lg w-64 text-left">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-[var(--border-default)]"></div>
          </div>
        </div>
      )}
    </div>
  );
}

function AnimatedNumber({ value, className }) {
  const animated = useCountUp(value);
  return <span className={className}>{animated}</span>;
}

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
      tooltip: language === 'fi'
        ? 'CISA KEV (Known Exploited Vulnerabilities) on Yhdysvaltain kyberturvallisuusviraston ylläpitämä lista aktiivisesti hyväksikäytetyistä haavoittuvuuksista. Nämä tulee korjata välittömästi.'
        : 'CISA KEV (Known Exploited Vulnerabilities) is a catalog maintained by the US Cybersecurity Agency of vulnerabilities that are actively being exploited in the wild. These require immediate patching.',
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
      tooltip: language === 'fi'
        ? 'Aktiiviset hyökkäykset tarkoittaa haavoittuvuuksia, joita hyökkääjät käyttävät juuri nyt aktiivisesti. Näiden korjaaminen on erittäin kiireellistä.'
        : 'Active Exploits are vulnerabilities that attackers are currently using in real attacks. Patching these is extremely urgent as exploitation is ongoing.',
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
          className={`glass-card p-4 flex items-center gap-4 ${insight.bg} hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20 transition-all duration-200`}
        >
          <div className={`p-3 rounded-lg ${insight.bg}`}>
            <insight.icon className={`w-6 h-6 ${insight.color}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">
              {insight.label}
              {insight.tooltip && (
                <Tooltip text={insight.tooltip}>
                  <Info className="w-3.5 h-3.5 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors" />
                </Tooltip>
              )}
            </div>
            {insight.isText ? (
              <div className={`text-sm font-medium ${insight.color}`}>
                {insight.value}
              </div>
            ) : (
              <div className="flex items-baseline gap-2">
                <AnimatedNumber value={insight.value} className={`text-2xl font-bold ${insight.color}`} />
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
