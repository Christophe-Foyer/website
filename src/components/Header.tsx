import { Button } from "@/components/ui/button";
import { Download, Mail, Phone } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-xl font-semibold text-primary">Christophe Foyer</h1>
            <div className="hidden md:flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>christophe@cfoyer.com</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>+44 7444 175493</span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;