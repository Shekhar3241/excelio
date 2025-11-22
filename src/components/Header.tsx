import { Link } from "react-router-dom";
import { FileSpreadsheet, Star, Clock, Calculator, Sparkles, BookOpen, FolderOpen } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-[var(--shadow-soft)] animate-fade-in">
      <div className="container mx-auto px-2 sm:px-4 h-16 flex items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-all duration-300 hover:scale-105 group">
          <img src="/logo.png" alt="SkillBI's Hub" className="h-8 w-auto sm:h-10 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-300" />
          <span className="font-bold text-base sm:text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">SkillBI's Hub</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
          <Link to="/" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
            Home
          </Link>
          <Link to="/blog" className="flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Blog</span>
          </Link>
          <Link to="/excel-errors" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105 hidden md:block relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
            Errors
          </Link>
          <Link to="/glossary" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105 hidden lg:block relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
            Glossary
          </Link>
          <Link to="/ai-generator">
            <Button variant="premium" size="sm" className="gap-1.5 h-8">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline font-semibold">AI</span>
            </Button>
          </Link>
          <Link to="/simulator" className="flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Simulator</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5 h-8">
                <FolderOpen className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Tools</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="premium-glass border-border/50 z-[100]">
              <DropdownMenuItem asChild>
                <Link to="/vba-generator" className="cursor-pointer">VBA Generator</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/excel-to-pdf" className="cursor-pointer">Excel to PDF</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
