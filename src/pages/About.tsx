import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Satellite, Globe, Zap, Target, Award, Users } from 'lucide-react';
import dataVisualization from '@/assets/data-visualization.jpg';

const About = () => {
  const stats = [
    { icon: Globe, value: '13M km²', label: 'Coverage Area' },
    { icon: Zap, value: 'Hourly', label: 'Data Updates' },
    { icon: Target, value: '2.1 km', label: 'Resolution' },
    { icon: Award, value: '2023', label: 'Launch Year' },
  ];

  const timeline = [
    { year: '2012', title: 'Project Approval', description: 'NASA approves TEMPO mission development' },
    { year: '2018', title: 'Instrument Complete', description: 'TEMPO spectrometer assembly finished' },
    { year: '2023', title: 'Launch Success', description: 'Deployed aboard Intelsat 40e satellite' },
    { year: '2024', title: 'Full Operations', description: 'Continuous air quality monitoring active' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-accent/20 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
              <Satellite className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">About the Mission</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              TEMPO: Tropospheric Emissions Monitoring of Pollution
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              The first space-based instrument to continuously measure air quality over North America, providing unprecedented insights into pollution patterns and their impacts.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-12 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Revolutionary Air Quality Monitoring</h2>
              <p className="text-muted-foreground mb-4">
                TEMPO is a groundbreaking NASA mission that monitors air pollution across North America at unprecedented spatial and temporal resolution. Operating from geostationary orbit, TEMPO provides hourly daytime measurements of key air pollutants.
              </p>
              <p className="text-muted-foreground mb-4">
                The instrument measures sunlight reflected and scattered from Earth's surface and atmosphere in the ultraviolet and visible spectrum. These measurements allow scientists to determine concentrations of nitrogen dioxide (NO₂), ozone (O₃), and other pollutants.
              </p>
              <p className="text-muted-foreground">
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
                className="w-full rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Timeline */}
      <section className="py-20 bg-gradient-to-b from-accent/10 via-background to-accent/5 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-4">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary">Journey Through Time</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Mission Timeline
            </h2>
            <p className="text-muted-foreground text-lg">From concept to continuous operations</p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Enhanced Timeline Line with Gradient */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/50 via-primary to-primary/50 rounded-full md:ml-[-2px]" />

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
                  className={`relative flex items-center mb-16 last:mb-0 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content Card */}
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'} pl-20 md:pl-0`}>
                    <motion.div
                      whileHover={{ scale: 1.02, y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl hover:border-primary/50 transition-all backdrop-blur-sm bg-card/80 group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-4xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                          {item.year}
                        </span>
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Satellite className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                      {/* Decorative line */}
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15 + 0.3, duration: 0.6 }}
                        className="h-1 bg-gradient-to-r from-primary/50 to-transparent rounded-full mt-4"
                      />
                    </motion.div>
                  </div>

                  {/* Enhanced Dot with Animation */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      delay: index * 0.15 + 0.2,
                      type: "spring",
                      stiffness: 200
                    }}
                    className="absolute left-8 md:left-1/2 z-10"
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
                        className="absolute inset-0 bg-primary/30 rounded-full"
                      />
                      {/* Main dot */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70 rounded-full border-4 border-background shadow-lg shadow-primary/20" />
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

      {/* Science Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Science & Partnership</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              TEMPO is a collaboration between NASA, the Smithsonian Astrophysical Observatory, and multiple partner institutions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'NASA', role: 'Mission Leadership', icon: Satellite },
              { name: 'Smithsonian', role: 'Science Operations', icon: Award },
              { name: 'EPA & Partners', role: 'Data Application', icon: Users },
            ].map((partner, index) => {
              const Icon = partner.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-8 text-center"
                >
                  <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{partner.name}</h3>
                  <p className="text-muted-foreground">{partner.role}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
