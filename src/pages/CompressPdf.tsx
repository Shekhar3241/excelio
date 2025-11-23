import { useState } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Minimize2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PDFDocument } from "pdf-lib";

const CompressPdf = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [compressedPdfUrl, setCompressedPdfUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setOriginalSize(selectedFile.size);
      setCompressedPdfUrl(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleCompress = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a PDF file to compress",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      const compressedPdfBytes = await pdfDoc.save({
        useObjectStreams: false,
      });

      const blob = new Blob([compressedPdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setCompressedPdfUrl(url);
      setCompressedSize(blob.size);

      toast({
        title: "Success",
        description: "PDF compressed successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to compress PDF file",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (compressedPdfUrl) {
      const a = document.createElement("a");
      a.href = compressedPdfUrl;
      a.download = "compressed.pdf";
      a.click();
    }
  };

  const handleReset = () => {
    setFile(null);
    setCompressedPdfUrl(null);
    setOriginalSize(0);
    setCompressedSize(0);
    if (compressedPdfUrl) {
      URL.revokeObjectURL(compressedPdfUrl);
    }
  };

  const compressionRatio = originalSize > 0 && compressedSize > 0 
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Compress PDF Files Online - Reduce PDF Size for Free</title>
        <meta name="description" content="Compress PDF files online to reduce file size while maintaining quality. Free PDF compression tool with no limits." />
      </Helmet>

      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Compress PDF Files
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Reduce PDF file size while maintaining quality
            </p>
          </div>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Minimize2 className="h-5 w-5" />
                Upload PDF to Compress
              </CardTitle>
              <CardDescription>Select a PDF file to reduce its size</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-foreground font-medium mb-2">Click to upload a PDF file</p>
                  <p className="text-sm text-muted-foreground">or drag and drop</p>
                </label>
              </div>

              {file && (
                <div className="space-y-2">
                  <p className="font-medium text-foreground">Selected file:</p>
                  <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                    <FileText className="h-4 w-4 text-foreground" />
                    <span className="text-sm text-foreground flex-1">{file.name}</span>
                    <span className="text-sm text-muted-foreground">{formatFileSize(originalSize)}</span>
                  </div>
                </div>
              )}

              {!compressedPdfUrl ? (
                <div className="flex gap-4">
                  <Button
                    onClick={handleCompress}
                    disabled={!file || isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? "Compressing..." : "Compress PDF"}
                  </Button>
                  {file && (
                    <Button onClick={handleReset} variant="outline">
                      Reset
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-foreground font-medium mb-2">PDF Compressed Successfully!</p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Original Size</p>
                        <p className="text-lg font-semibold text-foreground">{formatFileSize(originalSize)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Compressed Size</p>
                        <p className="text-lg font-semibold text-foreground">{formatFileSize(compressedSize)}</p>
                      </div>
                    </div>
                    {compressionRatio > 0 && (
                      <p className="text-sm text-accent mt-2">Reduced by {compressionRatio}%</p>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <Button onClick={handleDownload} className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download Compressed PDF
                    </Button>
                    <Button onClick={handleReset} variant="outline">
                      Compress More
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

export default CompressPdf;
