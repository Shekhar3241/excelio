import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { CategoryCard } from "@/components/CategoryCard";
import { ToolCard } from "@/components/ToolCard";
import { SearchBar } from "@/components/SearchBar";
import { categories, formulas } from "@/data/formulas";
import { tools } from "@/data/tools";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Instagram, Youtube, Loader2, Copy, Check, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import convertxLogo from "@/assets/convertx-logo-new.png";

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
      <section className="py-12 px-4 md:py-20 bg-[hsl(var(--hero-bg))]">
        <div className="container mx-auto max-w-4xl px-2 sm:px-4">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 text-foreground animate-fade-in px-2">
              Excel AI: Generate Formulas, Data Analysis, Visualizations & More
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 px-4 sm:px-6 animate-fade-in font-normal" style={{ animationDelay: '100ms' }}>
              Your comprehensive guide to Excel formulas. Search, browse, and master the most essential functions.
            </p>
          </div>

          {/* Premium AI Formula Generator */}
          <Card className="mb-6 md:mb-8 animate-fade-in border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5 shadow-xl" style={{ animationDelay: '150ms' }}>
            <CardHeader className="pb-3 md:pb-6 space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    AI Formula Generator
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Powered by Advanced AI • Instant Results
                  </CardDescription>
                </div>
              </div>
              <p className="text-base text-foreground/80 font-medium">Transform natural language into powerful Excel formulas with our premium AI engine</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="e.g., Calculate sum of sales for products..."
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateAI()}
                  className="flex-1 px-4 py-3.5 rounded-lg border-2 border-input bg-background text-base focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-200 font-medium"
                  disabled={isGenerating}
                />
                <Button
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  size="lg"
                  className="gap-2 w-full sm:w-auto font-bold bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5" />
                      <span>Generate AI Formula</span>
                    </>
                  )}
                </Button>
              </div>

              {generatedFormulas.length > 0 && (
                <div className="space-y-3 mt-4 p-4 bg-muted/50 rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-base">Generated Formulas:</h3>
                  </div>
                  {generatedFormulas.map((formula, index) => (
                    <div
                      key={index}
                      className="flex items-start sm:items-center gap-2 bg-background p-3 rounded-lg group border-2 border-border hover:border-primary/50 transition-all duration-200 shadow-sm"
                    >
                      <code className="text-sm flex-1 font-mono break-all font-semibold text-primary">{formula}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyFormula(formula, index)}
                        className="shrink-0 hover:bg-primary/10"
                      >
                        {copiedIndex === index ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : (
                          <Copy className="h-4 w-4" />
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
              <Card className="mt-4 max-h-96 overflow-y-auto clean-card">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    {filteredFormulas.map((formula) => (
                      <a
                        key={formula.id}
                        href={`/formula/${formula.id}`}
                        className="block p-3 rounded-lg hover:bg-muted transition-all duration-200 border border-transparent hover:border-accent/30"
                      >
                        <div className="font-semibold text-foreground">{formula.name}</div>
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

      {/* AI Tools Directory */}
      <section className="py-12 sm:py-16 px-4 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-10 animate-fade-in">
            {/* ConvertX Logo */}
            <div className="flex justify-center mb-6">
              <img 
                src={convertxLogo} 
                alt="ConvertX" 
                className="h-32 sm:h-40 md:h-48 w-auto animate-scale-in"
              />
            </div>
            <p className="text-sm text-primary font-bold mb-2 uppercase tracking-wider">// AI-POWERED TOOLS //</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">Our AI Apps & Tools</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our suite of powerful AI tools designed to supercharge your Excel and data workflows
            </p>
          </div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool, index) => (
              <div key={tool.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-8 sm:py-12 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-center animate-fade-in">Browse Formulas by Category</h2>
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
      <section className="py-8 sm:py-12 px-4 bg-muted">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 text-center">
            <div className="animate-fade-in hover:scale-105 transition-all duration-200 p-4 rounded-xl bg-background border border-border" style={{ animationDelay: '100ms' }}>
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mb-1 sm:mb-2">{formulas.length}</div>
              <div className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium">Total Formulas</div>
            </div>
            <div className="animate-fade-in hover:scale-105 transition-all duration-200 p-4 rounded-xl bg-background border border-border" style={{ animationDelay: '200ms' }}>
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mb-1 sm:mb-2">{categories.length}</div>
              <div className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium">Categories</div>
            </div>
            <div className="animate-fade-in hover:scale-105 transition-all duration-200 p-4 rounded-xl bg-background border border-border" style={{ animationDelay: '300ms' }}>
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mb-1 sm:mb-2">100%</div>
              <div className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium">Free & Open</div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-8 sm:py-12 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-6 sm:mb-8 animate-fade-in">
            <p className="text-sm text-accent font-semibold mb-2">// POWER TOOLS //</p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">Connect With Us</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Follow us for Excel tips, tutorials, and updates</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center animate-fade-in" style={{ animationDelay: '100ms' }}>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto gap-2 font-semibold"
              onClick={() => window.open('https://www.instagram.com/skillbi.in/', '_blank')}
            >
              <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Follow on Instagram</span>
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto gap-2 font-semibold"
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
