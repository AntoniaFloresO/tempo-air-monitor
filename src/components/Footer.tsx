import { Link } from 'react-router-dom';
import { Satellite, Github, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-slate-950/40 to-slate-950 border-t border-cyan-400/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Satellite className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">AirSense</h3>
                <p className="text-xs text-cyan-300/70">NASA TEMPO</p>
              </div>
            </div>
            <p className="text-sm text-blue-200/70">
              Monitoring air quality from space for a healthier planet.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-cyan-300">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-blue-200/70 hover:text-cyan-300 transition-colors">
                  Live Monitor
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-blue-200/70 hover:text-cyan-300 transition-colors">
                  About TEMPO
                </Link>
              </li>
              <li>
                <Link to="/data" className="text-sm text-blue-200/70 hover:text-cyan-300 transition-colors">
                  Data & Science
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-sm text-blue-200/70 hover:text-cyan-300 transition-colors">
                  News & Updates
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-cyan-300">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://tempo.si.edu/" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-200/70 hover:text-cyan-300 transition-colors">
                  TEMPO Mission
                </a>
              </li>
              <li>
                <a href="https://www.nasa.gov/" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-200/70 hover:text-cyan-300 transition-colors">
                  NASA
                </a>
              </li>
              <li>
                <a href="https://www.epa.gov/air-quality" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-200/70 hover:text-cyan-300 transition-colors">
                  EPA Air Quality
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-200/70 hover:text-cyan-300 transition-colors">
                  API Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4 text-cyan-300">Connect</h4>
            <div className="flex gap-3 mb-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-slate-800/50 border border-cyan-400/20 hover:bg-cyan-500/20 hover:border-cyan-400/50 text-cyan-300 transition-all flex items-center justify-center"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-slate-800/50 border border-blue-400/20 hover:bg-blue-500/20 hover:border-blue-400/50 text-blue-300 transition-all flex items-center justify-center"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@airsense.space"
                className="w-10 h-10 rounded-lg bg-slate-800/50 border border-purple-400/20 hover:bg-purple-500/20 hover:border-purple-400/50 text-purple-300 transition-all flex items-center justify-center"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-blue-200/70">
              Questions? Get in touch with our team.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cyan-400/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-blue-200/70">
            © {currentYear} AirSense. Powered by NASA TEMPO satellite data.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-blue-200/70 hover:text-cyan-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-blue-200/70 hover:text-cyan-300 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
