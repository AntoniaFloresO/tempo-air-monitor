import L from 'leaflet';

// Configuración de íconos de Leaflet para corregir problemas comunes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Centros de ciudades
export const CITY_CENTERS: Record<string, [number, number]> = {
  'los_angeles': [34.05, -118.25],
  'new_york': [40.71, -74.01],
  'chicago': [41.88, -87.63],
  'houston': [29.76, -95.37],
  'seattle': [47.61, -122.33],
  'miami': [25.76, -80.19]
};

// Bounds por ciudad
export const CITY_BOUNDS: Record<string, [[number, number], [number, number]]> = {
  'los_angeles': [[-118.7, 33.6], [-117.8, 34.4]],
  'new_york': [[-74.3, 40.4], [-73.7, 41.0]],
  'chicago': [[-88.0, 41.6], [-87.5, 42.1]],
  'houston': [[-95.8, 29.5], [-95.0, 30.1]],
  'seattle': [[-122.5, 47.4], [-122.1, 47.8]],
  'miami': [[-80.4, 25.6], [-80.0, 26.0]]
};

// Función para obtener color según risk_score
export function getRiskColor(riskScore: number): string {
  if (riskScore >= 67) return '#ef4444'; // Rojo - Bad
  if (riskScore >= 34) return '#f97316'; // Naranja - Moderate  
  return '#22c55e'; // Verde - Good
}

// Función para obtener texto de clasificación
export function getRiskClass(riskScore: number): string {
  if (riskScore >= 67) return 'Mala';
  if (riskScore >= 34) return 'Moderada';
  return 'Buena';
}

// Función para obtener emoji según ranking
export function getRankEmoji(rank: number): string {
  const emojis: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };
  return emojis[rank] || `#${rank}`;
}

// Función para formatear temperatura de Kelvin a Celsius
export function formatTemperature(kelvin: number): string {
  return (kelvin - 273.15).toFixed(1);
}

// Función para formatear concentraciones de ppb
export function formatConcentration(value: number): string {
  return (value * 1e9).toFixed(2);
}