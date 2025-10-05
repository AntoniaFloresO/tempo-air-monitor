import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import { useCityData } from '@/hooks/useCityData';
import { CitySelector } from './CitySelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp } from 'lucide-react';
import { 
  CITY_CENTERS, 
  CITY_BOUNDS, 
  getRiskColor, 
  getRiskClass,
  formatTemperature,
  formatConcentration 
} from '@/utils/mapHelpers';
import { GeoJsonResponse } from '@/types/api';
import 'leaflet/dist/leaflet.css';

export function AirQualityMap() {
  const [selectedCity, setSelectedCity] = useState('los_angeles');
  const { data: geoJsonData, loading, error } = useCityData(selectedCity, 'geojson');
  const mapRef = useRef<L.Map | null>(null);

  // Actualizar vista del mapa cuando cambia la ciudad
  useEffect(() => {
    if (mapRef.current && selectedCity && CITY_BOUNDS[selectedCity]) {
      mapRef.current.fitBounds(CITY_BOUNDS[selectedCity], { padding: [20, 20] });
    }
  }, [selectedCity]);

  const pointToLayer = (feature: GeoJSON.Feature, latlng: L.LatLngExpression) => {
    const riskScore = feature.properties.risk_score;
    const color = getRiskColor(riskScore);
    
    return L.circleMarker(latlng, {
      radius: 6,
      fillColor: color,
      color: '#ffffff',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    });
  };

  const onEachFeature = (feature: GeoJSON.Feature, layer: L.Layer) => {
    const props = feature.properties;
    const temp = props.temp ? formatTemperature(props.temp) : 'N/A';
    
    const popupContent = `
      <div class="p-3 min-w-64">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-3 h-3 rounded-full" style="background-color: ${getRiskColor(props.risk_score)}"></div>
          <h3 class="font-semibold text-sm">📊 Calidad del Aire</h3>
        </div>
        <div class="space-y-2 text-xs">
          <div class="flex justify-between">
            <span class="font-medium">Risk Score:</span>
            <span class="font-bold" style="color: ${getRiskColor(props.risk_score)}">${props.risk_score.toFixed(1)}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium">Clasificación:</span>
            <span class="font-semibold">${getRiskClass(props.risk_score)}</span>
          </div>
          <hr class="my-2">
          <div class="grid grid-cols-2 gap-2">
            <div>
              <span class="text-gray-600">NO₂:</span>
              <div class="font-mono text-xs">${formatConcentration(props.no2)} ppb</div>
            </div>
            <div>
              <span class="text-gray-600">O₃:</span>
              <div class="font-mono text-xs">${formatConcentration(props.o3)} ppb</div>
            </div>
            <div>
              <span class="text-gray-600">PM2.5:</span>
              <div class="font-mono text-xs">${props.pm25?.toFixed(1) || 'N/A'} μg/m³</div>
            </div>
            <div>
              <span class="text-gray-600">Temp:</span>
              <div class="font-mono text-xs">${temp}°C</div>
            </div>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Viento:</span>
            <span class="font-mono text-xs">${props.wind?.toFixed(1) || 'N/A'} m/s</span>
          </div>
          <hr class="my-2">
          <div class="text-xs text-gray-500 text-center">
            Datos: NASA TEMPO, OpenAQ, MERRA-2
          </div>
        </div>
      </div>
    `;
    
    layer.bindPopup(popupContent, {
      maxWidth: 300,
      className: 'custom-popup'
    });
  };

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            ❌ Error cargando datos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-[300px_1fr]">
        <div className="space-y-4">
          <CitySelector 
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
          />
          
          {loading && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Cargando datos de {selectedCity}...</span>
                </div>
              </CardContent>
            </Card>
          )}

          {geoJsonData && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  Estadísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">📍 Puntos de datos:</span>
                  <Badge variant="secondary">
                    {(geoJsonData as GeoJsonResponse).properties.total_features}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">🏙️ Ciudad:</span>
                  <span className="text-xs font-medium">
                    {(geoJsonData as GeoJsonResponse).properties.name.replace('CleanSky - ', '')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">⏱️ Actualizado:</span>
                  <span className="text-xs">
                    {new Date((geoJsonData as GeoJsonResponse).properties.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Leyenda */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                📊 Leyenda de Calidad del Aire
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-2">
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
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="h-[600px] overflow-hidden">
          <CardContent className="p-0 h-full">
            <MapContainer
              center={CITY_CENTERS[selectedCity] || CITY_CENTERS.los_angeles}
              zoom={10}
              className="h-full w-full"
              ref={mapRef}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {geoJsonData && !loading && (
                <GeoJSON
                  data={geoJsonData as GeoJSON.FeatureCollection}
                  pointToLayer={pointToLayer}
                  onEachFeature={onEachFeature}
                  key={selectedCity} // Forzar re-render cuando cambia ciudad
                />
              )}
            </MapContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
