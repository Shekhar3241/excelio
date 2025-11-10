import { useState } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, FileText, Loader2, Download, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function ExcelToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedPdfUrl, setConvertedPdfUrl] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (validTypes.includes(selectedFile.type) || selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
        setFile(selectedFile);
        setConvertedPdfUrl(null);
        toast.success(`${selectedFile.name} selected`);
      } else {
        toast.error('Please select a valid Excel file (.xlsx or .xls)');
      }
    }
  };

  const handleConvert = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setIsConverting(true);
    toast.loading('Converting Excel to PDF...', { id: 'converting' });

    try {
      // Read file as base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];

        // Call edge function
        const { data, error } = await supabase.functions.invoke('excel-to-pdf', {
          body: { 
            file: base64Data,
            filename: file.name
          }
        });

        if (error) throw error;

        if (data.pdfUrl) {
          setConvertedPdfUrl(data.pdfUrl);
          toast.success('Conversion successful!', { id: 'converting' });
        } else {
          throw new Error('No PDF URL returned');
        }
      };

      reader.onerror = () => {
        throw new Error('Failed to read file');
      };

    } catch (error) {
      console.error('Conversion error:', error);
      toast.error('Conversion failed. Please try again.', { id: 'converting' });
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (convertedPdfUrl) {
      const a = document.createElement('a');
      a.href = convertedPdfUrl;
      a.download = file?.name.replace(/\.[^/.]+$/, '.pdf') || 'converted.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('PDF downloaded!');
    }
  };

  const handleReset = () => {
    setFile(null);
    setConvertedPdfUrl(null);
  };

  return (
    <>
      <Helmet>
        <title>Excel to PDF Converter - Free Online Tool | SkillBI</title>
        <meta name="description" content="Convert Excel files to PDF instantly. Free online Excel to PDF converter with no file size limits. Fast, secure, and easy to use." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Excel to PDF Converter
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Convert your Excel spreadsheets to PDF format instantly. Fast, free, and secure.
              </p>
            </div>

            {/* Converter Card */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-6 w-6 text-primary" />
                  Upload & Convert
                </CardTitle>
                <CardDescription>
                  Select an Excel file (.xlsx, .xls) to convert it to PDF
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Upload Area */}
                {!file && (
                  <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                      onChange={handleFileSelect}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium mb-2">Drop your Excel file here</p>
                      <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                      <Button variant="outline" type="button">
                        Select File
                      </Button>
                    </label>
                  </div>
                )}

                {/* File Selected */}
                {file && !convertedPdfUrl && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileSpreadsheet className="h-8 w-8 text-green-500" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={handleReset}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button 
                      onClick={handleConvert} 
                      disabled={isConverting}
                      className="w-full gap-2"
                      size="lg"
                    >
                      {isConverting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Converting...
                        </>
                      ) : (
                        <>
                          <FileText className="h-5 w-5" />
                          Convert to PDF
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Conversion Complete */}
                {convertedPdfUrl && (
                  <div className="space-y-4">
                    <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                      <FileText className="h-12 w-12 mx-auto mb-3 text-green-500" />
                      <p className="font-semibold text-lg mb-2">Conversion Complete!</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Your PDF is ready to download
                      </p>
                      <Button onClick={handleDownload} className="gap-2" size="lg">
                        <Download className="h-5 w-5" />
                        Download PDF
                      </Button>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      onClick={handleReset}
                      className="w-full"
                    >
                      Convert Another File
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Fast Conversion</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Convert your Excel files to PDF in seconds with our optimized conversion engine
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Secure & Private</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Your files are processed securely and deleted immediately after conversion
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">High Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Maintains formatting, charts, and images with professional PDF output
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
