import { useState, useRef } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  FileStack, 
  Scissors, 
  Minimize2, 
  Image, 
  ArrowRight, 
  Edit3, 
  PenTool, 
  Droplet, 
  RotateCw, 
  Lock, 
  Unlock, 
  FileType, 
  FileSpreadsheet, 
  Presentation, 
  Table2, 
  Grid3x3, 
  Trash2, 
  FileOutput,
  Upload,
  X,
  Download,
  Loader2
} from "lucide-react";

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: any;
  isNew?: boolean;
  targetFormat?: string;
  acceptFiles?: string;
}

const tools: Tool[] = [
  { id: "pdf-to-word", name: "PDF to Word", description: "Convert PDF to Word document", icon: FileType, isNew: true, targetFormat: "word", acceptFiles: ".pdf" },
  { id: "pdf-to-excel", name: "PDF to Excel", description: "Convert PDF tables to Excel", icon: FileSpreadsheet, isNew: true, targetFormat: "excel", acceptFiles: ".pdf" },
  { id: "pdf-to-powerpoint", name: "PDF to PowerPoint", description: "Convert PDF to presentation", icon: Presentation, isNew: true, targetFormat: "powerpoint", acceptFiles: ".pdf" },
  { id: "pdf-to-jpg", name: "PDF to JPG", description: "Convert PDF pages to images", icon: Image, targetFormat: "jpg", acceptFiles: ".pdf" },
  { id: "word-to-pdf", name: "Word to PDF", description: "Convert Word to PDF", icon: FileType, targetFormat: "pdf", acceptFiles: ".doc,.docx" },
  { id: "excel-to-pdf", name: "Excel to PDF", description: "Convert spreadsheet to PDF", icon: FileSpreadsheet, targetFormat: "pdf", acceptFiles: ".xls,.xlsx" },
  { id: "powerpoint-to-pdf", name: "PowerPoint to PDF", description: "Convert presentation to PDF", icon: Presentation, targetFormat: "pdf", acceptFiles: ".ppt,.pptx" },
  { id: "jpg-to-pdf", name: "JPG to PDF", description: "Convert images to PDF", icon: ArrowRight, targetFormat: "pdf", acceptFiles: "image/*" },
  { id: "compress", name: "Compress PDF", description: "Reduce PDF file size", icon: Minimize2, targetFormat: "compressed-pdf", acceptFiles: ".pdf" },
  { id: "merge", name: "Merge PDF", description: "Combine multiple PDFs into one", icon: FileStack, targetFormat: "merged-pdf", acceptFiles: ".pdf" },
  { id: "split", name: "Split PDF", description: "Extract pages from PDF", icon: Scissors, targetFormat: "split-pdf", acceptFiles: ".pdf" },
  { id: "rotate", name: "Rotate PDF", description: "Rotate PDF pages", icon: RotateCw, targetFormat: "rotated-pdf", acceptFiles: ".pdf" },
  { id: "watermark", name: "Watermark PDF", description: "Add watermark to PDF pages", icon: Droplet, targetFormat: "watermarked-pdf", acceptFiles: ".pdf" },
  { id: "edit", name: "Edit PDF", description: "Add text and shapes to PDF", icon: Edit3, targetFormat: "edited-pdf", acceptFiles: ".pdf" },
  { id: "sign", name: "Sign PDF", description: "Add your signature to PDF", icon: PenTool, targetFormat: "signed-pdf", acceptFiles: ".pdf" },
  { id: "protect", name: "Protect PDF", description: "Add password to PDF", icon: Lock, targetFormat: "protected-pdf", acceptFiles: ".pdf" },
  { id: "unlock", name: "Unlock PDF", description: "Remove PDF password", icon: Unlock, targetFormat: "unlocked-pdf", acceptFiles: ".pdf" },
  { id: "organize", name: "Organize PDF", description: "Reorder PDF pages", icon: Grid3x3, targetFormat: "organized-pdf", acceptFiles: ".pdf" },
  { id: "delete", name: "Delete Pages", description: "Remove pages from PDF", icon: Trash2, targetFormat: "trimmed-pdf", acceptFiles: ".pdf" },
  { id: "extract", name: "Extract Pages", description: "Extract specific pages", icon: FileOutput, targetFormat: "extracted-pdf", acceptFiles: ".pdf" },
];

const UnifiedConverter = () => {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleToolClick = (tool: Tool) => {
    setSelectedTool(tool);
    setSelectedFile(null);
    setProgress(0);
  };

  const handleCloseModal = () => {
    setSelectedTool(null);
    setSelectedFile(null);
    setProgress(0);
  };

  const handleFileSelect = (file: File) => {
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
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFileSelect(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
    if (file) handleFileSelect(file);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        const base64Content = base64String.split(',')[1];
        resolve(base64Content);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleConvert = async () => {
    if (!selectedFile || !selectedTool) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? 90 : prev + 10));
      }, 300);

      const fileBase64 = await fileToBase64(selectedFile);
      
      const { data, error } = await supabase.functions.invoke('ai-file-convert', {
        body: {
          fileBase64,
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          targetFormat: selectedTool.targetFormat,
        }
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (error) throw error;

      const blob = new Blob([data.content], { type: data.mimeType || 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.fileName || `converted.${selectedTool.targetFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "✓ Conversion successful!",
        description: `Your file has been converted`,
      });

      setTimeout(() => {
        handleCloseModal();
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

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>ConvertX - 27 Free PDF Tools | Manage, Edit & Convert PDFs Online</title>
        <meta name="description" content="Free online PDF tools to merge, split, compress, convert, edit, sign, and manage PDF files directly in your browser. No software installation required." />
      </Helmet>

      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Every PDF tool you'll ever need
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            All the PDF tools you need in one place. Free, secure, and easy to use.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {tools.map((tool) => (
            <Card
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              className="relative group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border bg-card"
            >
              {tool.isNew && (
                <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground hover:bg-destructive px-2 py-1 text-xs font-semibold">
                  New!
                </Badge>
              )}
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-transparent">
                    <tool.icon className="w-8 h-8 text-destructive" strokeWidth={1.5} />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Conversion Modal */}
        {selectedTool && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <selectedTool.icon className="w-6 h-6 text-destructive" />
                  <h2 className="text-xl font-bold">{selectedTool.name}</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseModal}
                  disabled={isProcessing}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <CardContent className="p-6 space-y-6">
                {/* Upload Area */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                    isDragging
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/60"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileInputChange}
                    className="hidden"
                    accept={selectedTool.acceptFiles}
                  />
                  <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-base font-semibold mb-1">
                    {selectedFile ? selectedFile.name : "Drop your file here or click to browse"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedFile 
                      ? `${(selectedFile.size / 1024).toFixed(2)} KB`
                      : `Max file size: 10MB`
                    }
                  </p>
                </div>

                {/* Progress */}
                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Converting...</span>
                      <span className="font-semibold text-primary">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleConvert}
                    disabled={!selectedFile || isProcessing}
                    className="flex-1 h-11"
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
                    onClick={handleCloseModal}
                    disabled={isProcessing}
                    className="h-11"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default UnifiedConverter;
