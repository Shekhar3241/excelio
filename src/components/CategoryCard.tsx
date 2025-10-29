import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Category } from "@/data/formulas";

interface CategoryCardProps {
  category: Category;
  formulaCount: number;
}

export function CategoryCard({ category, formulaCount }: CategoryCardProps) {
  return (
    <Link to={`/category/${category.id}`}>
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-105 border-border bg-card cursor-pointer animate-fade-in group">
        <CardHeader className="space-y-3">
          <div className="text-5xl transition-transform duration-300 group-hover:scale-110">{category.icon}</div>
          <CardTitle className="text-xl transition-colors">{category.name}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {category.description}
          </CardDescription>
          <div className="text-sm font-medium text-primary pt-2 transition-colors">
            {formulaCount} {formulaCount === 1 ? 'formula' : 'formulas'}
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
