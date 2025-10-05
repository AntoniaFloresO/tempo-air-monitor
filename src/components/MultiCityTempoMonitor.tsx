import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Map, BarChart3, Satellite, Globe, Zap, AlertCircle, CheckCircle, MapPin } from 'lucide-react';
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

interface CityDataResponse {
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

interface CombinedCityData extends CityData {
  data?: CityDataResponse;
  lastUpdated?: string;
  status: 'loading' | 'success' | 'error' | 'no-data';
  errorMessage?: string;
}

export function MultiCityTempoMonitor() {
  const [cities, setCities] = useState<CombinedCityData[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('map');

  // Obtener lista de ciudades y sus datos
  useEffect(() => {
    const fetchCitiesAndData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🌍 Fetching cities from Phase 3.5 API...');
        
        // Obtener lista de ciudades
        const citiesResponse = await fetch('/api/cities', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });
        
        if (!citiesResponse.ok) {
          throw new Error(`Cities API failed: ${citiesResponse.status}`);
        }
        
        const citiesData: CitiesResponse = await citiesResponse.json();
        console.log('🏙️ Cities received:', citiesData);
        
        // Inicializar ciudades con estado de carga
        const initialCities: CombinedCityData[] = citiesData.cities.map(city => ({
          ...city,
          status: 'loading' as const
        }));
        
        setCities(initialCities);
        
        // Intentar obtener datos para cada ciudad
        const cityDataPromises = citiesData.cities.map(async (city): Promise<CombinedCityData> => {
          try {
            console.log(`🔄 Fetching data for ${city.name}...`);
            
            // Probar endpoint específico de ciudad primero
            const response = await fetch(`/api/cities/${city.id}/latest`, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              }
            });
            
            if (response.ok) {
              const cityData: CityDataResponse = await response.json();
              console.log(`✅ Real data for ${city.name}:`, cityData.cells.length, 'points');
              
              return {
                ...city,
                data: cityData,
                lastUpdated: cityData.generated_at,
                status: 'success'
              };
            } else {
              console.warn(`⚠️ No specific data for ${city.name}, trying fallback...`);
              
              // Fallback: usar endpoint general y filtrar por bbox
              const fallbackResponse = await fetch('/api/latest', {
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                }
              });
              
              if (fallbackResponse.ok) {
                const fallbackData: CityDataResponse = await fallbackResponse.json();
                
                // Filtrar datos por bbox de la ciudad (con margen)
                const cityBbox = city.bbox;
                const margin = 0.1; // Margen de 0.1 grados
                
                const filteredCells = fallbackData.cells.filter(cell => 
                  cell.lat >= (cityBbox.south - margin) &&
                  cell.lat <= (cityBbox.north + margin) &&
                  cell.lon >= (cityBbox.west - margin) &&
                  cell.lon <= (cityBbox.east + margin)
                );
                
                if (filteredCells.length > 0) {
                  const citySpecificData: CityDataResponse = {
                    ...fallbackData,
                    bbox: [cityBbox.west, cityBbox.south, cityBbox.east, cityBbox.north],
                    cells: filteredCells
                  };
                  
                  console.log(`📍 Filtered data for ${city.name}:`, filteredCells.length, 'points');
                  
                  return {
                    ...city,
                    data: citySpecificData,
                    lastUpdated: fallbackData.generated_at,
                    status: 'success'
                  };
                } else {
                  console.warn(`❌ No data points found for ${city.name} bbox`);
                  return {
                    ...city,
                    status: 'no-data',
                    errorMessage: 'No data points in city area'
                  };
                }
              } else {
                throw new Error(`Fallback API failed: ${fallbackResponse.status}`);
              }
            }
          } catch (err) {
            console.error(`❌ Error fetching data for ${city.name}:`, err);
            return {
              ...city,
              status: 'error',
              errorMessage: err instanceof Error ? err.message : 'Unknown error'
            };
          }
        });
        
