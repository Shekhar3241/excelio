import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, Loader2, Copy, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AISearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function AISearchBar({ value, onChange, placeholder = "Describe what you want to calculate..." }: AISearchBarProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedFormulas, setGeneratedFormulas] = useState<string[]>([]);
  const [showFormulas, setShowFormulas] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleAISearch = async () => {
    if (!value.trim()) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-search", {
        body: { query: value }
      });

      if (error) throw error;

      const formulas = data.formulas || [];
      setGeneratedFormulas(formulas);
      setShowFormulas(true);
    } catch (error) {
      console.error("AI formula generation error:", error);
      toast.error("AI formula generation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyFormula = async (formula: string, index: number) => {
    try {
      await navigator.clipboard.writeText(formula);
      setCopiedIndex(index);
      toast.success("Formula copied to clipboard!");
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      toast.error("Failed to copy formula");
    }
  };

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
              setShowFormulas(false);
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
              Generate Formula
            </>
          )}
        </Button>
      </div>

      {showFormulas && generatedFormulas.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 p-4 z-50 max-h-96 overflow-auto border-2 border-primary/20 shadow-lg">
          <div className="mb-3 px-2 py-1 text-sm font-semibold text-primary flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Generated Formulas
          </div>
          <div className="space-y-2">
            {generatedFormulas.map((formula, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-accent/50 rounded-md hover:bg-accent transition-colors"
              >
                <code className="flex-1 text-sm font-mono bg-background px-3 py-2 rounded border">
                  {formula}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyFormula(formula, index)}
                  className="shrink-0"
                >
                  {copiedIndex === index ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
