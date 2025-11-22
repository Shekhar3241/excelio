import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { CategoryCard } from "@/components/CategoryCard";
import { SearchBar } from "@/components/SearchBar";
import { categories, formulas } from "@/data/formulas";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Instagram, Youtube, Loader2, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [aiQuery, setAiQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFormulas, setGeneratedFormulas] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const getCategoryFormulaCount = (categoryId: string) => {
    return formulas.filter(f => f.category === categoryId).length;
  };

  const filteredFormulas = searchQuery.trim().length >= 2
    ? formulas.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleGenerateAI = async () => {
    if (!aiQuery.trim()) {
      toast({
        title: "Please enter a description",
        description: "Describe what you want to calculate in Excel",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-search', {
        body: { query: aiQuery }
      });

      if (error) throw error;

      if (data.formulas && data.formulas.length > 0) {
        setGeneratedFormulas(data.formulas);
        toast({
          title: "Formulas generated!",
          description: `Generated ${data.formulas.length} formula${data.formulas.length > 1 ? 's' : ''}`,
        });
      } else {
        toast({
          title: "No formulas generated",
          description: "Try rephrasing your request",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error generating formulas:', error);
      toast({
        title: "Error generating formulas",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyFormula = async (formula: string, index: number) => {
    try {
      await navigator.clipboard.writeText(formula);
      setCopiedIndex(index);
      toast({
        title: "Formula copied!",
        description: "Formula has been copied to clipboard",
      });
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 px-4 md:py-20 relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.08),transparent_50%)] pointer-events-none"></div>
        <div className="container mx-auto max-w-4xl px-2 sm:px-4 relative z-10">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 premium-text-gradient animate-fade-in px-2 drop-shadow-sm">
              SkillBI's Hub
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-foreground/80 mb-6 md:mb-8 px-4 sm:px-6 animate-fade-in font-medium" style={{ animationDelay: '100ms' }}>
              Your comprehensive guide to Excel formulas. Search, browse, and master the most essential functions.
            </p>
          </div>

          {/* AI Formula Generator */}
          <Card className="mb-6 md:mb-8 animate-fade-in premium-card premium-hover" style={{ animationDelay: '150ms' }}>
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                AI Formula Generator
              </CardTitle>
              <p className="text-sm sm:text-base text-muted-foreground">Describe what you want to calculate and get Excel formulas instantly</p>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="e.g., Calculate sum of sales for products..."
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateAI()}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-input bg-background/50 backdrop-blur-sm text-sm sm:text-base focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  disabled={isGenerating}
                />
                <Button
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  variant="premium"
                  size="lg"
                  className="gap-2 w-full sm:w-auto font-semibold"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      <span className="text-sm sm:text-base">Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-sm sm:text-base">Generate</span>
                    </>
                  )}
                </Button>
              </div>

              {generatedFormulas.length > 0 && (
                <div className="space-y-2 md:space-y-3 mt-3 md:mt-4">
                  <h3 className="font-semibold text-sm sm:text-base">Generated Formulas:</h3>
                  {generatedFormulas.map((formula, index) => (
                    <div
                      key={index}
                      className="flex items-start sm:items-center gap-2 bg-muted/50 backdrop-blur-sm p-2 sm:p-3 rounded-lg group border border-border/30 hover:border-primary/30 transition-all duration-200"
                    >
                      <code className="text-xs sm:text-sm flex-1 font-mono break-all">{formula}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyFormula(formula, index)}
                        className="shrink-0"
                      >
                        {copiedIndex === index ? (
                          <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Search Bar */}
          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <SearchBar
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search for any Excel formula..."
            />
            {filteredFormulas.length > 0 && (
              <Card className="mt-4 max-h-96 overflow-y-auto premium-card">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    {filteredFormulas.map((formula) => (
                      <a
                        key={formula.id}
                        href={`/formula/${formula.id}`}
                        className="block p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-primary/30"
                      >
                        <div className="font-semibold text-primary">{formula.name}</div>
                        <div className="text-sm text-muted-foreground">{formula.description}</div>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-8 sm:py-12 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-center animate-fade-in premium-text-gradient">Browse by Category</h2>
          <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {categories.map((category, index) => (
              <div key={category.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <CategoryCard
                  category={category}
                  formulaCount={getCategoryFormulaCount(category.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 sm:py-12 px-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,hsl(var(--primary)/0.05)_50%,transparent_75%)] bg-[length:20px_20px] pointer-events-none"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 text-center">
            <div className="animate-fade-in hover:scale-110 transition-all duration-300 p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 premium-hover" style={{ animationDelay: '100ms' }}>
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold premium-text-gradient mb-1 sm:mb-2">{formulas.length}</div>
              <div className="text-xs sm:text-sm md:text-base text-foreground/70 font-semibold">Total Formulas</div>
            </div>
            <div className="animate-fade-in hover:scale-110 transition-all duration-300 p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 premium-hover" style={{ animationDelay: '200ms' }}>
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold premium-text-gradient mb-1 sm:mb-2">{categories.length}</div>
              <div className="text-xs sm:text-sm md:text-base text-foreground/70 font-semibold">Categories</div>
            </div>
            <div className="animate-fade-in hover:scale-110 transition-all duration-300 p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 premium-hover" style={{ animationDelay: '300ms' }}>
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold premium-text-gradient mb-1 sm:mb-2">100%</div>
              <div className="text-xs sm:text-sm md:text-base text-foreground/70 font-semibold">Free & Open</div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-8 sm:py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-6 sm:mb-8 animate-fade-in">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 premium-text-gradient">Connect With Us</h2>
            <p className="text-sm sm:text-base text-foreground/70 font-medium">Follow us for Excel tips, tutorials, and updates</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center animate-fade-in" style={{ animationDelay: '100ms' }}>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto gap-2 premium-hover font-semibold"
              onClick={() => window.open('https://www.instagram.com/skillbi.in/', '_blank')}
            >
              <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Follow on Instagram</span>
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto gap-2 premium-hover font-semibold"
              onClick={() => window.open('https://www.youtube.com/channel/UCr1CnwN0cp_vsSHkIojDhIw', '_blank')}
            >
              <Youtube className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Subscribe on YouTube</span>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
