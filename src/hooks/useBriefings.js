import { useState, useEffect } from 'react';

export function useBriefings() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Add cache-busting timestamp to avoid stale data
        const response = await fetch(`/data/index.json?t=${Date.now()}`);
        if (!response.ok) throw new Error('Failed to fetch briefings');
        const json = await response.json();
        console.log('Fetched index.json:', json);
        console.log('Stats from index.json:', json?.stats);
        setData(json);
      } catch (err) {
        console.error('Error fetching index.json:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return {
    briefings: data?.briefings || [],
    stats: data?.stats || null,
    lastUpdated: data?.lastUpdated || null,
    indexData: data || null,
    loading,
    error,
  };
}

export function useBriefing(id) {
  const [briefing, setBriefing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBriefing() {
      if (!id) return;

      try {
        const response = await fetch(`/data/briefings/${id}.json`);
        if (!response.ok) throw new Error('Briefing not found');
        const json = await response.json();
        setBriefing(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBriefing();
  }, [id]);

  return { briefing, loading, error };
}
