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
              <Tag className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">News & Updates</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Latest from TEMPO Mission
            </h1>
            <p className="text-xl text-muted-foreground">
              Stay informed about new discoveries, data releases, and partnerships advancing air quality science
            </p>
          </motion.div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-20">
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
                <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden flex-shrink-0">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-block px-3 py-1 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-medium rounded-full">
                        {article.tag}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{article.date}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors min-h-[3.5rem]">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3 flex-grow">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all mt-auto">
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
            <button className="px-8 py-3 bg-card border border-border rounded-xl hover:bg-accent hover:border-primary/50 transition-all font-medium">
              Load More Articles
            </button>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-b from-background to-accent/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to receive the latest TEMPO mission updates and research highlights
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default News;
