import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapLibreMapProps {
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

export function MapLibreMap({ data, getRiskColor, getRiskLabel }: MapLibreMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  const getMarkerColor = (riskScore: number) => {
    if (riskScore >= 67) return '#ef4444'; // red-500
    if (riskScore >= 34) return '#f97316'; // orange-500
    return '#22c55e'; // green-500
  };

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // Calcular el centro del mapa basado en bbox
    const centerLat = (data.bbox[1] + data.bbox[3]) / 2;
    const centerLng = (data.bbox[0] + data.bbox[2]) / 2;

    // Inicializar el mapa
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json', // Estilo gratuito
      center: [centerLng, centerLat],
      zoom: 9
    });

    map.current.on('load', () => {
      if (!map.current) return;

      // Preparar datos GeoJSON
      const geojsonData = {
        type: 'FeatureCollection' as const,
        features: data.cells.map((cell, index) => ({
          type: 'Feature' as const,
          properties: {
            id: index,
            risk_score: cell.risk_score,
            class: cell.class,
            color: getMarkerColor(cell.risk_score)
          },
          geometry: {
            type: 'Point' as const,
            coordinates: [cell.lon, cell.lat]
          }
        }))
      };

      // Agregar fuente de datos
      map.current!.addSource('air-quality', {
        type: 'geojson',
        data: geojsonData
      });

      // Agregar capa de círculos
      map.current!.addLayer({
        id: 'air-quality-circles',
        type: 'circle',
        source: 'air-quality',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'risk_score'],
            0, 4,
            100, 12
          ],
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.8,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff'
        }
      });

      // Agregar popups al hacer clic
      map.current!.on('click', 'air-quality-circles', (e) => {
        if (!e.features || e.features.length === 0) return;
        
        const feature = e.features[0];
        const geometry = feature.geometry as GeoJSON.Point;
        const [lng, lat] = geometry.coordinates;
        const properties = feature.properties;

        const riskLabel = getRiskLabel(properties!.class);
        const riskColor = getRiskColor(properties!.risk_score);

        new maplibregl.Popup()
          .setLngLat([lng, lat])
          .setHTML(`
            <div style="padding: 8px; font-family: system-ui;">
              <div style="font-weight: 600; margin-bottom: 8px;">Calidad del Aire</div>
              <div style="font-size: 12px; line-height: 1.4;">
                <div><strong>Coordenadas:</strong> ${lat.toFixed(4)}, ${lng.toFixed(4)}</div>
                <div style="margin: 4px 0;"><strong>Risk Score:</strong> 
                  <span style="background: ${riskColor.includes('bg-') ? '#' + riskColor.split('-')[1] : riskColor}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px; margin-left: 4px;">
                    ${properties!.risk_score}
                  </span>
                </div>
                <div><strong>Clasificación:</strong> ${riskLabel}</div>
              </div>
            </div>
          `)
          .addTo(map.current!);
      });

      // Cambiar cursor al pasar sobre los puntos
      map.current!.on('mouseenter', 'air-quality-circles', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = 'pointer';
        }
      });

      map.current!.on('mouseleave', 'air-quality-circles', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = '';
        }
      });
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [data, getRiskColor, getRiskLabel]);

  return <div ref={mapContainer} className="w-full h-full" />;
}