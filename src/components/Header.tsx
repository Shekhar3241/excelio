import { Link } from "react-router-dom";
import { Calculator, Sparkles, BookOpen, FolderOpen } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full bg-black border-b border-border/30 shadow-lg backdrop-blur-sm animate-fade-in">
      <div className="container mx-auto px-2 sm:px-4 h-16 flex items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-all duration-300 hover:scale-105">
          <img src="/logo.png" alt="SkillBI's Hub" className="h-8 w-auto sm:h-10 animate-scale-in" />
          <span className="font-bold text-base sm:text-xl text-white">SkillBI</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
          <Link to="/" className="text-sm font-medium text-white/70 hover:text-white transition-all duration-300 hover:scale-105">
            Home
          </Link>
          <Link to="/blog" className="flex items-center gap-1 text-sm font-medium text-white/70 hover:text-white transition-all duration-300 hover:scale-105">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Blog</span>
          </Link>
          <Link to="/excel-errors" className="text-sm font-medium text-white/70 hover:text-white transition-all duration-300 hover:scale-105 hidden md:block">
            Errors
          </Link>
          <Link to="/glossary" className="text-sm font-medium text-white/70 hover:text-white transition-all duration-300 hover:scale-105 hidden lg:block">
            Glossary
          </Link>
          <Link to="/ai-generator">
            <Button size="sm" className="gap-1.5 h-8 bg-accent text-accent-foreground hover:bg-accent/90 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-accent/50">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span className="hidden sm:inline font-semibold">AI</span>
            </Button>
          </Link>
          <Link to="/simulator" className="flex items-center gap-1 text-sm font-medium text-white/70 hover:text-white transition-all duration-300 hover:scale-105">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Simulator</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5 h-8 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300">
                <FolderOpen className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Tools</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[100] bg-black border-border/30 animate-scale-in">
              <DropdownMenuItem asChild className="text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer transition-all duration-200">
                <Link to="/vba-generator" className="cursor-pointer">VBA Generator</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer transition-all duration-200">
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