        // Esperar a que se complete la carga de datos de todas las ciudades
        const citiesWithData = await Promise.all(cityDataPromises);
        setCities(citiesWithData);
        
        console.log('🎉 Multi-city data loading completed');
        
      } catch (err) {
        console.error('❌ Error in multi-city fetch:', err);
        setError(err instanceof Error ? err.message : 'Error loading cities');
      } finally {
        setLoading(false);
      }
    };

    fetchCitiesAndData();
    
    // Actualizar cada 15 minutos
    const interval = setInterval(fetchCitiesAndData, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Obtener datos combinados para mostrar
  const getDisplayData = () => {
    if (selectedCity === 'all') {
      // Combinar todas las ciudades con datos
      type CellData = { lat: number; lon: number; risk_score: number; class: string; };
      const allCells: CellData[] = [];
      const combinedBbox = [180, 90, -180, -90]; // [west, south, east, north]
      
      cities.forEach(city => {
        if (city.status === 'success' && city.data) {
          allCells.push(...city.data.cells);
          
          // Expandir bbox
          const cityBbox = city.data.bbox;
          combinedBbox[0] = Math.min(combinedBbox[0], cityBbox[0]); // west
          combinedBbox[1] = Math.min(combinedBbox[1], cityBbox[1]); // south
          combinedBbox[2] = Math.max(combinedBbox[2], cityBbox[2]); // east
          combinedBbox[3] = Math.max(combinedBbox[3], cityBbox[3]); // north
        }
      });
      
      if (allCells.length === 0) return null;
      
      return {
        bbox: combinedBbox as [number, number, number, number],
        generated_at: new Date().toISOString(),
        grid_resolution_deg: 0.03,
        variables: ['no2', 'pm25', 'o3', 'temp', 'wind', 'rain'],
        cells: allCells
      };
    } else {
      // Datos de ciudad específica
      const city = cities.find(c => c.id === selectedCity);
      return city?.data || null;
    }
  };

  const data = getDisplayData();

  // Estadísticas
  const getStats = () => {
    if (!data) return null;
    
    const totalCells = data.cells.length;
    const avgRiskScore = data.cells.reduce((sum, cell) => sum + cell.risk_score, 0) / totalCells;
    
    return {
      totalCells,
      totalCities: selectedCity === 'all' ? cities.filter(c => c.status === 'success').length : 1,
      avgRiskScore: Math.round(avgRiskScore),
      highRisk: data.cells.filter(cell => cell.risk_score >= 67).length,
      moderateRisk: data.cells.filter(cell => cell.risk_score >= 34 && cell.risk_score < 67).length,
      lowRisk: data.cells.filter(cell => cell.risk_score < 34).length,
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

  // Función compatible con TileMap que espera riskClass string
  const getRiskLabelByClass = (riskClass: string) => {
    switch (riskClass.toLowerCase()) {
      case 'very_bad':
      case 'bad':
        return 'Alto Riesgo';
      case 'moderate':
        return 'Riesgo Moderado';
      case 'good':
      default:
        return 'Bajo Riesgo';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-lg text-gray-600">Cargando datos de múltiples ciudades...</p>
              <p className="text-sm text-gray-500 mt-2">Conectando con API Phase 3.5</p>
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
              <strong>Error conectando con la API:</strong> {error}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

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
            <Globe className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Sistema avanzado de monitoreo de calidad del aire usando datos satelitales NASA TEMPO
            para múltiples ciudades de Norteamérica en tiempo real.
          </p>
          <Badge variant="outline" className="mt-2 border-green-500 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            API Phase 3.5 - Datos Reales
          </Badge>
        </div>

        {/* City Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Selector de Ciudad
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
                Todas las Ciudades ({cities.filter(c => c.status === 'success').length})
              </Button>
              {cities.map((city) => (
                <Button
                  key={city.id}
                  onClick={() => setSelectedCity(city.id)}
                  variant={selectedCity === city.id ? 'default' : 'outline'}
                  size="sm"
                  disabled={city.status !== 'success'}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {city.name}
                  {city.status === 'success' && city.data && (
                    <Badge variant="secondary" className="ml-2">
                      {city.data.cells.length}
                    </Badge>
                  )}
                  {city.status === 'loading' && <Loader2 className="h-3 w-3 ml-2 animate-spin" />}
                  {city.status === 'error' && <AlertCircle className="h-3 w-3 ml-2 text-red-500" />}
                </Button>
              ))}
            </div>
            
            {/* City Status Summary */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-green-50">
                <CardContent className="p-3">
                  <div className="text-center">
                    <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-green-800">
                      {cities.filter(c => c.status === 'success').length}
                    </div>
                    <div className="text-sm text-green-600">Con Datos</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-yellow-50">
                <CardContent className="p-3">
                  <div className="text-center">
                    <Loader2 className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-yellow-800">
                      {cities.filter(c => c.status === 'loading').length}
                    </div>
                    <div className="text-sm text-yellow-600">Cargando</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-red-50">
                <CardContent className="p-3">
                  <div className="text-center">
                    <AlertCircle className="h-6 w-6 text-red-600 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-red-800">
                      {cities.filter(c => c.status === 'error').length}
                    </div>
                    <div className="text-sm text-red-600">Con Error</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-50">
                <CardContent className="p-3">
                  <div className="text-center">
                    <Globe className="h-6 w-6 text-gray-600 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-gray-800">
                      {cities.length}
                    </div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Puntos de Datos</p>
                    <p className="text-2xl font-bold text-blue-900">{stats.totalCells.toLocaleString()}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Ciudades Activas</p>
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
        {data && (
          <>
            {activeTab === 'map' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5" />
                    Mapa de Calidad del Aire - {selectedCity === 'all' ? 'Todas las Ciudades' : cities.find(c => c.id === selectedCity)?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[600px] w-full">
                    <TileMap 
                      data={data} 
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
                        {data.cells.slice(0, 100).map((cell, index) => (
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
                    {data.cells.length > 100 && (
                      <p className="text-center text-gray-500 mt-4">
                        Mostrando primeros 100 de {data.cells.length} puntos de datos
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* City Details */}
        {selectedCity !== 'all' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Detalles de la Ciudad
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cities.filter(city => city.id === selectedCity).map(city => (
                <div key={city.id} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">{city.name}</h3>
                      <p className="text-gray-600">Población: {city.population.toLocaleString()}</p>
                      <p className="text-gray-600">Zona Horaria: {city.timezone}</p>
                      <p className="text-gray-600">Resolución: {city.grid_resolution}°</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Bounding Box:</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Norte: {city.bbox.north}°</p>
                        <p>Sur: {city.bbox.south}°</p>
                        <p>Este: {city.bbox.east}°</p>
                        <p>Oeste: {city.bbox.west}°</p>
                      </div>
                    </div>
                  </div>
                  
                  {city.status === 'success' && city.data && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Estado de los Datos:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-green-600">Puntos de Datos:</span>
                          <div className="font-bold">{city.data.cells.length}</div>
                        </div>
                        <div>
                          <span className="text-green-600">Última Actualización:</span>
                          <div className="font-bold">{new Date(city.lastUpdated || '').toLocaleTimeString()}</div>
                        </div>
                        <div>
                          <span className="text-green-600">Variables:</span>
                          <div className="font-bold">{city.data.variables.join(', ')}</div>
                        </div>
                        <div>
                          <span className="text-green-600">Resolución:</span>
                          <div className="font-bold">{city.data.grid_resolution_deg}°</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {city.status === 'error' && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        Error cargando datos: {city.errorMessage}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {city.status === 'no-data' && (
                    <Alert className="border-yellow-200 bg-yellow-50">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-800">
                        No hay datos disponibles para esta ciudad en este momento.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}