import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Map, BarChart3, Satellite, Globe, Zap, AlertCircle, CheckCircle, MapPin, Database, Activity } from 'lucide-react';
import { TileMap } from './TileMap';

interface DashboardData {
  metadata: {
    last_update: string;
    total_cities: number;
    data_sources: string[];
  };
  cities_status: Record<string, string>;
  map_data: {
    type: string;
    features: Array<{
      type: string;
      geometry: {
        type: string;
        coordinates: [number, number];
      };
      properties: {
        city: string;
        aqi: number;
        category: string;
        pm25: number;
        no2: number;
        color: string;
      };
    }>;
  };
  tabular_data: Array<{
    city: string;
    aqi: number;
    pm25: number;
    no2: number;
    status: string;
    last_update: string;
  }>;
  city_summaries: Record<string, {
    name: string;
    total_points: number;
    average_aqi: number;
    dominant_category: string;
    max_aqi: number;
    data_quality: number;
  }>;
  global_metrics: {
    total_points: number;
    cities_monitored: number;
    average_aqi: number;
    alerts_active: number;
    data_freshness_minutes: number;
  };
}

export function OptimizedDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('map');

  // Fetch data from optimized endpoint
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🚀 Fetching optimized dashboard data...');
        
        const response = await fetch('/api/dashboard/all-data', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`Dashboard API failed: ${response.status} ${response.statusText}`);
        }
        
        const dashboardData: DashboardData = await response.json();
        console.log('✅ Dashboard data received:', {
          totalPoints: dashboardData.global_metrics.total_points,
          cities: dashboardData.metadata.total_cities,
          mapFeatures: dashboardData.map_data.features.length,
          tableRows: dashboardData.tabular_data.length
        });
        
        setData(dashboardData);
        
      } catch (err) {
        console.error('❌ Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Actualizar cada 5 minutos
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Get display data based on selected city
  const getDisplayData = () => {
    if (!data) return null;
    
    if (selectedCity === 'all') {
      // Show all cities data
      const allCells = data.map_data.features.map(feature => ({
        lat: feature.geometry.coordinates[1],
        lon: feature.geometry.coordinates[0],
        risk_score: Math.round(feature.properties.aqi),
        class: feature.properties.category.toLowerCase().replace(/\s+/g, '_')
      }));
      
      // Calculate combined bbox from all features
      const coordinates = data.map_data.features.map(f => f.geometry.coordinates);
      const lons = coordinates.map(c => c[0]);
      const lats = coordinates.map(c => c[1]);
      
      const bbox: [number, number, number, number] = [
        Math.min(...lons) - 1, // west
        Math.min(...lats) - 1, // south  
        Math.max(...lons) + 1, // east
        Math.max(...lats) + 1  // north
      ];
      
      return {
        bbox,
        generated_at: data.metadata.last_update,
        grid_resolution_deg: 0.03,
        variables: ['no2', 'pm25', 'o3', 'temp', 'wind', 'rain'],
        cells: allCells
      };
    } else {
      // Show specific city data
      const cityFeatures = data.map_data.features.filter(
        feature => feature.properties.city.toLowerCase().includes(selectedCity.toLowerCase())
      );
      
      if (cityFeatures.length === 0) return null;
      
      const cityCells = cityFeatures.map(feature => ({
        lat: feature.geometry.coordinates[1],
        lon: feature.geometry.coordinates[0],
        risk_score: Math.round(feature.properties.aqi),
        class: feature.properties.category.toLowerCase().replace(/\s+/g, '_')
      }));
      
      // Calculate city bbox
      const coordinates = cityFeatures.map(f => f.geometry.coordinates);
      const lons = coordinates.map(c => c[0]);
      const lats = coordinates.map(c => c[1]);
      
      const bbox: [number, number, number, number] = [
        Math.min(...lons) - 0.5,
        Math.min(...lats) - 0.5,
        Math.max(...lons) + 0.5,
        Math.max(...lats) + 0.5
      ];
      
      return {
        bbox,
        generated_at: data.metadata.last_update,
        grid_resolution_deg: 0.03,
        variables: ['no2', 'pm25', 'o3', 'temp', 'wind', 'rain'],
        cells: cityCells
      };
    }
  };

  const mapData = getDisplayData();

  // AQI color mapping
  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'bg-green-600 text-white';
    if (aqi <= 100) return 'bg-yellow-500 text-black';
    if (aqi <= 150) return 'bg-orange-500 text-white';
    if (aqi <= 200) return 'bg-red-600 text-white';
    if (aqi <= 300) return 'bg-purple-600 text-white';
    return 'bg-red-900 text-white';
  };

  const getAQILabel = (category: string) => {
    const labels: Record<string, string> = {
      'good': 'Buena',
      'moderate': 'Moderada',
      'unhealthy_for_sensitive_groups': 'Insalubre para Sensibles',
      'unhealthy': 'Insalubre',
      'very_unhealthy': 'Muy Insalubre',
      'hazardous': 'Peligrosa'
    };
    return labels[category] || category;
  };

  const getRiskColor = (riskScore: number) => {
    return getAQIColor(riskScore);
  };

  const getRiskLabelByClass = (riskClass: string) => {
    return getAQILabel(riskClass);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-lg text-gray-600">Cargando dashboard optimizado...</p>
              <p className="text-sm text-gray-500 mt-2">Conectando con backend local (30,000 puntos)</p>
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
              <strong>Error conectando con backend local:</strong> {error}
              <div className="mt-2 text-sm">
                Asegúrate de que el backend esté corriendo en: <code>http://127.0.0.1:8000</code>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const availableCities = Object.entries(data.cities_status)
    .filter(([_, status]) => status === 'success')
    .map(([cityId, _]) => ({
      id: cityId,
      name: data.city_summaries[cityId]?.name || cityId,
      summary: data.city_summaries[cityId]
    }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Satellite className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CleanSky Dashboard
            </h1>
            <Database className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Sistema avanzado de monitoreo de calidad del aire con datos reales de NASA TEMPO, 
            OpenAQ y MERRA-2 para {data.metadata.total_cities} ciudades principales.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge variant="outline" className="border-green-500 text-green-700">
              <CheckCircle className="h-3 w-3 mr-1" />
              {data.global_metrics.total_points.toLocaleString()} Puntos Activos
            </Badge>
            <Badge variant="outline" className="border-blue-500 text-blue-700">
              <Activity className="h-3 w-3 mr-1" />
              Actualizado hace {data.global_metrics.data_freshness_minutes} min
            </Badge>
          </div>
        </div>

        {/* Global Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Puntos de Datos</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {data.global_metrics.total_points.toLocaleString()}
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
                  <p className="text-2xl font-bold text-purple-900">{data.global_metrics.cities_monitored}</p>
                </div>
                <MapPin className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">AQI Promedio</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {Math.round(data.global_metrics.average_aqi)}
                  </p>
                </div>
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Alertas Activas</p>
                  <p className="text-2xl font-bold text-red-900">{data.global_metrics.alerts_active}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* City Selector */}
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
                <Badge variant="secondary" className="ml-2">
                  {data.global_metrics.total_points.toLocaleString()}
                </Badge>
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
                  {city.summary && (
                    <Badge variant="secondary" className="ml-2">
                      {city.summary.total_points.toLocaleString()}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
            
            {/* City Summary */}
            {selectedCity !== 'all' && data.city_summaries[selectedCity] && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Puntos:</span>
                    <div className="font-bold">{data.city_summaries[selectedCity].total_points.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">AQI Promedio:</span>
                    <div className="font-bold">{Math.round(data.city_summaries[selectedCity].average_aqi)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Categoría:</span>
                    <div className="font-bold">{data.city_summaries[selectedCity].dominant_category}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Calidad de Datos:</span>
                    <div className="font-bold">{Math.round(data.city_summaries[selectedCity].data_quality * 100)}%</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

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
        {mapData && (
          <>
            {activeTab === 'map' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5" />
                    Mapa de Calidad del Aire - {selectedCity === 'all' ? 'Todas las Ciudades' : data.city_summaries[selectedCity]?.name}
                    <Badge variant="outline" className="ml-2">
                      {mapData.cells.length.toLocaleString()} puntos
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[600px] w-full">
                    <TileMap 
                      data={mapData} 
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
                    Resumen por Ciudad
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-3">Ciudad</th>
                          <th className="text-left p-3">AQI</th>
                          <th className="text-left p-3">PM2.5 (μg/m³)</th>
                          <th className="text-left p-3">NO₂ (molecules/cm²)</th>
                          <th className="text-left p-3">Estado</th>
                          <th className="text-left p-3">Puntos</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.tabular_data.map((row, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">{row.city}</td>
                            <td className="p-3">
                              <span className="font-bold">{Math.round(row.aqi)}</span>
                            </td>
                            <td className="p-3">{row.pm25.toFixed(1)}</td>
                            <td className="p-3">{row.no2.toExponential(2)}</td>
                            <td className="p-3">
                              <Badge className={getAQIColor(row.aqi)}>
                                {row.status}
                              </Badge>
                            </td>
                            <td className="p-3">
                              {data.city_summaries[row.city.toLowerCase().replace(/[^a-z]/g, '_')]?.total_points.toLocaleString() || 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Data Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Satellite className="h-5 w-5" />
              Fuentes de Datos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.metadata.data_sources.map((source, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1">
                  {source}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Última actualización: {new Date(data.metadata.last_update).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}