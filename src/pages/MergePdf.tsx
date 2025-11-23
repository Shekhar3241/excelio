import { useState } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Merge, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PDFDocument } from "pdf-lib";

const MergePdf = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
      setMergedPdfUrl(null);
    }
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast({
        title: "Error",
        description: "Please select at least 2 PDF files to merge",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);

      toast({
        title: "Success",
        description: "PDFs merged successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to merge PDF files",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (mergedPdfUrl) {
      const a = document.createElement("a");
      a.href = mergedPdfUrl;
      a.download = "merged.pdf";
      a.click();
    }
  };

  const handleReset = () => {
    setFiles([]);
    setMergedPdfUrl(null);
    if (mergedPdfUrl) {
      URL.revokeObjectURL(mergedPdfUrl);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Merge PDF Files Online - Combine PDFs for Free</title>
        <meta name="description" content="Merge multiple PDF files into one document easily and securely. Free online PDF merger tool with no file size limits." />
      </Helmet>

      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Merge PDF Files
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Combine multiple PDF documents into a single file with ease
            </p>
          </div>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Merge className="h-5 w-5" />
                Upload PDFs to Merge
              </CardTitle>
              <CardDescription>Select multiple PDF files to combine them into one</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-foreground font-medium mb-2">Click to upload PDF files</p>
                  <p className="text-sm text-muted-foreground">or drag and drop</p>
                </label>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <p className="font-medium text-foreground">Selected files ({files.length}):</p>
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                      <FileText className="h-4 w-4 text-foreground" />
                      <span className="text-sm text-foreground">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {!mergedPdfUrl ? (
                <div className="flex gap-4">
                  <Button
                    onClick={handleMerge}
                    disabled={files.length < 2 || isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? "Merging..." : "Merge PDFs"}
                  </Button>
                  {files.length > 0 && (
                    <Button onClick={handleReset} variant="outline">
                      Reset
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-secondary rounded-lg text-center">
                    <p className="text-foreground font-medium mb-2">PDF Merged Successfully!</p>
                  </div>
                  <div className="flex gap-4">
                    <Button onClick={handleDownload} className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download Merged PDF
                    </Button>
                    <Button onClick={handleReset} variant="outline">
                      Merge More
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MergePdf;
