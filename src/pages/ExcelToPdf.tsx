import { useState } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileSpreadsheet, FileText, Loader2, Download, X } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as PDFJS from 'pdfjs-dist';
// @ts-ignore - Vite will inline this as a URL string
import pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker.min?url';

// Set up PDF.js worker
PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker as any;

export default function ExcelToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [excelBlob, setExcelBlob] = useState<Blob | null>(null);
  const [conversionMode, setConversionMode] = useState<'excel-to-pdf' | 'pdf-to-excel'>('excel-to-pdf');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (conversionMode === 'excel-to-pdf') {
        const validTypes = [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel'
        ];
        
        if (validTypes.includes(selectedFile.type) || selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
          setFile(selectedFile);
          setPdfBlob(null);
          setExcelBlob(null);
          toast.success(`${selectedFile.name} selected`);
        } else {
          toast.error('Please select a valid Excel file (.xlsx or .xls)');
        }
      } else {
        if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
          setFile(selectedFile);
          setPdfBlob(null);
          setExcelBlob(null);
          toast.success(`${selectedFile.name} selected`);
        } else {
          toast.error('Please select a valid PDF file');
        }
      }
    }
  };

  const handleConvertExcelToPdf = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setIsConverting(true);
    toast.loading('Converting Excel to PDF...', { id: 'converting' });

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      pdf.setFontSize(16);
      pdf.text(file.name.replace(/\.[^/.]+$/, ''), pageWidth / 2, 15, { align: 'center' });

      let yPosition = 25;

      workbook.SheetNames.forEach((sheetName, sheetIndex) => {
        if (sheetIndex > 0) {
          pdf.addPage();
          yPosition = 15;
        }

        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text(`Sheet: ${sheetName}`, 14, yPosition);
        yPosition += 10;

        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        if (jsonData.length > 0) {
          autoTable(pdf, {
            head: [jsonData[0]],
            body: jsonData.slice(1),
            startY: yPosition,
            theme: 'grid',
            headStyles: {
              fillColor: [66, 139, 202],
              textColor: 255,
              fontStyle: 'bold',
              halign: 'center'
            },
            styles: {
              fontSize: 8,
              cellPadding: 2,
              overflow: 'linebreak',
              cellWidth: 'wrap'
            },
            columnStyles: {
              0: { cellWidth: 'auto' }
            },
            margin: { left: 14, right: 14 },
            didDrawPage: (data) => {
              const pageCount = pdf.getNumberOfPages();
              pdf.setFontSize(8);
              pdf.text(
                `Page ${pageCount}`,
                pageWidth - 20,
                pdf.internal.pageSize.getHeight() - 10
              );
            }
          });
        }
      });

      const pdfOutput = pdf.output('blob');
      setPdfBlob(pdfOutput);
      toast.success('Conversion successful!', { id: 'converting' });

    } catch (error) {
      console.error('Conversion error:', error);
      toast.error('Conversion failed. Please ensure your Excel file is valid.', { id: 'converting' });
    } finally {
      setIsConverting(false);
    }
  };

  const handleConvertPdfToExcel = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setIsConverting(true);
    toast.loading('Converting PDF to Excel...', { id: 'converting' });

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = PDFJS.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      const workbook = XLSX.utils.book_new();
      
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Extract text items with their positions
        const textItems = textContent.items.map((item: any) => ({
          text: item.str,
          x: item.transform[4],
          y: item.transform[5]
        }));
        
        // Sort by Y position (top to bottom) then X position (left to right)
        textItems.sort((a, b) => {
          const yDiff = b.y - a.y;
          if (Math.abs(yDiff) > 5) return yDiff > 0 ? 1 : -1;
          return a.x - b.x;
        });
        
        // Group items by rows
        const rows: string[][] = [];
        let currentRow: string[] = [];
        let lastY = textItems[0]?.y || 0;
        
        textItems.forEach((item) => {
          if (Math.abs(item.y - lastY) > 5) {
            if (currentRow.length > 0) {
              rows.push(currentRow);
              currentRow = [];
            }
            lastY = item.y;
          }
          if (item.text.trim()) {
            currentRow.push(item.text);
          }
        });
        
        if (currentRow.length > 0) {
          rows.push(currentRow);
        }
        
        // Create worksheet
        const worksheet = XLSX.utils.aoa_to_sheet(rows.length > 0 ? rows : [['No text found']]);
        XLSX.utils.book_append_sheet(workbook, worksheet, `Page ${pageNum}`);
      }
      
      const excelOutput = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelOutput], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      setExcelBlob(blob);
      toast.success('Conversion successful!', { id: 'converting' });

    } catch (error) {
      console.error('PDF to Excel conversion error:', error);
      toast.error(`Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: 'converting' });
    } finally {
      setIsConverting(false);
    }
  };

  const handleConvert = () => {
    if (conversionMode === 'excel-to-pdf') {
      handleConvertExcelToPdf();
    } else {
      handleConvertPdfToExcel();
    }
  };

  const handleDownload = () => {
    if (conversionMode === 'excel-to-pdf' && pdfBlob && file) {
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.[^/.]+$/, '.pdf');
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('PDF downloaded!');
    } else if (conversionMode === 'pdf-to-excel' && excelBlob && file) {
      const url = window.URL.createObjectURL(excelBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.[^/.]+$/, '.xlsx');
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Excel downloaded!');
    }
  };

  const handleReset = () => {
    setFile(null);
    setPdfBlob(null);
    setExcelBlob(null);
  };

  const handleModeChange = (value: string) => {
    setConversionMode(value as 'excel-to-pdf' | 'pdf-to-excel');
    setFile(null);
    setPdfBlob(null);
    setExcelBlob(null);
  };

  return (
    <>
      <Helmet>
        <title>Excel & PDF Converter - Free Online Tool | SkillBI</title>
        <meta name="description" content="Convert Excel to PDF and PDF to Excel instantly. Free online converter with no file size limits. Fast, secure, and easy to use." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Excel & PDF Converter
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Convert between Excel and PDF formats instantly. Fast, free, and secure.
              </p>
            </div>

            {/* Converter Card */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-6 w-6 text-primary" />
                  File Converter
                </CardTitle>
                <CardDescription>
                  Choose your conversion mode and upload your file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Conversion Mode Tabs */}
                <Tabs value={conversionMode} onValueChange={handleModeChange}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="excel-to-pdf">Excel to PDF</TabsTrigger>
                    <TabsTrigger value="pdf-to-excel">PDF to Excel</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="excel-to-pdf" className="space-y-6">
                    {/* Upload Area for Excel */}
                    {!file && (
                      <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
                        <input
                          type="file"
                          id="file-upload-excel"
                          className="hidden"
                          accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                          onChange={handleFileSelect}
                        />
                        <label htmlFor="file-upload-excel" className="cursor-pointer">
                          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-lg font-medium mb-2">Drop your Excel file here</p>
                          <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                          <Button variant="outline" type="button">
                            Select Excel File
                          </Button>
                        </label>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="pdf-to-excel" className="space-y-6">
                    {/* Upload Area for PDF */}
                    {!file && (
                      <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
                        <input
                          type="file"
                          id="file-upload-pdf"
                          className="hidden"
                          accept=".pdf,application/pdf"
                          onChange={handleFileSelect}
                        />
                        <label htmlFor="file-upload-pdf" className="cursor-pointer">
                          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-lg font-medium mb-2">Drop your PDF file here</p>
                          <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                          <Button variant="outline" type="button">
                            Select PDF File
                          </Button>
                        </label>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                {/* File Selected */}
                {file && !pdfBlob && !excelBlob && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        {conversionMode === 'excel-to-pdf' ? (
                          <FileSpreadsheet className="h-8 w-8 text-green-500" />
                        ) : (
                          <FileText className="h-8 w-8 text-red-500" />
                        )}
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
                      ) : conversionMode === 'excel-to-pdf' ? (
                        <>
                          <FileText className="h-5 w-5" />
                          Convert to PDF
                        </>
                      ) : (
                        <>
                          <FileSpreadsheet className="h-5 w-5" />
                          Convert to Excel
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Conversion Complete */}
                {(pdfBlob || excelBlob) && (
                  <div className="space-y-4">
                    <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                      {conversionMode === 'excel-to-pdf' ? (
                        <FileText className="h-12 w-12 mx-auto mb-3 text-green-500" />
                      ) : (
                        <FileSpreadsheet className="h-12 w-12 mx-auto mb-3 text-green-500" />
                      )}
                      <p className="font-semibold text-lg mb-2">Conversion Complete!</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Your {conversionMode === 'excel-to-pdf' ? 'PDF' : 'Excel file'} is ready to download
                      </p>
                      <Button onClick={handleDownload} className="gap-2" size="lg">
                        <Download className="h-5 w-5" />
                        Download {conversionMode === 'excel-to-pdf' ? 'PDF' : 'Excel'}
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
                  <CardTitle className="text-lg">Bidirectional Conversion</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Convert Excel to PDF or PDF to Excel with a single click
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Secure & Private</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    All conversions happen in your browser. Your files never leave your device
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">High Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Maintains formatting and structure with professional output
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
