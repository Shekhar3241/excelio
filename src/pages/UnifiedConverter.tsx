import { useState } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Download, FileText, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const UnifiedConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetFormat, setTargetFormat] = useState<string>("");
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File input triggered");
    const file = event.target.files?.[0];
    console.log("Selected file:", file);
    
    if (file) {
      console.log("File details:", {
        name: file.name,
        size: file.size,
        type: file.type
      });
      
      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        });
        event.target.value = ""; // Reset input
        return;
      }
      
      setSelectedFile(file);
      toast({
        title: "✓ File selected",
        description: `${file.name} (${(file.size / 1024).toFixed(2)} KB) is ready for conversion`,
      });
      
      // Reset input to allow selecting same file again
      event.target.value = "";
    } else {
      console.log("No file selected");
      toast({
        title: "No file selected",
        description: "Please try selecting a file again",
        variant: "destructive",
      });
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64Content = base64String.split(',')[1];
        resolve(base64Content);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleConvert = async () => {
    if (!selectedFile || !targetFormat) {
      toast({
        title: "Missing information",
        description: "Please select a file and target format",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Convert file to base64
      const fileBase64 = await fileToBase64(selectedFile);
      
      const { data, error } = await supabase.functions.invoke('ai-file-convert', {
        body: {
          fileBase64,
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          targetFormat,
        }
      });

      if (error) throw error;

      // Create and download the converted file
      const blob = new Blob([data.content], { 
        type: data.mimeType || 'text/plain' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.fileName || `converted.${targetFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Conversion successful!",
        description: `Your file has been converted to ${targetFormat}`,
      });

      setSelectedFile(null);
      setTargetFormat("");
    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: "Conversion failed",
        description: error instanceof Error ? error.message : "An error occurred during conversion",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getFormatOptions = () => {
    if (!selectedFile) return [];
    
    const fileName = selectedFile.name.toLowerCase();
    const fileType = selectedFile.type;

    // PDF source
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return ['excel', 'word', 'text', 'markdown', 'html'];
    }

    // Excel source
    if (fileType.includes('spreadsheet') || fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      return ['pdf', 'csv', 'text', 'html'];
    }

    // Word source
    if (fileType.includes('word') || fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      return ['pdf', 'text', 'markdown', 'html'];
    }

    // Image source
    if (fileType.startsWith('image/')) {
      return ['pdf', 'text-description'];
    }

    // Text/CSV source
    if (fileType.startsWith('text/') || fileName.endsWith('.txt') || fileName.endsWith('.csv')) {
      return ['pdf', 'excel', 'word', 'html', 'markdown'];
    }

    return ['pdf', 'text', 'excel', 'word'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Helmet>
        <title>AI File Converter - Convert Any File Format | ExcelFormulaBot</title>
        <meta name="description" content="Convert files between any format using AI. PDF to Excel, Word to PDF, Images to PDF, and more. Fast, accurate, and intelligent file conversion." />
      </Helmet>

      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-primary animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              AI File Converter
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Convert any file to any format using AI. Upload your file, select the target format, and let AI handle the conversion intelligently.
          </p>
        </div>

        <Card className="shadow-xl border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload & Convert
            </CardTitle>
            <CardDescription>
              Select your file and choose the format you want to convert to
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-primary/40 rounded-lg p-8 text-center hover:border-primary/60 hover:bg-primary/5 transition-all duration-200">
              <input
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                accept="*/*"
                key={selectedFile?.name || 'empty'}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-3 w-full"
              >
                <div className="p-3 rounded-full bg-primary/10">
                  <FileText className="w-12 h-12 text-primary" />
                </div>
                <div>
                  <p className="text-base font-semibold text-primary">Click here to upload your file</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    PDF, Excel, Word, Images, Text files supported (max 10MB)
                  </p>
                </div>
              </label>
            </div>

            {selectedFile && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-primary">✓ File ready for conversion</p>
                      <p className="text-sm font-semibold mt-1">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Size: {(selectedFile.size / 1024).toFixed(2)} KB | Type: {selectedFile.type || 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Convert to:</label>
                  <Select value={targetFormat} onValueChange={setTargetFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target format" />
                    </SelectTrigger>
                    <SelectContent>
                      {getFormatOptions().map((format) => (
                        <SelectItem key={format} value={format}>
                          {format.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleConvert}
                    disabled={isProcessing || !targetFormat}
                    className="flex-1"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Convert & Download
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      console.log("Resetting file selection");
                      setSelectedFile(null);
                      setTargetFormat("");
                      toast({
                        title: "Reset complete",
                        description: "You can now select a new file",
                      });
                    }}
                    disabled={isProcessing}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            { title: "AI-Powered", description: "Smart conversion using advanced AI" },
            { title: "Any Format", description: "Convert between any file format" },
            { title: "Instant Results", description: "Fast processing and download" },
          ].map((feature, idx) => (
            <Card key={idx} className="text-center">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UnifiedConverter;
