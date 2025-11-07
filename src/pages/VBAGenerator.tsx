import { useState } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Sparkles, Code2, BookOpen, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { supabase } from "@/integrations/supabase/client";

const commonTasks = [
  { id: 'custom', label: 'Custom Request', description: 'Describe your automation need' },
  { id: 'auto-email', label: 'Auto Email Sender', description: 'Send emails based on cell values' },
  { id: 'data-cleanup', label: 'Data Cleanup', description: 'Remove duplicates and format data' },
  { id: 'sheet-protection', label: 'Sheet Protection', description: 'Protect/unprotect multiple sheets' },
  { id: 'auto-backup', label: 'Auto Backup', description: 'Create automatic file backups' },
  { id: 'conditional-formatting', label: 'Conditional Formatting', description: 'Apply rules across ranges' },
  { id: 'import-data', label: 'Import External Data', description: 'Import from CSV/text files' },
  { id: 'chart-creator', label: 'Chart Creator', description: 'Generate charts from data ranges' }
];

export default function VBAGenerator() {
  const [selectedTask, setSelectedTask] = useState('custom');
  const [userPrompt, setUserPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [generating, setGenerating] = useState(false);

  const generateCode = async () => {
    if (!userPrompt.trim()) {
      toast.error("Please describe what you want to automate");
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-vba', {
        body: { 
          task: selectedTask,
          prompt: userPrompt 
        }
      });

      if (error) throw error;

      setGeneratedCode(data.code);
      setExplanation(data.explanation);
      toast.success("VBA code generated!");
    } catch (error) {
      console.error('Generation error:', error);
      toast.error("Failed to generate code. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast.success("Code copied to clipboard!");
  };

  return (
    <>
      <Helmet>
        <title>VBA Code Generator - AI-Powered Excel Macro Creator</title>
        <meta name="description" content="Generate VBA macros with AI. Automate Excel tasks, create custom functions, and get ready-to-use code with explanations." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                VBA Code Generator
              </h1>
              <p className="text-lg text-muted-foreground">
                AI-powered VBA script creation for Excel automation
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Input Panel */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code2 className="h-5 w-5 text-primary" />
                      Task Selection
                    </CardTitle>
                    <CardDescription>Choose a common task or describe your own</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Select value={selectedTask} onValueChange={setSelectedTask}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {commonTasks.map(task => (
                            <SelectItem key={task.id} value={task.id}>
                              {task.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground mt-2">
                        {commonTasks.find(t => t.id === selectedTask)?.description}
                      </p>
                    </div>

                    <div>
                      <Textarea
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                        placeholder="Describe what you want to automate in Excel. Be specific about the task, data ranges, and expected behavior..."
                        className="min-h-[200px]"
                      />
                    </div>

                    <Button 
                      onClick={generateCode} 
                      disabled={generating}
                      className="w-full gap-2"
                      size="lg"
                    >
                      {generating ? (
                        <>Generating...</>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Generate VBA Code
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* How to Use */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      How to Use Generated Code
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <span className="font-semibold text-primary">1.</span>
                        <span>Open Excel and press <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt + F11</kbd> to open VBA Editor</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-primary">2.</span>
                        <span>Insert a new module: Insert → Module</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-primary">3.</span>
                        <span>Copy and paste the generated code</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-primary">4.</span>
                        <span>Close VBA Editor and run the macro from Excel</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-primary">5.</span>
                        <span>Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt + F8</kbd> to see your macros</span>
                      </li>
                    </ol>
                  </CardContent>
                </Card>
              </div>

              {/* Output Panel */}
              <div className="space-y-6">
                {generatedCode && (
                  <>
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            Generated Code
                          </CardTitle>
                          <Button onClick={copyCode} variant="outline" size="sm" className="gap-2">
                            <Copy className="h-4 w-4" />
                            Copy
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-lg overflow-hidden">
                          <SyntaxHighlighter 
                            language="vbnet" 
                            style={vscDarkPlus}
                            customStyle={{
                              margin: 0,
                              borderRadius: '0.5rem',
                              fontSize: '0.875rem'
                            }}
                          >
                            {generatedCode}
                          </SyntaxHighlighter>
                        </div>
                      </CardContent>
                    </Card>

                    {explanation && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Code Explanation</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {explanation}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}

                {!generatedCode && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Popular VBA Tasks</CardTitle>
                      <CardDescription>Quick examples to get started</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="loops">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="loops">Loops</TabsTrigger>
                          <TabsTrigger value="formatting">Format</TabsTrigger>
                          <TabsTrigger value="data">Data</TabsTrigger>
                        </TabsList>
                        <TabsContent value="loops" className="mt-4">
                          <div className="space-y-2">
                            <p className="text-sm font-semibold">Example: Loop through rows</p>
                            <div className="rounded-lg overflow-hidden">
                              <SyntaxHighlighter 
                                language="vbnet" 
                                style={vscDarkPlus}
                                customStyle={{ margin: 0, fontSize: '0.75rem' }}
                              >
{`Sub LoopRows()
    Dim i As Long
    For i = 1 To 10
        Cells(i, 1).Value = "Row " & i
    Next i
End Sub`}
                              </SyntaxHighlighter>
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="formatting" className="mt-4">
                          <div className="space-y-2">
                            <p className="text-sm font-semibold">Example: Format cells</p>
                            <div className="rounded-lg overflow-hidden">
                              <SyntaxHighlighter 
                                language="vbnet" 
                                style={vscDarkPlus}
                                customStyle={{ margin: 0, fontSize: '0.75rem' }}
                              >
{`Sub FormatCells()
    Range("A1:A10").Font.Bold = True
    Range("A1:A10").Interior.Color = RGB(255, 255, 0)
End Sub`}
                              </SyntaxHighlighter>
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="data" className="mt-4">
                          <div className="space-y-2">
                            <p className="text-sm font-semibold">Example: Filter data</p>
                            <div className="rounded-lg overflow-hidden">
                              <SyntaxHighlighter 
                                language="vbnet" 
                                style={vscDarkPlus}
                                customStyle={{ margin: 0, fontSize: '0.75rem' }}
                              >
{`Sub FilterData()
    Range("A1").AutoFilter _
        Field:=1, Criteria1:=">100"
End Sub`}
                              </SyntaxHighlighter>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}