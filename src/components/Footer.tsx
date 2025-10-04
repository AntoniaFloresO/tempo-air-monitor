import { Link } from 'react-router-dom';
import { Satellite, Github, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <Satellite className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-bold">AirSense</h3>
                <p className="text-xs text-muted-foreground">NASA TEMPO</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Monitoring air quality from space for a healthier planet.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Live Monitor
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About TEMPO
                </Link>
              </li>
              <li>
                <Link to="/data" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Data & Science
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  News & Updates
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://tempo.si.edu/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  TEMPO Mission
                </a>
              </li>
              <li>
                <a href="https://www.nasa.gov/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  NASA
                </a>
              </li>
              <li>
                <a href="https://www.epa.gov/air-quality" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  EPA Air Quality
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  API Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-3 mb-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-accent hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-accent hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@airsense.space"
                className="w-10 h-10 rounded-lg bg-accent hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              Questions? Get in touch with our team.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} AirSense. Powered by NASA TEMPO satellite data.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
