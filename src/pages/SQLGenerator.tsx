import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Code2, Loader2, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet";

const SQLGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSQL, setGeneratedSQL] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateSQL = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a description",
        description: "Describe the SQL query you need",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-sql', {
        body: { prompt }
      });

      if (error) throw error;

      setGeneratedSQL(data.sql);
      toast({
        title: "SQL query generated!",
        description: "Your SQL query is ready",
      });
    } catch (error) {
      console.error('Error generating SQL:', error);
      toast({
        title: "Error generating SQL",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copySQL = async () => {
    try {
      await navigator.clipboard.writeText(generatedSQL);
      setCopied(true);
      toast({
        title: "SQL copied!",
        description: "SQL query has been copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>AI SQL Query Generator | Convert Text to SQL</title>
        <meta name="description" content="Convert your text instructions into SQL queries - powered by AI." />
      </Helmet>

      <Header />
      
      <section className="py-12 px-4 md:py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-foreground">
              AI SQL Query Generator
            </h1>
            <p className="text-lg text-muted-foreground">
              Convert your text instructions into SQL queries - powered by AI
            </p>
          </div>

          <Card className="border-2 border-border bg-card">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Code2 className="h-6 w-6 text-accent" />
                Generate SQL Query
              </CardTitle>
              <CardDescription>
                Describe what data you want to retrieve or manipulate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Example: Select all users who registered in the last 30 days and have made at least one purchase"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[150px]"
              />
              
              <Button
                onClick={generateSQL}
                disabled={isGenerating}
                className="w-full bg-accent hover:bg-accent/90"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating SQL...
                  </>
                ) : (
                  <>
                    <Code2 className="h-5 w-5 mr-2" />
                    Generate SQL Query
                  </>
                )}
              </Button>

              {generatedSQL && (
                <div className="space-y-3 mt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">Generated SQL:</h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copySQL}
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy SQL
                        </>
                      )}
                    </Button>
                  </div>
                  <Card className="bg-muted border-2 border-border">
                    <CardContent className="p-4">
                      <pre className="text-sm font-mono whitespace-pre-wrap text-foreground">
                        {generatedSQL}
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SQLGenerator;
