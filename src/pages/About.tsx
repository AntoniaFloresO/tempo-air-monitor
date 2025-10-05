import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Satellite, Globe, Zap, Target, Award, Users, CheckCircle, Wrench, Rocket, Radio } from 'lucide-react';
import dataVisualization from '@/assets/data-visualization.jpg';

const About = () => {
  const stats = [
    { icon: Globe, value: '13M km²', label: 'Coverage Area' },
    { icon: Zap, value: 'Hourly', label: 'Data Updates' },
    { icon: Target, value: '2.1 km', label: 'Resolution' },
    { icon: Award, value: '2023', label: 'Launch Year' },
  ];

  const timeline = [
    { 
      year: '2012', 
      title: 'Project Approval', 
      description: 'NASA approves TEMPO as part of its Earth Venture Instrument program, aimed at developing innovative space-based Earth observation instruments. The mission is designed to revolutionize air quality monitoring from geostationary orbit.',
      icon: CheckCircle
    },
    { 
      year: '2018', 
      title: 'Instrument Complete', 
      description: 'TEMPO ultraviolet-visible spectrometer assembly completed at the Smithsonian Astrophysical Observatory. NASA engineers finalize the cutting-edge technology capable of measuring atmospheric pollutants with unprecedented precision and temporal resolution.',
      icon: Wrench
    },
    { 
      year: '2023', 
      title: 'Launch Success', 
      description: 'TEMPO successfully deployed aboard the Intelsat 40e commercial communications satellite. NASA achieves a major milestone as the first space-based instrument dedicated to hourly air quality monitoring over North America at high spatial resolution.',
      icon: Rocket
    },
    { 
      year: '2024', 
      title: 'Full Operations', 
      description: 'TEMPO enters full operational phase, providing continuous daytime observations of air quality. NASA distributes data through GES DISC, enabling researchers, forecasters, and policymakers to track pollution patterns, improve air quality forecasts, and protect public health across the continent.',
      icon: Radio
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation />

      {/* Hero Section with fade */}
      <div className="relative">
        <section className="pt-32 pb-20 bg-gradient-to-b from-blue-950/30 via-slate-950 to-slate-900/40">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/30 rounded-full px-4 py-2 mb-6">
                <Satellite className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-300">About the Mission</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  TEMPO: Tropospheric Emissions
                </span>
                <br />
                Monitoring of Pollution
              </h1>
              <p className="text-xl text-white/85 mb-8">
                The first space-based instrument to continuously measure air quality over North America, providing unprecedented insights into pollution patterns and their impacts.
              </p>
            </motion.div>
          </div>
        </section>
        {/* Fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-slate-950 pointer-events-none z-10" />
      </div>

      {/* Stats Grid with fade */}
      <div className="relative">
        {/* Fade from previous section */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-950 to-transparent pointer-events-none z-10" />
        <section className="py-12 border-y border-cyan-400/20 bg-slate-950/60">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                const colors = ['text-cyan-400', 'text-blue-400', 'text-purple-400', 'text-cyan-300'];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <Icon className={`w-8 h-8 ${colors[index]} mx-auto mb-3`} />
                    <p className="text-3xl font-bold mb-1 text-white drop-shadow-lg">{stat.value}</p>
                    <p className="text-sm text-white/90">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
        {/* Fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-slate-950 pointer-events-none z-10" />
      </div>

      {/* Mission Overview with fade */}
      <div className="relative">
        {/* Fade from previous section */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-950 to-transparent pointer-events-none z-10" />
        <section className="py-20 bg-slate-900/40">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold mb-6 text-white">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Revolutionary
                  </span> Air Quality Monitoring
                </h2>
                <p className="text-white/70 mb-4">
                  TEMPO is a groundbreaking NASA mission that monitors air pollution across North America at unprecedented spatial and temporal resolution. Operating from geostationary orbit, TEMPO provides hourly daytime measurements of key air pollutants.
                </p>
                <p className="text-white/70 mb-4">
                  The instrument measures sunlight reflected and scattered from Earth's surface and atmosphere in the ultraviolet and visible spectrum. These measurements allow scientists to determine concentrations of nitrogen dioxide (NO₂), ozone (O₃), and other pollutants.
                </p>
                <p className="text-white/70">
                  This data helps researchers understand pollution sources, transport patterns, and their impact on public health and climate, enabling better air quality forecasts and policy decisions.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <img
                  src={dataVisualization}
                  alt="Air Quality Data Visualization"
                  className="w-full rounded-2xl shadow-2xl shadow-cyan-500/20 border border-cyan-400/20"
                />
              </motion.div>
            </div>
          </div>
        </section>
        {/* Fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-slate-950 pointer-events-none z-10" />
      </div>

      {/* Mission Timeline with fade */}
      <div className="relative">
        {/* Fade from previous section */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-950 to-transparent pointer-events-none z-10" />
        <section className="py-20 bg-gradient-to-b from-slate-950/60 via-blue-950/20 to-slate-950/60 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/30 rounded-full px-4 py-2 mb-4">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-cyan-300">Journey Through Time</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Mission Timeline
                </span>
              </h2>
              <p className="text-white/70 text-lg">From concept to continuous operations</p>
            </motion.div>

            <div className="max-w-5xl mx-auto">
              <div className="relative">
                {/* Enhanced Timeline Line with Gradient */}
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500/50 via-blue-500 to-purple-500/50 rounded-full md:ml-[-2px]" />

                {/* Timeline Items */}
                {timeline.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, scale: 0.8 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ 
                      delay: index * 0.15,
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }}
                    className={`relative flex items-start mb-16 last:mb-0 ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Content Card */}
                    <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'} pl-20 md:pl-0`}>
                      <motion.div
                        whileHover={{ scale: 1.02, y: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="bg-slate-900/50 border border-cyan-400/20 rounded-2xl p-8 shadow-lg hover:shadow-cyan-500/20 hover:border-cyan-400/40 transition-all backdrop-blur-sm group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <span className="text-4xl font-bold bg-gradient-to-br from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            {item.year}
                          </span>
                          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                            {item.icon && <item.icon className="w-6 h-6 text-cyan-400" />}
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-3 group-hover:text-cyan-400 transition-colors text-white">
                          {item.title}
                        </h3>
                        <p className="text-white/70 leading-relaxed">
                          {item.description}
                        </p>
                        {/* Decorative line */}
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "100%" }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.15 + 0.3, duration: 0.6 }}
                          className="h-1 bg-gradient-to-r from-cyan-500/50 to-transparent rounded-full mt-4"
                        />
                      </motion.div>
                    </div>

                    {/* Enhanced Dot with Animation - Aligned to top */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ 
                        delay: index * 0.15 + 0.2,
                        type: "spring",
                        stiffness: 200
                      }}
                      className="absolute left-8 md:left-1/2 top-12 z-10"
                    >
                      <div className="relative w-6 h-6 -ml-3">
                        {/* Pulsing ring */}
                        <motion.div
                          animate={{ 
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 0, 0.5]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="absolute inset-0 bg-cyan-400/30 rounded-full"
                        />
                        {/* Main dot */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full border-4 border-slate-950 shadow-lg shadow-cyan-500/20" />
                        {/* Inner glow */}
                        <div className="absolute inset-[6px] bg-white/30 rounded-full" />
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* Fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-slate-950 pointer-events-none z-10" />
      </div>

      {/* Science Team with fade */}
      <div className="relative">
        {/* Fade from previous section */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-950 to-transparent pointer-events-none z-10" />
        <section className="py-20 bg-slate-900/40">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 text-white">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Science & Partnership
                </span>
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                TEMPO is a collaboration between NASA, the Smithsonian Astrophysical Observatory, and multiple partner institutions
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { 
                  name: 'NASA', 
                  role: 'Mission Leadership & Funding', 
                  icon: Satellite,
                  description: 'NASA leads the TEMPO mission through its Earth Science Division, providing funding, oversight, and technical expertise. The agency manages data distribution through the Goddard Earth Sciences Data and Information Services Center (GES DISC).',
                  image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/200px-NASA_logo.svg.png'
                },
                { 
                  name: 'Smithsonian', 
                  role: 'Instrument Development', 
                  icon: Award,
                  description: 'The Smithsonian Astrophysical Observatory designed and built the TEMPO spectrometer instrument. Their team of engineers and scientists operates the instrument and processes raw data into atmospheric measurements.',
                  image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80'
                },
                { 
                  name: 'EPA & NOAA', 
                  role: 'Data Application & Forecasting', 
                  icon: Users,
                  description: 'The Environmental Protection Agency and National Oceanic and Atmospheric Administration use TEMPO data for air quality forecasting, health alerts, and environmental policy. Multiple research institutions also leverage the data for atmospheric studies.',
                  image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&q=80'
                },
              ].map((partner, index) => {
                const Icon = partner.icon;
                const colors = ['text-cyan-400', 'text-blue-400', 'text-purple-400'];
                const bgColors = ['bg-cyan-500/20', 'bg-blue-500/20', 'bg-purple-500/20'];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-900/50 border border-cyan-400/20 rounded-2xl p-6 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/10 transition-all backdrop-blur-sm group"
                  >
                    {/* Image */}
                    <div className="relative h-32 mb-4 rounded-xl overflow-hidden bg-slate-800/50">
                      <img 
                        src={partner.image} 
                        alt={partner.name}
                        className="w-full h-full object-contain p-4"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                    </div>
                    
                    {/* Icon & Title */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 ${bgColors[index]} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-6 h-6 ${colors[index]}`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{partner.name}</h3>
                        <p className="text-sm text-cyan-300/70">{partner.role}</p>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-white/70 text-sm leading-relaxed">{partner.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
        {/* Fade to footer */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-slate-950 pointer-events-none z-10" />
      </div>

      <Footer />
    </div>
  );
};

export default About;
