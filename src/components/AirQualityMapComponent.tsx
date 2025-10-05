import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet en React
import L from 'leaflet';

// Configuración de iconos por defecto para Leaflet
const iconRetinaUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png';
const iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png';
const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

interface AirQualityMapProps {
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

export function AirQualityMapComponent({ data, getRiskColor, getRiskLabel }: AirQualityMapProps) {
  const getMarkerColor = (riskScore: number) => {
    if (riskScore >= 67) return '#ef4444'; // red-500
    if (riskScore >= 34) return '#f97316'; // orange-500
    return '#22c55e'; // green-500
  };

  const getMarkerSize = (riskScore: number) => {
    return Math.max(5, Math.min(15, riskScore / 5));
  };

  const center: [number, number] = [
    (data.bbox[1] + data.bbox[3]) / 2,
    (data.bbox[0] + data.bbox[2]) / 2
  ];

  return (
    <div className="h-[500px] rounded-lg overflow-hidden border">
      <MapContainer
        center={center}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {data.cells.map((cell, index) => (
          <CircleMarker
            key={index}
            center={[cell.lat, cell.lon]}
            radius={getMarkerSize(cell.risk_score)}
            pathOptions={{
              color: getMarkerColor(cell.risk_score),
              fillColor: getMarkerColor(cell.risk_score),
              fillOpacity: 0.7
            }}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold mb-2">Calidad del Aire</div>
                <div className="space-y-1">
                  <div><strong>Latitud:</strong> {cell.lat.toFixed(4)}</div>
                  <div><strong>Longitud:</strong> {cell.lon.toFixed(4)}</div>
                  <div><strong>Risk Score:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getRiskColor(cell.risk_score)}`}>
                      {cell.risk_score}
                    </span>
                  </div>
                  <div><strong>Clasificación:</strong> {getRiskLabel(cell.class)}</div>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}