import { Header } from "@/components/Header";
import { FormulaCard } from "@/components/FormulaCard";
import { formulas } from "@/data/formulas";
import { useFavorites } from "@/hooks/use-favorites";
import { Star } from "lucide-react";

const Favorites = () => {
  const { favorites } = useFavorites();
  
  const favoriteFormulas = formulas.filter(f => favorites.includes(f.id));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Star className="h-8 w-8 text-primary fill-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Favorite Formulas
            </h1>
          </div>
          <p className="text-muted-foreground">
            Your bookmarked formulas for quick access
          </p>
        </div>

        {favoriteFormulas.length === 0 ? (
          <div className="text-center py-12">
            <Star className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground text-lg mb-2">No favorites yet</p>
            <p className="text-sm text-muted-foreground">
              Click the star icon on any formula to add it to your favorites
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {favoriteFormulas.map(formula => (
              <FormulaCard key={formula.id} formula={formula} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
