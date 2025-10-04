import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.9, 0.8]);
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 10;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;
        setMousePosition({ x, y });
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Memoize star positions to avoid recalculating on every render
  const stars = useMemo(() => 
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      width: Math.random() * 2,
      height: Math.random() * 2,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 2,
    })),
  []);
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

  const handleLocationSelect = useCallback((coords: [number, number]) => {
    setSelectedCoords(coords);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Enhanced Space Background with Earth and Station */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Deep Space Gradient */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950/70 to-slate-900"
          style={{ opacity }}
        >
          {/* Optimized Stars Layer - Reduced from 80 to 30 */}
          <motion.div
            className="absolute inset-0"
            style={{ 
              y: y1,
              x: mousePosition.x * 0.2,
            }}
          >
            {stars.map((star) => (
              <motion.div
                key={star.id}
                className="absolute bg-white rounded-full will-change-transform"
                style={{
                  width: `${star.width}px`,
                  height: `${star.height}px`,
                  top: `${star.top}%`,
                  left: `${star.left}%`,
                }}
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: star.duration,
                  repeat: Infinity,
                  delay: star.delay,
                }}
              />
            ))}
          </motion.div>

          {/* Earth - Simplified */}
          <motion.div
            className="absolute will-change-transform"
            style={{ 
              bottom: '-50%',
              right: '-20%',
              width: '140%',
              height: '140%',
              y: y1,
              x: mousePosition.x * -0.3,
            }}
          >
            {/* Earth Atmospheric Glow */}
            <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-[120px]" />
            
            {/* Earth Main Body - Static gradient, no animation */}
            <div 
              className="absolute inset-0 rounded-full overflow-hidden shadow-2xl"
              style={{
                background: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.5) 0%, rgba(29, 78, 216, 0.4) 35%, rgba(30, 58, 138, 0.3) 65%, rgba(15, 23, 42, 0.2) 85%, transparent 100%)',
                boxShadow: 'inset -40px -40px 120px rgba(0, 0, 0, 0.5), inset 40px 40px 80px rgba(59, 130, 246, 0.2)'
              }}
            >
              {/* Terminator Line (Day/Night) - Static */}
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(135deg, transparent 45%, rgba(0, 0, 0, 0.6) 55%)'
              }} />
            </div>

            {/* Atmosphere Rim Lighting */}
            <div className="absolute inset-0 rounded-full" style={{
              boxShadow: '0 0 60px rgba(59, 130, 246, 0.4), inset 0 0 80px rgba(59, 130, 246, 0.2)'
            }} />
          </motion.div>

          {/* Simplified Satellite */}
          <motion.div
            className="absolute will-change-transform"
            style={{
              top: '30%',
              left: '50%',
              y: mousePosition.y * 0.8,
              x: mousePosition.x * 0.8,
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 100,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {/* Main Station Body */}
              <div className="relative w-24 h-32 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 rounded-sm shadow-2xl">
                {/* Solar Panel Left */}
                <div className="absolute top-1/2 -left-16 -translate-y-1/2 w-16 h-40 bg-gradient-to-r from-blue-950/50 via-blue-500/70 to-blue-950/50 backdrop-blur-sm border border-blue-400/40 shadow-lg shadow-blue-500/30" 
                  style={{
                    clipPath: 'polygon(0 8%, 100% 0, 100% 100%, 0 92%)',
                  }}
                />
                
                {/* Solar Panel Right */}
                <div className="absolute top-1/2 -right-16 -translate-y-1/2 w-16 h-40 bg-gradient-to-r from-blue-950/50 via-blue-500/70 to-blue-950/50 backdrop-blur-sm border border-blue-400/40 shadow-lg shadow-blue-500/30"
                  style={{
                    clipPath: 'polygon(0 0, 100% 8%, 100% 92%, 0 100%)',
                  }}
                />
                
                {/* Communication Array */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-1 h-10 bg-gradient-to-t from-slate-300 to-slate-400" />
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-4 h-4 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-lg shadow-red-500/60">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-red-400"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.8, 0, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Atmospheric Light Effects - Static */}
          <div className="absolute inset-0">
            <div className="absolute top-[20%] left-[15%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[25%] right-[25%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px]" />
            <div className="absolute top-[50%] right-[15%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
          </div>

          {/* Technical Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)',
            backgroundSize: '80px 80px'
          }} />
        </motion.div>

        {/* Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950/80" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        <Navigation />

        {/* Hero Section with fade effect */}
        <div className="relative">
          <HeroSection />
          {/* Fade to next section */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-background pointer-events-none z-10" />
        </div>

        {/* Features Section with fade effects */}
        <div className="relative">
          {/* Fade from previous section */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
          <FeaturesSection />
          {/* Fade to next section */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-slate-900 pointer-events-none z-10" />
        </div>

        {/* Monitor Section - Redesigned with Dramatic Style */}
        <section id="monitor" className="relative py-32 overflow-hidden">
        {/* Fade from previous section */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-900 to-transparent pointer-events-none z-20" />
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-blue-950/60 to-slate-900/80">
          {/* Static Atmospheric Effect - No animation for better performance */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
              backgroundSize: '100% 100%',
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Dramatic Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent leading-tight">
                Monitor
                <br />
                From Space
              </h2>
            </motion.div>
            
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 120 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"
            />
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto leading-relaxed"
            >
              Real-time atmospheric data from NASA's TEMPO satellite
              <br />
              <span className="text-cyan-300">Select • Explore • Protect</span>
            </motion.p>
          </motion.div>

          {/* Pollutant Selector - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mb-12 max-w-4xl mx-auto"
          >
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
              <PollutantSelector selected={selectedPollutant} onSelect={setSelectedPollutant} />
            </div>
          </motion.div>

          {/* Monitor Grid - Cinematic Layout */}
          <div className="grid lg:grid-cols-3 gap-8 min-h-[700px]">
            {/* Map Section - Dramatic Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 relative group"
            >
              {/* Decorative Corner Elements */}
              <div className="absolute -top-2 -left-2 w-20 h-20 border-t-2 border-l-2 border-cyan-400/50 rounded-tl-3xl z-10" />
              <div className="absolute -top-2 -right-2 w-20 h-20 border-t-2 border-r-2 border-purple-400/50 rounded-tr-3xl z-10" />
              <div className="absolute -bottom-2 -left-2 w-20 h-20 border-b-2 border-l-2 border-blue-400/50 rounded-bl-3xl z-10" />
              <div className="absolute -bottom-2 -right-2 w-20 h-20 border-b-2 border-r-2 border-pink-400/50 rounded-br-3xl z-10" />
              
              {/* Map Container */}
              <div className="relative h-[700px] rounded-2xl overflow-hidden backdrop-blur-sm bg-slate-900/50 border border-white/10 shadow-2xl">
                <AirQualityMap
                  selectedPollutant={selectedPollutant}
                  onLocationSelect={handleLocationSelect}
                />
                
                {/* Overlay Grid Effect */}
                <div className="absolute inset-0 pointer-events-none opacity-10">
                  <div className="w-full h-full" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                  }} />
                </div>
              </div>
            </motion.div>

            {/* Side Panel - Desktop - Futuristic Holographic Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="hidden lg:flex flex-col gap-6"
            >
              {airQualityData && (
                <>
                  {/* Risk Panel - Holographic Card */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative group"
                  >
                    {/* Static Border Glow */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl opacity-60 blur group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Card Content */}
                    <div className="relative backdrop-blur-xl bg-gradient-to-br from-slate-900/90 via-blue-950/80 to-slate-900/90 border border-cyan-400/30 rounded-2xl overflow-hidden shadow-2xl">
                      {/* Holographic Effect Overlay */}
                      <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-cyan-400/30 via-transparent to-transparent" />
                        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-tl from-purple-400/30 via-transparent to-transparent" />
                      </div>
                      
                      {/* Corner Accents */}
                      <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-400/60 rounded-tl-lg" />
                      <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-purple-400/60 rounded-br-lg" />
                      
                      {/* Tech Grid Pattern */}
                      <div className="absolute inset-0 opacity-5" style={{
                        backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                      }} />
                      
                      <div className="relative z-10">
                        <RiskPanel aqi={airQualityData.aqi} riskLevel={airQualityData.riskLevel} />
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Info Panel - Holographic Card */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative group flex-1"
                  >
                    {/* Static Border Glow */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-2xl opacity-60 blur group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Card Content */}
                    <div className="relative h-full backdrop-blur-xl bg-gradient-to-br from-slate-900/90 via-purple-950/80 to-slate-900/90 border border-purple-400/30 rounded-2xl overflow-hidden shadow-2xl">
                      {/* Holographic Effect Overlay */}
                      <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-bl from-purple-400/30 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-tr from-pink-400/30 via-transparent to-transparent" />
                      </div>
                      
                      {/* Corner Accents */}
                      <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-purple-400/60 rounded-tr-lg" />
                      <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-pink-400/60 rounded-bl-lg" />
                      
                      {/* Tech Pattern Overlay */}
                      <div className="absolute inset-0 opacity-5" style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 92, 246, 0.3) 2px, rgba(139, 92, 246, 0.3) 4px)',
                      }} />
                      
                      <div className="relative z-10 h-full">
                        <InfoPanel data={airQualityData} selectedPollutant={selectedPollutant} />
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </motion.div>

            {/* Mobile Panel Toggle - Optimized */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidePanelOpen(!sidePanelOpen)}
              className="lg:hidden fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center z-40 backdrop-blur-sm border-2 border-cyan-400/30"
            >
              {sidePanelOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </motion.button>

            {/* Side Panel - Mobile Drawer - Futuristic */}
            <motion.div
              initial={false}
              animate={{
                x: sidePanelOpen ? 0 : '100%',
              }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed inset-y-0 right-0 w-full sm:w-96 backdrop-blur-2xl bg-gradient-to-b from-slate-950/98 via-blue-950/95 to-slate-950/98 shadow-2xl z-50 overflow-y-auto border-l-2 border-cyan-400/30"
            >
              {/* Tech Pattern Background */}
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)',
                backgroundSize: '30px 30px'
              }} />
              
              <div className="relative p-6 space-y-6 pt-24">
                {airQualityData && (
                  <>
                    {/* Mobile Risk Panel - Holographic */}
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl opacity-60 blur" />
                      <div className="relative backdrop-blur-xl bg-gradient-to-br from-slate-900/90 via-blue-950/80 to-slate-900/90 border border-cyan-400/30 rounded-2xl overflow-hidden">
                        {/* Corner Accents */}
                        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-400/60 rounded-tl-lg" />
                        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-purple-400/60 rounded-br-lg" />
                        
                        <div className="relative z-10">
                          <RiskPanel aqi={airQualityData.aqi} riskLevel={airQualityData.riskLevel} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Mobile Info Panel - Holographic */}
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-2xl opacity-60 blur" />
                      <div className="relative backdrop-blur-xl bg-gradient-to-br from-slate-900/90 via-purple-950/80 to-slate-900/90 border border-purple-400/30 rounded-2xl overflow-hidden">
                        {/* Corner Accents */}
                        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-purple-400/60 rounded-tr-lg" />
                        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-pink-400/60 rounded-bl-lg" />
                        
                        <div className="relative z-10">
                          <InfoPanel data={airQualityData} selectedPollutant={selectedPollutant} />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Overlay for mobile drawer - Enhanced */}
            {sidePanelOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidePanelOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              />
            )}
          </div>
        </div>
        
        {/* Fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent via-slate-900/50 to-background pointer-events-none z-20" />
      </section>

      {/* News Section with fade effects */}
      <div className="relative">
        {/* Fade from previous section */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
        <NewsSection />
        {/* Fade to footer */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-slate-950 pointer-events-none z-10" />
      </div>

      {/* Footer with fade effect */}
      <div className="relative">
        {/* Fade from previous section */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-950 to-transparent pointer-events-none z-10" />
        <Footer />
      </div>
      </div>
    </div>
  );
};

export default Index;
