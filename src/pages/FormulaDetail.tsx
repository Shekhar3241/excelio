import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { formulas, categories } from "@/data/formulas";
import { ArrowLeft, Copy, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useFavorites } from "@/hooks/use-favorites";
import { useRecent } from "@/hooks/use-recent";
import { FormulaCard } from "@/components/FormulaCard";

export default function FormulaDetail() {
  const { formulaId } = useParams<{ formulaId: string }>();
  const [copiedSyntax, setCopiedSyntax] = useState(false);
  const [copiedExample, setCopiedExample] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addRecent } = useRecent();

  const formula = formulas.find(f => f.id === formulaId);
  const category = formula ? categories.find(c => c.id === formula.category) : null;

  // Get related formulas (same category, excluding current formula)
  const relatedFormulas = formula
    ? formulas.filter(f => f.category === formula.category && f.id !== formula.id).slice(0, 3)
    : [];

  useEffect(() => {
    if (formulaId) {
      addRecent(formulaId);
    }
  }, [formulaId, addRecent]);

  const copyToClipboard = async (text: string, type: 'syntax' | 'example') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'syntax') {
        setCopiedSyntax(true);
        setTimeout(() => setCopiedSyntax(false), 2000);
      } else {
        setCopiedExample(true);
        setTimeout(() => setCopiedExample(false), 2000);
      }
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  if (!formula || !category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <p className="text-center text-muted-foreground">Formula not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to={`/category/${formula.category}`}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {category.name}
          </Button>
        </Link>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {category.icon} {category.name}
            </Badge>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-5xl font-bold font-mono text-primary mb-4">
                {formula.name}
              </h1>
              <p className="text-xl text-foreground">
                {formula.description}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleFavorite(formula.id)}
              className="h-12 w-12 shrink-0"
            >
              <Star
                className={`h-6 w-6 ${
                  isFavorite(formula.id)
                    ? "fill-primary text-primary"
                    : "text-muted-foreground"
                }`}
              />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Syntax
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(formula.syntax, 'syntax')}
                  className="h-8"
                >
                  {copiedSyntax ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <code className="block p-4 bg-accent rounded-lg text-accent-foreground font-mono text-sm overflow-x-auto">
                {formula.syntax}
              </code>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Example
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(formula.example, 'example')}
                  className="h-8"
                >
                  {copiedExample ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <code className="block p-4 bg-accent rounded-lg text-accent-foreground font-mono text-sm overflow-x-auto">
                {formula.example}
              </code>
            </CardContent>
          </Card>

          {formula.notes && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">
                  {formula.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-8 p-6 bg-accent rounded-lg border border-border">
          <h3 className="font-semibold mb-2 text-accent-foreground">Need more help?</h3>
          <p className="text-sm text-muted-foreground">
            Visit the{" "}
            <a
              href={`https://support.microsoft.com/en-us/office/${formula.name.toLowerCase()}-function`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              official Microsoft documentation
            </a>{" "}
            for more detailed information about this formula.
          </p>
        </div>

        {relatedFormulas.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Formulas</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {relatedFormulas.map(related => (
                <FormulaCard key={related.id} formula={related} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
