import { Github, Linkedin } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
            Christophe Foyer
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive("/") ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              About
            </Link>
            <Link
              to="/projects"
              className={`text-sm font-medium transition-colors ${
                isActive("/projects") ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              Projects
            </Link>
            <Link
              to="/resume"
              className={`text-sm font-medium transition-colors ${
                isActive("/resume") ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              Resume
            </Link>
            
            <div className="flex items-center gap-4 ml-4">
              <a
                href="https://github.cfoyer.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub Profile"
              >
                <Github size={20} />
              </a>
              <a
                href="https://linkedin.cfoyer.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;