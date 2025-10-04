export type Pollutant = 'no2' | 'o3' | 'pm25';

export type RiskLevel = 'good' | 'moderate' | 'unhealthy' | 'very-unhealthy' | 'hazardous';

export interface AirQualityData {
  aqi: number;
  riskLevel: RiskLevel;
  pollutants: {
    no2: number;
    o3: number;
    pm25: number;
  };
  location: {
    name: string;
    coords: [number, number];
  };
  timestamp: Date;
}

export interface RiskInfo {
  level: RiskLevel;
  label: string;
  color: string;
  description: string;
  recommendations: string[];
}
