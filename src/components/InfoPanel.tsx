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
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border space-y-6">
      {/* Location */}
      <div className="flex items-start gap-3">
        <MapPin className="w-5 h-5 text-primary mt-0.5" />
        <div>
          <p className="font-semibold">{data.location.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.location.coords[1].toFixed(4)}°N, {Math.abs(data.location.coords[0]).toFixed(4)}°W
          </p>
        </div>
      </div>

      {/* Last Updated */}
      <div className="flex items-start gap-3">
        <Clock className="w-5 h-5 text-primary mt-0.5" />
        <div>
          <p className="font-semibold">Last Updated</p>
          <p className="text-sm text-muted-foreground">{formatTime(data.timestamp)}</p>
        </div>
      </div>

      {/* Current Pollutant Details */}
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Pollutant Levels</h3>
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
                  backgroundColor: isSelected ? 'hsl(var(--accent))' : 'transparent',
                }}
                className="flex items-center justify-between p-3 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm uppercase">{pollutant}</span>
                  {isSelected && (
                    <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                  )}
                </div>
                <span className="font-semibold">
                  {value.toFixed(1)} <span className="text-sm text-muted-foreground">{unit}</span>
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Data Source */}
      <div className="border-t pt-6">
        <p className="text-xs text-muted-foreground">
          Data provided by NASA TEMPO satellite program and ground monitoring stations
        </p>
      </div>
    </div>
  );
};

export default InfoPanel;
