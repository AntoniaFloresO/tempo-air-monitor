import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AirQualityMap from '@/components/AirQualityMap';
import PollutantSelector from '@/components/PollutantSelector';
import RiskPanel from '@/components/RiskPanel';
import InfoPanel from '@/components/InfoPanel';
import { Pollutant, AirQualityData } from '@/types/air-quality';
import { calculateAQI, getRiskLevel, generateMockData } from '@/utils/air-quality';
import { Menu, X } from 'lucide-react';

const Index = () => {
  const [selectedPollutant, setSelectedPollutant] = useState<Pollutant>('no2');
  const [selectedCoords, setSelectedCoords] = useState<[number, number]>([-98.5795, 39.8283]);
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);

  useEffect(() => {
    // Generate mock data for selected location
    const pollutants = generateMockData(selectedCoords);
    const aqi = calculateAQI(pollutants.no2, pollutants.o3, pollutants.pm25);
    const riskLevel = getRiskLevel(aqi);

    setAirQualityData({
      aqi,
      riskLevel,
      pollutants,
      location: {
        name: 'Selected Location',
        coords: selectedCoords,
      },
      timestamp: new Date(),
    });
  }, [selectedCoords]);

  const handleLocationSelect = (coords: [number, number]) => {
    setSelectedCoords(coords);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">AirSense</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Real-time Air Quality Monitoring
                </p>
              </div>
            </motion.div>

            {/* Mobile menu button */}
            <button
              onClick={() => setSidePanelOpen(!sidePanelOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-accent"
            >
              {sidePanelOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Pollutant Selector */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4"
          >
            <PollutantSelector selected={selectedPollutant} onSelect={setSelectedPollutant} />
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 h-full"
          >
            <AirQualityMap
              selectedPollutant={selectedPollutant}
              onLocationSelect={handleLocationSelect}
            />
          </motion.div>

          {/* Side Panel - Desktop */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden lg:flex flex-col gap-6 overflow-y-auto"
          >
            {airQualityData && (
              <>
                <RiskPanel aqi={airQualityData.aqi} riskLevel={airQualityData.riskLevel} />
                <InfoPanel data={airQualityData} selectedPollutant={selectedPollutant} />
              </>
            )}
          </motion.div>

          {/* Side Panel - Mobile Drawer */}
          <motion.div
            initial={false}
            animate={{
              x: sidePanelOpen ? 0 : '100%',
            }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="lg:hidden fixed inset-y-0 right-0 w-full sm:w-96 bg-background shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {airQualityData && (
                <>
                  <RiskPanel aqi={airQualityData.aqi} riskLevel={airQualityData.riskLevel} />
                  <InfoPanel data={airQualityData} selectedPollutant={selectedPollutant} />
                </>
              )}
            </div>
          </motion.div>

          {/* Overlay for mobile drawer */}
          {sidePanelOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidePanelOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-6">
        <div className="container mx-auto px-4 py-4">
          <p className="text-xs text-center text-muted-foreground">
            Powered by NASA TEMPO satellite data and ground monitoring stations
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
