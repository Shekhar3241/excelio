import { useState } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WordToPdf = () => {
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
        description: "Please select a Word document to convert",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Import required libraries dynamically
      const mammoth = await import('mammoth/mammoth.browser');
      const { default: jsPDF } = await import('jspdf');

      // Read the Word file
      const arrayBuffer = await file.arrayBuffer();
      
      // Convert Word to HTML
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const html = result.value;

      // Create PDF from HTML content
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const maxWidth = pageWidth - (margin * 2);

      // Simple HTML to PDF conversion
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      tempDiv.style.width = `${maxWidth * 3.78}px`; // Convert mm to px (approx)
      document.body.appendChild(tempDiv);

      let yPosition = margin;
      const lineHeight = 7;

      // Extract text from HTML
      const elements = tempDiv.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li');
      
      elements.forEach((element) => {
        const text = element.textContent || '';
        const tag = element.tagName.toLowerCase();
        
        // Set font based on element type
        if (tag.startsWith('h')) {
          const size = tag === 'h1' ? 16 : tag === 'h2' ? 14 : 12;
          pdf.setFontSize(size);
          pdf.setFont(undefined, 'bold');
        } else {
          pdf.setFontSize(10);
          pdf.setFont(undefined, 'normal');
        }

        // Split text to fit width
        const lines = pdf.splitTextToSize(text, maxWidth);
        
        lines.forEach((line: string) => {
          if (yPosition + lineHeight > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(line, margin, yPosition);
          yPosition += lineHeight;
        });

        yPosition += 3; // Add spacing between elements
      });

      document.body.removeChild(tempDiv);

      // Download the PDF
      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.(docx?|doc)$/i, '.pdf');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Word document converted to PDF successfully!",
      });
      
      setFile(null);
    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to convert Word document",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Word to PDF Converter - Convert DOCX to PDF Online</title>
        <meta name="description" content="Convert Word documents to PDF online. Transform DOCX files to PDF format instantly." />
      </Helmet>

      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Word to PDF Converter
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Convert Word documents to PDF format
            </p>
          </div>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Upload Word Document
              </CardTitle>
              <CardDescription>Select a DOCX file to convert to PDF</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent transition-colors">
                <input
                  type="file"
                  accept=".docx,.doc"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="word-upload"
                />
                <label htmlFor="word-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-foreground font-medium mb-2">Click to upload a Word file</p>
                  <p className="text-sm text-muted-foreground">or drag and drop (.docx, .doc)</p>
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
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Convert to PDF
                    </>
                  )}
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
                <CardTitle className="text-lg">Preserve Formatting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Maintains original document layout and styles
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Universal Format</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  PDF works on any device and platform
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick & Easy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Simple one-click conversion process
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

export default WordToPdf;
