import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Download, Database, FileText, Code, TrendingUp, Map } from 'lucide-react';
import earthAtmosphere from '@/assets/earth-atmosphere.jpg';

const Data = () => {
  const dataProducts = [
    {
      icon: Map,
      title: 'NO₂ Concentrations',
      description: 'Hourly nitrogen dioxide measurements at 2.1km resolution',
      format: 'NetCDF, HDF5',
      size: '~50 MB/hour',
    },
    {
      icon: TrendingUp,
      title: 'O₃ Profiles',
      description: 'Vertical ozone distribution and surface concentrations',
      format: 'NetCDF, CSV',
      size: '~40 MB/hour',
    },
    {
      icon: Database,
      title: 'Aerosol Data',
      description: 'PM2.5 estimates and aerosol optical depth',
      format: 'NetCDF, GeoTIFF',
      size: '~35 MB/hour',
    },
  ];

  const apiExamples = [
    {
      title: 'Get Current AQI',
      code: `GET /api/v1/aqi?lat=40.7128&lon=-74.0060`,
      description: 'Retrieve air quality index for specific coordinates',
    },
    {
      title: 'Historical Data',
      code: `GET /api/v1/pollutant/no2?date=2024-01-15&region=northeast`,
      description: 'Access historical pollutant measurements',
    },
    {
      title: 'Forecast Data',
      code: `GET /api/v1/forecast?location=nyc&hours=24`,
      description: 'Get air quality predictions',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={earthAtmosphere}
            alt="Earth Atmosphere"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
              <Database className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Data & Science</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Access High-Resolution Air Quality Data
            </h1>
            <p className="text-xl text-muted-foreground">
              Download TEMPO satellite data, access our API, and explore comprehensive air quality datasets for research and applications.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Data Products */}
      <section className="py-20 bg-accent/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Available Data Products</h2>
            <p className="text-muted-foreground">Hourly measurements covering North America</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {dataProducts.map((product, index) => {
              const Icon = product.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/50 transition-all flex flex-col"
                >
                  <Icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                  <p className="text-muted-foreground mb-4">{product.description}</p>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Format:</span>
                      <span className="font-medium">{product.format}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="font-medium">{product.size}</span>
                    </div>
                  </div>
                  <button className="w-full mt-auto bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Sample
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* API Documentation */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Developer API</h2>
              <p className="text-muted-foreground mb-6">
                Integrate real-time air quality data into your applications with our RESTful API. Free for non-commercial use with rate limits.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Code className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">RESTful Endpoints</h3>
                    <p className="text-sm text-muted-foreground">
                      Simple HTTP requests with JSON responses
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Comprehensive Docs</h3>
                    <p className="text-sm text-muted-foreground">
                      Detailed API reference and code examples
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Database className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Real-time Updates</h3>
                    <p className="text-sm text-muted-foreground">
                      Data refreshed hourly during daylight hours
                    </p>
                  </div>
                </div>
              </div>

              <button className="mt-8 bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors font-medium">
                Get API Key
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {apiExamples.map((example, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl p-4"
                >
                  <h3 className="font-semibold mb-2">{example.title}</h3>
                  <code className="block bg-accent/50 px-4 py-3 rounded-lg text-sm font-mono mb-2 overflow-x-auto">
                    {example.code}
                  </code>
                  <p className="text-sm text-muted-foreground">{example.description}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Research Resources */}
      <section className="py-20 bg-accent/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6 text-center">Research & Publications</h2>
            <p className="text-muted-foreground text-center mb-12">
              Explore peer-reviewed studies and technical documentation using TEMPO data
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Algorithm Theoretical Basis Documents',
                  description: 'Detailed technical specifications and retrieval algorithms',
                  link: '#',
                },
                {
                  title: 'Validation Reports',
                  description: 'Data quality assessments and comparison studies',
                  link: '#',
                },
                {
                  title: 'User Guides',
                  description: 'Step-by-step tutorials for data processing and analysis',
                  link: '#',
                },
                {
                  title: 'Published Papers',
                  description: 'Scientific publications using TEMPO observations',
                  link: '#',
                },
              ].map((resource, index) => (
                <motion.a
                  key={index}
                  href={resource.link}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/50 transition-all group"
                >
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Data;
