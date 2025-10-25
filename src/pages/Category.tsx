import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { FormulaCard } from "@/components/FormulaCard";
import { SearchBar } from "@/components/SearchBar";
import { categories, formulas } from "@/data/formulas";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Category() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const category = categories.find(c => c.id === categoryId);
  const categoryFormulas = formulas.filter(f => f.category === categoryId);

  // Search across ALL formulas, not just current category
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim()) {
      // Find matching formulas across all categories
      const matchingFormulas = formulas.filter(f =>
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.description.toLowerCase().includes(query.toLowerCase())
      );
      
      // If we have results and the first result is NOT in the current category, navigate to it
      if (matchingFormulas.length > 0 && matchingFormulas[0].category !== categoryId) {
        navigate(`/category/${matchingFormulas[0].category}`);
      }
    }
  };

  // Filter formulas in current category based on search
  const filteredFormulas = categoryFormulas.filter(formula =>
    formula.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    formula.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset search when category changes
  useEffect(() => {
    setSearchQuery("");
  }, [categoryId]);

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <p className="text-center text-muted-foreground">Category not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Button>
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-5xl">{category.icon}</span>
            <h1 className="text-4xl font-bold">{category.name}</h1>
          </div>
          <p className="text-lg text-muted-foreground mt-2">{category.description}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {categoryFormulas.length} {categoryFormulas.length === 1 ? 'formula' : 'formulas'}
          </p>
        </div>

        <div className="mb-8">
          <SearchBar
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search all formulas..."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredFormulas.map(formula => (
            <FormulaCard key={formula.id} formula={formula} />
          ))}
        </div>

        {filteredFormulas.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No formulas found matching your search.
          </p>
        )}
      </div>
    </div>
  );
}
