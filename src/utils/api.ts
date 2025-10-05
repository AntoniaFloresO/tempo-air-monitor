import {
  CitiesResponse,
  CityDataResponse,
  GeoJsonResponse,
  ComparisonResponse,
  AlertResponse,
  PointAirQualityResponse
} from '../types/api';
import cleanSkyLAApi from './cleanSkyLAApi';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://0.0.0.0:8002/api';

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorMessage = `API Error: ${response.status} ${response.statusText}`;
    throw new ApiError(errorMessage, response.status);
  }
  
  try {
    return await response.json();
  } catch (error) {
    throw new ApiError('Error parsing JSON response');
  }
};

export const api = {
  // Lista de ciudades - usar tu API
  getCities: async (): Promise<CitiesResponse> => {
    return cleanSkyLAApi.getCities();
  },

  // Datos de una ciudad (JSON) - usar tu API
  getCityData: async (cityId: string): Promise<CityDataResponse> => {
    return cleanSkyLAApi.getCityData(cityId);
  },

  // Datos GeoJSON para mapas - usar tu API
  getCityGeoJSON: async (cityId: string): Promise<GeoJsonResponse> => {
    return cleanSkyLAApi.getCityGeoJSON(cityId);
  },

  // Comparar ciudades - usar tu API
  compareCities: async (cityIds: string[] | string): Promise<ComparisonResponse> => {
    return cleanSkyLAApi.compareCities(cityIds);
  },

  // Calidad del aire por coordenadas
  getAirQualityAtPoint: async (
    cityId: string, 
    lat: number, 
    lon: number
  ): Promise<PointAirQualityResponse> => {
    const response = await fetch(`${API_BASE}/cities/${cityId}/airquality?lat=${lat}&lon=${lon}`);
    return handleResponse<PointAirQualityResponse>(response);
  },

  // Alertas
  getCityAlerts: async (cityId: string, threshold: number = 70): Promise<AlertResponse> => {
    const response = await fetch(`${API_BASE}/cities/${cityId}/alerts?threshold=${threshold}`);
    return handleResponse<AlertResponse>(response);
  }
};

export default api;