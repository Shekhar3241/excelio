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
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const UnifiedConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetFormat, setTargetFormat] = useState<string>("");
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast({
        title: "File selected",
        description: `${file.name} is ready for conversion`,
      });
    }
  };

  const extractFileContent = async (file: File): Promise<string> => {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    // PDF
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n\n';
      }
      return fullText;
    }

    // Excel
    if (fileType.includes('spreadsheet') || fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      let content = '';
      
      workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        content += `Sheet: ${sheetName}\n${XLSX.utils.sheet_to_csv(sheet)}\n\n`;
      });
      return content;
    }

    // Word (basic text extraction)
    if (fileType.includes('word') || fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      return await file.text();
    }

    // Images (return metadata)
    if (fileType.startsWith('image/')) {
      return `Image file: ${file.name}, Size: ${(file.size / 1024).toFixed(2)} KB, Type: ${fileType}`;
    }

    // Text files
    if (fileType.startsWith('text/') || fileName.endsWith('.txt') || fileName.endsWith('.csv')) {
      return await file.text();
    }

    return `File: ${file.name}, Type: ${fileType}, Size: ${(file.size / 1024).toFixed(2)} KB`;
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
      const fileContent = await extractFileContent(selectedFile);
      
      const { data, error } = await supabase.functions.invoke('ai-file-convert', {
        body: {
          fileContent,
          fileName: selectedFile.name,
          sourceType: selectedFile.type,
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
            <div className="border-2 border-dashed border-primary/40 rounded-lg p-8 text-center hover:border-primary/60 transition-colors">
              <input
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                accept="*/*"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <FileText className="w-12 h-12 text-primary/60" />
                <div>
                  <p className="text-sm font-medium">Click to upload any file</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, Excel, Word, Images, Text files supported
                  </p>
                </div>
              </label>
            </div>

            {selectedFile && (
              <div className="space-y-4">
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <p className="text-sm font-medium">Selected file:</p>
                  <p className="text-sm text-muted-foreground">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
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
                      setSelectedFile(null);
                      setTargetFormat("");
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
