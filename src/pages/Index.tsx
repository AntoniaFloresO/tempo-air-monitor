import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import NewsSection from '@/components/NewsSection';
import Footer from '@/components/Footer';
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
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Monitor Section */}
      <section id="monitor" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Live Air Quality Monitor</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select a pollutant and explore real-time air quality data across North America
            </p>
          </motion.div>

          {/* Pollutant Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-6 max-w-4xl mx-auto"
          >
            <PollutantSelector selected={selectedPollutant} onSelect={setSelectedPollutant} />
          </motion.div>

          {/* Monitor Grid */}
          <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
            {/* Map Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
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
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
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

            {/* Mobile Panel Toggle */}
            <button
              onClick={() => setSidePanelOpen(!sidePanelOpen)}
              className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center z-40"
            >
              {sidePanelOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Side Panel - Mobile Drawer */}
            <motion.div
              initial={false}
              animate={{
                x: sidePanelOpen ? 0 : '100%',
              }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed inset-y-0 right-0 w-full sm:w-96 bg-background shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6 space-y-6 pt-20">
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
        </div>
      </section>

      {/* News Section */}
      <NewsSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
