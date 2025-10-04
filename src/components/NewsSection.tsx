import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const news = [
  {
    date: 'Sep 7, 2024',
    title: 'TEMPO Data Now Available for Public Use',
    description: 'NASA releases comprehensive air quality dataset covering North America with hourly resolution.',
    tag: 'Data Release',
  },
  {
    date: 'Aug 15, 2024',
    title: 'Record Air Quality Improvements Detected',
    description: 'TEMPO satellite reveals significant reductions in NO₂ levels across major metropolitan areas.',
    tag: 'Research',
  },
  {
    date: 'Jul 22, 2024',
    title: 'New Partnership with EPA Announced',
    description: 'Enhanced collaboration will provide real-time air quality alerts to millions of Americans.',
    tag: 'Partnership',
  },
];

const NewsSection = () => {
  return (
    <section className="py-20 bg-background">
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
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/50 transition-all group cursor-pointer"
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
            </motion.article>
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
