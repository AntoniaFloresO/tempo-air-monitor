import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Layers, Navigation, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface SimpleCanvasMapProps {
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

export function SimpleCanvasMap({ data, getRiskColor, getRiskLabel }: SimpleCanvasMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPoint, setSelectedPoint] = React.useState<{
    lat: number;
    lon: number;
    risk_score: number;
    class: string;
    index: number;
    point: { x: number; y: number };
  } | null>(null);
  const [zoom, setZoom] = React.useState(1);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });

  const getColorForRisk = (riskScore: number) => {
    if (riskScore >= 70) return '#dc2626'; // red-600
    if (riskScore >= 45) return '#ea580c'; // orange-600  
    if (riskScore >= 25) return '#ca8a04'; // yellow-600
    return '#16a34a'; // green-600
  };

  const latLonToPixel = React.useCallback((lat: number, lon: number, width: number, height: number) => {
    const [minLon, minLat, maxLon, maxLat] = data.bbox;
    
    const x = ((lon - minLon) / (maxLon - minLon)) * width;
    const y = ((maxLat - lat) / (maxLat - minLat)) * height;
    
    return {
      x: x * zoom + offset.x,
      y: y * zoom + offset.y
    };
  }, [data.bbox, zoom, offset]);

  const drawMap = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2; // Para alta resolución
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    const width = rect.width;
    const height = rect.height;

    // Limpiar canvas
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // Dibujar grid de fondo
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Dibujar contorno del área
    const [minLon, minLat, maxLon, maxLat] = data.bbox;
    const topLeft = latLonToPixel(maxLat, minLon, width, height);
    const bottomRight = latLonToPixel(minLat, maxLon, width, height);
    
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      topLeft.x,
      topLeft.y,
      bottomRight.x - topLeft.x,
      bottomRight.y - topLeft.y
    );

    // Dibujar heatmap de fondo (opcional)
    data.cells.forEach(cell => {
      const point = latLonToPixel(cell.lat, cell.lon, width, height);
      const radius = Math.max(8, cell.risk_score / 3) * zoom;
      
      // Gradient radial para efecto heatmap
      const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);
      const color = getColorForRisk(cell.risk_score);
      gradient.addColorStop(0, color + '40'); // 25% opacity
      gradient.addColorStop(1, color + '00'); // 0% opacity
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Dibujar puntos de datos
    data.cells.forEach((cell, index) => {
      const point = latLonToPixel(cell.lat, cell.lon, width, height);
      const radius = Math.max(3, Math.min(12, cell.risk_score / 8)) * zoom;
      const color = getColorForRisk(cell.risk_score);

      // Círculo principal
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
      ctx.fill();

      // Borde blanco
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Highlight si está seleccionado
      if (selectedPoint && selectedPoint.index === index) {
        ctx.strokeStyle = '#1e40af';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    });

    // Dibujar etiquetas de ciudades principales
    const cities = [
      { name: 'Downtown LA', lat: 34.0522, lon: -118.2437 },
      { name: 'Hollywood', lat: 34.0928, lon: -118.3287 },
      { name: 'Santa Monica', lat: 34.0195, lon: -118.4912 },
      { name: 'Beverly Hills', lat: 34.0736, lon: -118.4004 },
      { name: 'Pasadena', lat: 34.1478, lon: -118.1445 }
    ];

    ctx.fillStyle = '#1e293b';
    ctx.font = `${Math.max(10, 12 * zoom)}px system-ui`;
    cities.forEach(city => {
      const point = latLonToPixel(city.lat, city.lon, width, height);
      if (point.x > 0 && point.x < width && point.y > 0 && point.y < height) {
        // Fondo para el texto
        const textWidth = ctx.measureText(city.name).width;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(point.x - textWidth/2 - 4, point.y - 20, textWidth + 8, 16);
        
        // Texto
        ctx.fillStyle = '#1e293b';
        ctx.textAlign = 'center';
        ctx.fillText(city.name, point.x, point.y - 8);
      }
    });
  }, [data, zoom, selectedPoint, latLonToPixel]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Encontrar el punto más cercano al click
    let closestPoint = null;
    let minDistance = Infinity;

    data.cells.forEach((cell, index) => {
      const point = latLonToPixel(cell.lat, cell.lon, rect.width, rect.height);
      const distance = Math.sqrt(
        Math.pow(point.x - clickX, 2) + Math.pow(point.y - clickY, 2)
      );

      if (distance < 20 && distance < minDistance) { // 20px de tolerancia
        minDistance = distance;
        closestPoint = { ...cell, index, point };
      }
    });

    setSelectedPoint(closestPoint);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: event.clientX - offset.x, y: event.clientY - offset.y });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setOffset({
        x: event.clientX - dragStart.x,
        y: event.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.5, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.5, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setSelectedPoint(null);
  };

  // Redibujar cuando cambian los parámetros
  useEffect(() => {
    drawMap();
  }, [data, zoom, offset, selectedPoint, drawMap]);

  // Redibujar cuando cambia el tamaño
  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => drawMap(), 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawMap]);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-gray-50 rounded-lg overflow-hidden">
      {/* Canvas del mapa */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-move"
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      />

      {/* Controles */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
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
                Zoom: {zoom.toFixed(1)}x
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
                <div className="font-semibold">Punto de Medición</div>
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
                <div><strong>📍 Lat:</strong> {selectedPoint.lat.toFixed(4)}</div>
                <div><strong>📍 Lon:</strong> {selectedPoint.lon.toFixed(4)}</div>
                <div className="flex items-center gap-2">
                  <strong>🎯 Risk Score:</strong>
                  <Badge 
                    style={{ 
                      backgroundColor: getColorForRisk(selectedPoint.risk_score),
                      color: 'white'
                    }}
                  >
                    {selectedPoint.risk_score}
                  </Badge>
                </div>
                <div><strong>📊 Nivel:</strong> {getRiskLabel(selectedPoint.class)}</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Leyenda */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="p-3 shadow-lg bg-white/95 backdrop-blur-sm">
          <div className="text-xs font-semibold mb-2">Nivel de Riesgo</div>
          <div className="space-y-1">
            {[
              { color: '#16a34a', label: 'Bajo (0-24)' },
              { color: '#ca8a04', label: 'Moderado (25-44)' },
              { color: '#ea580c', label: 'Alto (45-69)' },
              { color: '#dc2626', label: 'Muy Alto (70+)' }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-3 h-3 rounded-full border border-white shadow-sm" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Haz clic en un punto para más info
          </div>
        </Card>
      </div>
    </div>
  );
}