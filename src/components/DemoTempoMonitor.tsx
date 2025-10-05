import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Eye, Wind, Thermometer, Droplets, Activity } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Custom scrollbar styles
const customScrollbarStyle = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(51, 65, 85, 0.3);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(34, 211, 238, 0.5);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(34, 211, 238, 0.7);
  }
`;

// Inject custom styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerHTML = customScrollbarStyle;
  document.head.appendChild(styleSheet);
}

// Tipos TypeScript
interface CityData {
  name: string;
  lat: number;
  lng: number;
  aqi: number;
  level: string;
  pollutants: Record<string, number>;
  temperature: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  lastUpdate: string;
}

// Datos ficticios para la demostración - Región TEMPO
const generateMockData = () => {
  const cities = [
    // Estados Unidos - Principales ciudades
    { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, aqi: 155, level: 'Unhealthy for Sensitive Groups' },
    { name: 'New York', lat: 40.7128, lng: -74.0060, aqi: 98, level: 'Moderate' },
    { name: 'Houston', lat: 29.7604, lng: -95.3698, aqi: 167, level: 'Unhealthy' },
    { name: 'Phoenix', lat: 33.4484, lng: -112.0740, aqi: 134, level: 'Unhealthy for Sensitive Groups' },
    { name: 'Chicago', lat: 41.8781, lng: -87.6298, aqi: 87, level: 'Moderate' },
    { name: 'Miami', lat: 25.7617, lng: -80.1918, aqi: 76, level: 'Moderate' },
    { name: 'Seattle', lat: 47.6062, lng: -122.3321, aqi: 65, level: 'Moderate' },
    { name: 'Denver', lat: 39.7392, lng: -104.9903, aqi: 112, level: 'Unhealthy for Sensitive Groups' },
    { name: 'Atlanta', lat: 33.7490, lng: -84.3880, aqi: 89, level: 'Moderate' },
    { name: 'Detroit', lat: 42.3314, lng: -83.0458, aqi: 94, level: 'Moderate' },
    
    // Canadá - Ciudades principales
    { name: 'Toronto', lat: 43.6532, lng: -79.3832, aqi: 72, level: 'Moderate' },
    { name: 'Vancouver', lat: 49.2827, lng: -123.1207, aqi: 58, level: 'Moderate' },
    { name: 'Montreal', lat: 45.5017, lng: -73.5673, aqi: 69, level: 'Moderate' },
    { name: 'Calgary', lat: 51.0447, lng: -114.0719, aqi: 81, level: 'Moderate' },
    { name: 'Edmonton', lat: 53.5461, lng: -113.4938, aqi: 77, level: 'Moderate' },
    { name: 'Ottawa', lat: 45.4215, lng: -75.6972, aqi: 63, level: 'Moderate' },
    
    // México - Norte del país (región TEMPO)
    { name: 'Mexico City', lat: 19.4326, lng: -99.1332, aqi: 189, level: 'Unhealthy' },
    { name: 'Tijuana', lat: 32.5149, lng: -117.0382, aqi: 145, level: 'Unhealthy for Sensitive Groups' },
    { name: 'Monterrey', lat: 25.6866, lng: -100.3161, aqi: 156, level: 'Unhealthy for Sensitive Groups' },
    { name: 'Ciudad Juárez', lat: 31.6904, lng: -106.4245, aqi: 134, level: 'Unhealthy for Sensitive Groups' },
    { name: 'Guadalajara', lat: 20.6597, lng: -103.3496, aqi: 142, level: 'Unhealthy for Sensitive Groups' },
    { name: 'Mexicali', lat: 32.6519, lng: -115.4683, aqi: 167, level: 'Unhealthy' },
  ];

  const pollutants = ['NO2', 'O3', 'PM2.5', 'PM10', 'SO2', 'CO'];
  
  return cities.map(city => ({
    ...city,
    pollutants: pollutants.reduce((acc, pollutant) => {
      acc[pollutant] = Math.floor(Math.random() * 200) + 10;
      return acc;
    }, {} as Record<string, number>),
    temperature: Math.floor(Math.random() * 25) + 15,
    humidity: Math.floor(Math.random() * 40) + 40,
    windSpeed: Math.floor(Math.random() * 15) + 5,
    visibility: Math.floor(Math.random() * 8) + 2,
    lastUpdate: new Date(Date.now() - Math.random() * 3600000).toISOString(),
  }));
};

const getAQIColor = (aqi: number) => {
  if (aqi <= 50) return 'bg-green-500';
  if (aqi <= 100) return 'bg-yellow-500';
  if (aqi <= 150) return 'bg-orange-500';
  if (aqi <= 200) return 'bg-red-500';
  if (aqi <= 300) return 'bg-purple-500';
  return 'bg-red-900';
};

const getAQITextColor = (aqi: number) => {
  if (aqi <= 50) return 'text-green-400';
  if (aqi <= 100) return 'text-yellow-400';
  if (aqi <= 150) return 'text-orange-400';
  if (aqi <= 200) return 'text-red-400';
  if (aqi <= 300) return 'text-purple-400';
  return 'text-red-300';
};

// Air Risk Score System (1-100 scale)
const calculateAirRiskScore = (city: CityData) => {
  const { aqi, pollutants, temperature, humidity, windSpeed } = city;
  
  // Base score from AQI (inverted - higher AQI means higher risk, lower score)
  const baseScore = Math.max(0, 100 - (aqi * 0.5));
  
  // Pollutant factor (average of top 3 pollutants)
  const pollutantValues = Object.values(pollutants);
  const topPollutants = pollutantValues.sort((a, b) => b - a).slice(0, 3);
  const avgPollutant = topPollutants.reduce((sum, val) => sum + val, 0) / topPollutants.length;
  const pollutantPenalty = Math.min(20, avgPollutant / 10);
  
  // Environmental factors
  let environmentalBonus = 0;
  
  // Wind helps disperse pollutants
  if (windSpeed > 10) environmentalBonus += 5;
  else if (windSpeed < 5) environmentalBonus -= 3;
  
  // Optimal humidity range (40-60%)
  if (humidity >= 40 && humidity <= 60) environmentalBonus += 2;
  else if (humidity > 80 || humidity < 30) environmentalBonus -= 2;
  
  // Temperature extremes can worsen air quality perception
  if (temperature > 35 || temperature < 0) environmentalBonus -= 2;
  
  const finalScore = Math.max(1, Math.min(100, baseScore - pollutantPenalty + environmentalBonus));
  return Math.round(finalScore);
};

const getAirRiskLevel = (score: number) => {
  if (score >= 85) return { level: 'Excellent', color: 'text-green-400', bgColor: 'bg-green-500', description: 'Air is very safe to breathe' };
  if (score >= 70) return { level: 'Good', color: 'text-green-300', bgColor: 'bg-green-400', description: 'Air quality is satisfactory' };
  if (score >= 55) return { level: 'Moderate', color: 'text-yellow-400', bgColor: 'bg-yellow-500', description: 'Acceptable for most people' };
  if (score >= 40) return { level: 'Poor', color: 'text-orange-400', bgColor: 'bg-orange-500', description: 'Sensitive groups should limit outdoor activities' };
  if (score >= 25) return { level: 'Very Poor', color: 'text-red-400', bgColor: 'bg-red-500', description: 'Health warnings of emergency conditions' };
  return { level: 'Hazardous', color: 'text-red-300', bgColor: 'bg-red-600', description: 'Everyone should avoid outdoor activities' };
};

const AirRiskScoreDisplay = ({ city }: { city: CityData }) => {
  const score = calculateAirRiskScore(city);
  const riskInfo = getAirRiskLevel(score);
  
  return (
    <div className="p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/30 rounded-lg border border-cyan-400/10">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm lg:text-base text-white/90 flex items-center">
          <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></div>
          Air Risk Score
        </h4>
        <div className="text-right">
          <div className={`text-2xl lg:text-3xl font-bold ${riskInfo.color}`}>
            {score}
          </div>
          <div className="text-xs text-white/60">out of 100</div>
        </div>
      </div>
      
      {/* Score Bar */}
      <div className="mb-3">
        <div className="w-full bg-slate-600/50 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-1000 ${riskInfo.bgColor}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
      
      {/* Risk Level */}
      <div className="flex items-center justify-between">
        <div>
          <span className={`font-semibold ${riskInfo.color}`}>{riskInfo.level}</span>
          <p className="text-xs text-white/70 mt-1">{riskInfo.description}</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/60">Based on</div>
          <div className="text-xs text-white/80">AQI, Pollutants & Weather</div>
        </div>
      </div>
    </div>
  );
};

const getMarkerColor = (aqi: number) => {
  if (aqi <= 50) return '#10b981'; // green
  if (aqi <= 100) return '#f59e0b'; // yellow
  if (aqi <= 150) return '#f97316'; // orange
  if (aqi <= 200) return '#ef4444'; // red
  if (aqi <= 300) return '#a855f7'; // purple
  return '#7f1d1d'; // dark red
};

const getMarkerRadius = (aqi: number) => {
  return Math.max(8, Math.min(25, aqi / 8));
};

const MapLayerControl = ({ currentLayer, onLayerChange }: { currentLayer: string; onLayerChange: (layer: string) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const layers = [
    { id: 'dark', name: 'Dark', icon: '🌙', shortName: 'Dark' },
    { id: 'satellite', name: 'Satellite', icon: '🛰️', shortName: 'Sat' },
    { id: 'terrain', name: 'Terrain', icon: '🏔️', shortName: 'Topo' },
    { id: 'street', name: 'Streets', icon: '🗺️', shortName: 'Street' },
  ];

  const currentLayerInfo = layers.find(l => l.id === currentLayer);

  return (
    <>
      {/* Desktop Version */}
      <div className="hidden md:block absolute top-4 right-4 z-[1000] bg-slate-900/95 backdrop-blur-sm border border-cyan-400/20 rounded-lg p-2 shadow-xl">
        <div className="flex flex-col space-y-1">
          {layers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => onLayerChange(layer.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                currentLayer === layer.id 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-sm' 
                  : 'text-white/70 hover:bg-slate-800/50 hover:text-white hover:scale-105'
              }`}
            >
              <span className="text-base">{layer.icon}</span>
              <span className="font-medium">{layer.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Version */}
      <div className="md:hidden absolute top-4 right-4 z-[1000]">
        <div className="relative">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 px-3 py-2 bg-slate-900/95 backdrop-blur-sm border border-cyan-400/20 rounded-lg shadow-xl text-white/90 hover:text-cyan-300 transition-all duration-200"
          >
            <span className="text-base">{currentLayerInfo?.icon}</span>
            <span className="text-sm font-medium">{currentLayerInfo?.shortName}</span>
            <svg 
              className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isExpanded && (
            <div className="absolute top-full right-0 mt-2 bg-slate-900/95 backdrop-blur-sm border border-cyan-400/20 rounded-lg p-2 shadow-xl min-w-[120px]">
              {layers.filter(layer => layer.id !== currentLayer).map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => {
                    onLayerChange(layer.id);
                    setIsExpanded(false);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm text-white/70 hover:bg-slate-800/50 hover:text-white transition-all duration-200 w-full"
                >
                  <span className="text-base">{layer.icon}</span>
                  <span className="font-medium">{layer.shortName}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const AirQualityMap = ({ cities, onCitySelect }: { cities: CityData[]; onCitySelect: (city: CityData) => void }) => {
  const [currentLayer, setCurrentLayer] = useState('dark');
  
  // Centro específico de la región TEMPO (Norte de EE.UU., sur de Canadá, norte de México)
  const center: [number, number] = [45.0, -100.0]; // Más al norte para incluir Canadá
  const zoom = 4;

  const getTileLayerUrl = (layerType: string) => {
    switch (layerType) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'terrain':
        return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      case 'street':
        return 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
      case 'dark':
      default:
        return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    }
  };

  const getTileLayerAttribution = (layerType: string) => {
    switch (layerType) {
      case 'satellite':
        return '&copy; <a href="https://www.esri.com/">Esri</a>';
      case 'terrain':
        return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://opentopomap.org">OpenTopoMap</a>';
      case 'street':
        return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
      case 'dark':
      default:
        return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
    }
  };

  return (
    <div className="h-full w-full rounded-lg overflow-hidden relative">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        bounds={[
          [25.0, -140.0], // Suroeste (incluye el oeste de México)
          [65.0, -60.0]   // Noreste (incluye el este de Canadá)
        ]}
        maxBounds={[
          [20.0, -150.0], // Límites máximos
          [70.0, -50.0]
        ]}
        minZoom={3}
        maxZoom={10}
      >
        <TileLayer
          key={currentLayer}
          url={getTileLayerUrl(currentLayer)}
          attribution={getTileLayerAttribution(currentLayer)}
        />
        
        {/* Overlay para mostrar la cobertura de TEMPO */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm border border-cyan-400/20 rounded-lg p-3 text-white/90 text-sm">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="font-semibold">TEMPO Coverage Area</span>
            </div>
            <p className="text-xs text-white/70">North America: USA, Canada, Mexico</p>
          </div>
        </div>

        {cities.map((city, index) => (
          <CircleMarker
            key={index}
            center={[city.lat, city.lng]}
            radius={getMarkerRadius(city.aqi)}
            pathOptions={{
              fillColor: getMarkerColor(city.aqi),
              color: '#ffffff',
              weight: 2,
              opacity: 0.9,
              fillOpacity: 0.7,
            }}
            eventHandlers={{
              click: () => onCitySelect(city),
              mouseover: (e) => {
                e.target.setStyle({
                  weight: 3,
                  fillOpacity: 0.9,
                });
              },
              mouseout: (e) => {
                e.target.setStyle({
                  weight: 2,
                  fillOpacity: 0.7,
                });
              },
            }}
          >
            <Popup>
              <div className="text-center p-3 min-w-[180px]">
                <h3 className="font-bold text-lg text-gray-800 mb-2">{city.name}</h3>
                
                {/* Air Risk Score in Popup */}
                <div className="mb-3 p-2 bg-gray-100 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600">Air Risk Score</span>
                    <span className={`text-lg font-bold ${getAirRiskLevel(calculateAirRiskScore(city)).color.replace('text-', 'text-')}`}>
                      {calculateAirRiskScore(city)}/100
                    </span>
                  </div>
                  <div className="text-xs text-gray-700 font-medium">
                    {getAirRiskLevel(calculateAirRiskScore(city)).level}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm">
                    AQI: <span className={`font-semibold ${city.aqi > 100 ? 'text-red-600' : city.aqi > 50 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {city.aqi}
                    </span>
                  </p>
                  <p className="text-xs text-gray-600">{city.level}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <div>🌡️ {city.temperature}°C</div>
                    <div>💧 {city.humidity}%</div>
                    <div>💨 {city.windSpeed} km/h</div>
                    <div>👁️ {city.visibility} km</div>
                  </div>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      
      <MapLayerControl currentLayer={currentLayer} onLayerChange={setCurrentLayer} />
    </div>
  );
};

const HeatmapCell = ({ city, onClick }: { city: CityData; onClick: () => void }) => {
  const colorClass = getAQIColor(city.aqi);
  const intensity = Math.min(city.aqi / 200, 1);
  
  return (
    <div
      className={`relative cursor-pointer transition-all duration-300 hover:scale-110 hover:z-10 ${colorClass} rounded-lg p-3 m-1 shadow-lg`}
      style={{ opacity: 0.7 + intensity * 0.3 }}
      onClick={onClick}
    >
      <div className="text-white font-bold text-sm">{city.name}</div>
      <div className="text-white text-xs">{city.aqi} AQI</div>
    </div>
  );
};

const PollutantBar = ({ name, value, max = 200 }: { name: string; value: number; max?: number }) => {
  const percentage = (value / max) * 100;
  const colorClass = getAQIColor(value);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-white/80">{name}</span>
        <span className="text-white font-semibold">{value} μg/m³</span>
      </div>
      <div className="w-full bg-slate-700/50 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

export const DemoTempoMonitor = () => {
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [cities, setCities] = useState<CityData[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setCities(generateMockData());
    setSelectedCity(generateMockData()[0]);
    
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      // Simular actualizaciones de datos cada 30 segundos
      if (Math.random() > 0.7) {
        setCities(prev => prev.map(city => ({
          ...city,
          aqi: Math.max(10, city.aqi + (Math.random() - 0.5) * 20),
          pollutants: Object.keys(city.pollutants).reduce((acc, key) => {
            acc[key] = Math.max(5, city.pollutants[key] + (Math.random() - 0.5) * 15);
            return acc;
          }, {} as Record<string, number>)
        })));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);



  const averageAQI = cities.length > 0 ? Math.round(cities.reduce((sum, city) => sum + city.aqi, 0) / cities.length) : 0;
  const criticalCities = cities.filter(city => city.aqi > 150).length;
  const averageRiskScore = cities.length > 0 ? Math.round(cities.reduce((sum, city) => sum + calculateAirRiskScore(city), 0) / cities.length) : 0;
  const safeAirCities = cities.filter(city => calculateAirRiskScore(city) >= 70).length;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Simplified Space Background - Static for better performance */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Deep Space Gradient - Static */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950/70 to-slate-900">
          {/* Static Stars Layer */}
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                  width: `${Math.random() * 2}px`,
                  height: `${Math.random() * 2}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: 0.3 + Math.random() * 0.5,
                }}
              />
            ))}
          </div>

          {/* Atmospheric Light Effects - Static */}
          <div className="absolute inset-0">
            <div className="absolute top-[20%] left-[15%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[25%] right-[25%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px]" />
            <div className="absolute top-[50%] right-[15%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
          </div>
        </div>

        {/* Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950/80" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Header with fade */}
        <div className="relative">
          <section className="pt-32 pb-20 bg-gradient-to-b from-blue-950/30 via-slate-950 to-slate-900/40">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto text-center relative"
              >
                {/* Back to Home Button - Positioned in header left */}
                <div className="absolute top-0 left-0 hidden sm:block">
                  <button
                    onClick={() => window.location.href = '/'}
                    className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-400/30 hover:to-blue-500/30 text-cyan-300 hover:text-cyan-200 rounded-full border border-cyan-400/30 hover:border-cyan-400/50 backdrop-blur-sm transition-all duration-300 hover:scale-110 group"
                    title="Back to Home"
                  >
                    <svg 
                      className="w-5 h-5 group-hover:translate-x-[-2px] transition-transform duration-200" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                      />
                    </svg>
                  </button>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    TEMPO Air Quality
                  </span>
                  <br />
                  Monitor
                </h1>
                <p className="text-xl text-white/70 font-light mb-8">
                  Real-time atmospheric monitoring for North America
                </p>
                
                {/* Mobile Back to Home Button */}
                <div className="sm:hidden mb-6">
                  <button
                    onClick={() => window.location.href = '/'}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-400/30 hover:to-blue-500/30 text-cyan-300 hover:text-cyan-200 rounded-lg border border-cyan-400/30 hover:border-cyan-400/50 backdrop-blur-sm transition-all duration-300 text-sm"
                  >
                    <svg 
                      className="w-4 h-4 mr-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                      />
                    </svg>
                    Back to Home
                  </button>
                </div>

                <div className="text-right max-w-xs ml-auto">
                  <div className="text-sm text-white/60">Last Update</div>
                  <div className="text-lg font-mono text-cyan-300">{currentTime.toLocaleTimeString()}</div>
                </div>
              </motion.div>
            </div>
          </section>
          {/* Fade to next section */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-slate-950 pointer-events-none z-10" />
        </div>

        {/* Stats Overview - Responsive Design */}
        <div className="relative">
          <section className="py-8 md:py-12 border-y border-cyan-400/20 bg-slate-900/30">
            <div className="container mx-auto px-4 max-w-7xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
              >
                <Card className="bg-slate-800/80 border border-cyan-400/40 backdrop-blur-sm hover:shadow-xl hover:shadow-cyan-500/20 hover:border-cyan-400/60 transition-all duration-300 hover:scale-105">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                      <div className="relative">
                        <Activity className="h-6 w-6 md:h-8 md:w-8 text-cyan-400 flex-shrink-0" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs md:text-sm text-white/80 font-medium">Air Risk Score</p>
                        <p className={`text-lg md:text-2xl font-bold ${getAirRiskLevel(averageRiskScore).color} truncate`}>
                          {averageRiskScore}/100
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-800/80 border border-cyan-400/40 backdrop-blur-sm hover:shadow-xl hover:shadow-cyan-500/20 hover:border-cyan-400/60 transition-all duration-300 hover:scale-105">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                      <AlertTriangle className="h-6 w-6 md:h-8 md:w-8 text-red-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs md:text-sm text-white/80 font-medium">Critical Cities</p>
                        <p className="text-lg md:text-2xl font-bold text-red-400">{criticalCities}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-800/80 border border-cyan-400/40 backdrop-blur-sm hover:shadow-xl hover:shadow-cyan-500/20 hover:border-cyan-400/60 transition-all duration-300 hover:scale-105">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                      <Eye className="h-6 w-6 md:h-8 md:w-8 text-green-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs md:text-sm text-white/80 font-medium">Safe Air Cities</p>
                        <p className="text-lg md:text-2xl font-bold text-green-400">{safeAirCities}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-800/80 border border-cyan-400/40 backdrop-blur-sm hover:shadow-xl hover:shadow-cyan-500/20 hover:border-cyan-400/60 transition-all duration-300 hover:scale-105">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                      <Wind className="h-6 w-6 md:h-8 md:w-8 text-purple-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs md:text-sm text-white/80 font-medium">Total Cities</p>
                        <p className="text-lg md:text-2xl font-bold text-purple-400">{cities.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>
        </div>

        {/* Main Dashboard - Improved Responsive Layout */}
        <div className="relative">
          <section className="py-8 md:py-16 lg:py-20 bg-slate-900/40">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 md:top-20 left-5 md:left-10 w-48 h-48 md:w-72 md:h-72 bg-cyan-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-10 md:bottom-20 right-5 md:right-10 w-64 h-64 md:w-96 md:h-96 bg-blue-500/20 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                {/* Map Section */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="xl:col-span-2 relative group"
                >
                  {/* Decorative corners - Hidden on mobile for cleaner look */}
                  <div className="hidden lg:block absolute -top-2 -left-2 w-16 h-16 xl:w-20 xl:h-20 border-t-2 border-l-2 border-cyan-400/50 rounded-tl-3xl z-10" />
                  <div className="hidden lg:block absolute -top-2 -right-2 w-16 h-16 xl:w-20 xl:h-20 border-t-2 border-r-2 border-purple-400/50 rounded-tr-3xl z-10" />
                  <div className="hidden lg:block absolute -bottom-2 -left-2 w-16 h-16 xl:w-20 xl:h-20 border-b-2 border-l-2 border-blue-400/50 rounded-bl-3xl z-10" />
                  <div className="hidden lg:block absolute -bottom-2 -right-2 w-16 h-16 xl:w-20 xl:h-20 border-b-2 border-r-2 border-pink-400/50 rounded-br-3xl z-10" />
                  
                  <Card className="bg-slate-900/50 border border-cyan-400/20 backdrop-blur-sm hover:shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-400/40 transition-all duration-300 h-full">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center space-x-2 text-white text-lg md:text-xl">
                        <Activity className="h-5 w-5 md:h-6 md:w-6 text-cyan-400 flex-shrink-0" />
                        <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                          Interactive Air Quality Map
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px] p-4 lg:p-6">
                      <AirQualityMap cities={cities} onCitySelect={setSelectedCity} />
                      
                      {/* Leyenda */}
                      <div className="mt-4 flex flex-wrap items-center justify-center space-x-4 text-xs">
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-white/70">Good (0-50)</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-white/70">Moderate (51-100)</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span className="text-white/70">Unhealthy for Sensitive (101-150)</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-white/70">Unhealthy (151-200)</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-white/70">Very Unhealthy (201-300)</span>
                        </div>
                      </div>
                    
                    </CardContent>
                  </Card>
                </motion.div>

                {/* City Details - Responsive Sidebar */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="xl:col-span-1 space-y-4 lg:space-y-6"
                >
                  {selectedCity ? (
                    <Card className="bg-slate-900/50 border border-cyan-400/20 backdrop-blur-sm hover:shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-400/40 transition-all duration-300">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-white">
                          <span className="text-lg md:text-xl font-bold truncate">{selectedCity.name}</span>
                          <Badge className={`${getAQIColor(selectedCity.aqi)} text-white self-start sm:self-center flex-shrink-0`}>
                            {selectedCity.aqi} AQI
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 lg:space-y-6 p-4 lg:p-6">
                        {/* Environmental Metrics - Responsive Grid */}
                        <div className="grid grid-cols-2 gap-3 lg:gap-4">
                          <div className="flex items-center space-x-2 p-2 bg-slate-800/30 rounded-lg">
                            <Thermometer className="h-4 w-4 text-red-400 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-white/60 font-medium">Temperature</p>
                              <p className="font-semibold text-white text-sm lg:text-base">{selectedCity.temperature}°C</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 p-2 bg-slate-800/30 rounded-lg">
                            <Droplets className="h-4 w-4 text-blue-400 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-white/60 font-medium">Humidity</p>
                              <p className="font-semibold text-white text-sm lg:text-base">{selectedCity.humidity}%</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 p-2 bg-slate-800/30 rounded-lg">
                            <Wind className="h-4 w-4 text-green-400 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-white/60 font-medium">Wind Speed</p>
                              <p className="font-semibold text-white text-sm lg:text-base">{selectedCity.windSpeed} km/h</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 p-2 bg-slate-800/30 rounded-lg">
                            <Eye className="h-4 w-4 text-purple-400 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-white/60 font-medium">Visibility</p>
                              <p className="font-semibold text-white text-sm lg:text-base">{selectedCity.visibility} km</p>
                            </div>
                          </div>
                        </div>

                        {/* Pollutants - Improved Mobile Experience */}
                        <div className="space-y-3 lg:space-y-4">
                          <h4 className="font-semibold text-sm lg:text-base text-white/90 flex items-center">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></div>
                            Pollutant Levels
                          </h4>
                          <div className="space-y-3">
                            {Object.entries(selectedCity.pollutants).slice(0, 4).map(([pollutant, value]) => (
                              <PollutantBar key={pollutant} name={pollutant} value={value as number} />
                            ))}
                          </div>
                        </div>

                        {/* Air Risk Score - NEW FEATURE */}
                        <AirRiskScoreDisplay city={selectedCity} />
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-slate-900/50 border border-cyan-400/20 backdrop-blur-sm">
                      <CardContent className="p-6 lg:p-8 text-center">
                        <div className="space-y-4">
                          <div className="w-16 h-16 mx-auto bg-slate-800/50 rounded-full flex items-center justify-center">
                            <Activity className="h-8 w-8 text-cyan-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-2">Select a City</h3>
                            <p className="text-sm text-white/70">
                              Click on a city marker on the map or select from the grid below to view detailed air quality information.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              </div>
            </div>
          </section>
        </div>

        {/* Cities Overview - Responsive Table/Cards */}
        <div className="relative">
          <section className="py-8 md:py-16 lg:py-20 bg-slate-950/60">
            <div className="container mx-auto px-4 max-w-7xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-slate-900/50 border border-cyan-400/20 backdrop-blur-sm hover:shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-400/40 transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-white text-xl md:text-2xl">
                      <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                        All Cities Overview
                      </span>
                    </CardTitle>
                    <p className="text-sm text-white/70 mt-2">
                      Click on any city to view detailed information
                    </p>
                  </CardHeader>
                  <CardContent className="p-4 lg:p-6">
                    {/* Desktop Table View */}
                    <div className="hidden lg:block">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                          <thead>
                            <tr className="border-b border-cyan-400/20">
                              <th className="text-left py-3 px-4 text-white/70 font-medium min-w-[120px]">City</th>
                              <th className="text-left py-3 px-4 text-white/70 font-medium min-w-[100px]">Risk Score</th>
                              <th className="text-left py-3 px-4 text-white/70 font-medium min-w-[80px]">AQI</th>
                              <th className="text-left py-3 px-4 text-white/70 font-medium min-w-[120px]">Safety Level</th>
                              <th className="text-left py-3 px-4 text-white/70 font-medium min-w-[100px]">Last Update</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cities.map((city, index) => {
                              const riskScore = calculateAirRiskScore(city);
                              const riskInfo = getAirRiskLevel(riskScore);
                              return (
                                <tr 
                                  key={index} 
                                  className="border-b border-slate-700/50 hover:bg-slate-800/50 cursor-pointer transition-all duration-200"
                                  onClick={() => setSelectedCity(city)}
                                >
                                  <td className="py-3 px-4 font-medium text-white">{city.name}</td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center space-x-2">
                                      <span className={`text-lg font-bold ${riskInfo.color}`}>
                                        {riskScore}
                                      </span>
                                      <span className="text-xs text-white/60">/100</span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <Badge className={`${getAQIColor(city.aqi)} text-white`}>
                                      {city.aqi}
                                    </Badge>
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className={`font-medium ${riskInfo.color}`}>
                                      {riskInfo.level}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-white/60 text-sm">
                                    {new Date(city.lastUpdate).toLocaleTimeString()}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Mobile/Tablet Card View */}
                    <div className="lg:hidden space-y-3">
                      {cities.map((city, index) => {
                        const riskScore = calculateAirRiskScore(city);
                        const riskInfo = getAirRiskLevel(riskScore);
                        return (
                          <div
                            key={index}
                            onClick={() => setSelectedCity(city)}
                            className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg hover:bg-slate-800/50 hover:border-cyan-400/30 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-semibold text-white text-base">{city.name}</h3>
                              <div className="flex items-center space-x-2">
                                <div className="text-center">
                                  <div className={`text-lg font-bold ${riskInfo.color}`}>
                                    {riskScore}
                                  </div>
                                  <div className="text-xs text-white/60">Risk Score</div>
                                </div>
                                <Badge className={`${getAQIColor(city.aqi)} text-white ml-2`}>
                                  {city.aqi} AQI
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="mb-2">
                              <span className={`text-sm font-medium ${riskInfo.color}`}>
                                {riskInfo.level}
                              </span>
                              <span className="text-xs text-white/60 ml-2">
                                - {riskInfo.description}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-white/60">AQI Level: </span>
                                <span className="text-white/80">{city.level}</span>
                              </div>
                              <div>
                                <span className="text-white/60">Primary: </span>
                                <span className="text-white/80">
                                  {Object.entries(city.pollutants).reduce((a, b) => 
                                    city.pollutants[a[0]] > city.pollutants[b[0]] ? a : b
                                  )[0]}
                                </span>
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-white/60">
                              Updated: {new Date(city.lastUpdate).toLocaleTimeString()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>
          {/* Fade to footer */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-slate-950 pointer-events-none z-10" />
        </div>
      </div>
    </div>
  );
};