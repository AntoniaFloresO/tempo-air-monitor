import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Calendar, Tag, ArrowRight } from 'lucide-react';

const News = () => {
  const newsArticles = [
    {
      date: 'Aug 2023',
      tag: 'Milestone',
      title: 'TEMPO\'s First Images Released',
      excerpt: 'NASA unveils the first stunning images from TEMPO, marking the beginning of revolutionary air quality monitoring over North America.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
      url: 'https://www.nasa.gov/image-article/tempos-first-images/',
    },
    {
      date: 'Sep 2024',
      tag: 'Data Release',
      title: 'TEMPO Data Now Available to Public',
      excerpt: 'Comprehensive air quality dataset from TEMPO is now accessible through NASA\'s GES DISC portal for research and applications.',
      image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&h=400&fit=crop',
      url: 'https://disc.gsfc.nasa.gov/information/news?title=TEMPO%20Data%20Now%20Available',
    },
    {
      date: 'Oct 2024',
      tag: 'Research',
      title: 'NASA\'s TEMPO Maps Pollution Over North America',
      excerpt: 'TEMPO provides unprecedented hourly measurements of air pollutants, transforming our understanding of atmospheric dynamics and pollution patterns.',
      image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=400&fit=crop',
      url: 'https://www.nasa.gov/missions/tempo/nasas-tempo-maps-pollution-over-north-america/',
    },
    {
      date: 'Oct 2023',
      tag: 'Science',
      title: 'TEMPO Measures Air Quality Across Continent',
      excerpt: 'Earth Observatory showcases TEMPO\'s capability to measure air quality with unprecedented spatial and temporal resolution.',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop',
      url: 'https://earthobservatory.nasa.gov/images/151888/tempo-measures-air-quality',
    },
    {
      date: 'Jun 2024',
      tag: 'Anniversary',
      title: 'First Year of TEMPO Observations',
      excerpt: 'Smithsonian Magazine highlights the groundbreaking achievements and discoveries from TEMPO\'s first year of operations.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
      url: 'https://www.smithsonianmag.com/air-space-magazine/tempo/',
    },
    {
      date: 'May 2024',
      tag: 'Data Portal',
      title: 'Access TEMPO Data Through Multiple Portals',
      excerpt: 'TEMPO data is now available through NASA\'s data portals, providing researchers worldwide access to revolutionary air quality measurements.',
      image: 'https://images.unsplash.com/photo-1628126235206-5260b9ea6441?w=800&h=400&fit=crop',
      url: 'https://www-air.larc.nasa.gov/missions/tempo/dataportal.html',
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

            {/* Load More */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <button className="px-8 py-3 bg-slate-900/70 border border-cyan-400/30 text-cyan-300 rounded-xl hover:bg-cyan-500/10 hover:border-cyan-400/50 transition-all font-medium backdrop-blur-sm">
                Load More Articles
              </button>
            </motion.div>
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
