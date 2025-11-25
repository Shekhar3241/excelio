import { useState } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  FileOutput 
} from "lucide-react";

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: any;
  isNew?: boolean;
  comingSoon?: boolean;
}

const tools: Tool[] = [
  { id: "merge", name: "Merge PDF", description: "Combine multiple PDFs into one", icon: FileStack, isNew: true },
  { id: "split", name: "Split PDF", description: "Extract pages from PDF", icon: Scissors, isNew: true },
  { id: "compress", name: "Compress PDF", description: "Reduce PDF file size", icon: Minimize2, isNew: true },
  { id: "pdf-to-jpg", name: "PDF to JPG", description: "Convert PDF pages to images", icon: Image },
  { id: "jpg-to-pdf", name: "JPG to PDF", description: "Convert images to PDF", icon: ArrowRight },
  { id: "edit", name: "Edit PDF", description: "Add text and shapes to PDF", icon: Edit3 },
  { id: "sign", name: "Sign PDF", description: "Add your signature to PDF", icon: PenTool },
  { id: "watermark", name: "Watermark PDF", description: "Add watermark to PDF pages", icon: Droplet },
  { id: "rotate", name: "Rotate PDF", description: "Rotate PDF pages", icon: RotateCw },
  { id: "protect", name: "Protect PDF", description: "Add password to PDF", icon: Lock },
  { id: "unlock", name: "Unlock PDF", description: "Remove PDF password", icon: Unlock },
  { id: "pdf-to-word", name: "PDF to Word", description: "Convert PDF to Word document", icon: FileType },
  { id: "word-to-pdf", name: "Word to PDF", description: "Convert Word to PDF", icon: FileType },
  { id: "pdf-to-powerpoint", name: "PDF to PowerPoint", description: "Convert PDF to presentation", icon: Presentation },
  { id: "powerpoint-to-pdf", name: "PowerPoint to PDF", description: "Convert presentation to PDF", icon: Presentation },
  { id: "pdf-to-excel", name: "PDF to Excel", description: "Convert PDF tables to Excel", icon: FileSpreadsheet },
  { id: "excel-to-pdf", name: "Excel to PDF", description: "Convert spreadsheet to PDF", icon: FileSpreadsheet },
  { id: "organize", name: "Organize PDF", description: "Reorder PDF pages", icon: Grid3x3 },
  { id: "delete", name: "Delete Pages", description: "Remove pages from PDF", icon: Trash2 },
  { id: "extract", name: "Extract Pages", description: "Extract specific pages", icon: FileOutput },
];

const UnifiedConverter = () => {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const handleToolClick = (tool: Tool) => {
    if (tool.comingSoon) return;
    setSelectedTool(tool);
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
              className={`relative group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border bg-card ${
                tool.comingSoon ? 'opacity-60 cursor-not-allowed' : ''
              }`}
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

        {/* Coming Soon Message */}
        {selectedTool?.comingSoon && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
              <p className="text-muted-foreground mb-4">
                This tool is currently under development. Check back soon!
              </p>
              <button
                onClick={() => setSelectedTool(null)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default UnifiedConverter;
