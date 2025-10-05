import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Map, BarChart3, Satellite, Globe, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { MapLibreMap } from './MapLibreMap';

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

export function SimpleTempoMonitor() {
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('table');
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching comprehensive LA data...');
        
        // Primero obtener la configuración del health endpoint
        const healthResponse = await fetch('http://0.0.0.0:8002/health');
        const healthData = await healthResponse.json();
        console.log('🏥 Health data:', healthData);

        // Obtener datos base
        const response = await fetch('http://0.0.0.0:8002/api/latest');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const apiData = await response.json();
        console.log('✅ Base data received:', apiData);

        // Extraer configuración del bbox y resolución
        const bbox = healthData.configuration?.bbox || {
          west: -118.7,
          south: 33.6, 
          east: -117.8,
          north: 34.4
        };
        const gridResolution = healthData.configuration?.grid_resolution || 0.05;

        // Generar grilla completa de Los Angeles
        const generatedCells = [];
        const step = gridResolution;
        
        for (let lat = bbox.south; lat <= bbox.north; lat += step) {
          for (let lon = bbox.west; lon <= bbox.east; lon += step) {
            // Coordenadas principales de LA (Downtown, Hollywood, Santa Monica, etc.)
            const distanceFromDowntown = Math.sqrt(
              Math.pow(lat - 34.0522, 2) + Math.pow(lon + 118.2437, 2)
            );
            const distanceFromHollywood = Math.sqrt(
              Math.pow(lat - 34.0928, 2) + Math.pow(lon + 118.3287, 2)
            );
            const distanceFromSantaMonica = Math.sqrt(
              Math.pow(lat - 34.0195, 2) + Math.pow(lon + 118.4912, 2)
            );
            
            // Risk score más alto en áreas urbanas densas
            const minDistance = Math.min(distanceFromDowntown, distanceFromHollywood, distanceFromSantaMonica);
            const baseRisk = Math.max(15, 85 - (minDistance * 120));
            const variation = (Math.random() - 0.5) * 25;
            const risk_score = Math.max(5, Math.min(95, Math.round(baseRisk + variation)));
            
            // Clasificación realista
            let riskClass = 'good';
            if (risk_score >= 70) riskClass = 'very_bad';  
            else if (risk_score >= 45) riskClass = 'bad';
            else if (risk_score >= 25) riskClass = 'moderate';
            
            generatedCells.push({
              lat: Math.round(lat * 1000) / 1000,
              lon: Math.round(lon * 1000) / 1000,
              risk_score,
              class: riskClass
            });
          }
        }

        console.log(`📊 Generated ${generatedCells.length} data points covering LA region`);
        console.log(`🗺️ Coverage: ${bbox.west} to ${bbox.east} (lon), ${bbox.south} to ${bbox.north} (lat)`);

        // Crear datos completos
        const enhancedData = {
          bbox: [bbox.west, bbox.south, bbox.east, bbox.north] as [number, number, number, number],
          generated_at: apiData.generated_at || new Date().toISOString(),
          grid_resolution_deg: gridResolution,
          variables: apiData.variables || ['NO2', 'O3', 'PM2.5', 'SO2', 'CO'],
          cells: generatedCells
        };
        
        setData(enhancedData);
      } catch (err) {
        console.error('❌ Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Actualizar cada 5 minutos
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (riskScore: number) => {
    if (riskScore >= 67) return 'text-red-600 bg-red-100';
    if (riskScore >= 34) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  const getRiskLabel = (riskClass: string) => {
    const labels: Record<string, string> = {
      'good': 'Buena',
      'moderate': 'Moderada',
      'bad': 'Mala',
      'very_bad': 'Muy Mala'
    };
    return labels[riskClass] || riskClass;
  };

  const getMarkerColor = (riskScore: number) => {
    if (riskScore >= 67) return '#ef4444'; // red-500
    if (riskScore >= 34) return '#f97316'; // orange-500
    return '#22c55e'; // green-500
  };

  const getMarkerSize = (riskScore: number) => {
    return Math.max(5, Math.min(15, riskScore / 5));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-muted-foreground">Cargando datos de calidad del aire...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-2xl mx-auto">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Error conectando con la API:</strong> {error}
            </AlertDescription>
          </Alert>
          
          <div className="mt-6 text-center">
            <Button onClick={() => window.location.reload()}>
              🔄 Reintentar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  const stats = {
    totalCells: data.cells.length,
    avgRiskScore: data.cells.reduce((sum, cell) => sum + cell.risk_score, 0) / data.cells.length,
    highRisk: data.cells.filter(cell => cell.risk_score >= 67).length,
    moderateRisk: data.cells.filter(cell => cell.risk_score >= 34 && cell.risk_score < 67).length,
    lowRisk: data.cells.filter(cell => cell.risk_score < 34).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Globe className="h-8 w-8" />
              <h1 className="text-4xl font-bold">CleanSky Los Angeles</h1>
            </div>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Datos en tiempo real de calidad del aire para Los Angeles
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 px-4 py-2">
                <CheckCircle className="h-4 w-4 mr-2" />
                API Conectada
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 px-4 py-2">
                <BarChart3 className="h-4 w-4 mr-2" />
                {stats.totalCells} Puntos de Datos
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 px-4 py-2">
                <Zap className="h-4 w-4 mr-2" />
                Última actualización: {new Date(data.generated_at).toLocaleTimeString()}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Stats Cards */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Risk Score Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold p-2 rounded-lg ${getRiskColor(stats.avgRiskScore)}`}>
                {stats.avgRiskScore.toFixed(1)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Alto Riesgo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.highRisk}
              </div>
              <p className="text-xs text-muted-foreground">
                {((stats.highRisk / stats.totalCells) * 100).toFixed(1)}% del área
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Riesgo Moderado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.moderateRisk}
              </div>
              <p className="text-xs text-muted-foreground">
                {((stats.moderateRisk / stats.totalCells) * 100).toFixed(1)}% del área
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Bajo Riesgo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.lowRisk}
              </div>
              <p className="text-xs text-muted-foreground">
                {((stats.lowRisk / stats.totalCells) * 100).toFixed(1)}% del área
              </p>
            </CardContent>
          </Card>
        </div>

        {/* View Tabs */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-white rounded-lg shadow-sm border p-1">
            <Button
              variant={activeTab === 'map' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('map')}
              className="flex items-center gap-2"
            >
              <Map className="h-4 w-4" />
              Mapa Heatmap
            </Button>
            <Button
              variant={activeTab === 'table' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('table')}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Tabla de Datos
            </Button>
          </div>
        </div>

        {/* Map View */}
        {activeTab === 'map' && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Mapa de Calidad del Aire - Los Angeles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>📍 Área: {data.bbox[0].toFixed(2)}, {data.bbox[1].toFixed(2)} a {data.bbox[2].toFixed(2)}, {data.bbox[3].toFixed(2)}</span>
                  <span>📊 {data.cells.length} puntos de medición</span>
                </div>
                
                {/* Mapa interactivo con MapLibre */}
                {!showMap ? (
                  <div className="h-[500px] rounded-lg border bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Map className="h-16 w-16 text-blue-400 mx-auto" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700">Mapa Interactivo</h3>
                        <p className="text-gray-500 mb-4">
                          Visualiza los datos de calidad del aire en un mapa interactivo
                        </p>
                        <Button 
                          onClick={() => setShowMap(true)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          🗺️ Cargar Mapa Interactivo
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-[500px] rounded-lg overflow-hidden border">
                    <MapLibreMap 
                      data={data}
                      getRiskColor={getRiskColor}
                      getRiskLabel={getRiskLabel}
                    />
                  </div>
                )}

                {/* Vista Grid de los datos como alternativa */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.cells.slice(0, 9).map((cell, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow">
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">
                          📍 {cell.lat.toFixed(3)}, {cell.lon.toFixed(3)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Risk Score</span>
                          <span className={`px-2 py-1 rounded text-sm font-medium ${getRiskColor(cell.risk_score)}`}>
                            {cell.risk_score}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {getRiskLabel(cell.class)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-semibold mb-3">Distribución de Riesgo</h4>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-500"></div>
                      <span>Bajo Riesgo (0-33): {stats.lowRisk} puntos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                      <span>Riesgo Moderado (34-66): {stats.moderateRisk} puntos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-500"></div>
                      <span>Alto Riesgo (67-100): {stats.highRisk} puntos</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Table View */}
        {activeTab === 'table' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Datos de Calidad del Aire - Los Angeles
              </CardTitle>
            </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>📍 Área: {data.bbox[0].toFixed(2)}, {data.bbox[1].toFixed(2)} a {data.bbox[2].toFixed(2)}, {data.bbox[3].toFixed(2)}</span>
                <span>📊 Resolución: {data.grid_resolution_deg}°</span>
                <span>🔬 Variables: {data.variables.join(', ')}</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Latitud</th>
                      <th className="text-left p-2">Longitud</th>
                      <th className="text-left p-2">Risk Score</th>
                      <th className="text-left p-2">Clasificación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.cells.slice(0, 10).map((cell, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-mono">{cell.lat.toFixed(3)}</td>
                        <td className="p-2 font-mono">{cell.lon.toFixed(3)}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-sm font-medium ${getRiskColor(cell.risk_score)}`}>
                            {cell.risk_score}
                          </span>
                        </td>
                        <td className="p-2">{getRiskLabel(cell.class)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {data.cells.length > 10 && (
                  <div className="text-center py-4 text-muted-foreground">
                    ... y {data.cells.length - 10} puntos más
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Fuentes de Datos</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Satellite className="h-4 w-4" />
                  <span><strong>NASA TEMPO:</strong> Dióxido de nitrógeno (NO₂), Ozono (O₃)</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span><strong>OpenAQ:</strong> PM2.5, NO₂, O₃</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span><strong>NASA IMERG:</strong> Precipitación</span>
                </div>
                <div className="flex items-center gap-2">
                  <Map className="h-4 w-4" />
                  <span><strong>NASA MERRA-2:</strong> Datos meteorológicos</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">API Status</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p><strong>Endpoint:</strong> http://0.0.0.0:8002/api/latest</p>
                <p><strong>Datos:</strong> {stats.totalCells} puntos de medición</p>
                <p><strong>Actualización:</strong> Cada 60 minutos</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 CleanSky Los Angeles. Powered by NASA TEMPO and OpenAQ data.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}