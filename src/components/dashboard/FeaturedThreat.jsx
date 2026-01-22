import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Shield } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import GradientBorder from '../ui/GradientBorder';

export default function FeaturedThreat({ briefing }) {
  const { language } = useLanguage();

  if (!briefing) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6 }}
    >
      <GradientBorder hover={false}>
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <div className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">
                  {language === 'fi' ? 'Päivän uhka' : 'Featured Threat'}
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-semibold bg-red-500/20 text-red-400 rounded-full border border-red-500/50">
                    {briefing.severity}
                  </span>
                  {briefing.cves?.length > 0 && (
                    <span className="text-sm font-mono text-cyan-400">
                      {briefing.cves[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Shield className="w-8 h-8 text-pink-500/50" />
          </div>

          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">
            {briefing.title}
          </h2>

          <p className="text-[var(--text-secondary)] mb-4 line-clamp-2">
            {briefing.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {briefing.tags?.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-muted)] rounded-lg"
                >
                  {tag}
                </span>
              ))}
            </div>

            <Link
              to={`/briefing/${briefing.id}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              {language === 'fi' ? 'Lue nyt' : 'Read Now'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </GradientBorder>
    </motion.div>
  );
}
