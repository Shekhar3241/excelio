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
      <section className="py-16 px-4 md:py-20" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent animate-fade-in">
              SkillBI's Hub
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 px-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
              Your comprehensive guide to Excel formulas. Search, browse, and master the most essential functions.
            </p>
          </div>

          {/* AI Formula Generator */}
          <Card className="mb-8 animate-fade-in" style={{ animationDelay: '150ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="h-6 w-6 text-primary" />
                AI Formula Generator
              </CardTitle>
              <p className="text-muted-foreground">Describe what you want to calculate and get Excel formulas instantly</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="e.g., Calculate sum of sales for products containing 'Apple'"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateAI()}
                  className="flex-1 px-4 py-3 rounded-lg border border-input bg-background text-base"
                  disabled={isGenerating}
                />
                <Button
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  size="lg"
                  className="gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Generate
                    </>
                  )}
                </Button>
              </div>

              {generatedFormulas.length > 0 && (
                <div className="space-y-3 mt-4">
                  <h3 className="font-semibold">Generated Formulas:</h3>
                  {generatedFormulas.map((formula, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-muted p-3 rounded-lg group"
                    >
                      <code className="text-sm flex-1 font-mono">{formula}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyFormula(formula, index)}
                        className="ml-2"
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
              <Card className="mt-4 max-h-96 overflow-y-auto">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    {filteredFormulas.map((formula) => (
                      <a
                        key={formula.id}
                        href={`/formula/${formula.id}`}
                        className="block p-3 rounded-lg hover:bg-muted transition-colors"
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
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center animate-fade-in">Browse by Category</h2>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
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
      <section className="py-12 px-4 bg-accent">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div className="animate-fade-in hover:scale-105 transition-transform duration-300" style={{ animationDelay: '100ms' }}>
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">{formulas.length}</div>
              <div className="text-sm sm:text-base text-muted-foreground">Total Formulas</div>
            </div>
            <div className="animate-fade-in hover:scale-105 transition-transform duration-300" style={{ animationDelay: '200ms' }}>
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">{categories.length}</div>
              <div className="text-sm sm:text-base text-muted-foreground">Categories</div>
            </div>
            <div className="animate-fade-in hover:scale-105 transition-transform duration-300" style={{ animationDelay: '300ms' }}>
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm sm:text-base text-muted-foreground">Free & Open</div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Connect With Us</h2>
            <p className="text-muted-foreground">Follow us for Excel tips, tutorials, and updates</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '100ms' }}>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto gap-2 hover-scale"
              onClick={() => window.open('https://www.instagram.com/skillbi.in/', '_blank')}
            >
              <Instagram className="h-5 w-5" />
              Follow on Instagram
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto gap-2 hover-scale"
              onClick={() => window.open('https://www.youtube.com/channel/UCr1CnwN0cp_vsSHkIojDhIw', '_blank')}
            >
              <Youtube className="h-5 w-5" />
              Subscribe on YouTube
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
