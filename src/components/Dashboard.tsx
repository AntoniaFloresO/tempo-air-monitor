import { useState } from 'react';
import { AirQualityMap } from './AirQualityMap';
import { CityComparison } from './CityComparison';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Map, BarChart3, Satellite, Globe, Zap } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('map');

  const tabs: Tab[] = [
    { 
      id: 'map', 
      label: 'Mapa Interactivo', 
      icon: <Map className="h-4 w-4" />,
      component: <AirQualityMap /> 
    },
    { 
      id: 'comparison', 
      label: 'Comparación de Ciudades', 
      icon: <BarChart3 className="h-4 w-4" />,
      component: <CityComparison /> 
    }
  ];

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
            {tabs.map(tab => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                size="lg"
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-6"
              >
                {tab.icon}
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            {tabs.find(tab => tab.id === activeTab)?.icon}
            <h2 className="text-2xl font-bold">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h2>
          </div>
          <p className="text-muted-foreground">
            {activeTab === 'map' 
              ? 'Explora los datos de calidad del aire en tiempo real con visualización interactiva por ciudad'
              : 'Compara la calidad del aire entre diferentes ciudades y analiza métricas detalladas'
            }
          </p>
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in-50 duration-200">
          {tabs.find(tab => tab.id === activeTab)?.component}
        </div>
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
                <p>
                  <strong>Desarrollado para:</strong> NASA Space Apps Challenge 2024
                </p>
                <p>
                  <strong>Equipo:</strong> CleanSky - Satellite Air Quality Platform
                </p>
                <p>
                  <strong>Cobertura:</strong> Norteamérica (Área de cobertura TEMPO)
                </p>
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