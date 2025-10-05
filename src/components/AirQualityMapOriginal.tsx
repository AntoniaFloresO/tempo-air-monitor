import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Pollutant } from '@/types/air-quality';

interface AirQualityMapProps {
  selectedPollutant: Pollutant;
  onLocationSelect?: (coords: [number, number]) => void;
}

const AirQualityMapOriginal = ({ selectedPollutant, onLocationSelect }: AirQualityMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
      },
      center: [-98.5795, 39.8283], // Center of USA
      zoom: 4,
      pitch: 0,
    });

    // Add navigation controls
    map.current.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: false,
      }),
      'top-right'
    );

    // Add geolocate control
    const geolocate = new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });
    map.current.addControl(geolocate, 'top-right');

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    // Ensure style is fully loaded before allowing source additions
    map.current.on('style.load', () => {
      setMapLoaded(true);
    });

    // Click event for location selection
    map.current.on('click', (e) => {
      if (onLocationSelect) {
        onLocationSelect([e.lngLat.lng, e.lngLat.lat]);
      }
    });

    // Auto-trigger geolocation after map is ready
    map.current.once('idle', () => {
      setTimeout(() => geolocate.trigger(), 500);
    });

    // Cleanup
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [onLocationSelect]);

  // Add pollutant visualization layer
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Double-check that style is loaded before proceeding
    if (!map.current.isStyleLoaded()) {
      console.log('Style not loaded yet, waiting...');
      return;
    }

    // Remove existing pollutant layer if any
    if (map.current.getLayer('pollutant-heatmap')) {
      map.current.removeLayer('pollutant-heatmap');
    }
    if (map.current.getSource('pollutant-data')) {
      map.current.removeSource('pollutant-data');
    }

    // Generate sample data points (in production, this would come from TEMPO API)
    const sampleData = generateSamplePollutantData(selectedPollutant);

    // Add source
    map.current.addSource('pollutant-data', {
      type: 'geojson',
      data: sampleData,
    });

    // Get color based on pollutant
    const colors = getPollutantColors(selectedPollutant);

    // Add heatmap layer
    map.current.addLayer({
      id: 'pollutant-heatmap',
      type: 'heatmap',
      source: 'pollutant-data',
      paint: {
        'heatmap-weight': ['interpolate', ['linear'], ['get', 'value'], 0, 0, 100, 1],
        'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0,
          'rgba(0, 0, 255, 0)',
          0.2,
          colors.low,
          0.4,
          colors.medium,
          0.6,
          colors.high,
          0.8,
          colors.veryHigh,
          1,
          colors.hazardous,
        ],
        'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 20, 9, 40],
        'heatmap-opacity': 0.7,
      },
    });
  }, [selectedPollutant, mapLoaded]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-2xl overflow-hidden" />
      <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-border">
        <p className="text-sm font-medium">{getPollutantLabel(selectedPollutant)}</p>
      </div>
    </div>
  );
};

// Helper functions
function getPollutantLabel(pollutant: Pollutant): string {
  const labels = {
    no2: 'Nitrogen Dioxide (NO₂)',
    o3: 'Ozone (O₃)',
    pm25: 'Particulate Matter (PM2.5)',
  };
  return labels[pollutant];
}

function getPollutantColors(pollutant: Pollutant) {
  const colorSets = {
    no2: {
      low: 'rgb(255, 237, 160)',
      medium: 'rgb(255, 193, 7)',
      high: 'rgb(255, 152, 0)',
      veryHigh: 'rgb(244, 67, 54)',
      hazardous: 'rgb(156, 39, 176)',
    },
    o3: {
      low: 'rgb(179, 229, 252)',
      medium: 'rgb(100, 181, 246)',
      high: 'rgb(41, 182, 246)',
      veryHigh: 'rgb(2, 119, 189)',
      hazardous: 'rgb(1, 87, 155)',
    },
    pm25: {
      low: 'rgb(225, 190, 231)',
      medium: 'rgb(186, 104, 200)',
      high: 'rgb(156, 39, 176)',
      veryHigh: 'rgb(106, 27, 154)',
      hazardous: 'rgb(74, 20, 140)',
    },
  };
  return colorSets[pollutant];
}

function generateSamplePollutantData(pollutant: Pollutant) {
  // Generate random sample data points
  const features = [];
  const cities = [
    { name: 'Los Angeles', coords: [-118.2437, 34.0522], baseValue: 60 },
    { name: 'New York', coords: [-74.006, 40.7128], baseValue: 45 },
    { name: 'Houston', coords: [-95.3698, 29.7604], baseValue: 55 },
    { name: 'Chicago', coords: [-87.6298, 41.8781], baseValue: 50 },
    { name: 'Phoenix', coords: [-112.074, 33.4484], baseValue: 65 },
    { name: 'Miami', coords: [-80.1918, 25.7617], baseValue: 40 },
    { name: 'Seattle', coords: [-122.3321, 47.6062], baseValue: 35 },
    { name: 'Denver', coords: [-104.9903, 39.7392], baseValue: 48 },
  ];

  cities.forEach((city) => {
    // Add multiple points around each city to create heat zones
    for (let i = 0; i < 15; i++) {
      const offsetLng = (Math.random() - 0.5) * 1;
      const offsetLat = (Math.random() - 0.5) * 1;
      const value = city.baseValue + (Math.random() - 0.5) * 20;

      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [city.coords[0] + offsetLng, city.coords[1] + offsetLat],
        },
        properties: {
          value: Math.max(0, Math.min(100, value)),
          city: city.name,
        },
      });
    }
  });

  return {
    type: 'FeatureCollection' as const,
    features,
  };
}

export default AirQualityMapOriginal;