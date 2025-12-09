import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { CategoryCard } from "@/components/CategoryCard";
import { ToolCard } from "@/components/ToolCard";
import { SearchBar } from "@/components/SearchBar";
import { categories, formulas } from "@/data/formulas";
import { tools } from "@/data/tools";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Instagram, Youtube, Upload, ArrowRight, Database, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with AI Data Analyzer CTA */}
      <section className="py-12 px-4 md:py-20 bg-[hsl(var(--hero-bg))]">
        <div className="container mx-auto max-w-4xl px-2 sm:px-4">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 text-foreground animate-fade-in px-2">
              Excel AI: Data Analysis, Visualizations & More
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 px-4 sm:px-6 animate-fade-in font-normal" style={{ animationDelay: '100ms' }}>
              Upload your files and let AI analyze your data. Get instant insights, charts, and actionable recommendations.
            </p>
          </div>

          {/* AI Data Analyzer CTA Card */}
          <Card className="mb-6 md:mb-8 animate-fade-in border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5 shadow-xl overflow-hidden" style={{ animationDelay: '150ms' }}>
            <CardHeader className="pb-4 md:pb-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                  <Database className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Data.chat
                  </CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    Powered by Advanced AI • Instant Insights
                  </CardDescription>
                </div>
              </div>
              <p className="text-base md:text-lg text-foreground/80 font-medium">
                Upload Excel, CSV, PDF, or any document and chat with AI to analyze your data
              </p>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {/* Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Ask questions about your data</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Generate charts & visualizations</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Get statistical insights</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Export results as PDF</span>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                onClick={() => navigate('/datachat')}
                size="lg"
                className="w-full gap-3 font-bold bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-6 text-lg"
              >
                <Upload className="h-5 w-5" />
                <span>Start Analyzing Your Data</span>
                <ArrowRight className="h-5 w-5" />
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Free to use • No signup required • Supports Excel, CSV, PDF, and more
              </p>
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
