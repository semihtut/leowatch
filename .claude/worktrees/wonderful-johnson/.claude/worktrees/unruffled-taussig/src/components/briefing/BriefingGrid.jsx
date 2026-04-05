import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import BriefingCard from './BriefingCard';

export default function BriefingGrid({ briefings = [], title = 'Recent Briefings', showViewAll = true }) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">{title}</h2>
        {showViewAll && briefings.length > 0 && (
          <Link
            to="/archive"
            className="flex items-center gap-1 text-sm text-pink-500 hover:text-pink-400 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Grid */}
      {briefings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {briefings.map((briefing, index) => (
            <BriefingCard key={briefing.id} briefing={briefing} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 glass-card">
          <p className="text-[var(--text-muted)]">No briefings found.</p>
        </div>
      )}
    </div>
  );
}
