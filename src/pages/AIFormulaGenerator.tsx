import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Paperclip, ArrowUp, FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';
import ReactMarkdown from 'react-markdown';
// @ts-ignore - Vite will inline this as a URL string
import pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker.min?url';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker as any;

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AIFormulaGenerator = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [initialPrompt, setInitialPrompt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // Only scroll if user is near the bottom (within 100px)
    const container = messagesEndRef.current?.parentElement;
    if (container) {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      if (isNearBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const exportToPDF = (content: string, index: number) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - (margin * 2);
      let yPosition = margin;
      
      // Helper function to check if we need a new page
      const checkPageBreak = (requiredSpace: number = 10) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };
      
      // Helper function to process inline markdown (bold, italic, code)
      const processInlineMarkdown = (text: string): string => {
        // Remove markdown syntax for PDF (we'll use font styles instead)
        return text
          .replace(/\*\*\*(.+?)\*\*\*/g, '$1') // bold italic
          .replace(/\*\*(.+?)\*\*/g, '$1') // bold
          .replace(/\*(.+?)\*/g, '$1') // italic
          .replace(/`(.+?)`/g, '$1') // code
          .replace(/~~(.+?)~~/g, '$1'); // strikethrough
      };
      
      // Title
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(41, 128, 185);
      doc.text("Analysis Results", margin, yPosition);
      yPosition += 12;
      
      // Add a subtle line separator
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;
      
      // Split content into lines
      const contentLines = content.split('\n');
      
      for (let i = 0; i < contentLines.length; i++) {
        const line = contentLines[i];
        
        // Skip empty lines but add minimal spacing
        if (line.trim() === '') {
          yPosition += 3;
          continue;
        }
        
        // Handle H1 headings (# )
        if (line.startsWith('# ')) {
          checkPageBreak(15);
          yPosition += 5; // Extra space before heading
          doc.setFontSize(16);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(52, 73, 94);
          const headingText = processInlineMarkdown(line.substring(2));
          const splitLines = doc.splitTextToSize(headingText, maxWidth);
          splitLines.forEach((splitLine: string) => {
            doc.text(splitLine, margin, yPosition);
            yPosition += 8;
          });
          yPosition += 3;
          continue;
        }
        
        // Handle H2 headings (## )
        if (line.startsWith('## ')) {
          checkPageBreak(12);
          yPosition += 4;
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(52, 73, 94);
          const headingText = processInlineMarkdown(line.substring(3));
          const splitLines = doc.splitTextToSize(headingText, maxWidth);
          splitLines.forEach((splitLine: string) => {
            doc.text(splitLine, margin, yPosition);
            yPosition += 7;
          });
          yPosition += 2;
          continue;
        }
        
        // Handle H3 headings (### )
        if (line.startsWith('### ')) {
          checkPageBreak(10);
          yPosition += 3;
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(52, 73, 94);
          const headingText = processInlineMarkdown(line.substring(4));
          const splitLines = doc.splitTextToSize(headingText, maxWidth);
          splitLines.forEach((splitLine: string) => {
            doc.text(splitLine, margin, yPosition);
            yPosition += 6;
          });
          yPosition += 2;
          continue;
        }
        
        // Handle unordered list items (- or * )
        if (line.match(/^[\-\*]\s/)) {
          checkPageBreak(8);
          doc.setFontSize(11);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(0, 0, 0);
          const bulletText = processInlineMarkdown(line.substring(2));
          const bulletX = margin + 5;
          
          // Draw bullet point
          doc.circle(margin + 2, yPosition - 1.5, 0.8, 'F');
          
          const splitLines = doc.splitTextToSize(bulletText, maxWidth - 7);
          splitLines.forEach((splitLine: string, idx: number) => {
            if (idx > 0) checkPageBreak(6);
            doc.text(splitLine, bulletX, yPosition);
            yPosition += 6;
          });
          continue;
        }
        
        // Handle numbered list items (1. 2. etc.)
        if (line.match(/^\d+\.\s/)) {
          checkPageBreak(8);
          doc.setFontSize(11);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(0, 0, 0);
          const match = line.match(/^(\d+\.)\s(.+)$/);
          if (match) {
            const number = match[1];
            const text = processInlineMarkdown(match[2]);
            const numberWidth = doc.getTextWidth(number + ' ');
            
            doc.text(number, margin, yPosition);
            const splitLines = doc.splitTextToSize(text, maxWidth - numberWidth);
            splitLines.forEach((splitLine: string, idx: number) => {
              if (idx > 0) checkPageBreak(6);
              doc.text(splitLine, margin + numberWidth, yPosition);
              yPosition += 6;
            });
          }
          continue;
        }
        
        // Handle bold text (check if line contains **)
        const isBold = line.includes('**');
        
        // Regular paragraph text
        checkPageBreak(8);
        doc.setFontSize(11);
        doc.setFont("helvetica", isBold ? "bold" : "normal");
        doc.setTextColor(0, 0, 0);
        
        const cleanText = processInlineMarkdown(line);
        const splitLines = doc.splitTextToSize(cleanText, maxWidth);
        splitLines.forEach((splitLine: string) => {
          checkPageBreak(6);
          doc.text(splitLine, margin, yPosition);
          yPosition += 6;
        });
        yPosition += 1; // Small spacing between paragraphs
      }
      
      // Add footer with page numbers
      const pageCount = doc.internal.pages.length - 1;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }
      
      doc.save(`analysis-result-${index + 1}.pdf`);
      toast({
        title: "Exported to PDF",
        description: "Analysis has been saved as PDF",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Could not export to PDF",
        variant: "destructive",
      });
    }
  };

  const exportToWord = async (content: string, index: number) => {
    try {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import('docx');
      
      // Split content into lines and create paragraphs
      const lines = content.split('\n');
      const paragraphs = lines.map(line => {
        // Check if line is a heading
        if (line.startsWith('# ')) {
          return new Paragraph({
            text: line.substring(2),
            heading: HeadingLevel.HEADING_1,
          });
        } else if (line.startsWith('## ')) {
          return new Paragraph({
            text: line.substring(3),
            heading: HeadingLevel.HEADING_2,
          });
        } else if (line.startsWith('### ')) {
          return new Paragraph({
            text: line.substring(4),
            heading: HeadingLevel.HEADING_3,
          });
        } else if (line.trim() === '') {
          return new Paragraph({ text: '' });
        } else {
          // Regular paragraph
          return new Paragraph({
            children: [new TextRun({ text: line })],
          });
        }
      });
      
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: "Analysis Results",
              heading: HeadingLevel.TITLE,
            }),
            ...paragraphs,
          ],
        }],
      });
      
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analysis-result-${index + 1}.docx`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Exported to Word",
        description: "Analysis has been saved as Word document",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Could not export to Word",
        variant: "destructive",
      });
    }
  };

  const parseExcelFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          let result = `Excel File: ${file.name}\n\n`;
          
          workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            result += `Sheet: ${sheetName}\n`;
            result += JSON.stringify(jsonData.slice(0, 100), null, 2) + '\n\n';
          });
          
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const parseWordFile = async (file: File): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        const mammoth = await import('mammoth/mammoth.browser');
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        resolve(`Word Document: ${file.name}\n\n${result.value}`);
      } catch (error) {
        reject(error);
      }
    });
  };

  const parsePdfFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          let fullText = `PDF File: ${file.name}\n\n`;
          
          for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += `Page ${i}:\n${pageText}\n\n`;
          }
          
          resolve(fullText);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    for (const file of files) {
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 20MB limit`,
          variant: "destructive",
        });
        continue;
      }
      setUploadedFiles((prev) => [...prev, file]);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && uploadedFiles.length === 0) return;

    const userMessage: Message = {
      role: "user",
      content: input || initialPrompt || "Analyzing uploaded files...",
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setInitialPrompt("");
    setIsLoading(true);

    try {
      let fileContext = "";
      
      if (uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          try {
            if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
              const excelData = await parseExcelFile(file);
              fileContext += `\n\n${excelData}`;
            } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
              const pdfText = await parsePdfFile(file);
              fileContext += `\n\n${pdfText}`;
            } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
              const wordText = await parseWordFile(file);
              fileContext += `\n\n${wordText}`;
            } else if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.csv') || file.name.endsWith('.json')) {
              const text = await file.text();
              fileContext += `\n\nFile: ${file.name}\n${text.substring(0, 10000)}`;
            } else if (file.type.startsWith('image/')) {
              fileContext += `\n\n[File: ${file.name} - Image file uploaded for visual analysis]`;
            } else {
              fileContext += `\n\n[File: ${file.name} - Binary file, type: ${file.type}]`;
            }
          } catch (e) {
            console.error('Error parsing file:', e);
            fileContext += `\n\n[File: ${file.name} - Error parsing file]`;
          }
        }
        setUploadedFiles([]);
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-data`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: newMessages,
            fileContext,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  aiResponse += content;
                  setMessages((prev) => {
                    const updated = [...prev];
                    if (updated[updated.length - 1]?.role === "assistant") {
                      updated[updated.length - 1].content = aiResponse;
                    } else {
                      updated.push({ role: "assistant", content: aiResponse });
                    }
                    return updated;
                  });
                  // Removed auto-scroll during streaming to prevent jumping
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      // Scroll only at the end of response
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Helmet>
        <title>AI Excel Assistant - Analyze Your Data</title>
        <meta
          name="description"
          content="Upload Excel, PDF, and other files to get AI-powered insights and analysis."
        />
      </Helmet>

      <Header />

      <main className="flex-1 container mx-auto px-2 sm:px-4 py-4 sm:py-8 md:py-12 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          {messages.length === 0 ? (
            <div className="animate-fade-in">
              <div className="bg-card rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 border border-border/50">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-foreground mb-6 sm:mb-8 md:mb-12 animate-scale-in">
                  Analyse Your Data
                </h1>
                
                <div className="mb-6">
                  <Textarea
                    value={initialPrompt}
                    onChange={(e) => setInitialPrompt(e.target.value)}
                    placeholder="What would you like to know? (e.g., 'Find sales trends', 'Analyze customer data', 'Calculate averages')"
                    className="resize-none rounded-2xl min-h-[100px] text-sm sm:text-base"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Describe what you want to analyze, then upload your data files below
                  </p>
                </div>
                
                <div className="flex gap-2 sm:gap-4 items-center justify-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.xlsx,.xls,.doc,.docx,.txt,.csv,.json,image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-full px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 text-sm sm:text-base md:text-lg border-2 hover:scale-105 transition-transform"
                  >
                    <Paperclip className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                    Add data
                  </Button>
                  
                  <Button
                    size="lg"
                    className="rounded-full p-4 sm:p-5 md:p-6 hover:scale-105 transition-transform"
                    onClick={() => {
                      if (uploadedFiles.length > 0 || initialPrompt.trim()) {
                        handleSend();
                      }
                    }}
                    disabled={uploadedFiles.length === 0 && !initialPrompt.trim()}
                  >
                    <ArrowUp className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Button>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-6 p-4 bg-muted/50 rounded-2xl">
                    <p className="text-sm text-muted-foreground mb-3 font-medium">
                      {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} ready
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="text-sm px-3 py-1 bg-background rounded-full border border-border"
                        >
                          {file.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-card rounded-2xl sm:rounded-3xl shadow-2xl border border-border/50 overflow-hidden">
                <div className="max-h-[65vh] sm:max-h-[60vh] overflow-y-auto p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                    >
                      <div className="flex flex-col gap-2 max-w-[90%] sm:max-w-[85%]">
                        <div
                          className={`rounded-2xl sm:rounded-3xl px-4 sm:px-5 md:px-6 py-3 sm:py-4 ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          {message.role === "assistant" ? (
                            <div className="prose prose-sm sm:prose dark:prose-invert max-w-none">
                              <ReactMarkdown
                                components={{
                                  p: ({children}) => <p className="mb-2 leading-relaxed text-sm sm:text-base">{children}</p>,
                                  ul: ({children}) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                                  ol: ({children}) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                                  li: ({children}) => <li className="text-sm sm:text-base">{children}</li>,
                                  code: ({children}) => <code className="bg-background/50 px-1.5 py-0.5 rounded text-xs sm:text-sm">{children}</code>,
                                  pre: ({children}) => <pre className="bg-background/50 p-2 sm:p-3 rounded-lg overflow-x-auto text-xs sm:text-sm my-2">{children}</pre>,
                                  h1: ({children}) => <h1 className="text-lg sm:text-xl font-bold mb-2">{children}</h1>,
                                  h2: ({children}) => <h2 className="text-base sm:text-lg font-bold mb-2">{children}</h2>,
                                  h3: ({children}) => <h3 className="text-sm sm:text-base font-bold mb-1">{children}</h3>,
                                  strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap break-words leading-relaxed text-sm sm:text-base">
                              {message.content}
                            </p>
                          )}
                        </div>
                        {message.role === "assistant" && (
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => exportToPDF(message.content, index)}
                              className="text-xs"
                            >
                              <FileDown className="h-3 w-3 mr-1" />
                              PDF
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => exportToWord(message.content, index)}
                              className="text-xs"
                            >
                              <FileDown className="h-3 w-3 mr-1" />
                              Word
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start animate-fade-in">
                      <div className="bg-muted rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex gap-1.5">
                          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                <div className="p-3 sm:p-4 md:p-6 border-t border-border/50 bg-background/50">
                  <div className="flex gap-2 sm:gap-3 items-end">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.xlsx,.xls,.doc,.docx,.txt,.csv,.json,image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                      className="rounded-full shrink-0 h-9 w-9 sm:h-10 sm:w-10"
                    >
                      <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                    
                    <div className="flex-1 relative">
                      <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                        placeholder="Ask about your data..."
                        disabled={isLoading}
                        className="resize-none rounded-2xl sm:rounded-3xl min-h-[50px] sm:min-h-[60px] pr-12 sm:pr-14 text-sm sm:text-base"
                        rows={2}
                      />
                      {uploadedFiles.length > 0 && (
                        <div className="absolute bottom-2 left-3 text-xs text-muted-foreground">
                          {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={handleSend}
                      disabled={isLoading || (!input.trim() && uploadedFiles.length === 0)}
                      size="icon"
                      className="rounded-full shrink-0 h-9 w-9 sm:h-10 sm:w-10"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      ) : (
                        <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AIFormulaGenerator;
