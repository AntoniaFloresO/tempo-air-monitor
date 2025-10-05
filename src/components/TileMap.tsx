import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Layers, Navigation, ZoomIn, ZoomOut, RotateCcw, Satellite } from 'lucide-react';

interface TileMapProps {
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

export function TileMap({ data, getRiskColor, getRiskLabel }: TileMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPoint, setSelectedPoint] = useState<{
    lat: number;
    lon: number;
    risk_score: number;
    class: string;
    index: number;
    point: { x: number; y: number };
  } | null>(null);
  const [zoom, setZoom] = useState(4); // Zoom más alejado para ver toda Norte América
  const [center, setCenter] = useState<[number, number]>([
    40.0, // Latitud central de Norte América
    -100.0 // Longitud central de Norte América
  ]);
  const [mapStyle, setMapStyle] = useState<'osm' | 'satellite'>('osm');

  const deg2rad = (deg: number) => deg * (Math.PI / 180);
  const rad2deg = (rad: number) => rad * (180 / Math.PI);

  // Convertir lat/lon a coordenadas de pixel para el tile map
  const latLonToPixel = (lat: number, lon: number, zoom: number, centerLat: number, centerLon: number, width: number, height: number) => {
    const tileSize = 256;
    const scale = Math.pow(2, zoom);
    
    // Proyección Mercator Web
    const worldPixelX = ((centerLon + 180) / 360) * tileSize * scale;
    const worldPixelY = ((1 - Math.log(Math.tan(centerLat * Math.PI / 180) + 1 / Math.cos(centerLat * Math.PI / 180)) / Math.PI) / 2) * tileSize * scale;
    
    const pointPixelX = ((lon + 180) / 360) * tileSize * scale;
    const pointPixelY = ((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2) * tileSize * scale;
    
    return {
      x: width / 2 + (pointPixelX - worldPixelX),
      y: height / 2 + (pointPixelY - worldPixelY)
    };
  };

  const getColorForRisk = (riskScore: number) => {
    if (riskScore >= 70) return '#dc2626';
    if (riskScore >= 45) return '#ea580c';
    if (riskScore >= 25) return '#ca8a04';
    return '#16a34a';
  };

  // Generar URL del tile de OpenStreetMap
  const getTileUrl = (x: number, y: number, z: number, style: string) => {
    if (style === 'satellite') {
      return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;
    }
    return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
  };

  const drawMapWithOverlay = () => {
    const canvas = canvasRef.current;
    const container = mapContainerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Calcular tiles necesarios
    const tileSize = 256;
    const scale = Math.pow(2, zoom);
    const worldPixelX = ((center[1] + 180) / 360) * tileSize * scale;
    const worldPixelY = ((1 - Math.log(Math.tan(center[0] * Math.PI / 180) + 1 / Math.cos(center[0] * Math.PI / 180)) / Math.PI) / 2) * tileSize * scale;
    
    const offsetX = rect.width / 2 - worldPixelX;
    const offsetY = rect.height / 2 - worldPixelY;

    // Dibujar fondo gris mientras cargan los tiles
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Calcular rango de tiles a cargar
    const minTileX = Math.floor((worldPixelX - rect.width / 2) / tileSize);
    const maxTileX = Math.ceil((worldPixelX + rect.width / 2) / tileSize);
    const minTileY = Math.floor((worldPixelY - rect.height / 2) / tileSize);
    const maxTileY = Math.ceil((worldPixelY + rect.height / 2) / tileSize);

    let tilesLoaded = 0;
    const totalTiles = (maxTileX - minTileX + 1) * (maxTileY - minTileY + 1);

    // Cargar y dibujar tiles
    for (let x = minTileX; x <= maxTileX; x++) {
      for (let y = minTileY; y <= maxTileY; y++) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const tilePixelX = x * tileSize + offsetX;
          const tilePixelY = y * tileSize + offsetY;
          ctx.drawImage(img, tilePixelX, tilePixelY, tileSize, tileSize);
          
          tilesLoaded++;
          if (tilesLoaded === totalTiles) {
            // Todos los tiles cargados, ahora dibujar overlay
            drawDataOverlay();
          }
        };
        img.onerror = () => {
          // Si falla, dibujar un tile gris con información
          const tilePixelX = x * tileSize + offsetX;
          const tilePixelY = y * tileSize + offsetY;
          ctx.fillStyle = '#e2e8f0';
          ctx.fillRect(tilePixelX, tilePixelY, tileSize, tileSize);
          ctx.strokeStyle = '#cbd5e1';
          ctx.strokeRect(tilePixelX, tilePixelY, tileSize, tileSize);
          
          tilesLoaded++;
          if (tilesLoaded === totalTiles) {
            drawDataOverlay();
          }
        };
        img.src = getTileUrl(x, y, zoom, mapStyle);
      }
    }

