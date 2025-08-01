import { Github, Linkedin } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Christophe Foyer</h1>
          <div className="flex items-center gap-4">
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
        </div>
      </div>
    </header>
  );
};

export default Header;