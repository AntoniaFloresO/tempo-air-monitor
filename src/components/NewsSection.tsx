import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const news = [
  {
    date: 'Aug 2023',
    title: 'TEMPO\'s First Images Released',
    description: 'NASA unveils the first stunning images from TEMPO, marking the beginning of revolutionary air quality monitoring over North America.',
    tag: 'Milestone',
    url: 'https://www.nasa.gov/image-article/tempos-first-images/',
  },
  {
    date: 'Sep 2024',
    title: 'TEMPO Data Now Available to Public',
    description: 'Comprehensive air quality dataset from TEMPO is now accessible through NASA\'s GES DISC portal for research and applications.',
    tag: 'Data Release',
    url: 'https://disc.gsfc.nasa.gov/information/news?title=TEMPO%20Data%20Now%20Available',
  },
  {
    date: 'Oct 2024',
    title: 'Mapping Pollution Across North America',
    description: 'TEMPO provides unprecedented hourly measurements of air pollutants, transforming our understanding of atmospheric dynamics.',
    tag: 'Research',
    url: 'https://www.nasa.gov/missions/tempo/nasas-tempo-maps-pollution-over-north-america/',
  },
];

const NewsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-950/20 via-background/60 to-slate-950/40">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold"
          >
            Latest Updates
          </motion.h2>
          <Link
            to="/news"
            className="hidden sm:inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-medium"
          >
            View All News
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* News Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {news.map((item, index) => (
            <motion.a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/50 transition-all group cursor-pointer block"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Calendar className="w-4 h-4" />
                <span>{item.date}</span>
              </div>
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-3">
                {item.tag}
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-muted-foreground mb-4">{item.description}</p>
              <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                Read more
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.a>
          ))}
        </div>

        {/* Mobile View All Link */}
        <Link
          to="/news"
          className="sm:hidden flex items-center justify-center gap-2 text-primary hover:gap-3 transition-all font-medium mt-8"
        >
          View All News
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
};

export default NewsSection;
