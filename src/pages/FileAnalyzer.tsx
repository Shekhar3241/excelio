import { useState } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Lightbulb, FileText } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { supabase } from "@/integrations/supabase/client";

interface AnalysisResult {
  fileName: string;
  sheets: string[];
  totalFormulas: number;
  formulasByType: Record<string, number>;
  errors: Array<{ sheet: string; cell: string; error: string }>;
  suggestions: string[];
  complexity: 'Low' | 'Medium' | 'High';
}

export default function FileAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      if (uploadedFile.size > MAX_FILE_SIZE) {
        toast.error('File too large. Maximum size is 10MB. Please use a smaller file.');
        e.target.value = '';
        return;
      }
      
      if (!uploadedFile.name.match(/\.(xlsx|xls|xlsm)$/)) {
        toast.error("Please upload a valid Excel file (.xlsx, .xls, .xlsm)");
        e.target.value = '';
        return;
      }
      setFile(uploadedFile);
      setAnalysis(null);
    }
  };

  const analyzeFile = async () => {
    if (!file) return;

    setAnalyzing(true);
    setProgress(10);

    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        setProgress(30);

        // Extract formulas and basic info
        const sheets = workbook.SheetNames;
        const formulas: string[] = [];
        const errors: Array<{ sheet: string; cell: string; error: string }> = [];

        sheets.forEach(sheetName => {
          const sheet = workbook.Sheets[sheetName];
          const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
          
          for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
              const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
              const cell = sheet[cellAddress];
              
              if (cell && cell.f) {
                formulas.push(cell.f);
              }
              
              if (cell && cell.v && typeof cell.v === 'string' && cell.v.startsWith('#')) {
                errors.push({
                  sheet: sheetName,
                  cell: cellAddress,
                  error: cell.v
                });
              }
            }
          }
        });

        setProgress(60);

        // Analyze formulas
        const formulasByType: Record<string, number> = {};
        formulas.forEach(formula => {
          const match = formula.match(/^([A-Z]+)\(/);
          if (match) {
            const funcName = match[1];
            formulasByType[funcName] = (formulasByType[funcName] || 0) + 1;
          }
        });

        // Get AI-powered suggestions
        setProgress(80);
        const { data: aiData, error: aiError } = await supabase.functions.invoke('analyze-excel', {
          body: { 
            fileName: file.name,
            sheets,
            totalFormulas: formulas.length,
            formulasByType,
            errors: errors.slice(0, 10) // Send first 10 errors
          }
        });

        if (aiError) throw aiError;

        const complexity = formulas.length > 100 ? 'High' : formulas.length > 30 ? 'Medium' : 'Low';

        setAnalysis({
          fileName: file.name,
          sheets,
          totalFormulas: formulas.length,
          formulasByType,
          errors,
          suggestions: aiData?.suggestions || [],
          complexity
        });

        setProgress(100);
        toast.success("File analyzed successfully!");
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error("Failed to analyze file. Please try again.");
    } finally {
      setAnalyzing(false);
      setProgress(0);
    }
  };

  return (
    <>
      <Helmet>
        <title>Excel File Analyzer - Analyze Formulas, Find Errors & Get Optimizations</title>
        <meta name="description" content="Upload your Excel files to analyze formulas, identify errors, and get AI-powered optimization suggestions." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Excel File Analyzer
              </h1>
              <p className="text-lg text-muted-foreground">
                Upload your Excel files to analyze formulas, identify errors, and get optimization suggestions
              </p>
            </div>

            {/* Upload Section */}
            <Card className="mb-8 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  Upload Excel File
                </CardTitle>
                <CardDescription>
                  Supported formats: .xlsx, .xls, .xlsm (Max 10MB)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <input
                    type="file"
                    accept=".xlsx,.xls,.xlsm"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" asChild>
                      <span>Choose File</span>
                    </Button>
                  </label>
                  {file && (
                    <p className="mt-4 text-sm text-muted-foreground">
                      Selected: {file.name}
                    </p>
                  )}
                </div>

                {file && !analyzing && !analysis && (
                  <Button onClick={analyzeFile} className="w-full mt-4" size="lg">
                    Analyze File
                  </Button>
                )}

                {analyzing && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Analyzing...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {analysis && (
              <div className="space-y-6 animate-fade-in">
                {/* Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Analysis Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Sheets</p>
                        <p className="text-2xl font-bold">{analysis.sheets.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Formulas</p>
                        <p className="text-2xl font-bold">{analysis.totalFormulas}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Errors Found</p>
                        <p className="text-2xl font-bold text-destructive">{analysis.errors.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Complexity</p>
                        <Badge variant={analysis.complexity === 'High' ? 'destructive' : analysis.complexity === 'Medium' ? 'default' : 'secondary'}>
                          {analysis.complexity}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Formula Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Formula Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(analysis.formulasByType)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 10)
                        .map(([formula, count]) => (
                          <div key={formula} className="flex items-center justify-between">
                            <span className="font-mono text-sm">{formula}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-32 bg-muted rounded-full h-2">
                                <div 
                                  className="bg-primary rounded-full h-2" 
                                  style={{ width: `${(count / analysis.totalFormulas) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm text-muted-foreground w-12 text-right">{count}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Errors */}
                {analysis.errors.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        Errors Found
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysis.errors.slice(0, 10).map((error, idx) => (
                          <Alert key={idx} variant="destructive">
                            <AlertDescription>
                              <span className="font-semibold">{error.sheet}!</span>
                              <span className="font-mono">{error.cell}</span>: {error.error}
                            </AlertDescription>
                          </Alert>
                        ))}
                        {analysis.errors.length > 10 && (
                          <p className="text-sm text-muted-foreground text-center mt-4">
                            And {analysis.errors.length - 10} more errors...
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* AI Suggestions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      Optimization Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.suggestions.map((suggestion, idx) => (
                        <Alert key={idx}>
                          <CheckCircle2 className="h-4 w-4" />
                          <AlertDescription>{suggestion}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}