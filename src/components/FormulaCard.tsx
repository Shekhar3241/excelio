import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Formula } from "@/data/formulas";
import { ChevronRight } from "lucide-react";

interface FormulaCardProps {
  formula: Formula;
}

export function FormulaCard({ formula }: FormulaCardProps) {
  return (
    <Link to={`/formula/${formula.id}`}>
      <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/50 border-border bg-card cursor-pointer group">
        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-mono text-primary group-hover:text-primary-light transition-colors">
              {formula.name}
            </CardTitle>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <CardDescription className="text-sm text-foreground">
            {formula.description}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
