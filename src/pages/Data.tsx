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
    <div className="min-h-screen bg-slate-950">
      <Navigation />

      {/* Hero Section with fade */}
      <div className="relative">
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={earthAtmosphere}
              alt="Earth Atmosphere"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-blue-950/60 to-slate-900/80" />
          </div>

          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/30 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
                <Database className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-300">Data & Science</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Access High-Resolution
                </span>
                <br />
                Air Quality Data
              </h1>
              <p className="text-xl text-white/70 font-light">
                Download TEMPO satellite data, access our API, and explore comprehensive air quality datasets for research and applications.
              </p>
            </motion.div>
          </div>
        </section>
        {/* Fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-slate-900 pointer-events-none z-10" />
      </div>

      {/* Data Products with fade */}
      <div className="relative">
        {/* Fade from previous section */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-900 to-transparent pointer-events-none z-10" />
        <section className="py-20 bg-slate-900/40">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Available Data Products
              </h2>
              <p className="text-white/90 font-light">Hourly measurements covering North America</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {dataProducts.map((product, index) => {
                const Icon = product.icon;
                const colors = ['text-cyan-400', 'text-blue-400', 'text-purple-400'];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-900/50 border border-cyan-400/20 rounded-2xl p-6 hover:shadow-lg hover:shadow-cyan-500/10 hover:border-cyan-400/40 transition-all flex flex-col backdrop-blur-sm"
                  >
                    <Icon className={`w-10 h-10 ${colors[index]} mb-4`} />
                    <h3 className="text-xl font-semibold mb-2 text-white">{product.title}</h3>
                    <p className="text-white/70 mb-4">{product.description}</p>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-white/60">Format:</span>
                        <span className="font-medium text-cyan-300">{product.format}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Size:</span>
                        <span className="font-medium text-cyan-300">{product.size}</span>
                      </div>
                    </div>
                    <button className="w-full mt-auto bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20">
                      <Download className="w-4 h-4" />
                      Download Sample
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
        {/* Fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-slate-950 pointer-events-none z-10" />
      </div>

      {/* API Documentation with fade */}
      <div className="relative">
        {/* Fade from previous section */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-950 to-transparent pointer-events-none z-10" />
        <section className="py-20 bg-slate-950/60">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6 text-white">Developer API</h2>
              <p className="text-white/70 mb-6">
                Integrate real-time air quality data into your applications with our RESTful API. Free for non-commercial use with rate limits.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <Code className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-white">RESTful Endpoints</h3>
                    <p className="text-sm text-white/70">
                      Simple HTTP requests with JSON responses
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-white">Comprehensive Docs</h3>
                    <p className="text-sm text-white/70">
                      Detailed API reference and code examples
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Database className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-white">Real-time Updates</h3>
                    <p className="text-sm text-white/70">
                      Data refreshed hourly during daylight hours
                    </p>
                  </div>
                </div>
              </div>

              <button className="mt-8 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all font-medium shadow-lg shadow-cyan-500/20">
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
                  className="bg-slate-900/50 border border-cyan-400/20 rounded-xl p-4 hover:border-cyan-400/40 transition-all backdrop-blur-sm"
                >
                  <h3 className="font-semibold mb-2 text-white">{example.title}</h3>
                  <code className="block bg-slate-950/80 px-4 py-3 rounded-lg text-sm font-mono mb-2 overflow-x-auto text-cyan-300">
                    {example.code}
                  </code>
                  <p className="text-sm text-white/70">{example.description}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      {/* Fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-slate-950 pointer-events-none z-10" />
    </div>

      {/* Research Resources with fade */}
      <div className="relative">
        {/* Fade from previous section */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-950 to-transparent pointer-events-none z-10" />
        <section className="py-20 bg-slate-900/40">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-4xl font-bold mb-6 text-center text-white">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Research & Publications
                </span>
              </h2>
              <p className="text-white/70 text-center mb-12">
                Explore peer-reviewed studies and technical documentation using TEMPO data
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Algorithm Theoretical Basis Documents',
                    description: 'Detailed technical specifications and retrieval algorithms',
                    link: 'https://tempo.si.edu/documents.html',
                  },
                  {
                    title: 'Validation Reports',
                    description: 'Data quality assessments and comparison studies',
                    link: 'https://www.sciencedirect.com/search?qs=TEMPO%20satellite%20validation',
                  },
                  {
                    title: 'User Guides',
                    description: 'Step-by-step tutorials for data processing and analysis',
                    link: 'https://tempo.si.edu/data_for_scientists.html',
                  },
                  {
                    title: 'Published Papers',
                    description: 'Scientific publications using TEMPO observations',
                    link: 'https://scholar.google.com/scholar?q=TEMPO+satellite+air+quality',
                  },
                ].map((resource, index) => (
                  <motion.a
                    key={index}
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-900/50 border border-cyan-400/20 rounded-xl p-6 hover:shadow-lg hover:shadow-cyan-500/10 hover:border-cyan-400/40 transition-all group backdrop-blur-sm"
                  >
                    <h3 className="font-semibold mb-2 group-hover:text-cyan-400 transition-colors text-white">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-white/70">{resource.description}</p>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
        {/* Fade to footer */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-slate-950 pointer-events-none z-10" />
      </div>

      <Footer />
    </div>
  );
};

export default Data;
