import { Link } from "react-router-dom";
import { Instagram, Youtube, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t mt-12 sm:mt-16 bg-muted/30">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand Section */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              SkillBI's Hub
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Your comprehensive Excel formula reference guide with AI-powered assistance and interactive learning tools.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/skillbi.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Visit our Instagram page"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.youtube.com/channel/UCr1CnwN0cp_vsSHkIojDhIw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Visit our YouTube channel"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="mailto:support@skillbi.in"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email us"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/ai-generator" className="text-muted-foreground hover:text-primary transition-colors">
                  AI Formula Generator
                </Link>
              </li>
              <li>
                <Link to="/simulator" className="text-muted-foreground hover:text-primary transition-colors">
                  Formula Simulator
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Resources</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/favorites" className="text-muted-foreground hover:text-primary transition-colors">
                  Favorites
                </Link>
              </li>
              <li>
                <Link to="/recent" className="text-muted-foreground hover:text-primary transition-colors">
                  Recent
                </Link>
              </li>
              <li>
                <a
                  href="https://support.microsoft.com/en-us/office/excel-functions-alphabetical-b3944572-255d-4efb-bb96-c6d90033e188"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Excel Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Legal</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-muted-foreground">
          <p>
            © {currentYear} SkillBI's Hub. All rights reserved.
          </p>
          <p className="mt-1 sm:mt-2">
            Microsoft Excel is a trademark of Microsoft Corporation. We are not affiliated with Microsoft.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
