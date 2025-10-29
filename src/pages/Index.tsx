import { Header } from "@/components/Header";
import { CategoryCard } from "@/components/CategoryCard";
import { SearchBarEnhanced } from "@/components/SearchBarEnhanced";
import { categories, formulas } from "@/data/formulas";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // Only navigate if there's actually a search query (at least 2 characters)
    if (query.trim().length >= 2) {
      // Find matching formulas
      const matchingFormulas = formulas.filter(f =>
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.description.toLowerCase().includes(query.toLowerCase())
      );
      
      // If we have results, navigate to the first formula's category
      if (matchingFormulas.length > 0) {
        navigate(`/category/${matchingFormulas[0].category}`);
      }
    }
  };

  const getCategoryFormulaCount = (categoryId: string) => {
    return formulas.filter(f => f.category === categoryId).length;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 px-4 md:py-20" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent animate-fade-in">
            SkillBI's Hub
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 px-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
            Your comprehensive guide to Excel formulas. Search, browse, and master the most essential functions.
          </p>
          
          <SearchBarEnhanced
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search for any Excel formula..."
          />

          <div className="mt-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <Button
              onClick={() => navigate("/ai-generator")}
              size="lg"
              className="gap-2 hover:scale-105 transition-transform duration-200"
            >
              <Sparkles className="h-5 w-5 animate-pulse" />
              Try AI Formula Generator
            </Button>
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

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>Built for Excel users everywhere. Data accuracy not guaranteed - always verify with official documentation.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
