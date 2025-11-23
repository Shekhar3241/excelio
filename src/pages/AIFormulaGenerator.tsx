import { useState } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Download, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AIFormulaGenerator = () => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a description for your image",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (imageUrl) {
        setGeneratedImage(imageUrl);
        toast({
          title: "Success",
          description: "Image generated successfully!",
        });
      } else {
        throw new Error("No image in response");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = "ai-generated-image.png";
    link.click();
  };

  const examplePrompts = [
    "A futuristic city with flying cars at sunset",
    "A cute robot reading a book in a cozy library",
    "Mountain landscape with aurora borealis in the night sky",
    "Abstract art with vibrant colors and geometric shapes",
    "A magical forest with glowing mushrooms and fireflies",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>AI Image Generator - Create Stunning Images from Text</title>
        <meta
          name="description"
          content="Generate beautiful images from text descriptions using AI. Create illustrations, photos, and artwork instantly."
        />
      </Helmet>

      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-4 animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-3 px-4 py-2 bg-accent/20 rounded-full animate-scale-in">
              <Sparkles className="h-5 w-5 text-accent animate-pulse" />
              <span className="text-sm font-semibold text-accent">AI-Powered</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              AI Image Generator
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform your ideas into stunning visuals with AI
            </p>
          </div>

          <Card className="p-6 border-2 border-border shadow-xl animate-scale-in">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">
                  Describe the image you want to create
                </label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A serene beach at sunset with palm trees..."
                  className="min-h-[100px] text-base"
                />
              </div>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                size="lg"
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating Image...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>
            </div>
          </Card>

          {generatedImage && (
            <Card className="p-6 border-2 border-accent/30 bg-card animate-fade-in">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-accent" />
                    Generated Image
                  </h2>
                  <Button onClick={handleDownload} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="rounded-lg overflow-hidden border-2 border-border">
                  <img
                    src={generatedImage}
                    alt="AI Generated"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </Card>
          )}

          <Card className="p-6 bg-card animate-fade-in">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              Try these example prompts:
            </h3>
            <div className="grid gap-2">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="text-left p-3 bg-background rounded-md hover:bg-accent/20 transition-all duration-300 hover:scale-[1.02] text-sm border border-border hover:border-accent text-foreground"
                >
                  {example}
                </button>
              ))}
            </div>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "High Quality", desc: "AI-generated images in high resolution" },
              { title: "Unlimited Ideas", desc: "Create as many images as you want" },
              { title: "Instant Results", desc: "Get your images in seconds" },
            ].map((feature, i) => (
              <Card
                key={i}
                className="p-4 border-border bg-card hover:border-accent transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AIFormulaGenerator;
