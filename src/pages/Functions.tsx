import { Header } from "@/components/Header";
import { FormulaCard } from "@/components/FormulaCard";
import { categories, formulas } from "@/data/formulas";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Functions = () => {
  const getCategoryFormulas = (categoryId: string) => {
    return formulas.filter(f => f.category === categoryId);
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.icon;
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            All Functions
          </h1>
          <p className="text-muted-foreground">
            Browse all {formulas.length} Excel formulas organized by category
          </p>
        </div>

        <Accordion type="multiple" className="space-y-4">
          {categories.map(category => {
            const categoryFormulas = getCategoryFormulas(category.id);
            const Icon = getCategoryIcon(category.id);
            
            return (
              <AccordionItem
                key={category.id}
                value={category.id}
                className="border border-border rounded-lg bg-card"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-accent/50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3 text-left">
                    {Icon && (
                      <div className="h-6 w-6 text-primary shrink-0">
                        <Icon />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {categoryFormulas.length} formulas
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="grid gap-4 md:grid-cols-2 pt-4">
                    {categoryFormulas.map(formula => (
                      <FormulaCard key={formula.id} formula={formula} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
};

export default Functions;
