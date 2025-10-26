import { Header } from "@/components/Header";
import { FormulaCard } from "@/components/FormulaCard";
import { formulas } from "@/data/formulas";
import { useRecent } from "@/hooks/use-recent";
import { Clock } from "lucide-react";

const Recent = () => {
  const { recent } = useRecent();
  
  const recentFormulas = recent
    .map(id => formulas.find(f => f.id === id))
    .filter(Boolean) as typeof formulas;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Recently Viewed
            </h1>
          </div>
          <p className="text-muted-foreground">
            Your browsing history - most recent first
          </p>
        </div>

        {recentFormulas.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground text-lg mb-2">No recent formulas</p>
            <p className="text-sm text-muted-foreground">
              Formulas you view will appear here
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentFormulas.map(formula => (
              <FormulaCard key={formula.id} formula={formula} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recent;
