import { useState } from "react";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2, Copy, Check, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AIFormulaGenerator() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedFormulas, setGeneratedFormulas] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!query.trim()) {
      toast.error("Please describe what you want to calculate");
      return;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-search", {
        body: { query }
      });

      if (error) throw error;

      console.log("AI Response data:", data);

      // Use the formulas array directly - no fallback conversion
      const formulas = Array.isArray(data?.formulas) ? data.formulas : [];

      setGeneratedFormulas(formulas);
      
      if (formulas.length === 0) {
        toast.error("No formulas generated. Please try rephrasing your request.");
      }
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

  const examples = [
    "Add numbers in column A from row 1 to 10",
    "Calculate average of values in B2 to B20",
    "Count non-empty cells in range C1 to C50",
    "If A1 is greater than 100, show 'High', else show 'Low'",
    "Join text from cells D1 and D2 with a space",
    "Find the maximum value in range E1 to E15"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-16 px-4" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-primary">AI-Powered</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Formula Generator
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Describe what you want to calculate in plain English, and let AI generate the Excel formula for you.
            </p>
          </div>

          {/* Input Section */}
          <Card className="p-6 mb-8 border-2 border-primary/20 shadow-xl">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  What do you want to calculate?
                </label>
                <Input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isLoading) {
                      handleGenerate();
                    }
                  }}
                  placeholder="e.g., Add numbers in column A from row 1 to 10"
                  className="text-lg py-6"
                />
              </div>
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !query.trim()}
                size="lg"
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate Formula
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Results Section */}
          {generatedFormulas.length > 0 && (
            <Card className="p-6 border-2 border-green-500/20 bg-green-50/5">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-500" />
                <h2 className="text-xl font-bold">Generated Formulas</h2>
              </div>
              <div className="space-y-3">
                {generatedFormulas.map((formula, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-background rounded-lg border-2 border-border hover:border-primary/50 transition-colors"
                  >
                    <code className="flex-1 text-base font-mono bg-accent/50 px-4 py-3 rounded border">
                      {formula}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyFormula(formula, index)}
                      className="shrink-0"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Examples Section */}
          <Card className="mt-8 p-6 bg-accent/30">
            <div className="mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Try these examples:</h3>
            </div>
            <div className="grid gap-2">
              {examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(example)}
                  className="text-left p-3 bg-background rounded-md hover:bg-accent transition-colors text-sm border border-border hover:border-primary/50"
                >
                  {example}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
