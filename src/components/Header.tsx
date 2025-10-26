import { Link } from "react-router-dom";
import { FileSpreadsheet } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <FileSpreadsheet className="h-6 w-6 text-primary" />
          <span className="font-semibold text-xl">Excelio's Hub</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/functions" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Functions
          </Link>
          <a 
            href="https://support.microsoft.com/en-us/office/excel-functions-alphabetical-b3944572-255d-4efb-bb96-c6d90033e188" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Official Docs
          </a>
        </nav>
      </div>
    </header>
  );
}
