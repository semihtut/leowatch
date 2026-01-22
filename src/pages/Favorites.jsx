import { useMemo } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { useBriefings } from '../hooks/useBriefings';
import { useFavorites } from '../hooks/useFavorites';
import BriefingCard from '../components/briefing/BriefingCard';

export default function Favorites() {
  const { briefings, loading, error } = useBriefings();
  const { favorites, clearFavorites, favoritesCount } = useFavorites();

  const favoriteBriefings = useMemo(() => {
    return briefings.filter((briefing) => favorites.includes(briefing.id));
  }, [briefings, favorites]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Error loading briefings: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3">
            <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
            Favorites
          </h1>
          <p className="mt-2 text-[var(--text-secondary)]">
            {favoritesCount > 0
              ? `You have ${favoritesCount} saved briefing${favoritesCount > 1 ? 's' : ''}`
              : 'Save important briefings for quick access'}
          </p>
        </div>
        {favoritesCount > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all favorites?')) {
                clearFavorites();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Favorites Grid */}
      {favoriteBriefings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteBriefings.map((briefing, index) => (
            <BriefingCard key={briefing.id} briefing={briefing} index={index} showFavorite />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 glass-card">
          <Heart className="w-16 h-16 mx-auto text-[var(--text-muted)] mb-4" />
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No favorites yet</h3>
          <p className="text-[var(--text-muted)] max-w-md mx-auto">
            Click the heart icon on any briefing to save it here for quick access later.
          </p>
        </div>
      )}
    </div>
  );
}
