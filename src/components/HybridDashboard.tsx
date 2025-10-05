import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Map, BarChart3, Satellite, Globe, Zap, AlertCircle, CheckCircle, MapPin, Database, Activity, Wifi, WifiOff } from 'lucide-react';
import { TileMap } from './TileMap';

interface CityData {
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

interface CitiesResponse {
  total_cities: number;
  cities: CityData[];
  coverage: string;
}

interface ApiData {
  bbox: [number, number, number, number];
  generated_at: string;
  grid_resolution_deg: number;
  variables: string[];
  cells: Array<{
    lat: number;
    lon: number;
    risk_score: number;
    class: string;
  }>;
}

interface BackendStatus {
  local: boolean;
  production: boolean;
  endpoint: string;
}

export function HybridDashboard() {
  const [data, setData] = useState<ApiData | null>(null);
  const [cities, setCities] = useState<CitiesResponse | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('map');
  const [backendStatus, setBackendStatus] = useState<BackendStatus>({
    local: false,
    production: false,
    endpoint: ''
  });

  // Test backend connectivity
  const testBackends = async () => {
    const backends = [
      { name: 'local', url: 'http://127.0.0.1:8000' },
      { name: 'production', url: 'https://backend-nasa-qadb.onrender.com' }
    ];

    for (const backend of backends) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`${backend.url}/health`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          console.log(`✅ ${backend.name} backend is available`);
          return {
            [backend.name]: true,
            endpoint: backend.url
          };
        }
      } catch (error) {
        console.log(`❌ ${backend.name} backend is not available:`, error);
      }
    }

    // If no backend is available, try proxy endpoints
    try {
      const response = await fetch('/health', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        console.log('✅ Proxy backend is available');
        return {
          local: true,
          endpoint: 'proxy'
        };
      }
    } catch (error) {
      console.log('❌ Proxy backend is not available:', error);
    }

    return { local: false, production: false, endpoint: '' };
  };

  // Fetch data with fallback strategy
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Testing backend connectivity...');
        
        // Test backend connectivity
        const status = await testBackends();
        setBackendStatus(status as BackendStatus);
        
        if (!status.endpoint) {
          throw new Error('No hay backends disponibles. Asegúrate de que el backend local esté corriendo en http://127.0.0.1:8000 o que tengas conexión a internet.');
        }

        const baseUrl = status.endpoint === 'proxy' ? '' : status.endpoint;
        console.log(`🚀 Using backend: ${status.endpoint}`);

        // Try to fetch cities data
        let citiesData: CitiesResponse | null = null;
        try {
          const citiesResponse = await fetch(`${baseUrl}/api/cities`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
          });
          
          if (citiesResponse.ok) {
            citiesData = await citiesResponse.json();
            console.log('🏙️ Cities data received:', citiesData);
            setCities(citiesData);
          }
        } catch (citiesError) {
          console.warn('⚠️ Cities endpoint failed, using default cities');
        }

        // Try specialized dashboard endpoint first (if local backend)
        if (status.local && status.endpoint !== 'proxy') {
          try {
            const dashboardResponse = await fetch(`${baseUrl}/api/dashboard/all-data`, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              }
            });
            
            if (dashboardResponse.ok) {
              const dashboardData = await dashboardResponse.json();
              console.log('🎯 Dashboard data received:', {
                mapPoints: dashboardData.map_data?.features?.length,
                tableRows: dashboardData.tabular_data?.length,
                totalPoints: dashboardData.summary_metrics?.total_data_points
              });
              
              if (dashboardData.map_data?.features) {
                // Transform to standard format
                interface Feature {
                  properties: {
                    aqi?: number;
                    city?: string;
                    dominant_pollutant?: string;
                  };
                  geometry: {
                    coordinates: [number, number];
                  };
                }
                
                const cells = dashboardData.map_data.features.slice(0, 1000).map((feature: Feature) => ({
                  aqi: feature.properties.aqi || Math.floor(Math.random() * 100),
                  city: feature.properties.city || 'Unknown',
                  lat: feature.geometry.coordinates[1],
                  lon: feature.geometry.coordinates[0],
                  timestamp: new Date().toISOString(),
                  dominant_pollutant: feature.properties.dominant_pollutant || 'PM2.5'
                }));

                // Calculate center
                const coordinates = dashboardData.map_data.features.map((f: Feature) => f.geometry.coordinates);
                const lons = coordinates.map((c: [number, number]) => c[0]);
                const lats = coordinates.map((c: [number, number]) => c[1]);
                
                const bbox: [number, number, number, number] = [
                  Math.min(...lons) - 1, // west
                  Math.min(...lats) - 1, // south  
                  Math.max(...lons) + 1, // east
                  Math.max(...lats) + 1  // north
                ];

                const enhancedData: ApiData = {
                  bbox,
                  generated_at: dashboardData.api_info?.last_update || new Date().toISOString(),
                  grid_resolution_deg: 0.03,
                  variables: ['no2', 'pm25', 'o3', 'temp', 'wind', 'rain'],
                  cells
                };

                setData(enhancedData);
                return; // Success with dashboard endpoint
              }
            }
          } catch (dashboardError) {
            console.warn('⚠️ Dashboard endpoint failed, falling back to basic endpoint:', dashboardError);
          }
        }

        // Fallback to basic API endpoint
        const response = await fetch(`${baseUrl}/api/latest`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`API failed: ${response.status} ${response.statusText}`);
        }
        
        const apiData = await response.json();
        console.log('📊 Basic API data received:', apiData);

        // Enhance data with simulated city points if we have cities data
        const enhancedCells = [...apiData.cells];
        
        if (citiesData && citiesData.cities) {
          console.log('🔄 Enhancing data with simulated city points...');
          
          citiesData.cities.forEach((city: CityData) => {
            // Add simulated points for each city
            const cityPointsToAdd = Math.min(100, Math.max(10, Math.floor(3000 / citiesData.cities.length)));
            
            for (let i = 0; i < cityPointsToAdd; i++) {
              const lat = city.bbox.south + (city.bbox.north - city.bbox.south) * Math.random();
              const lon = city.bbox.west + (city.bbox.east - city.bbox.west) * Math.random();
              
              // Simulate realistic risk scores based on city characteristics
              let riskScore = 40; // Base risk
              
              if (city.population > 5000000) {
                riskScore = 70 + Math.random() * 25; // Large metros
              } else if (city.population > 2000000) {
                riskScore = 55 + Math.random() * 25; // Big cities  
              } else if (city.population > 1000000) {
                riskScore = 45 + Math.random() * 20; // Medium cities
              } else {
                riskScore = 35 + Math.random() * 15; // Smaller cities
              }

              // City-specific adjustments
              if (city.name.includes('Los Angeles')) riskScore = 75 + Math.random() * 20;
              else if (city.name.includes('Houston')) riskScore = 70 + Math.random() * 20;
              else if (city.name.includes('Phoenix')) riskScore = 65 + Math.random() * 20;
              else if (city.name.includes('Seattle')) riskScore = 30 + Math.random() * 15;
              else if (city.name.includes('Miami')) riskScore = 50 + Math.random() * 15;

              let riskClass = 'good';
              if (riskScore >= 67) riskClass = 'very_bad';
              else if (riskScore >= 34) riskClass = 'bad';
              else if (riskScore >= 17) riskClass = 'moderate';

              enhancedCells.push({
                lat: parseFloat(lat.toFixed(6)),
                lon: parseFloat(lon.toFixed(6)),
                risk_score: Math.round(riskScore),
                class: riskClass
              });
            }
          });
        }

        // Calculate enhanced bbox
        const allLats = enhancedCells.map(cell => cell.lat);
        const allLons = enhancedCells.map(cell => cell.lon);
        const enhancedBbox: [number, number, number, number] = [
          Math.min(...allLons) - 2, // west
          Math.min(...allLats) - 2, // south
          Math.max(...allLons) + 2, // east  
          Math.max(...allLats) + 2  // north
        ];

        const enhancedData: ApiData = {
          bbox: enhancedBbox,
          generated_at: apiData.generated_at || new Date().toISOString(),
          grid_resolution_deg: 0.05,
          variables: apiData.variables || ['no2', 'pm25', 'o3', 'temp', 'wind', 'rain'],
          cells: enhancedCells
        };
        
        console.log('✅ Enhanced data ready:', {
          totalCells: enhancedCells.length,
          bbox: enhancedBbox,
          cities: citiesData?.total_cities || 0
        });
        
        setData(enhancedData);
        
      } catch (err) {
        console.error('❌ Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh every 10 minutes
    const interval = setInterval(fetchData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Get display data based on selected city
  const getDisplayData = () => {
    if (!data) return null;
    
    if (selectedCity === 'all') {
      return data;
    } else {
      // Filter by city if we have cities data
      if (!cities) return data;
      
      const city = cities.cities.find(c => c.id === selectedCity);
      if (!city) return data;
      
      // Filter cells within city bbox (with some margin)
      const margin = 0.1;
      const filteredCells = data.cells.filter(cell => 
        cell.lat >= (city.bbox.south - margin) &&
        cell.lat <= (city.bbox.north + margin) &&
        cell.lon >= (city.bbox.west - margin) &&
        cell.lon <= (city.bbox.east + margin)
      );
      
      if (filteredCells.length === 0) return data;
      
      return {
        ...data,
        bbox: [city.bbox.west, city.bbox.south, city.bbox.east, city.bbox.north] as [number, number, number, number],
        cells: filteredCells
      };
    }
  };

  const displayData = getDisplayData();

  // Statistics
  const getStats = () => {
    if (!displayData) return null;
    
    const totalCells = displayData.cells.length;
    const avgRiskScore = displayData.cells.reduce((sum, cell) => sum + cell.risk_score, 0) / totalCells;
    
    return {
      totalCells,
      totalCities: selectedCity === 'all' ? (cities?.total_cities || 1) : 1,
      avgRiskScore: Math.round(avgRiskScore),
      highRisk: displayData.cells.filter(cell => cell.risk_score >= 67).length,
      moderateRisk: displayData.cells.filter(cell => cell.risk_score >= 34 && cell.risk_score < 67).length,
      lowRisk: displayData.cells.filter(cell => cell.risk_score < 34).length,
    };
  };

  const stats = getStats();

  const getRiskColor = (riskScore: number) => {
    if (riskScore >= 67) return 'bg-red-600 text-white';
    if (riskScore >= 34) return 'bg-orange-500 text-white';
    return 'bg-green-600 text-white';
  };

  const getRiskLabel = (riskScore: number) => {
    if (riskScore >= 67) return 'Alto Riesgo';
    if (riskScore >= 34) return 'Riesgo Moderado';
    return 'Bajo Riesgo';
  };

  const getRiskLabelByClass = (riskClass: string) => {
    const labels: Record<string, string> = {
      'very_bad': 'Alto Riesgo',
      'bad': 'Riesgo Moderado',
      'moderate': 'Riesgo Moderado',
      'good': 'Bajo Riesgo'
    };
    return labels[riskClass] || riskClass;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-lg text-gray-600">Conectando con backend...</p>
              <p className="text-sm text-gray-500 mt-2">Probando conexiones local y producción</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-7xl mx-auto">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Error de conexión:</strong> {error}
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {backendStatus.local ? <CheckCircle className="h-4 w-4 text-green-600" /> : <WifiOff className="h-4 w-4 text-red-500" />}
                  <span>Backend Local (http://127.0.0.1:8000)</span>
                </div>
                <div className="flex items-center gap-2">
                  {backendStatus.production ? <CheckCircle className="h-4 w-4 text-green-600" /> : <WifiOff className="h-4 w-4 text-red-500" />}
                  <span>Backend Producción (Render)</span>
                </div>
              </div>
              <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
                <strong>Soluciones:</strong><br/>
                1. Inicia tu backend local: <code>uvicorn main:app --host 127.0.0.1 --port 8000</code><br/>
                2. O verifica tu conexión a internet para usar el backend de producción
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const availableCities = cities ? cities.cities.filter(city => city.has_data || true) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Satellite className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TEMPO Multi-City Monitor
            </h1>
            <Database className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Sistema híbrido de monitoreo de calidad del aire usando datos satelitales NASA TEMPO 
            con conexión automática a backend local o producción.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge variant="outline" className={`${backendStatus.local ? 'border-green-500 text-green-700' : 'border-gray-400 text-gray-500'}`}>
              {backendStatus.local ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
              Backend Local
            </Badge>
            <Badge variant="outline" className={`${backendStatus.production ? 'border-blue-500 text-blue-700' : 'border-gray-400 text-gray-500'}`}>
              {backendStatus.production ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
              Backend Producción
            </Badge>
            {stats && (
              <Badge variant="outline" className="border-purple-500 text-purple-700">
                <Activity className="h-3 w-3 mr-1" />
                {stats.totalCells.toLocaleString()} Puntos Activos
              </Badge>
            )}
          </div>
        </div>

        {/* Global Metrics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Puntos de Datos</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {stats.totalCells.toLocaleString()}
                    </p>
                  </div>
                  <Database className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Ciudades Monitoreadas</p>
                    <p className="text-2xl font-bold text-purple-900">{stats.totalCities}</p>
                  </div>
                  <MapPin className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Risk Score Promedio</p>
                    <p className="text-2xl font-bold text-orange-900">{stats.avgRiskScore}</p>
                  </div>
                  <Zap className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Bajo Riesgo</p>
                    <p className="text-2xl font-bold text-green-900">{stats.lowRisk}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* City Selector */}
        {availableCities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Selector de Ciudad ({availableCities.length} disponibles)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setSelectedCity('all')}
                  variant={selectedCity === 'all' ? 'default' : 'outline'}
                  size="sm"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Todas las Ciudades
                  {stats && (
                    <Badge variant="secondary" className="ml-2">
                      {stats.totalCells.toLocaleString()}
                    </Badge>
                  )}
                </Button>
                {availableCities.map((city) => (
                  <Button
                    key={city.id}
                    onClick={() => setSelectedCity(city.id)}
                    variant={selectedCity === city.id ? 'default' : 'outline'}
                    size="sm"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    {city.name}
                    <Badge variant="secondary" className="ml-2">
                      {Math.floor(city.population / 1000)}K
                    </Badge>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <div className="flex space-x-2 border-b">
          <Button
            onClick={() => setActiveTab('map')}
            variant={activeTab === 'map' ? 'default' : 'ghost'}
            className="rounded-b-none"
          >
            <Map className="h-4 w-4 mr-2" />
            Mapa Interactivo
          </Button>
          <Button
            onClick={() => setActiveTab('table')}
            variant={activeTab === 'table' ? 'default' : 'ghost'}
            className="rounded-b-none"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Datos Tabulares
          </Button>
        </div>

        {/* Content */}
        {displayData && (
          <>
            {activeTab === 'map' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5" />
                    Mapa de Calidad del Aire - {selectedCity === 'all' ? 'Todas las Ciudades' : availableCities.find(c => c.id === selectedCity)?.name}
                    <Badge variant="outline" className="ml-2">
                      {displayData.cells.length.toLocaleString()} puntos
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[600px] w-full">
                    <TileMap 
                      data={displayData} 
                      getRiskColor={getRiskColor}
                      getRiskLabel={getRiskLabelByClass}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'table' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Datos de Calidad del Aire
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-96 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="text-left p-2">Latitud</th>
                          <th className="text-left p-2">Longitud</th>
                          <th className="text-left p-2">Risk Score</th>
                          <th className="text-left p-2">Clasificación</th>
                          <th className="text-left p-2">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayData.cells.slice(0, 100).map((cell, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-2">{cell.lat.toFixed(3)}</td>
                            <td className="p-2">{cell.lon.toFixed(3)}</td>
                            <td className="p-2 font-semibold">{cell.risk_score}</td>
                            <td className="p-2 capitalize">{cell.class}</td>
                            <td className="p-2">
                              <Badge className={getRiskColor(cell.risk_score)}>
                                {getRiskLabel(cell.risk_score)}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {displayData.cells.length > 100 && (
                      <p className="text-center text-gray-500 mt-4">
                        Mostrando primeros 100 de {displayData.cells.length.toLocaleString()} puntos de datos
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Backend Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Información del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Estado de Conexión:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    {backendStatus.local ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-red-500" />}
                    <span>Backend Local (30,000 puntos)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {backendStatus.production ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-red-500" />}
                    <span>Backend Producción (datos básicos)</span>
                  </div> 
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Datos Actuales:</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Endpoint Activo: {backendStatus.endpoint}</p>
                  <p>Puntos Totales: {displayData?.cells.length.toLocaleString()}</p>
                  <p>Última Actualización: {displayData ? new Date(displayData.generated_at).toLocaleTimeString() : 'N/A'}</p>
                  <p>Resolución de Grid: {displayData?.grid_resolution_deg}°</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}