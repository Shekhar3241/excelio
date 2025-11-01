import { Link } from "react-router-dom";
import { FileSpreadsheet, Star, Clock, Calculator, Sparkles, BookOpen } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-fade-in">
      <div className="container mx-auto px-2 sm:px-4 h-16 flex items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-all duration-200 hover:scale-105">
          <FileSpreadsheet className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          <span className="font-semibold text-base sm:text-xl">SkillBI's Hub</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/blog" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Blog</span>
          </Link>
          <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:block">
            About
          </Link>
          <Link to="/ai-generator">
            <Button variant="default" size="sm" className="gap-1.5 h-8">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">AI Generator</span>
            </Button>
          </Link>
          <Link to="/simulator" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Simulator</span>
          </Link>
          <Link to="/favorites" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline">Favorites</span>
          </Link>
          <Link to="/recent" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Recent</span>
          </Link>
          <a 
            href="https://support.microsoft.com/en-us/office/excel-functions-alphabetical-b3944572-255d-4efb-bb96-c6d90033e188" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:block"
          >
            Docs
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
