import { motion } from 'framer-motion';
import { Eye, TrendingDown, Shield, Database, Zap, Users } from 'lucide-react';

const features = [
  {
    icon: Eye,
    title: 'Real-Time Monitoring',
    description: 'Track air quality changes hour by hour with data from space',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: TrendingDown,
    title: 'Pollution Tracking',
    description: 'Monitor NO₂, O₃, and PM2.5 levels across North America',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Shield,
    title: 'Health Protection',
    description: 'Get personalized recommendations based on air quality',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Database,
    title: 'NASA Data',
    description: 'Powered by TEMPO satellite and ground station networks',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Zap,
    title: 'High Resolution',
    description: 'Unprecedented spatial and temporal data resolution',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Users,
    title: 'Public Access',
    description: 'Free air quality data for everyone, everywhere',
    gradient: 'from-indigo-500 to-blue-500',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/10">
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

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/50 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
