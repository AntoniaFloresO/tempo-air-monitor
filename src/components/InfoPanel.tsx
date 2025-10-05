import { AirQualityData, Pollutant } from '@/types/air-quality';
import { MapPin, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface InfoPanelProps {
  data: AirQualityData;
  selectedPollutant: Pollutant;
}

const InfoPanel = ({ data, selectedPollutant }: InfoPanelProps) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  const getPollutantValue = (pollutant: Pollutant) => {
    return data.pollutants[pollutant];
  };

  const getPollutantUnit = (pollutant: Pollutant) => {
    return pollutant === 'pm25' ? 'μg/m³' : 'ppb';
  };

  const getTrend = (value: number) => {
    // Simulate trend based on value (in production, compare with previous readings)
    if (value < 40) return 'down';
    if (value > 60) return 'up';
    return 'stable';
  };

  const trend = getTrend(getPollutantValue(selectedPollutant));

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-destructive' : trend === 'down' ? 'text-green-500' : 'text-muted-foreground';

  return (
    <div className="relative overflow-hidden rounded-2xl p-6 shadow-lg bg-slate-900/60 backdrop-blur-md border border-cyan-500/20 space-y-6">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 space-y-6">
        {/* Location */}
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-cyan-400 mt-0.5" />
          <div>
            <p className="font-semibold text-white">{data.location.name}</p>
            <p className="text-sm text-cyan-300/60">
              {data.location.coords[1].toFixed(4)}°N, {Math.abs(data.location.coords[0]).toFixed(4)}°W
            </p>
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <p className="font-semibold text-white">Last Updated</p>
            <p className="text-sm text-cyan-300/60">{formatTime(data.timestamp)}</p>
          </div>
        </div>

        {/* Current Pollutant Details */}
        <div className="border-t border-cyan-500/20 pt-6">
          <h3 className="font-semibold text-cyan-300 mb-4 uppercase tracking-wider">Pollutant Levels</h3>
          <div className="space-y-3">
            {Object.entries(data.pollutants).map(([key, value]) => {
              const pollutant = key as Pollutant;
              const isSelected = pollutant === selectedPollutant;
              const unit = getPollutantUnit(pollutant);

              return (
                <motion.div
                  key={key}
                  initial={false}
                  animate={{
                    scale: isSelected ? 1.02 : 1,
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                    isSelected 
                      ? 'bg-cyan-500/20 border border-cyan-400/30' 
                      : 'bg-slate-800/30 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm uppercase text-white">{pollutant}</span>
                    {isSelected && (
                      <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                    )}
                  </div>
                  <span className="font-semibold text-white">
                    {value.toFixed(1)} <span className="text-sm text-cyan-300/60">{unit}</span>
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Data Source */}
        <div className="border-t border-cyan-500/20 pt-6">
          <p className="text-xs text-cyan-300/50">
            Data provided by NASA TEMPO satellite program and ground monitoring stations
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
