import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Map, BarChart3, Satellite, Globe, Zap, AlertCircle } from 'lucide-react';

export function TempoMonitorDemo() {
  const [activeTab, setActiveTab] = useState('map');
  const [demoMode] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Globe className="h-8 w-8" />
              <h1 className="text-4xl font-bold">CleanSky North America</h1>
            </div>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Plataforma de monitoreo de calidad del aire con datos satelitales NASA TEMPO en tiempo real
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 px-4 py-2">
                <Satellite className="h-4 w-4 mr-2" />
                6 Ciudades Activas
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 px-4 py-2">
                <BarChart3 className="h-4 w-4 mr-2" />
                1,800 Puntos de Datos
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 px-4 py-2">
                <Zap className="h-4 w-4 mr-2" />
                Datos en Tiempo Real
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-1 py-4">
            <Button
              variant={activeTab === 'map' ? 'default' : 'ghost'}
              size="lg"
              onClick={() => setActiveTab('map')}
              className="flex items-center gap-2 px-6"
            >
              <Map className="h-4 w-4" />
              Mapa Interactivo
            </Button>
            <Button
              variant={activeTab === 'comparison' ? 'default' : 'ghost'}
              size="lg"
              onClick={() => setActiveTab('comparison')}
              className="flex items-center gap-2 px-6"
            >
              <BarChart3 className="h-4 w-4" />
              Comparación de Ciudades
            </Button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {demoMode && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Modo Demo:</strong> La API del backend no está disponible. 
              Para ver los datos reales, inicie el servidor backend en 
              <code className="mx-1 px-2 py-1 bg-orange-100 rounded">http://localhost:8000</code>
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            {activeTab === 'map' ? <Map className="h-6 w-6" /> : <BarChart3 className="h-6 w-6" />}
            <h2 className="text-2xl font-bold">
              {activeTab === 'map' ? 'Mapa Interactivo' : 'Comparación de Ciudades'}
            </h2>
          </div>
          <p className="text-muted-foreground">
            {activeTab === 'map' 
              ? 'Explora los datos de calidad del aire en tiempo real con visualización interactiva por ciudad'
              : 'Compara la calidad del aire entre diferentes ciudades y analiza métricas detalladas'
            }
          </p>
        </div>

        {/* Demo Content */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-[300px_1fr]">
              <div className="space-y-4">
                {/* City Selector Demo */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-blue-600" />
                      Seleccionar Ciudad:
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {['Los Angeles, CA', 'New York, NY', 'Chicago, IL', 'Houston, TX', 'Seattle, WA', 'Miami, FL'].map((city) => (
                        <div key={city} className="p-2 rounded border hover:bg-muted/50 cursor-pointer">
                          <div className="font-medium text-sm">{city}</div>
                          <div className="text-xs text-muted-foreground">
                            Datos NASA TEMPO disponibles
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Stats Demo */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <BarChart3 className="h-4 w-4" />
                      Estadísticas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">📍 Puntos de datos:</span>
                      <Badge variant="secondary">300</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">🏙️ Ciudad:</span>
                      <span className="text-xs font-medium">Los Angeles, CA</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Legend Demo */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">
                      📊 Leyenda de Calidad del Aire
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-500"></div>
                      <span className="text-xs">Buena (0-34)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                      <span className="text-xs">Moderada (34-67)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-500"></div>
                      <span className="text-xs">Mala (67-100)</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Map Area Demo */}
              <Card className="h-[600px] overflow-hidden">
                <CardContent className="p-0 h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                      <Map className="h-12 w-12 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Mapa Interactivo</h3>
                      <p className="text-muted-foreground text-sm max-w-md">
                        Aquí se mostraría el mapa interactivo con datos de calidad del aire 
                        cuando el backend esté disponible.
                      </p>
                    </div>
                    <Badge variant="outline">Esperando conexión API</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'comparison' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ranking de Ciudades por Calidad del Aire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Seattle, WA', score: 28.5, rank: '🥇', status: 'Buena' },
                    { name: 'Miami, FL', score: 31.2, rank: '🥈', status: 'Buena' },
                    { name: 'Chicago, IL', score: 35.8, rank: '🥉', status: 'Moderada' },
                    { name: 'New York, NY', score: 42.1, rank: '#4', status: 'Moderada' },
                    { name: 'Houston, TX', score: 48.7, rank: '#5', status: 'Moderada' },
                    { name: 'Los Angeles, CA', score: 52.3, rank: '#6', status: 'Moderada' },
                  ].map((city) => (
                    <div key={city.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{city.rank}</div>
                        <div>
                          <div className="font-semibold">{city.name}</div>
                          <div className="text-sm text-muted-foreground">NASA TEMPO Data</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">{city.score}</div>
                        <Badge variant={city.status === 'Buena' ? 'secondary' : 'outline'}>
                          {city.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
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
                  <span><strong>NASA TEMPO:</strong> Dióxido de nitrógeno (NO₂) satelital</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span><strong>OpenAQ:</strong> Estaciones de monitoreo terrestres</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span><strong>MERRA-2:</strong> Datos meteorológicos</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Proyecto</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p><strong>Desarrollado para:</strong> NASA Space Apps Challenge 2024</p>
                <p><strong>Equipo:</strong> CleanSky - Satellite Air Quality Platform</p>
                <p><strong>Cobertura:</strong> Norteamérica (Área de cobertura TEMPO)</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 CleanSky North America. Desarrollado con datos abiertos de NASA y OpenAQ.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}