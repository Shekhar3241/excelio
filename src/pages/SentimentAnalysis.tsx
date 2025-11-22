import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Smile, Frown, Meh, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet";

interface SentimentResult {
  text: string;
  sentiment: "positive" | "negative" | "neutral";
  confidence: number;
}

const SentimentAnalysis = () => {
  const [textInput, setTextInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<SentimentResult[]>([]);
  const { toast } = useToast();

  const analyzeSentiment = async () => {
    if (!textInput.trim()) {
      toast({
        title: "Please enter text",
        description: "Enter text to analyze sentiment",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-sentiment', {
        body: { texts: textInput.split('\n').filter(t => t.trim()) }
      });

      if (error) throw error;

      setResults(data.results);
      toast({
        title: "Analysis complete!",
        description: `Analyzed ${data.results.length} text(s)`,
      });
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      toast({
        title: "Error analyzing sentiment",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <Smile className="h-6 w-6 text-green-500" />;
      case "negative":
        return <Frown className="h-6 w-6 text-red-500" />;
      default:
        return <Meh className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "border-green-500/50 bg-green-500/10";
      case "negative":
        return "border-red-500/50 bg-red-500/10";
      default:
        return "border-yellow-500/50 bg-yellow-500/10";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>AI Sentiment Analysis Tool | Analyze Text Sentiment</title>
        <meta name="description" content="Upload text or files to generate sentiment analysis - positive, negative or neutral using AI." />
      </Helmet>

      <Header />
      
      <section className="py-12 px-4 md:py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-foreground">
              AI Sentiment Analysis Tool
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload a file or list of text to generate the sentiment - positive, negative or neutral
            </p>
          </div>

          <Card className="border-2 border-border bg-card">
            <CardHeader>
              <CardTitle className="text-2xl">Analyze Text Sentiment</CardTitle>
              <CardDescription>
                Enter text (one per line) to analyze sentiment using AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter text to analyze (one per line)&#10;Example:&#10;This product is amazing!&#10;I'm not satisfied with the service.&#10;The quality is okay."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="min-h-[200px] font-mono"
              />
              
              <div className="flex gap-2">
                <Button
                  onClick={analyzeSentiment}
                  disabled={isAnalyzing}
                  className="flex-1 bg-accent hover:bg-accent/90"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Smile className="h-5 w-5 mr-2" />
                      Analyze Sentiment
                    </>
                  )}
                </Button>
              </div>

              {results.length > 0 && (
                <div className="space-y-3 mt-6">
                  <h3 className="font-bold text-lg">Results:</h3>
                  {results.map((result, index) => (
                    <Card key={index} className={`border-2 ${getSentimentColor(result.sentiment)}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          {getSentimentIcon(result.sentiment)}
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-2">{result.text}</p>
                            <div className="flex items-center gap-2">
                              <span className="font-bold capitalize">{result.sentiment}</span>
                              <span className="text-sm text-muted-foreground">
                                ({Math.round(result.confidence * 100)}% confidence)
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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

export default SentimentAnalysis;
