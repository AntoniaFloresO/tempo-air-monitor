import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Map, BarChart3, Satellite, Globe, Zap, AlertCircle, CheckCircle } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('map');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching data from API...');
        const response = await fetch('http://0.0.0.0:8002/api/latest');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const apiData = await response.json();
        console.log('API Data received:', apiData);
        
        setData(apiData);
      } catch (err) {
        console.error('Error fetching data:', err);
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

        {/* Data Table */}
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