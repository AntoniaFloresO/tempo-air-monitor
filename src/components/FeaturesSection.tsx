import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';

const features = [
  {
    title: 'Real-Time Monitoring',
    description: 'Track air quality changes hour by hour with data from space. TEMPO provides continuous monitoring of pollutants across North America.',
    image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&q=80', // Satélite en el espacio
    gradient: 'from-blue-400/80 via-cyan-400/70 to-teal-400/60',
    bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
  },
  {
    title: 'Pollution Tracking',
    description: 'Monitor NO₂, O₃, and PM2.5 levels across North America. Identify pollution sources and track their movement in real-time.',
    image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&q=80', // Contaminación del aire - ciudad con smog
    gradient: 'from-orange-400/80 via-rose-400/70 to-pink-400/60',
    bgColor: 'bg-gradient-to-br from-orange-50 to-rose-50',
  },
  {
    title: 'Health Protection',
    description: 'Get personalized recommendations based on air quality. Stay informed and protect your health with real-time alerts and guidance.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80', // Persona con mascarilla/salud
    gradient: 'from-emerald-400/80 via-green-400/70 to-teal-400/60',
    bgColor: 'bg-gradient-to-br from-emerald-50 to-green-50',
  },
  {
    title: 'NASA Data',
    description: 'Powered by TEMPO satellite and ground station networks. Access high-quality data backed by NASA\'s advanced technology.',
    image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&q=80', // Centro de control NASA
    gradient: 'from-purple-400/80 via-violet-400/70 to-fuchsia-400/60',
    bgColor: 'bg-gradient-to-br from-purple-50 to-violet-50',
  },
  {
    title: 'High Resolution',
    description: 'Unprecedented spatial and temporal data resolution. Get detailed air quality information at neighborhood level with hourly updates.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', // Gráficos y datos de alta resolución
    gradient: 'from-amber-400/80 via-yellow-400/70 to-orange-300/60',
    bgColor: 'bg-gradient-to-br from-amber-50 to-yellow-50',
  },
  {
    title: 'Public Access',
    description: 'Free air quality data for everyone, everywhere. Access comprehensive information and contribute to environmental awareness.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80', // Personas colaborando/comunidad
    gradient: 'from-indigo-400/80 via-blue-400/70 to-sky-400/60',
    bgColor: 'bg-gradient-to-br from-indigo-50 to-blue-50',
  },
];

const FeaturesSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-gradient-to-b from-slate-950/60 via-slate-900/40 to-slate-950/60 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            Revolutionary Air Quality Monitoring
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/70"
          >
            TEMPO is the first space-based instrument to monitor air pollutants hourly during daytime across North America
          </motion.p>
        </div>

        {/* Features Carousel */}
        <div className="relative overflow-hidden">
          <div className="flex gap-6 overflow-x-auto scrollbar-hide py-8 px-4 snap-x snap-mandatory">
            {features.map((feature, index) => {
              const isHovered = hoveredIndex === index;
              const isDimmed = hoveredIndex !== null && hoveredIndex !== index;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="flex-shrink-0 snap-center"
                  style={{ width: '380px' }}
                >
                  <div
                    className={`transition-all duration-300 ${
                      isHovered ? 'scale-105 -translate-y-2' : isDimmed ? 'scale-95' : 'scale-100'
                    }`}
                  >
                    <Card className={`overflow-hidden transition-all duration-300 border-0 h-[500px] ${
                      isHovered 
                        ? 'shadow-2xl ring-2 ring-primary/20' 
                        : 'shadow-lg'
                    }`}>
                      <CardContent className="p-0 h-full">
                        <div className="relative h-full">
                          {/* Image Section - Full Height */}
                          <div 
                            className={`absolute inset-0 transition-all duration-300 ${
                              isDimmed ? 'grayscale brightness-60' : ''
                            }`}
                          >
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} transition-opacity duration-300`}
                              style={{ 
                                opacity: isHovered ? 0.75 : isDimmed ? 0.25 : 0.55,
                              }}
                            />
                            <img 
                              src={feature.image} 
                              alt={feature.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          {/* Content Overlay */}
                          <div className="absolute inset-0 flex flex-col justify-between p-8 z-10">
                            {/* Top Section with State/Region */}
                            <div
                              className={`transition-opacity duration-300 ${
                                isHovered ? 'opacity-100' : isDimmed ? 'opacity-30' : 'opacity-80'
                              }`}
                            >
                              <p className="text-xs uppercase tracking-widest text-white/90 mb-2">
                                TEMPO MISSION
                              </p>
                            </div>
                            
                            {/* Bottom Section with Title and Description */}
                            <div>
                              <h3 
                                className={`text-4xl font-bold text-white mb-4 drop-shadow-2xl transition-all duration-300 ${
                                  isHovered ? 'opacity-100' : isDimmed ? 'opacity-40' : 'opacity-90'
                                }`}
                              >
                                {feature.title}
                              </h3>
                              
                              <div 
                                className={`h-0.5 bg-white/60 rounded-full mb-4 transition-all duration-300 ${
                                  isHovered ? 'w-20 opacity-90' : isDimmed ? 'w-12 opacity-30' : 'w-16 opacity-60'
                                }`}
                              />
                              
                              <p 
                                className={`text-sm text-white/90 leading-relaxed transition-all duration-300 ${
                                  isHovered ? 'opacity-100' : 'opacity-0'
                                }`}
                              >
                                {feature.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* Navigation Hint */}
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Hover over cards to explore • Scroll horizontally to see more
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection;
