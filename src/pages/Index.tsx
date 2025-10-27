import { Header } from "@/components/Header";
import { CategoryCard } from "@/components/CategoryCard";
import { SearchBarEnhanced } from "@/components/SearchBarEnhanced";
import { categories, formulas } from "@/data/formulas";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      <section className="py-16 px-4" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            SkillBi's Hub
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your comprehensive guide to Excel formulas. Search, browse, and master the most essential functions.
          </p>
          <div className="flex justify-center">
            <SearchBarEnhanced
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search for any Excel formula..."
            />
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Browse by Category</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {categories.map(category => (
              <CategoryCard
                key={category.id}
                category={category}
                formulaCount={getCategoryFormulaCount(category.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 px-4 bg-accent">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">{formulas.length}</div>
              <div className="text-muted-foreground">Total Formulas</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">{categories.length}</div>
              <div className="text-muted-foreground">Categories</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">Free & Open</div>
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
