import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Layers, Satellite, Navigation, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface GoogleStyleMapProps {
  data: {
    bbox: [number, number, number, number];
    cells: Array<{
      lat: number;
      lon: number;
      risk_score: number;
      class: string;
    }>;
  };
  getRiskColor: (score: number) => string;
  getRiskLabel: (riskClass: string) => string;
}

export function GoogleStyleMap({ data, getRiskColor, getRiskLabel }: GoogleStyleMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite' | 'hybrid'>('streets');
  const [showLabels, setShowLabels] = useState(true);
  const [currentZoom, setCurrentZoom] = useState(10);

  const getMarkerColor = (riskScore: number) => {
    if (riskScore >= 70) return '#dc2626'; // red-600
    if (riskScore >= 45) return '#ea580c'; // orange-600
    if (riskScore >= 25) return '#ca8a04'; // yellow-600
    return '#16a34a'; // green-600
  };

  const getMarkerSize = (riskScore: number, zoom: number) => {
    const baseSize = Math.max(4, Math.min(20, riskScore / 4));
    const zoomFactor = Math.max(0.5, Math.min(2, zoom / 10));
    return baseSize * zoomFactor;
  };

  const mapStyles = React.useMemo(() => ({
    streets: 'https://api.maptiler.com/maps/streets-v2/style.json?key=demo',
    satellite: 'https://api.maptiler.com/maps/satellite/style.json?key=demo',
    hybrid: 'https://api.maptiler.com/maps/hybrid/style.json?key=demo'
  }), []);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    const centerLat = (data.bbox[1] + data.bbox[3]) / 2;
    const centerLng = (data.bbox[0] + data.bbox[2]) / 2;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyles[mapStyle],
      center: [centerLng, centerLat],
      zoom: currentZoom,
      pitch: 0,
      bearing: 0,
      attributionControl: false
    });

    // Controles personalizados estilo Google Maps
    const nav = new maplibregl.NavigationControl({
      showCompass: true,
      showZoom: true,
      visualizePitch: true
    });
    map.current.addControl(nav, 'top-right');

    // Control de escala
    const scale = new maplibregl.ScaleControl({
      maxWidth: 100,
      unit: 'metric'
    });
    map.current.addControl(scale, 'bottom-left');

    map.current.on('load', () => {
      if (!map.current) return;

      // Crear heatmap de fondo
      const heatmapData = {
        type: 'FeatureCollection' as const,
        features: data.cells.map((cell, index) => ({
          type: 'Feature' as const,
          properties: {
            id: index,
            risk_score: cell.risk_score,
            class: cell.class,
            weight: cell.risk_score / 100
          },
          geometry: {
            type: 'Point' as const,
            coordinates: [cell.lon, cell.lat]
          }
        }))
      };

      // Añadir fuente de datos
      map.current!.addSource('air-quality-heatmap', {
        type: 'geojson',
        data: heatmapData
      });

      // Capa de heatmap (fondo)
      map.current!.addLayer({
        id: 'air-quality-heat',
        type: 'heatmap',
        source: 'air-quality-heatmap',
        maxzoom: 15,
        paint: {
          // Intensidad del heatmap basada en el zoom
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 1,
            15, 3
          ],
          // Radio del heatmap basado en el zoom
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 2,
            15, 20
          ],
          // Peso del heatmap basado en el risk_score
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'risk_score'],
            0, 0,
            100, 1
          ],
          // Colores del heatmap (verde a rojo)
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0, 255, 0, 0)',
            0.2, 'rgba(0, 255, 0, 0.2)',
            0.4, 'rgba(255, 255, 0, 0.4)',
            0.6, 'rgba(255, 165, 0, 0.6)',
            0.8, 'rgba(255, 69, 0, 0.8)',
            1, 'rgba(255, 0, 0, 1)'
          ],
          // Opacidad del heatmap
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7, 0.8,
            15, 0.4
          ]
        }
      });

      // Capa de círculos (primer plano) 
      map.current!.addLayer({
        id: 'air-quality-circles',
        type: 'circle',
        source: 'air-quality-heatmap',
        minzoom: 10,
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, ['interpolate', ['linear'], ['get', 'risk_score'], 0, 3, 100, 8],
            15, ['interpolate', ['linear'], ['get', 'risk_score'], 0, 6, 100, 15],
            20, ['interpolate', ['linear'], ['get', 'risk_score'], 0, 10, 100, 25]
          ],
          'circle-color': [
            'case',
            ['>=', ['get', 'risk_score'], 70], '#dc2626',
            ['>=', ['get', 'risk_score'], 45], '#ea580c', 
            ['>=', ['get', 'risk_score'], 25], '#ca8a04',
            '#16a34a'
          ],
          'circle-opacity': 0.8,
          'circle-stroke-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 1,
            15, 2
          ],
          'circle-stroke-color': '#ffffff',
          'circle-stroke-opacity': 0.8
        }
      });

      // Eventos de interacción
      let popup: maplibregl.Popup | null = null;

      map.current!.on('click', 'air-quality-circles', (e) => {
        if (!e.features || e.features.length === 0) return;
        
        const feature = e.features[0];
        const geometry = feature.geometry as GeoJSON.Point;
        const [lng, lat] = geometry.coordinates;
        const properties = feature.properties;

        if (popup) popup.remove();

        const riskLabel = getRiskLabel(properties!.class);

        popup = new maplibregl.Popup({
          closeButton: true,
          closeOnClick: false,
          className: 'google-style-popup'
        })
          .setLngLat([lng, lat])
          .setHTML(`
            <div style="padding: 12px; font-family: 'Segoe UI', system-ui, sans-serif; min-width: 200px;">
              <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <div style="width: 12px; height: 12px; border-radius: 50%; background: ${getMarkerColor(properties!.risk_score)}; margin-right: 6px;"></div>
                <div style="font-weight: 600; font-size: 14px;">Calidad del Aire</div>
              </div>
              <div style="font-size: 12px; line-height: 1.5; color: #374151;">
                <div style="margin: 4px 0;"><strong>📍 Ubicación:</strong> ${lat.toFixed(4)}, ${lng.toFixed(4)}</div>
                <div style="margin: 4px 0;"><strong>🎯 Risk Score:</strong> 
                  <span style="background: ${getMarkerColor(properties!.risk_score)}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; margin-left: 4px;">
                    ${properties!.risk_score}
                  </span>
                </div>
                <div style="margin: 4px 0;"><strong>📊 Nivel:</strong> ${riskLabel}</div>
                <div style="margin: 8px 0 4px 0; font-size: 10px; color: #6b7280;">
                  🕒 Actualizado: ${new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          `)
          .addTo(map.current!);
      });

      // Cursor pointer en hover
      map.current!.on('mouseenter', 'air-quality-circles', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current!.on('mouseleave', 'air-quality-circles', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });

      // Actualizar zoom
      map.current!.on('zoom', () => {
        if (map.current) setCurrentZoom(Math.round(map.current.getZoom()));
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [data, getRiskColor, getRiskLabel, currentZoom, mapStyle, mapStyles]);

  // Cambiar estilo del mapa
  useEffect(() => {
    if (map.current) {
      map.current.setStyle(mapStyles[mapStyle]);
    }
  }, [mapStyle, mapStyles]);

  const handleZoomIn = () => {
    if (map.current) map.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (map.current) map.current.zoomOut();
  };

  const handleResetView = () => {
    if (map.current) {
      const centerLat = (data.bbox[1] + data.bbox[3]) / 2;
      const centerLng = (data.bbox[0] + data.bbox[2]) / 2;
      map.current.flyTo({
        center: [centerLng, centerLat],
        zoom: 10,
        pitch: 0,
        bearing: 0
      });
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Mapa */}
      <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden" />
      
      {/* Controles personalizados estilo Google Maps */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        {/* Selector de estilo de mapa */}
        <Card className="p-2 shadow-lg">
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant={mapStyle === 'streets' ? 'default' : 'ghost'}
              onClick={() => setMapStyle('streets')}
              className="text-xs px-2 py-1"
            >
              <MapPin className="h-3 w-3 mr-1" />
              Calles
            </Button>
            <Button
              size="sm"
              variant={mapStyle === 'satellite' ? 'default' : 'ghost'}
              onClick={() => setMapStyle('satellite')}
              className="text-xs px-2 py-1"
            >
              <Satellite className="h-3 w-3 mr-1" />
              Satélite
            </Button>
            <Button
              size="sm"
              variant={mapStyle === 'hybrid' ? 'default' : 'ghost'}
              onClick={() => setMapStyle('hybrid')}
              className="text-xs px-2 py-1"
            >
              <Layers className="h-3 w-3 mr-1" />
              Híbrido
            </Button>
          </div>
        </Card>

        {/* Controles de navegación adicionales */}
        <Card className="p-1 shadow-lg">
          <div className="flex flex-col">
            <Button size="sm" variant="ghost" onClick={handleZoomIn} className="p-1 h-8 w-8">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <div className="border-t my-1"></div>
            <Button size="sm" variant="ghost" onClick={handleZoomOut} className="p-1 h-8 w-8">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <div className="border-t my-1"></div>
            <Button size="sm" variant="ghost" onClick={handleResetView} className="p-1 h-8 w-8" title="Centrar vista">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Información del mapa */}
      <div className="absolute bottom-4 right-4 z-10">
        <Card className="p-2 shadow-lg bg-white/90 backdrop-blur-sm">
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Zoom: {currentZoom}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {data.cells.length} puntos
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Leyenda estilo Google */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="p-3 shadow-lg bg-white/95 backdrop-blur-sm">
          <div className="text-xs font-semibold mb-2">Nivel de Riesgo</div>
          <div className="space-y-1">
            {[
              { color: '#16a34a', label: 'Bajo (0-24)', range: '0-24' },
              { color: '#ca8a04', label: 'Moderado (25-44)', range: '25-44' },
              { color: '#ea580c', label: 'Alto (45-69)', range: '45-69' },
              { color: '#dc2626', label: 'Muy Alto (70+)', range: '70+' }
            ].map((item) => (
              <div key={item.range} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-3 h-3 rounded-full border border-white shadow-sm" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}