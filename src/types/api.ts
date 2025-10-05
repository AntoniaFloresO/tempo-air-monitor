// Tipos para la API CleanSky LA (tu API actual)

export interface CleanSkyLAResponse {
  bbox: [number, number, number, number]; // [west, south, east, north]
  generated_at: string;
  grid_resolution_deg: number;
  variables: string[];
  cells: CleanSkyCell[];
}

export interface CleanSkyCell {
  lat: number;
  lon: number;
  risk_score: number;
  class: string;
  no2?: number;
  pm25?: number;
  o3?: number;
  temp?: number;
  wind?: number;
  rain?: number;
}

// Tipos originales para compatibilidad
export interface City {
  id: string;
  name: string;
  bbox: {
    west: number;
    south: number;
    east: number;
    north: number;
  };
  population: number;
  timezone: string;
  has_data: boolean;
  grid_resolution: number;
}

export interface CitiesResponse {
  total_cities: number;
  cities: City[];
  coverage: string;
}

export interface AirQualityCell {
  lat: number;
  lon: number;
  risk_score: number;
  risk_class: string;
  cell_id: string;
  no2: number;
  pm25: number;
  o3: number;
  temp: number;
  wind: number;
}

export interface CityDataResponse {
  city_id: string;
  city_name: string;
  timestamp: string;
  grid_info: {
    total_cells: number;
    bounds: {
      west: number;
      south: number;
      east: number;
      north: number;
    };
  };
  cells: AirQualityCell[];
  summary: {
    high_risk: number;
    moderate_risk: number;
    low_risk: number;
  };
}

export interface GeoJsonFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    risk_score: number;
    risk_class: string;
    cell_id: string;
    no2: number;
    pm25: number;
    o3: number;
    temp: number;
    wind: number;
  };
}

export interface GeoJsonResponse {
  type: 'FeatureCollection';
  properties: {
    name: string;
    city_id: string;
    timestamp: string;
    total_features: number;
  };
  features: GeoJsonFeature[];
}

export interface CityRanking {
  city_id: string;
  city_name: string;
  population: number;
  avg_risk_score: number;
  max_risk_score: number;
  min_risk_score: number;
  high_risk_percentage: number;
  moderate_risk_percentage: number;
  low_risk_percentage: number;
  overall_class: string;
  total_grid_points: number;
  rank?: number;
}

export interface ComparisonResponse {
  timestamp: string;
  comparison_type: string;
  cities_compared: number;
  cities_with_data: number;
  ranking: CityRanking[];
}

export interface AlertResponse {
  city_id: string;
  city_name: string;
  timestamp: string;
  alerts_count: number;
  high_risk_areas: Array<{
    lat: number;
    lon: number;
    risk_score: number;
    cell_id: string;
  }>;
}

export interface PointAirQualityResponse {
  city_id: string;
  city_name: string;
  timestamp: string;
  location: {
    lat: number;
    lon: number;
  };
  nearest_cell: AirQualityCell;
  distance_meters: number;
}