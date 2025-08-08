import { Github, Linkedin, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Header = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-8 py-1">
        <div className="flex items-center justify-between">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <img src="/lovable-uploads/f5951bcb-c86b-4dca-9eea-bcc1da2a6080.png" alt="Christophe Foyer" className="h-16" />
          </Link>
          
          {isMobile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu size={20} />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-background border">
                <DropdownMenuItem asChild>
                  <Link to="/" className={isActive("/") ? "text-primary font-medium" : ""}>
                    About
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/projects" className={isActive("/projects") ? "text-primary font-medium" : ""}>
                    Projects
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/resume" className={isActive("/resume") ? "text-primary font-medium" : ""}>
                    Resume
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a
                    href="https://github.cfoyer.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Github size={16} />
                    GitHub
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a
                    href="https://linkedin.cfoyer.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Linkedin size={16} />
                    LinkedIn
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
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
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;