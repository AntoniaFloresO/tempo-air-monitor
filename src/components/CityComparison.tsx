import { useState } from 'react';
import { useComparison } from '@/hooks/useComparison';
import { useCityList } from '@/hooks/useCityList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Trophy, Users, Target, TrendingUp, TrendingDown } from 'lucide-react';
import { getRiskClass, getRankEmoji } from '@/utils/mapHelpers';
import { ComparisonResponse } from '@/types/api';

export function CityComparison() {
  const [selectedCities, setSelectedCities] = useState<string[]>(['los_angeles', 'new_york', 'chicago', 'houston']);
  const { activeCities, loading: citiesLoading } = useCityList();
  const { comparison, loading, error, refetch } = useComparison(selectedCities);

  const handleCityToggle = (cityId: string) => {
    setSelectedCities(prev => 
      prev.includes(cityId) 
        ? prev.filter(id => id !== cityId)
        : [...prev, cityId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCities.length === activeCities.length) {
      setSelectedCities([]);
    } else {
      setSelectedCities(activeCities.map(city => city.id));
    }
  };

  if (citiesLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Cargando ciudades...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="flex items-center justify-center gap-2 text-2xl font-bold">
          <Trophy className="h-6 w-6 text-yellow-600" />
          Ranking de Calidad del Aire
        </h2>
        <p className="text-muted-foreground">
          Comparación entre ciudades basada en datos satelitales NASA TEMPO
        </p>
      </div>

      {/* Selector de ciudades */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Seleccionar ciudades para comparar</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSelectAll}
            >
              {selectedCities.length === activeCities.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeCities.map(city => (
              <div key={city.id} className="flex items-center space-y-0 gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={city.id}
                  checked={selectedCities.includes(city.id)}
                  onCheckedChange={() => handleCityToggle(city.id)}
                />
                <div className="flex-1">
                  <label htmlFor={city.id} className="cursor-pointer">
                    <div className="font-medium">{city.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {city.population.toLocaleString()} habitantes
                    </div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estado de carga */}
      {loading && (
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Comparando {selectedCities.length} ciudades...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-red-600">
                ❌ Error: {error}
              </div>
              <Button variant="outline" size="sm" onClick={refetch}>
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resultados */}
      {comparison && !loading && (
        <div className="space-y-6">
          {/* Estadísticas generales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Resumen de Comparación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {comparison.cities_compared}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    🌍 Ciudades comparadas
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {comparison.cities_with_data}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    📊 Con datos válidos
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-mono text-muted-foreground">
                    ⏱️ {new Date(comparison.timestamp).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Última actualización
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ranking de ciudades */}
          <div className="grid gap-4">
            {comparison.ranking.map((city, index) => {
              const rank = index + 1;
              const isTopThree = rank <= 3;
              return (
                <Card key={city.city_id} className={`${isTopThree ? 'ring-2 ring-yellow-200' : ''} relative`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`text-2xl ${isTopThree ? 'text-3xl' : ''}`}>
                          {getRankEmoji(rank)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{city.city_name}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-3 w-3" />
                            {city.population?.toLocaleString() || 'N/A'} habitantes
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-3xl font-bold text-primary">
                          {city.avg_risk_score.toFixed(1)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Risk Score Promedio
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Clasificación:</span>
                          <Badge 
                            variant={city.overall_class === 'good' ? 'secondary' : 
                                   city.overall_class === 'moderate' ? 'outline' : 'destructive'}
                            className="text-xs"
                          >
                            {getRiskClass(city.avg_risk_score)}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-red-500"></div>
                              Alto Riesgo:
                            </span>
                            <span className="font-mono">{city.high_risk_percentage.toFixed(1)}%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                              Moderado:
                            </span>
                            <span className="font-mono">{city.moderate_risk_percentage.toFixed(1)}%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              Bajo Riesgo:
                            </span>
                            <span className="font-mono">{city.low_risk_percentage.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-red-500" />
                            Máximo:
                          </span>
                          <span className="font-mono">{city.max_risk_score.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <TrendingDown className="h-3 w-3 text-green-500" />
                            Mínimo:
                          </span>
                          <span className="font-mono">{city.min_risk_score.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>📍 Puntos de datos:</span>
                          <Badge variant="secondary" className="text-xs">
                            {city.total_grid_points}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Barra de progreso visual */}
                    <div className="mt-4">
                      <div className="flex text-xs text-muted-foreground mb-1">
                        <span>Rango: {city.min_risk_score.toFixed(1)} - {city.max_risk_score.toFixed(1)}</span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 via-orange-500 to-red-500"
                          style={{ width: `${(city.avg_risk_score / 100) * 100}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {selectedCities.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">
              Selecciona al menos una ciudad para comparar
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}