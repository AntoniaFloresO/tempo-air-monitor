import { motion } from 'framer-motion';
import { ArrowRight, Satellite, Globe, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import tempoSatellite from '@/assets/tempo-satellite.jpg';

const HeroSection = () => {
  return (
    <div className="relative min-h-[600px] md:min-h-[700px] overflow-hidden bg-gradient-to-br from-slate-950/50 via-background/80 to-blue-950/30">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={tempoSatellite}
          alt="TEMPO Satellite"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-background/70 to-background/90" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6"
          >
            <Satellite className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">NASA TEMPO Mission</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Unbounded air quality
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-primary/70">
              monitoring from space
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl"
          >
            Real-time air quality data from NASA's TEMPO satellite. Monitor pollution levels across North America with unprecedented spatial and temporal resolution.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#monitor"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Start Monitoring
              <ArrowRight className="w-5 h-5" />
            </a>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 bg-card border border-border px-6 py-3 rounded-xl font-medium hover:bg-accent transition-colors"
            >
              Learn About TEMPO
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-6 mt-16"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary">
                <Globe className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold">North America</p>
              <p className="text-sm text-muted-foreground">Coverage Area</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary">
                <Zap className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold">Hourly</p>
              <p className="text-sm text-muted-foreground">Data Updates</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary">
                <Satellite className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold">3 Pollutants</p>
              <p className="text-sm text-muted-foreground">Monitored 24/7</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground">Scroll to explore</p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 bg-muted-foreground/50 rounded-full" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
