import { CleanSkyLAResponse, CleanSkyCell } from '../types/api';

const API_BASE = 'http://0.0.0.0:8002';

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

// Función para convertir los datos de tu API al formato esperado por los componentes
const convertToGeoJSON = (data: CleanSkyLAResponse): any => {
  return {
    type: 'FeatureCollection',
    properties: {
      name: 'CleanSky - Los Angeles, CA',
      city_id: 'los_angeles',
      timestamp: data.generated_at,
      total_features: data.cells.length
    },
    features: data.cells.map((cell) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [cell.lon, cell.lat]
      },
      properties: {
        risk_score: cell.risk_score,
        risk_class: cell.class,
        cell_id: `${cell.lat}_${cell.lon}`,
        no2: cell.no2 || 0,
        pm25: cell.pm25 || 0,
        o3: cell.o3 || 0,
        temp: cell.temp || 273.15, // Default temperature in Kelvin
        wind: cell.wind || 0,
        rain: cell.rain || 0
      }
    }))
  };
};

// Función para simular datos de ciudades basándose en tu API de LA
const generateMockCities = () => {
  return {
    total_cities: 6,
    cities: [
      {
        id: 'los_angeles',
        name: 'Los Angeles, CA',
        bbox: { west: -118.7, south: 33.6, east: -117.8, north: 34.4 },
        population: 3971883,
        timezone: 'America/Los_Angeles',
        has_data: true,
        grid_resolution: 0.05
      },
      // Otras ciudades como "no disponibles" por ahora
      {
        id: 'new_york',
        name: 'New York, NY',
        bbox: { west: -74.3, south: 40.4, east: -73.7, north: 41.0 },
        population: 8336817,
        timezone: 'America/New_York',
        has_data: false,
        grid_resolution: 0.05
      },
      {
        id: 'chicago',
        name: 'Chicago, IL',
        bbox: { west: -88.0, south: 41.6, east: -87.5, north: 42.1 },
        population: 2693976,
        timezone: 'America/Chicago',
        has_data: false,
        grid_resolution: 0.05
      },
      {
        id: 'houston',
        name: 'Houston, TX',
        bbox: { west: -95.8, south: 29.5, east: -95.0, north: 30.1 },
        population: 2320268,
        timezone: 'America/Chicago',
        has_data: false,
        grid_resolution: 0.05
      },
      {
        id: 'seattle',
        name: 'Seattle, WA',
        bbox: { west: -122.5, south: 47.4, east: -122.1, north: 47.8 },
        population: 753675,
        timezone: 'America/Los_Angeles',
        has_data: false,
        grid_resolution: 0.05
      },
      {
        id: 'miami',
        name: 'Miami, FL',
        bbox: { west: -80.4, south: 25.6, east: -80.0, north: 26.0 },
        population: 470914,
        timezone: 'America/New_York',
        has_data: false,
        grid_resolution: 0.05
      }
    ],
    coverage: 'Los Angeles Area (Powered by CleanSky LA API)'
  };
};

export const cleanSkyLAApi = {
  // Info de la API
  getApiInfo: async () => {
    const response = await fetch(`${API_BASE}/`);
    return handleResponse(response);
  },

  // Health check
  getHealth: async () => {
    const response = await fetch(`${API_BASE}/health`);
    return handleResponse(response);
  },

  // Datos más recientes (tu endpoint principal)
  getLatest: async (): Promise<CleanSkyLAResponse> => {
    const response = await fetch(`${API_BASE}/api/latest`);
    return handleResponse<CleanSkyLAResponse>(response);
  },

  // Pronóstico
  getForecast: async () => {
    const response = await fetch(`${API_BASE}/api/forecast`);
    return handleResponse(response);
  },

  // Alertas
  getAlerts: async () => {
    const response = await fetch(`${API_BASE}/api/alerts`);
    return handleResponse(response);
  },

  // Adaptadores para compatibilidad con los componentes existentes
  getCities: async () => {
    // Tu API solo maneja LA, así que devolvemos datos simulados
    return generateMockCities();
  },

  getCityData: async (cityId: string) => {
    if (cityId !== 'los_angeles') {
      throw new ApiError('Solo Los Angeles está disponible actualmente');
    }
    
    const data = await cleanSkyLAApi.getLatest();
    return {
      city_id: 'los_angeles',
      city_name: 'Los Angeles, CA',
      timestamp: data.generated_at,
      grid_info: {
        total_cells: data.cells.length,
        bounds: {
          west: data.bbox[0],
          south: data.bbox[1],
          east: data.bbox[2],
          north: data.bbox[3]
        }
      },
      cells: data.cells.map(cell => ({
        lat: cell.lat,
        lon: cell.lon,
        risk_score: cell.risk_score,
        risk_class: cell.class,
        cell_id: `${cell.lat}_${cell.lon}`,
        no2: cell.no2 || 0,
        pm25: cell.pm25 || 0,
        o3: cell.o3 || 0,
        temp: cell.temp || 273.15,
        wind: cell.wind || 0
      })),
      summary: {
        high_risk: data.cells.filter(c => c.risk_score >= 67).length,
        moderate_risk: data.cells.filter(c => c.risk_score >= 34 && c.risk_score < 67).length,
        low_risk: data.cells.filter(c => c.risk_score < 34).length
      }
    };
  },

  getCityGeoJSON: async (cityId: string) => {
    if (cityId !== 'los_angeles') {
      throw new ApiError('Solo Los Angeles está disponible actualmente');
    }
    
    const data = await cleanSkyLAApi.getLatest();
    return convertToGeoJSON(data);
  },

  compareCities: async (cityIds: string[] | string) => {
    // Solo podemos comparar LA por ahora
    const cities = Array.isArray(cityIds) ? cityIds : [cityIds];
    const availableCities = cities.filter(id => id === 'los_angeles');
    
    if (availableCities.length === 0) {
      throw new ApiError('Ninguna de las ciudades seleccionadas está disponible');
    }

    const data = await cleanSkyLAApi.getLatest();
    const avgRiskScore = data.cells.reduce((sum, cell) => sum + cell.risk_score, 0) / data.cells.length;
    const maxRiskScore = Math.max(...data.cells.map(c => c.risk_score));
    const minRiskScore = Math.min(...data.cells.map(c => c.risk_score));
    
    const highRisk = data.cells.filter(c => c.risk_score >= 67).length;
    const moderateRisk = data.cells.filter(c => c.risk_score >= 34 && c.risk_score < 67).length;
    const lowRisk = data.cells.filter(c => c.risk_score < 34).length;
    const totalCells = data.cells.length;

    return {
      timestamp: data.generated_at,
      comparison_type: 'air_quality_ranking',
      cities_compared: availableCities.length,
      cities_with_data: availableCities.length,
      ranking: [{
        city_id: 'los_angeles',
        city_name: 'Los Angeles, CA',
        population: 3971883,
        avg_risk_score: avgRiskScore,
        max_risk_score: maxRiskScore,
        min_risk_score: minRiskScore,
        high_risk_percentage: (highRisk / totalCells) * 100,
        moderate_risk_percentage: (moderateRisk / totalCells) * 100,
        low_risk_percentage: (lowRisk / totalCells) * 100,
        overall_class: avgRiskScore >= 67 ? 'bad' : avgRiskScore >= 34 ? 'moderate' : 'good',
        total_grid_points: totalCells,
        rank: 1
      }]
    };
  }
};

export default cleanSkyLAApi;