import { RiskLevel } from '@/types/air-quality';

export function calculateAQI(no2: number, o3: number, pm25: number): number {
  // Simplified AQI calculation (in production, use EPA's breakpoint formula)
  const no2AQI = (no2 / 100) * 100;
  const o3AQI = (o3 / 70) * 100;
  const pm25AQI = (pm25 / 35) * 100;

  return Math.round(Math.max(no2AQI, o3AQI, pm25AQI));
}

export function getRiskLevel(aqi: number): RiskLevel {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'unhealthy';
  if (aqi <= 200) return 'very-unhealthy';
  return 'hazardous';
}

export function generateMockData(coords: [number, number]): {
  no2: number;
  o3: number;
  pm25: number;
} {
  // Generate realistic mock data (in production, fetch from TEMPO API)
  return {
    no2: Math.random() * 80 + 10, // 10-90 ppb
    o3: Math.random() * 60 + 20, // 20-80 ppb
    pm25: Math.random() * 30 + 5, // 5-35 μg/m³
  };
}