    // Si no hay tiles que cargar, dibujar overlay inmediatamente
    if (totalTiles === 0) {
      drawDataOverlay();
    }
  };

  const drawDataOverlay = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();

    // Dibujar heatmap de fondo (opcional)
    data.cells.forEach(cell => {
      const point = latLonToPixel(cell.lat, cell.lon, zoom, center[0], center[1], rect.width, rect.height);
      const radius = Math.max(15, cell.risk_score / 2);
      
      // Gradient radial para efecto heatmap
      const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);
      const color = getColorForRisk(cell.risk_score);
      gradient.addColorStop(0, color + '30'); // 20% opacity
      gradient.addColorStop(1, color + '00'); // 0% opacity
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Dibujar puntos de datos
    data.cells.forEach((cell, index) => {
      const point = latLonToPixel(cell.lat, cell.lon, zoom, center[0], center[1], rect.width, rect.height);
      const radius = Math.max(4, Math.min(12, cell.risk_score / 8));
      const color = getColorForRisk(cell.risk_score);

      // Círculo principal
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
      ctx.fill();

      // Borde blanco
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Highlight si está seleccionado
      if (selectedPoint && selectedPoint.index === index) {
        ctx.strokeStyle = '#1e40af';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    });

    // Dibujar etiquetas de ciudades importantes en Norte América (cobertura TEMPO)
    const cities = [
      // Estados Unidos - Costa Oeste
      { name: 'Los Ángeles', lat: 34.0522, lon: -118.2437 },
      { name: 'San Francisco', lat: 37.7749, lon: -122.4194 },
      { name: 'Seattle', lat: 47.6062, lon: -122.3321 },
      { name: 'Portland', lat: 45.5152, lon: -122.6784 },
      { name: 'San Diego', lat: 32.7157, lon: -117.1611 },
      { name: 'Las Vegas', lat: 36.1699, lon: -115.1398 },
      
      // Estados Unidos - Costa Este
      { name: 'Nueva York', lat: 40.7128, lon: -74.0060 },
      { name: 'Washington DC', lat: 38.9072, lon: -77.0369 },
      { name: 'Miami', lat: 25.7617, lon: -80.1918 },
      { name: 'Boston', lat: 42.3601, lon: -71.0589 },
      { name: 'Atlanta', lat: 33.7490, lon: -84.3880 },
      { name: 'Philadelphia', lat: 39.9526, lon: -75.1652 },
      
      // Estados Unidos - Centro
      { name: 'Chicago', lat: 41.8781, lon: -87.6298 },
      { name: 'Houston', lat: 29.7604, lon: -95.3698 },
      { name: 'Dallas', lat: 32.7767, lon: -96.7970 },
      { name: 'Denver', lat: 39.7392, lon: -104.9903 },
      { name: 'Phoenix', lat: 33.4484, lon: -112.0740 },
      { name: 'Detroit', lat: 42.3314, lon: -83.0458 },
      
      // Canadá
      { name: 'Toronto', lat: 43.6532, lon: -79.3832 },
      { name: 'Vancouver', lat: 49.2827, lon: -123.1207 },
      { name: 'Montreal', lat: 45.5017, lon: -73.5673 },
      { name: 'Calgary', lat: 51.0447, lon: -114.0719 },
      { name: 'Ottawa', lat: 45.4215, lon: -75.6972 },
      { name: 'Edmonton', lat: 53.5461, lon: -113.4938 },
      
      // México
      { name: 'Ciudad de México', lat: 19.4326, lon: -99.1332 },
      { name: 'Guadalajara', lat: 20.6597, lon: -103.3496 },
      { name: 'Monterrey', lat: 25.6866, lon: -100.3161 },
      { name: 'Tijuana', lat: 32.5149, lon: -117.0382 },
      { name: 'Cancún', lat: 21.1619, lon: -86.8515 },
      { name: 'Mérida', lat: 20.9674, lon: -89.5926 }
    ];

    ctx.fillStyle = '#1e293b';
    ctx.font = '12px system-ui';
    cities.forEach(city => {
      const point = latLonToPixel(city.lat, city.lon, zoom, center[0], center[1], rect.width, rect.height);
      if (point.x > 20 && point.x < rect.width - 20 && point.y > 20 && point.y < rect.height - 20) {
        // Fondo para el texto
        const textWidth = ctx.measureText(city.name).width;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(point.x - textWidth/2 - 4, point.y - 18, textWidth + 8, 16);
        
        // Borde del fondo
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 1;
        ctx.strokeRect(point.x - textWidth/2 - 4, point.y - 18, textWidth + 8, 16);
        
        // Texto
        ctx.fillStyle = '#1e293b';
        ctx.textAlign = 'center';
        ctx.fillText(city.name, point.x, point.y - 6);
      }
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const container = mapContainerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Encontrar el punto más cercano al click
    let closestPoint = null;
    let minDistance = Infinity;

    data.cells.forEach((cell, index) => {
      const point = latLonToPixel(cell.lat, cell.lon, zoom, center[0], center[1], rect.width, rect.height);
      const distance = Math.sqrt(
        Math.pow(point.x - clickX, 2) + Math.pow(point.y - clickY, 2)
      );

      if (distance < 20 && distance < minDistance) {
        minDistance = distance;
        closestPoint = { ...cell, index, point };
      }
    });

    setSelectedPoint(closestPoint);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 1, 3)); // Zoom mínimo para ver toda Norte América
  };

  const handleReset = () => {
    setZoom(4); // Vista inicial de Norte América
    setCenter([40.0, -100.0]); // Centro de Norte América
    setSelectedPoint(null);
  };

  // Redibujar cuando cambian los parámetros
  useEffect(() => {
    const timer = setTimeout(() => {
      drawMapWithOverlay();
    }, 100);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, center, selectedPoint, mapStyle, data]);

  return (
    <div ref={mapContainerRef} className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
      {/* Canvas del mapa */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onClick={handleCanvasClick}
      />

      {/* Controles de mapa */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        {/* Selector de estilo */}
        <Card className="p-2 shadow-lg">
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant={mapStyle === 'osm' ? 'default' : 'ghost'}
              onClick={() => setMapStyle('osm')}
              className="text-xs px-2 py-1"
            >
              <MapPin className="h-3 w-3 mr-1" />
              Mapa
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
          </div>
        </Card>

        {/* Controles de zoom */}
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
            <Button size="sm" variant="ghost" onClick={handleReset} className="p-1 h-8 w-8" title="Reset vista">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Info del mapa */}
      <div className="absolute bottom-4 right-4 z-10">
        <Card className="p-2 shadow-lg bg-white/90 backdrop-blur-sm">
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Zoom: {zoom}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {data.cells.length} puntos
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Popup de información */}
      {selectedPoint && (
        <div className="absolute top-4 right-4 z-10 max-w-xs">
          <Card className="p-3 shadow-lg bg-white border-2 border-blue-500">
            <div className="text-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">📍 Punto de Medición</div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedPoint(null)}
                  className="h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
              <div className="space-y-1 text-xs">
                <div><strong>Latitud:</strong> {selectedPoint.lat.toFixed(4)}</div>
                <div><strong>Longitud:</strong> {selectedPoint.lon.toFixed(4)}</div>
                <div className="flex items-center gap-2">
                  <strong>Risk Score:</strong>
                  <Badge 
                    style={{ 
                      backgroundColor: getColorForRisk(selectedPoint.risk_score),
                      color: 'white'
                    }}
                  >
                    {selectedPoint.risk_score}
                  </Badge>
                </div>
                <div><strong>Nivel:</strong> {getRiskLabel(selectedPoint.class)}</div>
                <div className="text-xs text-gray-500 mt-2">
                  🕒 {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Leyenda */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="p-3 shadow-lg bg-white/95 backdrop-blur-sm">
          <div className="text-xs font-semibold mb-2">🌡️ Nivel de Riesgo</div>
          <div className="space-y-1">
            {[
              { color: '#16a34a', label: 'Bajo (0-24)', count: data.cells.filter(c => c.risk_score < 25).length },
              { color: '#ca8a04', label: 'Moderado (25-44)', count: data.cells.filter(c => c.risk_score >= 25 && c.risk_score < 45).length },
              { color: '#ea580c', label: 'Alto (45-69)', count: data.cells.filter(c => c.risk_score >= 45 && c.risk_score < 70).length },
              { color: '#dc2626', label: 'Muy Alto (70+)', count: data.cells.filter(c => c.risk_score >= 70).length }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full border border-white shadow-sm" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span>{item.label}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {item.count}
                </Badge>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-500 border-t pt-2">
            Haz clic en un punto para más información
          </div>
        </Card>
      </div>
    </div>
  );
}