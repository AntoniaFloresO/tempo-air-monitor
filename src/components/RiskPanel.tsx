import { RiskLevel, RiskInfo } from '@/types/air-quality';
import { AlertTriangle, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface RiskPanelProps {
  aqi: number;
  riskLevel: RiskLevel;
}

const riskInfoMap: Record<RiskLevel, RiskInfo> = {
  good: {
    level: 'good',
    label: 'Good',
    color: 'hsl(var(--aqi-good))',
    description: 'Air quality is satisfactory, and air pollution poses little or no risk.',
    recommendations: [
      'Enjoy outdoor activities',
      'Perfect day for exercise outside',
      'No precautions needed',
    ],
  },
  moderate: {
    level: 'moderate',
    label: 'Moderate',
    color: 'hsl(var(--aqi-moderate))',
    description: 'Air quality is acceptable. However, there may be a risk for some people.',
    recommendations: [
      'Most people can enjoy outdoor activities',
      'Sensitive individuals should limit prolonged outdoor exertion',
      'Monitor symptoms if you have asthma',
    ],
  },
  unhealthy: {
    level: 'unhealthy',
    label: 'Unhealthy for Sensitive Groups',
    color: 'hsl(var(--aqi-unhealthy))',
    description: 'Members of sensitive groups may experience health effects.',
    recommendations: [
      'Limit prolonged outdoor exertion if sensitive',
      'Keep windows closed',
      'Use air purifiers indoors',
    ],
  },
  'very-unhealthy': {
    level: 'very-unhealthy',
    label: 'Very Unhealthy',
    color: 'hsl(var(--aqi-very-unhealthy))',
    description: 'Health alert: The risk of health effects is increased for everyone.',
    recommendations: [
      'Avoid prolonged outdoor activities',
      'Move activities indoors',
      'Wear a mask (N95) if you must go outside',
    ],
  },
  hazardous: {
    level: 'hazardous',
    label: 'Hazardous',
    color: 'hsl(var(--aqi-hazardous))',
    description: 'Health warning of emergency conditions: everyone is more likely to be affected.',
    recommendations: [
      'Stay indoors with windows closed',
      'Use air purifiers on high',
      'Avoid all outdoor activities',
      'Seek medical attention if experiencing symptoms',
    ],
  },
};

const RiskPanel = ({ aqi, riskLevel }: RiskPanelProps) => {
  const riskInfo = riskInfoMap[riskLevel];
  
  const getIcon = () => {
    switch (riskLevel) {
      case 'good':
        return CheckCircle;
      case 'moderate':
        return AlertCircle;
      case 'unhealthy':
      case 'very-unhealthy':
        return AlertTriangle;
      case 'hazardous':
        return XCircle;
    }
  };

  const Icon = getIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl p-6 shadow-lg bg-slate-900/60 backdrop-blur-md border border-cyan-500/20"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* AQI Value */}
        <div className="mb-6">
          <p className="text-sm text-cyan-300/70 mb-2 uppercase tracking-wider">Air Quality Index</p>
          <div className="flex items-end gap-3">
            <motion.h1
              key={aqi}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-6xl font-bold"
              style={{ color: riskInfo.color }}
            >
              {aqi}
            </motion.h1>
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-5 h-5" style={{ color: riskInfo.color }} />
                <p className="font-semibold text-lg text-white" style={{ color: riskInfo.color }}>
                  {riskInfo.label}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Bar */}
        <div className="mb-6">
          <div className="h-3 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(aqi, 300) / 3}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ backgroundColor: riskInfo.color }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-cyan-300/50">
            <span>0</span>
            <span>50</span>
            <span>100</span>
            <span>150</span>
            <span>200+</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-white/70 mb-4">{riskInfo.description}</p>

        {/* Recommendations */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-cyan-300 uppercase tracking-wider">Recommendations</p>
          <ul className="space-y-2">
            {riskInfo.recommendations.map((rec, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2 text-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: riskInfo.color }} />
                <span className="text-white/70">{rec}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default RiskPanel;
