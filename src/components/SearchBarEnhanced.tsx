import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formulas } from "@/data/formulas";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface SearchBarEnhancedProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBarEnhanced({ value, onChange, placeholder = "Search formulas..." }: SearchBarEnhancedProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const suggestions = value.trim().length >= 1
    ? formulas
        .filter(f =>
          f.name.toLowerCase().includes(value.toLowerCase()) ||
          f.description.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 8)
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearSearch = () => {
    onChange("");
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full max-w-2xl" ref={wrapperRef}>
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground z-10" />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => value && setShowSuggestions(true)}
        className="pl-10 pr-10 h-12 text-base bg-card border-border"
      />
      {value && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-10"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute top-full mt-2 w-full bg-card border-border z-50 max-h-96 overflow-y-auto shadow-lg">
          <div className="p-2">
            {suggestions.map(formula => (
              <Link
                key={formula.id}
                to={`/formula/${formula.id}`}
                onClick={() => {
                  setShowSuggestions(false);
                  onChange("");
                }}
                className="block p-3 hover:bg-accent rounded-md transition-colors"
              >
                <div className="font-mono text-sm font-semibold text-primary">
                  {formula.name}
                </div>
                <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                  {formula.description}
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
