import { useState } from "react";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Table, Image, Code, FileSpreadsheet, Zap, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import convertxLogo from "@/assets/convertx-logo.png";

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
  { id: "word-to-pdf", name: "Word to PDF", description: "Convert Word documents to PDF", icon: FileText, color: "#E74C3C", from: "docx,doc", to: "pdf", category: "to-pdf" },
  { id: "excel-to-pdf", name: "Excel to PDF", description: "Convert Excel spreadsheets to PDF", icon: Table, color: "#27AE60", from: "xlsx,xls", to: "pdf", category: "to-pdf" },
  { id: "ppt-to-pdf", name: "PowerPoint to PDF", description: "Convert presentations to PDF", icon: FileText, color: "#E67E22", from: "pptx,ppt", to: "pdf", category: "to-pdf" },
  { id: "image-to-pdf", name: "Image to PDF", description: "Convert JPG, PNG images to PDF", icon: Image, color: "#9B59B6", from: "jpg,jpeg,png", to: "pdf", category: "to-pdf" },
  { id: "html-to-pdf", name: "HTML to PDF", description: "Convert web pages to PDF", icon: Code, color: "#3498DB", from: "html,htm", to: "pdf", category: "to-pdf" },
  
  // Convert FROM PDF
  { id: "pdf-to-word", name: "PDF to Word", description: "Convert PDF to editable Word document", icon: FileText, color: "#2980B9", from: "pdf", to: "word", category: "from-pdf" },
  { id: "pdf-to-excel", name: "PDF to Excel", description: "Extract tables from PDF to Excel", icon: Table, color: "#16A085", from: "pdf", to: "excel", category: "from-pdf" },
  { id: "pdf-to-ppt", name: "PDF to PowerPoint", description: "Convert PDF to presentation slides", icon: FileText, color: "#D35400", from: "pdf", to: "powerpoint", category: "from-pdf" },
  { id: "pdf-to-jpg", name: "PDF to JPG", description: "Convert PDF pages to images", icon: Image, color: "#8E44AD", from: "pdf", to: "jpg", category: "from-pdf" },
  
  // Image conversions
  { id: "jpg-to-png", name: "JPG to PNG", description: "Convert JPG images to PNG format", icon: Image, color: "#1ABC9C", from: "jpg,jpeg", to: "png", category: "image" },
  { id: "png-to-jpg", name: "PNG to JPG", description: "Convert PNG images to JPG format", icon: Image, color: "#F39C12", from: "png", to: "jpg", category: "image" },
  
  // Document conversions
  { id: "word-to-html", name: "Word to HTML", description: "Convert Word to web page", icon: Code, color: "#34495E", from: "docx,doc", to: "html", category: "document" },
  { id: "excel-to-csv", name: "Excel to CSV", description: "Convert Excel to CSV format", icon: FileSpreadsheet, color: "#2ECC71", from: "xlsx,xls", to: "csv", category: "document" },
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
  const [selectedFormat, setSelectedFormat] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFile, setConvertedFile] = useState<{ content: string; fileName: string; mimeType: string } | null>(null);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const { toast } = useToast();

  // Available output formats
  const outputFormats = [
    { value: "pdf", label: "PDF Document" },
    { value: "word", label: "Word Document" },
    { value: "excel", label: "Excel Spreadsheet" },
    { value: "powerpoint", label: "PowerPoint Presentation" },
    { value: "jpg", label: "JPG Image" },
    { value: "png", label: "PNG Image" },
    { value: "html", label: "HTML Webpage" },
    { value: "csv", label: "CSV Data" },
  ];

  const filteredTools = selectedCategory === "all" 
    ? conversionTools 
    : conversionTools.filter(tool => tool.category === selectedCategory);

  const handleToolClick = (tool: ConversionTool) => {
    setSelectedFormat(tool.to);
    setSelectedFile(null);
    setConvertedFile(null);
    setIsToolsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    if (!selectedFile || !selectedFormat) {
      toast({
        title: "Missing information",
        description: "Please select a file and output format",
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
          targetFormat: selectedFormat,
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
      
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0a1f1f] via-[#0d2a2a] to-[#0a1f1f]">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16 max-w-4xl mx-auto">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img 
                src={convertxLogo} 
                alt="ConvertX" 
                className="h-24 w-auto animate-fade-in"
              />
            </div>
            
            {/* Lightning Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00d4ff]/30 bg-[#00d4ff]/5 mb-8 animate-pulse">
              <Zap className="h-4 w-4 text-[#00d4ff]" />
              <span className="text-sm font-semibold text-[#00d4ff]">Lightning Fast Conversions</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
              <span className="text-white">Convert Any File to</span>
              <br />
              <span className="text-[#00d4ff] drop-shadow-[0_0_30px_rgba(0,212,255,0.5)]">Any Format</span>
            </h1>

            <p className="text-xl text-gray-400 mb-12">
              Fast, secure, and completely free. Transform your files in seconds.
            </p>

            {/* Main Upload Area */}
            <div 
              className="border-2 border-dashed border-[#00d4ff]/30 rounded-2xl p-16 bg-[#0d2a2a]/30 backdrop-blur-sm hover:border-[#00d4ff]/60 transition-all duration-300 cursor-pointer group"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload-main"
              />
              <label htmlFor="file-upload-main" className="cursor-pointer block">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-[#00d4ff]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Upload className="h-10 w-10 text-[#00d4ff]" />
                  </div>
                  {!selectedFile ? (
                    <>
                      <p className="text-2xl font-bold text-white mb-2">
                        Drop your file here or click to browse
                      </p>
                      <p className="text-gray-400">
                        Supports all major file formats
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-[#00d4ff] mb-2">
                        {selectedFile.name}
                      </p>
                      <p className="text-gray-400">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </>
                  )}
                </div>
              </label>
            </div>

            {/* Format Selector and Convert Button */}
            {selectedFile && (
              <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4">
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger className="flex-1 h-14 text-lg bg-[#0d2a2a]/50 border-[#00d4ff]/30 text-white hover:border-[#00d4ff] transition-colors">
                    <SelectValue placeholder="Select output format" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0d2a2a] border-[#00d4ff]/30">
                    {outputFormats.map((format) => (
                      <SelectItem 
                        key={format.value} 
                        value={format.value}
                        className="text-white hover:bg-[#00d4ff]/10 hover:text-[#00d4ff] cursor-pointer"
                      >
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {!convertedFile ? (
                  <Button
                    onClick={handleConvert}
                    disabled={!selectedFormat || isConverting}
                    size="lg"
                    className="h-14 px-8 text-lg font-bold bg-[#00d4ff] text-[#0a1f1f] hover:bg-[#00d4ff]/90 hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all duration-300"
                  >
                    {isConverting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0a1f1f] mr-2" />
                        Converting...
                      </>
                    ) : (
                      'Convert Now'
                    )}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleDownload} 
                    size="lg"
                    className="h-14 px-8 text-lg font-bold bg-[#00d4ff] text-[#0a1f1f] hover:bg-[#00d4ff]/90 hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all duration-300"
                  >
                    Download File
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* All Tools Section - Collapsible */}
          <div className="max-w-7xl mx-auto mt-24">
            <Collapsible open={isToolsOpen} onOpenChange={setIsToolsOpen}>
              <div className="text-center mb-8">
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="text-lg font-semibold border-[#00d4ff]/30 text-[#00d4ff] hover:bg-[#00d4ff]/10 hover:border-[#00d4ff] transition-all"
                  >
                    Browse All Tools ({conversionTools.length})
                    <ChevronDown className={`ml-2 h-5 w-5 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent className="space-y-8">
                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`rounded-full ${
                        selectedCategory === category.id 
                          ? 'bg-[#00d4ff] text-[#0a1f1f] hover:bg-[#00d4ff]/90' 
                          : 'border-[#00d4ff]/30 text-white hover:bg-[#00d4ff]/10 hover:border-[#00d4ff]'
                      }`}
                    >
                      {category.label}
                    </Button>
                  ))}
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredTools.map((tool) => {
                    const IconComponent = tool.icon;
                    return (
                      <Card
                        key={tool.id}
                        className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-[#00d4ff]/20 hover:-translate-y-2 border-[#00d4ff]/20 bg-[#0d2a2a]/50 backdrop-blur-sm overflow-hidden group"
                        onClick={() => handleToolClick(tool)}
                      >
                        <CardContent className="p-6">
                          <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                            style={{ backgroundColor: tool.color }}
                          >
                            <IconComponent className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-lg font-bold mb-2 text-white">{tool.name}</h3>
                          <p className="text-sm text-gray-400">{tool.description}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Features Section */}
          <div className="mt-32 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6 rounded-2xl bg-[#0d2a2a]/30 backdrop-blur-sm border border-[#00d4ff]/10">
              <div className="w-16 h-16 rounded-full bg-[#00d4ff]/10 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-[#00d4ff]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Lightning Fast</h3>
              <p className="text-gray-400">Convert files in seconds with our powerful cloud processing</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-[#0d2a2a]/30 backdrop-blur-sm border border-[#00d4ff]/10">
              <div className="w-16 h-16 rounded-full bg-[#00d4ff]/10 flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-[#00d4ff]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Secure & Private</h3>
              <p className="text-gray-400">Your files are automatically deleted after conversion</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-[#0d2a2a]/30 backdrop-blur-sm border border-[#00d4ff]/10">
              <div className="w-16 h-16 rounded-full bg-[#00d4ff]/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-[#00d4ff]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">All Formats</h3>
              <p className="text-gray-400">Support for PDF, Word, Excel, Images and more</p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default UnifiedConverter;
