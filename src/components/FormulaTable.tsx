import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface FormulaTableProps {
  example: string;
}

export function FormulaTable({ example }: FormulaTableProps) {
  // Parse the example to create table data
  const parseExample = () => {
    // Extract formula and result
    const parts = example.split('=');
    if (parts.length < 2) return null;

    const formula = '=' + parts.slice(1).join('=').trim();
    
    // Try to extract sample data from common patterns
    let sampleData: { cell: string; value: string }[] = [];
    
    // Pattern for references like A1, B2, etc.
    const cellRefs = formula.match(/[A-Z]+\d+/g);
    if (cellRefs) {
      // Create sample data based on formula type
      const uniqueRefs = [...new Set(cellRefs)];
      sampleData = uniqueRefs.slice(0, 5).map((ref, idx) => ({
        cell: ref,
        value: `Sample ${idx + 1}`
      }));
    }

    return { formula, sampleData };
  };

  const data = parseExample();
  if (!data) return null;

  return (
    <div className="space-y-4">
      {data.sampleData.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-3 text-foreground">Sample Data:</h4>
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold text-foreground">Cell</TableHead>
                  <TableHead className="font-semibold text-foreground">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.sampleData.map((item, idx) => (
                  <TableRow key={idx} className="hover:bg-accent/50">
                    <TableCell className="font-mono font-semibold text-primary">{item.cell}</TableCell>
                    <TableCell className="text-foreground">{item.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <div>
        <h4 className="text-sm font-semibold mb-3 text-foreground">Formula in Use:</h4>
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold text-foreground">Formula</TableHead>
                <TableHead className="font-semibold text-foreground">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-accent/50">
                <TableCell className="font-mono text-sm text-primary">{data.formula}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  This formula processes the data shown above
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
