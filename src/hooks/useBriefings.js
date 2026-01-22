import { useState, useEffect } from 'react';

export function useBriefings() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/data/index.json');
        if (!response.ok) throw new Error('Failed to fetch briefings');
        const json = await response.json();
        setData(json);
      } catch (err) {
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
