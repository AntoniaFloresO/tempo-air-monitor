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
    image: 'https://images.unsplash.com/photo-1605276373954-0c4a0dac5b12?w=800&q=80', // Contaminación industrial
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
    <section className="py-20 bg-gradient-to-b from-slate-950/20 via-background/60 to-slate-900/40 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Revolutionary Air Quality Monitoring
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
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
                  <motion.div
                    animate={{
                      scale: isHovered ? 1.05 : isDimmed ? 0.95 : 1,
                      y: isHovered ? -10 : 0,
                    }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <Card className={`overflow-hidden transition-all duration-400 border-0 h-[500px] ${
                      isHovered 
                        ? 'shadow-2xl ring-2 ring-primary/20' 
                        : 'shadow-lg'
                    }`}>
                      <CardContent className="p-0 h-full">
                        <div className="relative h-full">
                          {/* Image Section - Full Height */}
                          <motion.div 
                            className="absolute inset-0"
                            animate={{
                              filter: isDimmed ? 'grayscale(100%) brightness(0.6)' : 'grayscale(0%) brightness(1)',
                            }}
                            transition={{ duration: 0.4 }}
                          >
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient}`}
                              style={{ 
                                opacity: isHovered ? 0.75 : isDimmed ? 0.25 : 0.55,
                                transition: 'opacity 0.4s ease'
                              }}
                            />
                            <img 
                              src={feature.image} 
                              alt={feature.title}
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                          
                          {/* Content Overlay */}
                          <div className="absolute inset-0 flex flex-col justify-between p-8 z-10">
                            {/* Top Section with State/Region */}
                            <motion.div
                              animate={{
                                opacity: isHovered ? 1 : isDimmed ? 0.3 : 0.8,
                              }}
                              transition={{ duration: 0.4 }}
                            >
                              <p className="text-xs uppercase tracking-widest text-white/90 mb-2">
                                TEMPO MISSION
                              </p>
                            </motion.div>
                            
                            {/* Bottom Section with Title and Description */}
                            <div>
                              <motion.h3 
                                className="text-4xl font-bold text-white mb-4 drop-shadow-2xl"
                                animate={{
                                  opacity: isHovered ? 1 : isDimmed ? 0.4 : 0.9,
                                  y: isHovered ? -5 : 0,
                                }}
                                transition={{ duration: 0.4 }}
                              >
                                {feature.title}
                              </motion.h3>
                              
                              <motion.div 
                                className="h-0.5 bg-white/60 rounded-full mb-4"
                                animate={{
                                  width: isHovered ? 80 : 60,
                                  opacity: isHovered ? 0.9 : isDimmed ? 0.3 : 0.6,
                                }}
                                transition={{ duration: 0.4 }}
                              />
                              
                              <motion.p 
                                className="text-sm text-white/90 leading-relaxed"
                                animate={{
                                  opacity: isHovered ? 1 : 0,
                                  y: isHovered ? 0 : 20,
                                }}
                                transition={{ duration: 0.4 }}
                              >
                                {feature.description}
                              </motion.p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
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
