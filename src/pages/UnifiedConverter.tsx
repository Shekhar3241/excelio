import { useState, useRef } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Download, FileText, Sparkles, Shield, Clock, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const UnifiedConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetFormat, setTargetFormat] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedFile(file);
    setTargetFormat("");
    toast({
      title: "✓ File selected",
      description: `${file.name} (${(file.size / 1024).toFixed(2)} KB) is ready for conversion`,
    });
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
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
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      const fileBase64 = await fileToBase64(selectedFile);
      
      const { data, error } = await supabase.functions.invoke('ai-file-convert', {
        body: {
          fileBase64,
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          targetFormat,
        }
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (error) throw error;

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
        title: "✓ Conversion successful!",
        description: `Your file has been converted to ${targetFormat.toUpperCase()}`,
      });

      setTimeout(() => {
        setSelectedFile(null);
        setTargetFormat("");
        setProgress(0);
      }, 1000);
    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: "Conversion failed",
        description: error instanceof Error ? error.message : "An error occurred during conversion",
        variant: "destructive",
      });
      setProgress(0);
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
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
      <Helmet>
        <title>AI File Converter - Convert Any File Format | ExcelFormulaBot</title>
        <meta name="description" content="Convert files between any format using AI. PDF to Excel, Word to PDF, Images to PDF, and more. Fast, accurate, and intelligent file conversion." />
      </Helmet>

      <Header />

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-3 mb-4 animate-in fade-in slide-in-from-top duration-500">
            <Sparkles className="w-12 h-12 text-primary animate-pulse" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              File Converter
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-top duration-700">
            Upload your file to get started
          </p>
          <p className="text-base text-muted-foreground animate-in fade-in slide-in-from-top duration-900">
            Click Convert and download your new file in seconds
          </p>
        </div>

        {/* Main Converter Card */}
        <Card className="shadow-2xl border-2 border-primary/20 backdrop-blur-sm bg-card/95 animate-in fade-in slide-in-from-bottom duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Upload className="w-6 h-6" />
              Upload & Convert
            </CardTitle>
            <CardDescription className="text-base">
              Drag and drop your file or click to browse
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer ${
                isDragging
                  ? "border-primary bg-primary/10 scale-105"
                  : "border-primary/40 hover:border-primary/60 hover:bg-primary/5"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileInputChange}
                className="hidden"
                accept="*/*"
              />
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20">
                  <FileText className="w-16 h-16 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground mb-2">
                    Drop your file here or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supported formats: PDF, DOCX, XLSX, JPG, PNG, TXT, CSV, MP3, MP4 (max 10MB)
                  </p>
                </div>
              </div>
            </div>

            {/* File Selected State */}
            {selectedFile && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top duration-300">
                <div className="p-5 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-l-4 border-primary rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        <p className="text-sm font-semibold text-primary">File ready for conversion</p>
                      </div>
                      <p className="text-base font-bold mb-1">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(2)} KB • {selectedFile.type || 'Unknown type'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Format Selection */}
                <div className="space-y-3">
                  <label className="text-base font-semibold">Select the output format:</label>
                  <Select value={targetFormat} onValueChange={setTargetFormat}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Choose target format..." />
                    </SelectTrigger>
                    <SelectContent>
                      {getFormatOptions().map((format) => (
                        <SelectItem key={format} value={format} className="text-base">
                          {format.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Progress Bar */}
                {isProcessing && (
                  <div className="space-y-2 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Converting...</span>
                      <span className="font-semibold text-primary">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleConvert}
                    disabled={isProcessing || !targetFormat}
                    className="flex-1 h-12 text-base bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 hover:scale-[1.02]"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5 mr-2" />
                        Convert & Download
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedFile(null);
                      setTargetFormat("");
                      setProgress(0);
                    }}
                    disabled={isProcessing}
                    className="h-12"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            { 
              icon: Sparkles, 
              title: "AI-Powered", 
              description: "Smart conversion using advanced AI technology for accurate results" 
            },
            { 
              icon: Clock, 
              title: "Lightning Fast", 
              description: "Convert between any file format in seconds with instant downloads" 
            },
            { 
              icon: Shield, 
              title: "Secure & Private", 
              description: "Your files are processed securely and automatically deleted" 
            },
          ].map((feature, idx) => (
            <Card key={idx} className="text-center border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg group">
              <CardContent className="pt-8 pb-6">
                <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <Card className="mt-12 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">Is this secure?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes! Your files are processed securely using encryption. All files are automatically deleted from our servers immediately after conversion. We never store or share your data.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">What file types are supported?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  We support a wide range of formats including documents (PDF, DOCX, TXT), spreadsheets (XLSX, CSV), images (JPG, PNG), audio (MP3), and video files (MP4). The available output formats depend on your input file type.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">How long does conversion take?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Most conversions complete in just a few seconds. The exact time depends on the file size and complexity. Files under 5MB typically convert in under 10 seconds.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">What's the file size limit?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  The maximum file size is 10MB. This ensures fast processing times and optimal performance for all users.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <div className="mt-8 p-6 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Your Privacy Matters</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your files are processed securely and automatically deleted after conversion. We use industry-standard encryption and never store your data. All conversions happen on secure servers, and your converted files are only accessible to you.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UnifiedConverter;
