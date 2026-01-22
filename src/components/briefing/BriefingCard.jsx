import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Heart } from 'lucide-react';
import SeverityBadge from './SeverityBadge';
import { useFavorites } from '../../hooks/useFavorites';

export default function BriefingCard({ briefing, index = 0, showFavorite = true }) {
  const { id, title, severity, date, tags = [], sourcesCount, excerpt, cves = [] } = briefing;
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(id);

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link to={`/briefing/${id}`} className="block h-full">
        <div className="h-full glass-card p-5 hover:border-pink-500/50 transition-all group relative">
          {/* Favorite Button */}
          {showFavorite && (
            <button
              onClick={handleFavoriteClick}
              className={`absolute top-4 right-4 p-2 rounded-lg transition-all z-10 ${
                favorited
                  ? 'text-pink-500 bg-pink-500/10'
                  : 'text-[var(--text-muted)] hover:text-pink-400 hover:bg-[var(--bg-card-hover)]'
              }`}
              title={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-5 h-5 ${favorited ? 'fill-pink-500' : ''}`} />
            </button>
          )}

          {/* Header */}
          <div className="flex justify-between items-start mb-3 pr-10">
            <SeverityBadge level={severity} />
            <span className="text-[var(--text-muted)] text-sm">{formattedDate}</span>
          </div>

          {/* Title */}
          <h3 className="text-[var(--text-primary)] font-semibold text-lg mb-2 line-clamp-2 group-hover:text-pink-400 transition-colors">
            {title}
          </h3>

          {/* CVEs */}
          {cves.length > 0 && (
            <p className="text-cyan-400 text-sm mb-2 font-mono">
              {cves.slice(0, 3).join(', ')}
              {cves.length > 3 && ` +${cves.length - 3}`}
            </p>
          )}

          {/* Excerpt */}
          <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-2">
            {excerpt}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-xs rounded"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 4 && (
                <span className="px-2 py-1 text-[var(--text-muted)] text-xs">
                  +{tags.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-between items-center pt-3 border-t border-[var(--border-default)]">
            <span className="text-[var(--text-muted)] text-sm">{sourcesCount} sources</span>
            <span className="text-pink-400 hover:text-pink-300 flex items-center gap-1 text-sm font-medium">
              Read <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
