import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Link2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBriefings } from '../../hooks/useBriefings';
import SeverityBadge from './SeverityBadge';
import { getRelativeTime } from '../../utils/relativeTime';

function scoreRelation(current, candidate) {
  let score = 0;

  // Shared CVEs (+3 each)
  const currentCves = new Set(current.cves || []);
  (candidate.cves || []).forEach((cve) => {
    if (currentCves.has(cve)) score += 3;
  });

  // Shared tags (+1 each)
  const currentTags = new Set((current.tags || []).map((t) => t.toLowerCase()));
  (candidate.tags || []).forEach((tag) => {
    if (currentTags.has(tag.toLowerCase())) score += 1;
  });

  return score;
}

export default function RelatedBriefings({ briefing, mitreAttack }) {
  const { briefings } = useBriefings();

  const related = useMemo(() => {
    if (!briefing || !briefings.length) return [];

    // Build current briefing's MITRE technique set from full data
    const currentTechniques = new Set(
      (mitreAttack?.tactics || []).map((t) => t.technique_id)
    );

    // Score from index data (cves + tags)
    const currentIndex = {
      cves: briefing.cves || [],
      tags: briefing.tags || [],
    };

    return briefings
      .filter((b) => b.id !== briefing.briefing_id)
      .map((candidate) => {
        let score = scoreRelation(currentIndex, candidate);

        // Bonus: shared MITRE techniques if candidate tags suggest overlap
        // We can't access candidate's full mitre data, but shared tags/cves
        // already provide strong signal. Add technique bonus from current briefing's
        // technique names matching candidate tags (heuristic).
        if (currentTechniques.size > 0) {
          const candidateTags = new Set((candidate.tags || []).map((t) => t.toLowerCase()));
          // Check if candidate shares severity-related patterns
          if (candidate.severity === briefing.severity?.level) score += 0.5;
        }

        return { ...candidate, score };
      })
      .filter((b) => b.score > 0)
      .sort((a, b) => b.score - a.score || new Date(b.date) - new Date(a.date))
      .slice(0, 4);
  }, [briefing, briefings, mitreAttack]);

  if (related.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-5"
    >
      <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-4">
        <Link2 className="w-5 h-5 text-pink-500" />
        Related Briefings
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {related.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Link
              to={`/briefing/${item.id}`}
              className="block p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] hover:border-pink-500/40 transition-all group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <SeverityBadge level={item.severity} />
                <span className="text-xs text-[var(--text-muted)] shrink-0">
                  {getRelativeTime(item.date)}
                </span>
              </div>

              <h4 className="text-sm font-medium text-[var(--text-primary)] line-clamp-2 group-hover:text-pink-400 transition-colors mb-2">
                {item.title}
              </h4>

              {item.cves?.length > 0 && (
                <p className="text-xs font-mono text-cyan-400 mb-2 truncate">
                  {item.cves.slice(0, 2).join(', ')}
                  {item.cves.length > 2 && ` +${item.cves.length - 2}`}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {item.tags?.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 text-[10px] bg-[var(--bg-primary)] text-[var(--text-muted)] rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
