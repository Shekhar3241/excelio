import { useState } from "react";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, FileText, Table, Image, Code, FileSpreadsheet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ConversionTool {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  from: string;
  to: string;
  category: string;
}

const conversionTools: ConversionTool[] = [
  // Convert TO PDF
  { id: "word-to-pdf", name: "Word to PDF", description: "Convert Word documents to PDF", icon: FileText, color: "#E74C3C", from: "docx", to: "pdf", category: "to-pdf" },
  { id: "excel-to-pdf", name: "Excel to PDF", description: "Convert Excel spreadsheets to PDF", icon: Table, color: "#27AE60", from: "xlsx", to: "pdf", category: "to-pdf" },
  { id: "ppt-to-pdf", name: "PowerPoint to PDF", description: "Convert presentations to PDF", icon: FileText, color: "#E67E22", from: "pptx", to: "pdf", category: "to-pdf" },
  { id: "image-to-pdf", name: "Image to PDF", description: "Convert JPG, PNG images to PDF", icon: Image, color: "#9B59B6", from: "jpg", to: "pdf", category: "to-pdf" },
  { id: "html-to-pdf", name: "HTML to PDF", description: "Convert web pages to PDF", icon: Code, color: "#3498DB", from: "html", to: "pdf", category: "to-pdf" },
  
  // Convert FROM PDF
  { id: "pdf-to-word", name: "PDF to Word", description: "Convert PDF to editable Word document", icon: FileText, color: "#2980B9", from: "pdf", to: "word", category: "from-pdf" },
  { id: "pdf-to-excel", name: "PDF to Excel", description: "Extract tables from PDF to Excel", icon: Table, color: "#16A085", from: "pdf", to: "excel", category: "from-pdf" },
  { id: "pdf-to-ppt", name: "PDF to PowerPoint", description: "Convert PDF to presentation slides", icon: FileText, color: "#D35400", from: "pdf", to: "powerpoint", category: "from-pdf" },
  { id: "pdf-to-jpg", name: "PDF to JPG", description: "Convert PDF pages to images", icon: Image, color: "#8E44AD", from: "pdf", to: "jpg", category: "from-pdf" },
  
  // Image conversions
  { id: "jpg-to-png", name: "JPG to PNG", description: "Convert JPG images to PNG format", icon: Image, color: "#1ABC9C", from: "jpg", to: "png", category: "image" },
  { id: "png-to-jpg", name: "PNG to JPG", description: "Convert PNG images to JPG format", icon: Image, color: "#F39C12", from: "png", to: "jpg", category: "image" },
  
  // Document conversions
  { id: "word-to-html", name: "Word to HTML", description: "Convert Word to web page", icon: Code, color: "#34495E", from: "docx", to: "html", category: "document" },
  { id: "excel-to-csv", name: "Excel to CSV", description: "Convert Excel to CSV format", icon: FileSpreadsheet, color: "#2ECC71", from: "xlsx", to: "csv", category: "document" },
];

const categories = [
  { id: "all", label: "All Tools" },
  { id: "to-pdf", label: "Convert to PDF" },
  { id: "from-pdf", label: "Convert from PDF" },
  { id: "image", label: "Image Tools" },
  { id: "document", label: "Document Tools" },
];

const UnifiedConverter = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTool, setSelectedTool] = useState<ConversionTool | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFile, setConvertedFile] = useState<{ content: string; fileName: string; mimeType: string } | null>(null);
  const { toast } = useToast();

  const filteredTools = selectedCategory === "all" 
    ? conversionTools 
    : conversionTools.filter(tool => tool.category === selectedCategory);

  const handleToolClick = (tool: ConversionTool) => {
    setSelectedTool(tool);
    setSelectedFile(null);
    setConvertedFile(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setConvertedFile(null);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleConvert = async () => {
    if (!selectedFile || !selectedTool) {
      toast({
        title: "Missing file",
        description: "Please select a file to convert",
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
          targetFormat: selectedTool.to,
        },
      });

      if (error) throw error;

      if (data?.content) {
        setConvertedFile({
          content: data.content,
          fileName: data.fileName,
          mimeType: data.mimeType,
        });
        toast({
          title: "Conversion successful!",
          description: "Your file has been converted successfully.",
        });
      }
    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: "Conversion failed",
        description: error instanceof Error ? error.message : "An error occurred during conversion",
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
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = convertedFile.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setConvertedFile(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>ConvertX - Free Online File Converter | SkillBI's Hub</title>
        <meta name="description" content="Convert files online for free. PDF, Word, Excel, PowerPoint, Images - all formats supported. Fast and secure file conversion." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              ConvertX
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Convert your files online for free. Fast, secure, and easy to use.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="rounded-full"
              >
                {category.label}
              </Button>
            ))}
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {filteredTools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Card
                  key={tool.id}
                  className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 overflow-hidden group"
                  onClick={() => handleToolClick(tool)}
                >
                  <CardContent className="p-6">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: tool.color }}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-foreground">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Features Section */}
          <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Conversion</h3>
              <p className="text-muted-foreground">Convert files in seconds with our powerful cloud processing</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
              <p className="text-muted-foreground">Your files are automatically deleted after conversion</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Table className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">All Formats</h3>
              <p className="text-muted-foreground">Support for PDF, Word, Excel, Images and more</p>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* Conversion Dialog */}
      <Dialog open={!!selectedTool} onOpenChange={() => setSelectedTool(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedTool && (
                <>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: selectedTool.color }}
                  >
                    <selectedTool.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xl">{selectedTool.name}</div>
                    <div className="text-sm text-muted-foreground font-normal">{selectedTool.description}</div>
                  </div>
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* File Upload Area */}
            <div
              className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload-dialog"
                accept={selectedTool ? `.${selectedTool.from}` : "*"}
              />
              <label htmlFor="file-upload-dialog" className="cursor-pointer block">
                <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">
                  {selectedFile ? selectedFile.name : "Drop your file here or click to browse"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedTool && `Accepts: ${selectedTool.from.toUpperCase()} files`}
                </p>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!convertedFile ? (
                <Button
                  onClick={handleConvert}
                  disabled={!selectedFile || isConverting}
                  className="flex-1"
                  size="lg"
                >
                  {isConverting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Converting...
                    </>
                  ) : (
                    `Convert to ${selectedTool?.to.toUpperCase()}`
                  )}
                </Button>
              ) : (
                <Button onClick={handleDownload} className="flex-1" size="lg">
                  Download {selectedTool?.to.toUpperCase()} File
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UnifiedConverter;
