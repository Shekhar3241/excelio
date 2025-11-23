import { useState } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Download, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PdfToWord = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleConvert = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a PDF file to convert",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    toast({
      title: "Processing",
      description: "PDF to Word conversion is being processed...",
    });

    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Info",
        description: "Advanced conversion features coming soon!",
      });
    }, 2000);
  };

  const handleReset = () => {
    setFile(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>PDF to Word Converter - Convert PDF to DOCX Online</title>
        <meta name="description" content="Convert PDF documents to editable Word files online. Free PDF to DOCX converter with high accuracy." />
      </Helmet>

      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              PDF to Word Converter
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Convert PDF documents to editable Word files instantly
            </p>
          </div>

          <Alert className="border-accent/50 bg-accent/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-foreground">
              Advanced PDF to Word conversion with layout preservation coming soon!
            </AlertDescription>
          </Alert>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Upload PDF to Convert
              </CardTitle>
              <CardDescription>Select a PDF file to convert to Word format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-foreground font-medium mb-2">Click to upload a PDF file</p>
                  <p className="text-sm text-muted-foreground">or drag and drop</p>
                </label>
              </div>

              {file && (
                <div className="space-y-2">
                  <p className="font-medium text-foreground">Selected file:</p>
                  <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                    <FileText className="h-4 w-4 text-foreground" />
                    <span className="text-sm text-foreground">{file.name}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  onClick={handleConvert}
                  disabled={!file || isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? "Converting..." : "Convert to Word"}
                </Button>
                {file && (
                  <Button onClick={handleReset} variant="outline">
                    Reset
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">High Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Preserve formatting, fonts, and layout during conversion
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Secure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your files are processed securely and deleted after conversion
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Quick conversion with instant download of your Word file
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PdfToWord;
