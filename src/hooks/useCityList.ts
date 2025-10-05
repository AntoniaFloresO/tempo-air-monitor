import { useState, useEffect } from 'react';
import api from '../utils/api';
import { CitiesResponse, City } from '../types/api';

interface UseCityListReturn {
  cities: City[];
  activeCities: City[];
  pendingCities: City[];
  loading: boolean;
  error: string | null;
  totalCities: number;
  activeCitiesCount: number;
  refetch: () => void;
}

export function useCityList(): UseCityListReturn {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data: CitiesResponse = await api.getCities();
      setCities(data.cities);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error loading cities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const activeCities = cities.filter(city => city.has_data);
  const pendingCities = cities.filter(city => !city.has_data);

  return {
    cities,
    activeCities,
    pendingCities,
    loading,
    error,
    totalCities: cities.length,
    activeCitiesCount: activeCities.length,
    refetch: fetchCities
  };
}