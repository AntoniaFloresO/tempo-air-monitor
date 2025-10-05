import { useState, useEffect } from 'react';
import api from '../utils/api';
import { CityDataResponse, GeoJsonResponse } from '../types/api';

interface UseCityDataReturn {
  data: CityDataResponse | GeoJsonResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCityData(
  cityId: string | null, 
  format: 'json' | 'geojson' = 'json'
): UseCityDataReturn {
  const [data, setData] = useState<CityDataResponse | GeoJsonResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!cityId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = format === 'geojson' 
        ? await api.getCityGeoJSON(cityId)
        : await api.getCityData(cityId);
        
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error(`Error loading data for ${cityId}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityId, format]);

  return { data, loading, error, refetch: fetchData };
}