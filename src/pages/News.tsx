import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Calendar, Tag, ArrowRight } from 'lucide-react';

const News = () => {
  const newsArticles = [
    {
      date: 'Sept 2025',
      tag: 'Data Release',
      title: 'TEMPO V04 & NRT V02 Product Release',
      excerpt: "NASA's Atmospheric Science Data Center (ASDC) announces the release of TEMPO Standard Version 04 and Near Real-Time Version 02 products for Levels 1, 2, and 3, enhancing data accuracy and timeliness.",
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', // Data visualization and analytics
      url: 'https://asdc.larc.nasa.gov/project/TEMPO'
    },
    {
      date: 'Jul 2025',
      tag: 'Mission Update',
      title: 'NASA Extends TEMPO Mission Through 2026',
      excerpt: "Following the completion of its primary 20-month mission, NASA announces that TEMPO will continue operating through at least September 2026 to provide continuous air quality monitoring across North America.",
      image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&q=80', // Satellite in space
      url: 'https://www.nasa.gov/missions/tempo/nasa-mission-monitoring-air-quality-from-space-extended/',
    },
    {
      date: 'Jul 2025',
      tag: 'Extension',
      title: 'TEMPO Mission Extended to Track Pollution in Unprecedented Detail',
      excerpt: 'NASA extends the TEMPO mission, allowing hourly pollution tracking at neighborhood scales, supporting studies on urban emissions, wildfires, and industrial sources.',
      image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&q=80', // Pollution/smog in city
      url: 'https://www.azosensors.com/news.aspx?newsID=16548'
    },
    {
      date: 'May 2024',
      tag: 'Data Release',
      title: 'New TEMPO Data Available at Neighborhood Scales',
      excerpt: 'NASA makes new TEMPO data available at unprecedented spatial resolution, enabling scientists to assess air quality variations at neighborhood and city-block levels.',
      image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80', // Aerial view of neighborhood/city
      url: 'https://tempo.si.edu/'
    },
    {
      date: 'Apr 2025',
      tag: 'Science / Research',
      title: 'Assimilating TEMPO NO₂ Observations into Atmospheric Models',
      excerpt: "A new study demonstrates how TEMPO's nitrogen dioxide (NO₂) observations can be assimilated into JEDI-based atmospheric models to improve forecasts and understand nitrogen cycling.",
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80', // Scientific research/atmospheric study
      url: 'https://arxiv.org/abs/2506.07321'
    },
    {
      date: 'Apr 2025',
      tag: 'Science / Findings',
      title: 'Free Tropospheric NO₂ Observed via TEMPO: Lightning Implications',
      excerpt: 'Researchers use TEMPO to observe free-tropospheric NO₂ and explore its link to lightning-generated nitrogen emissions, offering new insights into upper-atmosphere chemistry.',
      image: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=800&q=80', // Lightning storm - alternative
      url: 'https://arxiv.org/abs/2504.20337',
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
              <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/30 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
                <Tag className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-300">News & Updates</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Latest from TEMPO Mission
                </span>
              </h1>
              <p className="text-xl text-white/70 font-light">
                Stay informed about new discoveries, data releases, and partnerships advancing air quality science
              </p>
            </motion.div>
          </div>
        </section>
        {/* Fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-slate-900 pointer-events-none z-10" />
      </div>

      {/* News Grid with fade */}
      <div className="relative">
        {/* Fade from previous section */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-900 to-transparent pointer-events-none z-10" />
        <section className="py-20 bg-slate-900/40">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsArticles.map((article, index) => (
                <motion.a
                  key={index}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer block"
                >
                  <div className="bg-slate-900/50 border border-cyan-400/20 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-400/40 transition-all h-full flex flex-col backdrop-blur-sm">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden flex-shrink-0">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="inline-block px-3 py-1 bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/30 text-cyan-200 text-xs font-medium rounded-full">
                          {article.tag}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 text-sm text-white/70 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{article.date}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-cyan-300 transition-colors min-h-[3.5rem]">
                        {article.title}
                      </h3>
                      <p className="text-white/70 mb-4 line-clamp-3 flex-grow">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-cyan-400 font-medium group-hover:gap-3 transition-all mt-auto">
                        Read article
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            
          </div>
        </section>
      </div>

      {/* Newsletter with fade */}
      <div className="relative">
        <section className="py-20 bg-gradient-to-b from-slate-900/60 to-slate-950/80">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Stay Updated
              </h2>
              <p className="text-white/90 mb-8 font-light">
                Subscribe to receive the latest TEMPO mission updates and research highlights
              </p>
              <div className="flex gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-slate-900/50 border border-cyan-400/20 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/40 backdrop-blur-sm placeholder:text-white/50"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all font-medium shadow-lg shadow-cyan-500/20">
                  Subscribe
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default News;
