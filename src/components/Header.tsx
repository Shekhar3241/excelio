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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-fade-in">
      <div className="container mx-auto px-2 sm:px-4 h-16 flex items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-all duration-200 hover:scale-105">
          <img src="/logo.png" alt="SkillBI's Hub" className="h-8 w-auto sm:h-10" />
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
          <Link to="/excel-errors" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:block">
            Errors
          </Link>
          <Link to="/glossary" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden lg:block">
            Glossary
          </Link>
          <Link to="/ai-generator">
            <Button variant="default" size="sm" className="gap-1.5 h-8">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">AI</span>
            </Button>
          </Link>
          <Link to="/simulator" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
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
            <DropdownMenuContent align="end">
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
