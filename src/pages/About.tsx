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
      <section className="py-20 bg-accent/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Mission Timeline</h2>
            <p className="text-muted-foreground">From concept to continuous operations</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-border" />

              {/* Timeline Items */}
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex items-center mb-12 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'} pl-16 md:pl-0`}>
                    <div className="bg-card border border-border rounded-xl p-6">
                      <span className="text-2xl font-bold text-primary">{item.year}</span>
                      <h3 className="text-xl font-semibold mt-2 mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>

                  {/* Dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 -ml-2 bg-primary rounded-full border-4 border-background" />
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
