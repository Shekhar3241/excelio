import { Header } from "@/components/Header";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Calculator, Trash2, Play } from "lucide-react";

interface Cell {
  id: string;
  value: string;
  row: number;
  col: number;
}

export default function Simulator() {
  const [cells, setCells] = useState<Cell[]>(() => {
    const initialCells: Cell[] = [];
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 8; col++) {
        initialCells.push({
          id: `${row}-${col}`,
          value: "",
          row,
          col,
        });
      }
    }
    return initialCells;
  });
  const [formula, setFormula] = useState("");
  const [result, setResult] = useState<string>("");

  const getColumnLabel = (col: number) => {
    return String.fromCharCode(65 + col); // A, B, C, etc.
  };

  const getCellValue = (cellRef: string): number => {
    const match = cellRef.match(/([A-Z])(\d+)/);
    if (!match) return 0;
    
    const col = match[1].charCodeAt(0) - 65;
    const row = parseInt(match[2]) - 1;
    
    const cell = cells.find(c => c.row === row && c.col === col);
    const value = parseFloat(cell?.value || "0");
    return isNaN(value) ? 0 : value;
  };

  const getRangeValues = (range: string): number[] => {
    const match = range.match(/([A-Z])(\d+):([A-Z])(\d+)/);
    if (!match) return [];

    const startCol = match[1].charCodeAt(0) - 65;
    const startRow = parseInt(match[2]) - 1;
    const endCol = match[3].charCodeAt(0) - 65;
    const endRow = parseInt(match[4]) - 1;

    const values: number[] = [];
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const cell = cells.find(c => c.row === row && c.col === col);
        const value = parseFloat(cell?.value || "0");
        if (!isNaN(value)) values.push(value);
      }
    }
    return values;
  };

  const executeFormula = () => {
    try {
      let formulaStr = formula.trim();
      if (!formulaStr.startsWith("=")) {
        toast.error("Formula must start with =");
        return;
      }

      formulaStr = formulaStr.substring(1).toUpperCase();

      // SUM function
      if (formulaStr.startsWith("SUM(")) {
        const rangeMatch = formulaStr.match(/SUM\(([A-Z]\d+:[A-Z]\d+)\)/);
        if (rangeMatch) {
          const values = getRangeValues(rangeMatch[1]);
          const sum = values.reduce((a, b) => a + b, 0);
          setResult(sum.toString());
          toast.success("Formula executed!");
          return;
        }
      }

      // AVERAGE function
      if (formulaStr.startsWith("AVERAGE(")) {
        const rangeMatch = formulaStr.match(/AVERAGE\(([A-Z]\d+:[A-Z]\d+)\)/);
        if (rangeMatch) {
          const values = getRangeValues(rangeMatch[1]);
          const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
          setResult(avg.toFixed(2));
          toast.success("Formula executed!");
          return;
        }
      }

      // COUNT function
      if (formulaStr.startsWith("COUNT(")) {
        const rangeMatch = formulaStr.match(/COUNT\(([A-Z]\d+:[A-Z]\d+)\)/);
        if (rangeMatch) {
          const values = getRangeValues(rangeMatch[1]);
          setResult(values.length.toString());
          toast.success("Formula executed!");
          return;
        }
      }

      // MAX function
      if (formulaStr.startsWith("MAX(")) {
        const rangeMatch = formulaStr.match(/MAX\(([A-Z]\d+:[A-Z]\d+)\)/);
        if (rangeMatch) {
          const values = getRangeValues(rangeMatch[1]);
          const max = values.length > 0 ? Math.max(...values) : 0;
          setResult(max.toString());
          toast.success("Formula executed!");
          return;
        }
      }

      // MIN function
      if (formulaStr.startsWith("MIN(")) {
        const rangeMatch = formulaStr.match(/MIN\(([A-Z]\d+:[A-Z]\d+)\)/);
        if (rangeMatch) {
          const values = getRangeValues(rangeMatch[1]);
          const min = values.length > 0 ? Math.min(...values) : 0;
          setResult(min.toString());
          toast.success("Formula executed!");
          return;
        }
      }

      // Simple cell references (e.g., =A1+B1)
      formulaStr = formulaStr.replace(/([A-Z]\d+)/g, (match) => {
        return getCellValue(match).toString();
      });

      // Evaluate the expression
      const evalResult = eval(formulaStr);
      setResult(evalResult.toString());
      toast.success("Formula executed!");
    } catch (error) {
      toast.error("Invalid formula");
      setResult("ERROR");
    }
  };

  const updateCell = (id: string, value: string) => {
    setCells(prev => prev.map(c => c.id === id ? { ...c, value } : c));
  };

  const clearGrid = () => {
    setCells(prev => prev.map(c => ({ ...c, value: "" })));
    setFormula("");
    setResult("");
    toast.success("Grid cleared!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Calculator className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Live Formula Simulator
            </h1>
          </div>
          <p className="text-muted-foreground">
            Try Excel formulas in real-time with an interactive spreadsheet
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* Spreadsheet Grid */}
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Spreadsheet</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={clearGrid}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                  {/* Column headers */}
                  <div className="flex">
                    <div className="w-12 h-10 flex items-center justify-center border border-border bg-accent font-semibold text-sm">
                      #
                    </div>
                    {Array.from({ length: 8 }, (_, col) => (
                      <div
                        key={col}
                        className="w-24 h-10 flex items-center justify-center border border-border bg-accent font-semibold text-sm"
                      >
                        {getColumnLabel(col)}
                      </div>
                    ))}
                  </div>
                  
                  {/* Rows */}
                  {Array.from({ length: 10 }, (_, row) => (
                    <div key={row} className="flex">
                      <div className="w-12 h-10 flex items-center justify-center border border-border bg-accent font-semibold text-sm">
                        {row + 1}
                      </div>
                      {Array.from({ length: 8 }, (_, col) => {
                        const cell = cells.find(c => c.row === row && c.col === col);
                        return (
                          <Input
                            key={`${row}-${col}`}
                            value={cell?.value || ""}
                            onChange={(e) => updateCell(`${row}-${col}`, e.target.value)}
                            className="w-24 h-10 rounded-none border-border focus-visible:ring-1"
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formula Input */}
          <div className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Formula Editor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Enter Formula</label>
                  <Input
                    value={formula}
                    onChange={(e) => setFormula(e.target.value)}
                    placeholder="=SUM(A1:A5)"
                    className="font-mono"
                  />
                </div>
                
                <Button
                  onClick={executeFormula}
                  className="w-full"
                  disabled={!formula}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Execute Formula
                </Button>

                {result && (
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="text-sm font-medium mb-1">Result:</div>
                    <div className="text-2xl font-bold text-primary">{result}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Supported Formulas</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <div>
                      <code className="text-xs bg-accent px-1 py-0.5 rounded">SUM(A1:A5)</code>
                      <p className="text-muted-foreground mt-1">Add range of cells</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <div>
                      <code className="text-xs bg-accent px-1 py-0.5 rounded">AVERAGE(A1:A5)</code>
                      <p className="text-muted-foreground mt-1">Calculate average</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <div>
                      <code className="text-xs bg-accent px-1 py-0.5 rounded">COUNT(A1:A5)</code>
                      <p className="text-muted-foreground mt-1">Count numbers</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <div>
                      <code className="text-xs bg-accent px-1 py-0.5 rounded">MAX(A1:A5)</code>
                      <p className="text-muted-foreground mt-1">Find maximum</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <div>
                      <code className="text-xs bg-accent px-1 py-0.5 rounded">MIN(A1:A5)</code>
                      <p className="text-muted-foreground mt-1">Find minimum</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <div>
                      <code className="text-xs bg-accent px-1 py-0.5 rounded">=A1+B1</code>
                      <p className="text-muted-foreground mt-1">Basic operations (+, -, *, /)</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
