import { useState } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Loader2, Download, ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const UnifiedConverter = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>("");
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFile, setConvertedFile] = useState<{ content: string; fileName: string; mimeType: string } | null>(null);

  const conversionOptions = [
    { value: "pdf", label: "Convert to PDF", from: ["docx", "xlsx", "pptx", "jpg", "png", "html", "txt"] },
    { value: "word", label: "Convert to Word (DOCX)", from: ["pdf", "txt", "html"] },
    { value: "excel", label: "Convert to Excel (XLSX)", from: ["pdf", "csv"] },
    { value: "powerpoint", label: "Convert to PowerPoint (PPTX)", from: ["pdf"] },
    { value: "jpg", label: "Convert to JPG", from: ["pdf", "png", "webp"] },
    { value: "text", label: "Convert to Text", from: ["pdf", "docx"] },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setConvertedFile(null);
      setTargetFormat("");
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]);
      };
      reader.onerror = reject;
    });
  };

  const handleConvert = async () => {
    if (!selectedFile || !targetFormat) {
      toast({
        title: "Missing Information",
        description: "Please select a file and target format",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);

    try {
      const fileBase64 = await fileToBase64(selectedFile);
      
      const { data, error } = await supabase.functions.invoke('cloudconvert-file', {
        body: {
          fileBase64,
          fileName: selectedFile.name,
          targetFormat,
        },
      });

      if (error) throw error;

      if (data && data.content) {
        setConvertedFile({
          content: data.content,
          fileName: data.fileName,
          mimeType: data.mimeType,
        });
        toast({
          title: "Conversion Successful!",
          description: `Your file has been converted to ${targetFormat.toUpperCase()}`,
        });
      }
    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: "Conversion Failed",
        description: error instanceof Error ? error.message : "Failed to convert file",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!convertedFile) return;

    const byteCharacters = atob(convertedFile.content);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: convertedFile.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = convertedFile.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getAvailableFormats = () => {
    if (!selectedFile) return [];
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase() || '';
    return conversionOptions.filter(option => 
      option.from.includes(fileExtension)
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>ConvertX - Free File Converter | Convert PDF, Word, Excel, Images</title>
        <meta name="description" content="Free online file converter. Convert PDF to Word, Excel to PDF, images to PDF, and more. Fast, secure, and easy to use." />
      </Helmet>
      
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              ConvertX
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Convert your files instantly. Support for PDF, Word, Excel, PowerPoint, images, and more.
            </p>
          </div>

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                File Converter
              </CardTitle>
              <CardDescription>
                Upload your file and select the output format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload */}
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.docx,.xlsx,.pptx,.jpg,.jpeg,.png,.txt,.html,.csv"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">
                    {selectedFile ? selectedFile.name : "Click to upload file"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports: PDF, Word, Excel, PowerPoint, Images, Text, HTML
                  </p>
                </label>
              </div>

              {/* Format Selection */}
              {selectedFile && (
                <div className="space-y-2 animate-fade-in">
                  <label className="text-sm font-medium">Convert to:</label>
                  <Select value={targetFormat} onValueChange={setTargetFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select output format" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableFormats().map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                {!convertedFile ? (
                  <Button
                    onClick={handleConvert}
                    disabled={!selectedFile || !targetFormat || isConverting}
                    className="flex-1"
                    size="lg"
                  >
                    {isConverting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      <>
                        Convert File
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleDownload}
                      className="flex-1"
                      size="lg"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Converted File
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedFile(null);
                        setConvertedFile(null);
                        setTargetFormat("");
                      }}
                      variant="outline"
                      size="lg"
                    >
                      Convert Another File
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fast & Secure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  All conversions are processed securely and quickly using cloud infrastructure.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Multiple Formats</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Support for PDF, Word, Excel, PowerPoint, images, and more file formats.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">No Installation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Convert files directly in your browser. No software installation required.
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

export default UnifiedConverter;
