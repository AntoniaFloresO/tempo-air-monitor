import { useState, useEffect } from 'react';
import api from '../utils/api';
import { ComparisonResponse } from '../types/api';

interface UseComparisonReturn {
  comparison: ComparisonResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useComparison(cityIds: string[] = []): UseComparisonReturn {
  const [comparison, setComparison] = useState<ComparisonResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComparison = async () => {
    if (!cityIds.length) {
      setComparison(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await api.compareCities(cityIds);
      setComparison(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching comparison:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityIds.join(',')]);

  return { comparison, loading, error, refetch: fetchComparison };
}