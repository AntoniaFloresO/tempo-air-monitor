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
    color: 'cyan',
    glowColor: 'cyan-400',
    borderColor: 'border-cyan-400/30',
    hoverBorderColor: 'hover:border-cyan-400/60',
    activeBorderColor: 'border-cyan-400',
    bgColor: 'bg-cyan-500/10',
    textColor: 'text-cyan-300',
    iconColor: 'text-cyan-400',
  },
  {
    id: 'o3' as Pollutant,
    name: 'O₃',
    fullName: 'Ozone',
    icon: CloudRain,
    color: 'blue',
    glowColor: 'blue-400',
    borderColor: 'border-blue-400/30',
    hoverBorderColor: 'hover:border-blue-400/60',
    activeBorderColor: 'border-blue-400',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-300',
    iconColor: 'text-blue-400',
  },
  {
    id: 'pm25' as Pollutant,
    name: 'PM2.5',
    fullName: 'Particulate Matter',
    icon: Droplets,
    color: 'purple',
    glowColor: 'purple-400',
    borderColor: 'border-purple-400/30',
    hoverBorderColor: 'hover:border-purple-400/60',
    activeBorderColor: 'border-purple-400',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-300',
    iconColor: 'text-purple-400',
  },
];

const PollutantSelector = ({ selected, onSelect }: PollutantSelectorProps) => {
  return (
    <div className="flex gap-4">
      {pollutants.map((pollutant) => {
        const Icon = pollutant.icon;
        const isSelected = selected === pollutant.id;

        return (
          <motion.button
            key={pollutant.id}
            onClick={() => onSelect(pollutant.id)}
            className={`relative flex-1 group transition-all duration-300 ${
              isSelected ? 'scale-105' : 'scale-100'
            }`}
            whileHover={{ scale: isSelected ? 1.05 : 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {/* Glow Effect - Simplified */}
            {isSelected && (
              <div
                className={`absolute -inset-1 bg-gradient-to-r from-${pollutant.color}-500 to-${pollutant.color}-600 rounded-2xl opacity-30 blur-xl`}
              />
            )}

            {/* Card Container */}
            <div
              className={`relative backdrop-blur-xl rounded-2xl overflow-hidden transition-all duration-300 ${
                isSelected
                  ? `bg-slate-900/90 ${pollutant.activeBorderColor} border-2 shadow-2xl shadow-${pollutant.glowColor}/20`
                  : `bg-slate-900/50 ${pollutant.borderColor} border hover:bg-slate-900/70 ${pollutant.hoverBorderColor}`
              }`}
            >
              {/* Tech Corner Accents */}
              {isSelected && (
                <>
                  <div className={`absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 ${pollutant.activeBorderColor} rounded-tl-lg`} />
                  <div className={`absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 ${pollutant.activeBorderColor} rounded-br-lg`} />
                </>
              )}

              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }} />

              {/* Content */}
              <div className="relative px-6 py-5 flex flex-col items-center justify-center gap-3">
                {/* Icon - Simplified, removed pulse animation */}
                <div
                  className={`relative w-12 h-12 rounded-xl ${pollutant.bgColor} flex items-center justify-center transition-transform ${
                    isSelected ? 'scale-110' : 'scale-100'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${pollutant.iconColor} relative z-10`} />
                </div>

                {/* Text */}
                <div className="text-center">
                  <p className={`font-bold text-xl mb-1 transition-colors ${
                    isSelected ? pollutant.textColor : 'text-white/80'
                  }`}>
                    {pollutant.name}
                  </p>
                  <p className={`text-xs transition-colors ${
                    isSelected ? 'text-white/70' : 'text-white/50'
                  }`}>
                    {pollutant.fullName}
                  </p>
                </div>

                {/* Active Indicator - Simplified */}
                {isSelected && (
                  <div
                    className={`absolute top-3 right-3 w-2 h-2 bg-${pollutant.color}-400 rounded-full`}
                  />
                )}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default PollutantSelector;
