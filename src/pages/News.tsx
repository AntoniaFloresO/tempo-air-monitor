import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Calendar, Tag, ArrowRight } from 'lucide-react';

const News = () => {
  const newsArticles = [
    {
      date: 'Oct 1, 2024',
      tag: 'Data Release',
      title: 'TEMPO Data Portal Reaches 1 Million Downloads',
      excerpt: 'Researchers worldwide have downloaded over 1 million datasets from the TEMPO data portal, marking a major milestone in open science.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
    },
    {
      date: 'Sep 7, 2024',
      tag: 'Partnership',
      title: 'TEMPO Data Now Available for Public Use',
      excerpt: 'NASA releases comprehensive air quality dataset covering North America with hourly resolution, enabling unprecedented air quality monitoring.',
      image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&h=400&fit=crop',
    },
    {
      date: 'Aug 15, 2024',
      tag: 'Research',
      title: 'Record Air Quality Improvements Detected',
      excerpt: 'TEMPO satellite reveals significant reductions in NO₂ levels across major metropolitan areas following new emission regulations.',
      image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=400&fit=crop',
    },
    {
      date: 'Jul 22, 2024',
      tag: 'Partnership',
      title: 'New Partnership with EPA Announced',
      excerpt: 'Enhanced collaboration will provide real-time air quality alerts to millions of Americans through mobile applications.',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop',
    },
    {
      date: 'Jun 10, 2024',
      tag: 'Technology',
      title: 'AI Integration Enhances Pollution Forecasts',
      excerpt: 'Machine learning models trained on TEMPO data improve air quality prediction accuracy by 40%.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    },
    {
      date: 'May 5, 2024',
      tag: 'Research',
      title: 'Wildfire Smoke Tracking Capabilities Demonstrated',
      excerpt: 'TEMPO successfully tracks smoke plumes from Canadian wildfires, providing crucial data for air quality warnings.',
      image: 'https://images.unsplash.com/photo-1628126235206-5260b9ea6441?w=800&h=400&fit=crop',
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
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
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
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{article.date}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                      Read article
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.article>
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
