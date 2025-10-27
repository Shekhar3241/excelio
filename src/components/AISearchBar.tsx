import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, Loader2 } from "lucide-react";
import { formulas } from "@/data/formulas";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AISearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function AISearchBar({ value, onChange, placeholder = "Ask in plain English..." }: AISearchBarProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAISearch = async () => {
    if (!value.trim()) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-search", {
        body: { query: value }
      });

      if (error) throw error;

      const suggestedFormulas = data.suggestions || [];
      setAiSuggestions(suggestedFormulas);
      setShowSuggestions(true);
    } catch (error) {
      console.error("AI search error:", error);
      toast.error("AI search failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const matchedFormulas = aiSuggestions
    .map(name => formulas.find(f => f.name.toLowerCase() === name.toLowerCase()))
    .filter(Boolean);

  return (
    <div className="relative w-full max-w-2xl">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setShowSuggestions(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAISearch();
              }
            }}
            placeholder={placeholder}
            className="pl-10 pr-4 py-6 text-lg border-2 focus-visible:ring-primary"
          />
        </div>
        <Button
          onClick={handleAISearch}
          disabled={isLoading || !value.trim()}
          size="lg"
          className="px-6"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              AI Search
            </>
          )}
        </Button>
      </div>

      {showSuggestions && matchedFormulas.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 p-2 z-50 max-h-96 overflow-auto border-2 border-primary/20 shadow-lg">
          <div className="mb-2 px-2 py-1 text-sm font-semibold text-primary flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Suggestions
          </div>
          {matchedFormulas.map((formula) => (
            <Link
              key={formula.id}
              to={`/formula/${formula.id}`}
              className="block p-3 hover:bg-accent rounded-md transition-colors"
              onClick={() => {
                setShowSuggestions(false);
                onChange("");
              }}
            >
              <div className="font-semibold text-primary">{formula.name}</div>
              <div className="text-sm text-muted-foreground line-clamp-1">{formula.description}</div>
            </Link>
          ))}
        </Card>
      )}
    </div>
  );
}
