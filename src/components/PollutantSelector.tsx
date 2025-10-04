import { Pollutant } from '@/types/air-quality';
import { Wind, CloudRain, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';

interface PollutantSelectorProps {
  selected: Pollutant;
  onSelect: (pollutant: Pollutant) => void;
}

const pollutants = [
  {
    id: 'no2' as Pollutant,
    name: 'NO₂',
    fullName: 'Nitrogen Dioxide',
    icon: Wind,
    gradient: 'gradient-no2',
  },
  {
    id: 'o3' as Pollutant,
    name: 'O₃',
    fullName: 'Ozone',
    icon: CloudRain,
    gradient: 'gradient-o3',
  },
  {
    id: 'pm25' as Pollutant,
    name: 'PM2.5',
    fullName: 'Particulate Matter',
    icon: Droplets,
    gradient: 'gradient-pm25',
  },
];

const PollutantSelector = ({ selected, onSelect }: PollutantSelectorProps) => {
  return (
    <div className="flex gap-3">
      {pollutants.map((pollutant) => {
        const Icon = pollutant.icon;
        const isSelected = selected === pollutant.id;

        return (
          <motion.button
            key={pollutant.id}
            onClick={() => onSelect(pollutant.id)}
            className={`relative flex-1 px-4 py-3 rounded-xl border transition-all ${
              isSelected
                ? 'border-primary shadow-md'
                : 'border-border bg-card hover:border-primary/50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSelected && (
              <motion.div
                layoutId="pollutant-bg"
                className={`absolute inset-0 ${pollutant.gradient} opacity-10 rounded-xl`}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <div className="relative flex items-center justify-center gap-2">
              <Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
              <div className="text-left">
                <p className={`font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {pollutant.name}
                </p>
                <p className="text-xs text-muted-foreground hidden sm:block">{pollutant.fullName}</p>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default PollutantSelector;
