import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'threatbrief_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  const saveFavorites = useCallback((newFavorites) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, []);

  // Check if a briefing is favorited
  const isFavorite = useCallback((briefingId) => {
    return favorites.includes(briefingId);
  }, [favorites]);

  // Toggle favorite status
  const toggleFavorite = useCallback((briefingId) => {
    const newFavorites = favorites.includes(briefingId)
      ? favorites.filter((id) => id !== briefingId)
      : [...favorites, briefingId];
    saveFavorites(newFavorites);
  }, [favorites, saveFavorites]);

  // Add to favorites
  const addFavorite = useCallback((briefingId) => {
    if (!favorites.includes(briefingId)) {
      saveFavorites([...favorites, briefingId]);
    }
  }, [favorites, saveFavorites]);

  // Remove from favorites
  const removeFavorite = useCallback((briefingId) => {
    saveFavorites(favorites.filter((id) => id !== briefingId));
  }, [favorites, saveFavorites]);

  // Clear all favorites
  const clearFavorites = useCallback(() => {
    saveFavorites([]);
  }, [saveFavorites]);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
    favoritesCount: favorites.length,
  };
}
