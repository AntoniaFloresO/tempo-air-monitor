import { motion } from 'framer-motion';
import { ArrowRight, Satellite, Globe, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import tempoSatellite from '@/assets/tempo-satellite.jpg';

const HeroSection = () => {
  return (
    <div className="relative min-h-[600px] md:min-h-[700px] overflow-hidden bg-gradient-to-br from-slate-950/50 via-slate-900/80 to-blue-950/30">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={tempoSatellite}
          alt="TEMPO Satellite"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-900/70 to-slate-950/90" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/30 rounded-full px-4 py-2 mb-6 backdrop-blur-sm"
          >
            <Satellite className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-300">NASA TEMPO Mission</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white"
          >
            Unbounded air quality
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              monitoring from space
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl font-light"
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
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:from-cyan-400 hover:to-blue-400 transition-all shadow-lg shadow-cyan-500/20"
            >
              Start Monitoring
              <ArrowRight className="w-5 h-5" />
            </a>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 bg-slate-800/50 border border-cyan-400/30 text-cyan-100 px-6 py-3 rounded-xl font-medium hover:bg-slate-800/70 hover:border-cyan-400/50 transition-all backdrop-blur-sm"
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
              <div className="flex items-center gap-2 text-cyan-400">
                <Globe className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-white">North America</p>
              <p className="text-sm text-white/70">Coverage Area</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-blue-400">
                <Zap className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-white">Hourly</p>
              <p className="text-sm text-white/70">Data Updates</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-purple-400">
                <Satellite className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-white">3 Pollutants</p>
              <p className="text-sm text-white/70">Monitored 24/7</p>
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
          <p className="text-sm text-cyan-300/70">Scroll to explore</p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 border-2 border-cyan-400/30 rounded-full flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 bg-cyan-400/50 rounded-full" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
