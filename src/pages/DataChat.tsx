import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Paperclip, ArrowUp, FileDown, Plus, Sparkles, Menu, X, FileText, Search, ListChecks, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';
import ReactMarkdown from 'react-markdown';
import { Link } from "react-router-dom";
// @ts-ignore - Vite will inline this as a URL string
import pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker.min?url';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker as any;

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface DocumentFile {
  name: string;
  type: string;
  content: string;
}

const DataChat = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [sessionDocuments, setSessionDocuments] = useState<DocumentFile[]>([]);
  const [initialPrompt, setInitialPrompt] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [documentContext, setDocumentContext] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    const container = messagesEndRef.current?.parentElement;
    if (container) {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      if (isNearBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  const exportToPDF = (content: string, index: number) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 25;
      const maxWidth = pageWidth - (margin * 2);
      let yPosition = margin + 10;
      
      // Premium color palette
      const colors = {
        primary: [15, 23, 42] as [number, number, number],
        secondary: [51, 65, 85] as [number, number, number],
        accent: [59, 130, 246] as [number, number, number],
        muted: [100, 116, 139] as [number, number, number],
        light: [148, 163, 184] as [number, number, number],
        border: [226, 232, 240] as [number, number, number],
      };
      
      const checkPageBreak = (requiredSpace: number = 10) => {
        if (yPosition + requiredSpace > pageHeight - 35) {
          doc.addPage();
          yPosition = margin + 5;
          return true;
        }
        return false;
      };
      
      const cleanMarkdown = (text: string): string => {
        return text
          .replace(/<br\s*\/?>/gi, ' ')
          .replace(/<[^>]*>/g, '')
          .replace(/\*\*\*(.+?)\*\*\*/g, '$1')
          .replace(/\*\*(.+?)\*\*/g, '$1')
          .replace(/\*(.+?)\*/g, '$1')
          .replace(/_{3}(.+?)_{3}/g, '$1')
          .replace(/__(.+?)__/g, '$1')
          .replace(/_(.+?)_/g, '$1')
          .replace(/```[\s\S]*?```/g, '')
          .replace(/`(.+?)`/g, '$1')
          .replace(/~~(.+?)~~/g, '$1')
          .replace(/\[(.+?)\]\(.+?\)/g, '$1')
          .replace(/!\[.*?\]\(.*?\)/g, '')
          .replace(/\*+/g, '')
          .replace(/_+/g, ' ')
          .replace(/#+\s*/g, '')
          .replace(/\s{2,}/g, ' ')
          .trim();
      };

      const parseTableRow = (line: string): string[] => {
        const cleanLine = line.replace(/^\||\|$/g, '');
        return cleanLine
          .split('|')
          .map(cell => cleanMarkdown(cell).trim())
          .filter((_, idx, arr) => idx < arr.length);
      };
      
      const extractTitle = (text: string): string => {
        const h1Match = text.match(/^#\s+(.+)$/m);
        if (h1Match) return cleanMarkdown(h1Match[1]).substring(0, 60);
        
        const h2Match = text.match(/^##\s+(.+)$/m);
        if (h2Match) return cleanMarkdown(h2Match[1]).substring(0, 60);
        
        const firstLine = text.split('\n').find(line => 
          line.trim().length > 10 && !line.startsWith('|') && !line.match(/^[-:|]+$/)
        );
        if (firstLine) return cleanMarkdown(firstLine).substring(0, 60);
        
        return "Data Insights Report";
      };
      
      const reportTitle = extractTitle(content);
      
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 45, 'F');
      
      doc.setFillColor(59, 130, 246);
      doc.rect(0, 45, pageWidth, 2, 'F');
      
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      const titleLines = doc.splitTextToSize(reportTitle, maxWidth - 20);
      doc.text(titleLines[0], margin, 28);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(148, 163, 184);
      doc.text(`Generated on ${new Date().toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`, margin, 38);
      
      yPosition = 60;
      
      const contentLines = content.split('\n');
      let inTable = false;
      let tableRowIndex = 0;
      let tableData: string[][] = [];
      let tableStartY = yPosition;
      
      const renderTable = (data: string[][], startY: number) => {
        if (data.length === 0) return startY;
        
        const numCols = Math.max(...data.map(row => row.length));
        const colWidth = (maxWidth - 4) / numCols;
        const cellPadding = 6;
        const rowHeight = 12;
        const headerRowHeight = 14;
        
        let currentY = startY;
        
        const tableColors = {
          headerBg: [15, 23, 42] as [number, number, number],
          headerText: [255, 255, 255] as [number, number, number],
          evenRowBg: [248, 250, 252] as [number, number, number],
          oddRowBg: [255, 255, 255] as [number, number, number],
          borderColor: [203, 213, 225] as [number, number, number],
          cellText: [51, 65, 85] as [number, number, number],
        };
        
        const isNumericColumn = (colIdx: number): boolean => {
          for (let i = 1; i < data.length; i++) {
            const cell = data[i]?.[colIdx]?.trim() || '';
            if (cell && !cell.match(/^[\d,.$%€£¥+-]+$/)) {
              return false;
            }
          }
          return true;
        };
        
        data.forEach((row, rowIdx) => {
          const isHeader = rowIdx === 0;
          const currentRowHeight = isHeader ? headerRowHeight : rowHeight;
          
          if (currentY + currentRowHeight > pageHeight - 35) {
            doc.addPage();
            currentY = margin + 5;
          }
          
          if (isHeader) {
            doc.setFillColor(...tableColors.headerBg);
          } else if (rowIdx % 2 === 0) {
            doc.setFillColor(...tableColors.evenRowBg);
          } else {
            doc.setFillColor(...tableColors.oddRowBg);
          }
          doc.rect(margin, currentY, maxWidth, currentRowHeight, 'F');
          
          row.forEach((cell, colIdx) => {
            const cellX = margin + (colIdx * colWidth);
            
            doc.setDrawColor(...tableColors.borderColor);
            doc.setLineWidth(0.3);
            doc.line(cellX, currentY, cellX, currentY + currentRowHeight);
            
            if (isHeader) {
              doc.setFont("helvetica", "bold");
              doc.setTextColor(...tableColors.headerText);
              doc.setFontSize(9);
            } else {
              doc.setFont("helvetica", "normal");
              doc.setTextColor(...tableColors.cellText);
              doc.setFontSize(9);
            }
            
            const maxTextWidth = colWidth - (cellPadding * 2);
            let displayText = cell.trim().replace(/\s+/g, ' ');
            while (doc.getTextWidth(displayText) > maxTextWidth && displayText.length > 3) {
              displayText = displayText.slice(0, -4) + '...';
            }
            
            const textWidth = doc.getTextWidth(displayText);
            const textY = currentY + (currentRowHeight / 2) + 2.5;
            
            let textX: number;
            if (isHeader) {
              textX = cellX + (colWidth / 2) - (textWidth / 2);
            } else if (isNumericColumn(colIdx)) {
              textX = cellX + colWidth - cellPadding - textWidth;
            } else {
              textX = cellX + cellPadding;
            }
            
            doc.text(displayText, textX, textY);
          });
          
          const lastCellX = margin + maxWidth;
          doc.line(lastCellX, currentY, lastCellX, currentY + currentRowHeight);
          doc.line(margin, currentY, margin + maxWidth, currentY);
          doc.line(margin, currentY + currentRowHeight, margin + maxWidth, currentY + currentRowHeight);
          
          currentY += currentRowHeight;
        });
        
        return currentY + 10;
      };
      
      for (let i = 0; i < contentLines.length; i++) {
        const line = contentLines[i];
        const trimmedLine = line.trim();
        
        if (trimmedLine === '') {
          if (inTable && tableData.length > 0) {
            yPosition = renderTable(tableData, tableStartY);
            tableData = [];
            tableRowIndex = 0;
            inTable = false;
          }
          yPosition += 5;
          continue;
        }
        
        if (trimmedLine.match(/^\|?[\s\-:|]+\|?$/) || trimmedLine.match(/^[-:|]+$/)) {
          continue;
        }
        
        if (trimmedLine.includes('|')) {
          const cells = parseTableRow(trimmedLine);
          if (cells.length > 0) {
            if (!inTable) {
              inTable = true;
              tableStartY = yPosition;
              tableData = [];
              tableRowIndex = 0;
            }
            tableData.push(cells);
            tableRowIndex++;
          }
          continue;
        } else {
          if (inTable && tableData.length > 0) {
            yPosition = renderTable(tableData, tableStartY);
            tableData = [];
            tableRowIndex = 0;
          }
          inTable = false;
        }
        
        if (trimmedLine.startsWith('# ')) {
          checkPageBreak(25);
          yPosition += 12;
          
          doc.setFillColor(...colors.accent);
          doc.rect(margin, yPosition - 6, 4, 18, 'F');
          
          doc.setFontSize(20);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(...colors.primary);
          const headingText = cleanMarkdown(trimmedLine.substring(2));
          const splitLines = doc.splitTextToSize(headingText, maxWidth - 10);
          splitLines.forEach((splitLine: string) => {
            doc.text(splitLine, margin + 10, yPosition);
            yPosition += 10;
          });
          yPosition += 8;
          continue;
        }
        
        if (trimmedLine.startsWith('## ')) {
          checkPageBreak(18);
          yPosition += 10;
          doc.setFontSize(16);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(...colors.secondary);
          const headingText = cleanMarkdown(trimmedLine.substring(3));
          const splitLines = doc.splitTextToSize(headingText, maxWidth);
          splitLines.forEach((splitLine: string) => {
            doc.text(splitLine, margin, yPosition);
            yPosition += 9;
          });
          
          doc.setDrawColor(...colors.border);
          doc.setLineWidth(0.5);
          doc.line(margin, yPosition + 2, margin + 50, yPosition + 2);
          yPosition += 8;
          continue;
        }
        
        if (trimmedLine.startsWith('### ')) {
          checkPageBreak(15);
          yPosition += 6;
          doc.setFontSize(13);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(...colors.muted);
          const headingText = cleanMarkdown(trimmedLine.substring(4));
          const splitLines = doc.splitTextToSize(headingText, maxWidth);
          splitLines.forEach((splitLine: string) => {
            doc.text(splitLine, margin, yPosition);
            yPosition += 8;
          });
          yPosition += 4;
          continue;
        }
        
        if (trimmedLine.match(/^[\-\*]\s/)) {
          checkPageBreak(12);
          doc.setFontSize(11);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(...colors.secondary);
          const bulletText = cleanMarkdown(trimmedLine.substring(2));
          const bulletX = margin + 10;
          
          doc.setFillColor(...colors.accent);
          doc.circle(margin + 4, yPosition - 1.5, 1.5, 'F');
          
          const splitLines = doc.splitTextToSize(bulletText, maxWidth - 12);
          splitLines.forEach((splitLine: string, idx: number) => {
            if (idx > 0) checkPageBreak(7);
            doc.text(splitLine, bulletX, yPosition);
            yPosition += 7;
          });
          yPosition += 3;
          continue;
        }
        
        if (trimmedLine.match(/^\d+\.\s/)) {
          checkPageBreak(12);
          doc.setFontSize(11);
          const match = trimmedLine.match(/^(\d+\.)\s(.+)$/);
          if (match) {
            const number = match[1];
            const text = cleanMarkdown(match[2]);
            
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...colors.accent);
            doc.text(number, margin, yPosition);
            
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...colors.secondary);
            const numberWidth = doc.getTextWidth(number + '  ');
            const splitLines = doc.splitTextToSize(text, maxWidth - numberWidth);
            splitLines.forEach((splitLine: string, idx: number) => {
              if (idx > 0) checkPageBreak(7);
              doc.text(splitLine, margin + numberWidth, yPosition);
              yPosition += 7;
            });
          }
          yPosition += 3;
          continue;
        }
        
        checkPageBreak(12);
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...colors.secondary);
        
        const cleanText = cleanMarkdown(trimmedLine);
        if (cleanText) {
          const splitLines = doc.splitTextToSize(cleanText, maxWidth);
          splitLines.forEach((splitLine: string) => {
            checkPageBreak(7);
            doc.text(splitLine, margin, yPosition);
            yPosition += 7;
          });
          yPosition += 3;
        }
      }
      
      if (inTable && tableData.length > 0) {
        yPosition = renderTable(tableData, tableStartY);
      }
      
      const pageCount = doc.internal.pages.length - 1;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        doc.setFillColor(248, 250, 252);
        doc.rect(0, pageHeight - 22, pageWidth, 22, 'F');
        
        doc.setDrawColor(...colors.border);
        doc.setLineWidth(0.3);
        doc.line(0, pageHeight - 22, pageWidth, pageHeight - 22);
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...colors.muted);
        doc.text(
          "Made with data.chat (Skillbi.in)",
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
        
        doc.setFontSize(8);
        doc.setTextColor(...colors.light);
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth - margin,
          pageHeight - 10,
          { align: 'right' }
        );
      }
      
      doc.save(`data-analysis-report-${index + 1}.pdf`);
      toast({
        title: "Exported to PDF",
        description: "Your premium analysis report has been saved",
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
      
      const lines = content.split('\n');
      const paragraphs = lines.map(line => {
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
          
          for (let i = 1; i <= Math.min(pdf.numPages, 50); i++) {
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
    
    // Reset input to allow same file selection
    if (e.target) {
      e.target.value = '';
    }
  };

  const processFiles = async (files: File[]): Promise<string> => {
    let fileContext = "";
    const newDocs: DocumentFile[] = [];
    
    for (const file of files) {
      try {
        let content = "";
        if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          content = await parseExcelFile(file);
        } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
          content = await parsePdfFile(file);
        } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
          content = await parseWordFile(file);
        } else if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.csv') || file.name.endsWith('.json')) {
          content = await file.text();
          content = `File: ${file.name}\n${content.substring(0, 50000)}`;
        } else if (file.type.startsWith('image/')) {
          content = `[File: ${file.name} - Image file uploaded for visual analysis]`;
        } else {
          content = `[File: ${file.name} - Binary file, type: ${file.type}]`;
        }
        
        fileContext += `\n\n${content}`;
        newDocs.push({
          name: file.name,
          type: file.type || 'unknown',
          content: content.substring(0, 1000) + '...'
        });
      } catch (e) {
        console.error('Error parsing file:', e);
        fileContext += `\n\n[File: ${file.name} - Error parsing file]`;
      }
    }
    
    setSessionDocuments(prev => [...prev, ...newDocs]);
    return fileContext;
  };

  const handleSend = async (action?: string) => {
    const messageContent = input || initialPrompt;
    if (!messageContent.trim() && uploadedFiles.length === 0 && !action) return;

    let userMessageText = messageContent;
    if (action === "summarize") {
      userMessageText = "Please provide a comprehensive summary of the uploaded document(s).";
    } else if (action === "extract") {
      userMessageText = "Please extract and organize the key information from the uploaded document(s).";
    } else if (!messageContent.trim() && uploadedFiles.length > 0) {
      userMessageText = `I've uploaded ${uploadedFiles.length} file(s): ${uploadedFiles.map(f => f.name).join(', ')}. What would you like to know about them?`;
    }

    const userMessage: Message = {
      role: "user",
      content: userMessageText,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setInitialPrompt("");
    setIsLoading(true);

    try {
      let newFileContext = "";
      
      if (uploadedFiles.length > 0) {
        newFileContext = await processFiles(uploadedFiles);
        setDocumentContext(prev => prev + newFileContext);
        setUploadedFiles([]);
      }

      const fullContext = documentContext + newFileContext;

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
            fileContext: fullContext,
            action: action,
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
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }

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

  const startNewChat = () => {
    setMessages([]);
    setInput("");
    setInitialPrompt("");
    setUploadedFiles([]);
    setSessionDocuments([]);
    setDocumentContext("");
  };

  const removeDocument = (index: number) => {
    setSessionDocuments(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "Document removed",
      description: "The document has been removed from this session",
    });
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <Helmet>
        <title>Data.chat - AI-Powered Document Analysis</title>
        <meta
          name="description"
          content="Chat with your documents using AI. Upload PDFs, Excel, Word files and get instant answers, summaries, and insights."
        />
      </Helmet>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-50
        w-72 bg-secondary/50 border-r border-border
        flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-3">
          <Button 
            onClick={startNewChat}
            variant="outline" 
            className="w-full justify-start gap-3 rounded-xl h-11 border-border/50 hover:bg-muted"
          >
            <Plus className="h-4 w-4" />
            New chat
          </Button>
        </div>
        
        {/* Documents in session */}
        {sessionDocuments.length > 0 && (
          <div className="px-3 py-2 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground px-3 py-2 uppercase tracking-wider">
              Documents ({sessionDocuments.length})
            </p>
            <div className="space-y-1 max-h-[200px] overflow-y-auto">
              {sessionDocuments.map((doc, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 group"
                >
                  <FileText className="h-4 w-4 text-accent shrink-0" />
                  <span className="text-sm truncate flex-1">{doc.name}</span>
                  <button
                    onClick={() => removeDocument(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <p className="text-xs text-muted-foreground px-3 py-2">Previous chats will appear here</p>
        </div>
        
        <div className="p-3 border-t border-border">
          <Link 
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
          >
            ← Back to Home
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden h-9 w-9"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <h1 className="font-semibold text-lg">Data.chat</h1>
            </div>
          </div>
          {sessionDocuments.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              {sessionDocuments.length} document{sessionDocuments.length !== 1 ? 's' : ''} loaded
            </div>
          )}
        </header>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            /* Welcome screen */
            <div className="h-full flex flex-col items-center justify-center px-4 py-8">
              <div className="max-w-2xl w-full space-y-8 animate-fade-in">
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 mb-4">
                    <Sparkles className="h-8 w-8 text-accent" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                    Chat with your documents
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-md mx-auto">
                    Upload PDFs, Excel, or Word files and ask questions to get instant AI-powered insights.
                  </p>
                </div>

                {/* File upload area */}
                <div 
                  className="border-2 border-dashed border-border/50 rounded-2xl p-8 text-center hover:border-accent/50 transition-colors cursor-pointer bg-muted/20"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.xlsx,.xls,.doc,.docx,.txt,.csv,.json,image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Paperclip className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <p className="font-medium mb-1">Drop files here or click to upload</p>
                  <p className="text-sm text-muted-foreground">
                    Supports PDF, Excel, Word, CSV, TXT, JSON (Max 20MB each)
                  </p>
                </div>

                {/* Uploaded files preview */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm px-3 py-2 bg-muted rounded-xl border border-border/50"
                        >
                          <FileText className="h-4 w-4 text-accent" />
                          <span className="max-w-[200px] truncate">{file.name}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploadedFiles(prev => prev.filter((_, i) => i !== index));
                            }}
                            className="text-muted-foreground hover:text-foreground ml-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Quick action buttons */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Button
                        onClick={() => handleSend("summarize")}
                        disabled={isLoading}
                        variant="outline"
                        className="gap-2 rounded-xl"
                      >
                        <ListChecks className="h-4 w-4" />
                        Summarize
                      </Button>
                      <Button
                        onClick={() => handleSend("extract")}
                        disabled={isLoading}
                        variant="outline"
                        className="gap-2 rounded-xl"
                      >
                        <Search className="h-4 w-4" />
                        Extract Info
                      </Button>
                    </div>
                  </div>
                )}

                {/* Input area for welcome screen */}
                <div className="space-y-4">
                  <div className="relative">
                    <Textarea
                      ref={textareaRef}
                      value={initialPrompt}
                      onChange={(e) => setInitialPrompt(e.target.value)}
                      placeholder="Ask a question about your documents..."
                      className="min-h-[100px] resize-none rounded-2xl border-border/50 bg-card pr-12 text-base focus:ring-2 focus:ring-accent/20"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey && (initialPrompt.trim() || uploadedFiles.length > 0)) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <Paperclip className="h-4 w-4" />
                      Add more files
                    </Button>
                    
                    <Button
                      onClick={() => handleSend()}
                      disabled={(!initialPrompt.trim() && uploadedFiles.length === 0) || isLoading}
                      className="rounded-full px-6 gap-2"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowUp className="h-4 w-4" />
                      )}
                      {isLoading ? "Analyzing..." : "Send"}
                    </Button>
                  </div>
                </div>

                {/* Feature highlights */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                  {[
                    { icon: "💬", title: "Q&A", desc: "Ask questions" },
                    { icon: "📋", title: "Summarize", desc: "Get summaries" },
                    { icon: "🔍", title: "Extract", desc: "Find key info" },
                    { icon: "📚", title: "Multi-file", desc: "Analyze many docs" },
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className="text-center p-3 rounded-xl border border-border/50 bg-card/50"
                    >
                      <span className="text-2xl">{feature.icon}</span>
                      <p className="font-medium text-sm mt-1">{feature.title}</p>
                      <p className="text-xs text-muted-foreground">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Messages */
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-4 animate-fade-in ${message.role === "user" ? "justify-end" : ""}`}
                >
                  {message.role === "assistant" && (
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-accent" />
                    </div>
                  )}
                  <div className={`flex flex-col gap-2 ${message.role === "user" ? "items-end" : "items-start"} max-w-[85%]`}>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown
                            components={{
                              p: ({children}) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
                              ul: ({children}) => <ul className="list-disc pl-4 mb-3 space-y-1">{children}</ul>,
                              ol: ({children}) => <ol className="list-decimal pl-4 mb-3 space-y-1">{children}</ol>,
                              li: ({children}) => <li>{children}</li>,
                              code: ({children}) => <code className="bg-background/50 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>,
                              pre: ({children}) => <pre className="bg-background/50 p-4 rounded-xl overflow-x-auto text-sm my-3">{children}</pre>,
                              h1: ({children}) => <h1 className="text-xl font-bold mb-3 mt-4 first:mt-0">{children}</h1>,
                              h2: ({children}) => <h2 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h2>,
                              h3: ({children}) => <h3 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h3>,
                              strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                              table: ({children}) => (
                                <div className="overflow-x-auto my-4 rounded-lg border border-border">
                                  <table className="w-full text-sm border-collapse">{children}</table>
                                </div>
                              ),
                              thead: ({children}) => <thead className="bg-muted/50 border-b border-border">{children}</thead>,
                              tbody: ({children}) => <tbody className="divide-y divide-border">{children}</tbody>,
                              tr: ({children}) => <tr className="hover:bg-muted/30 transition-colors">{children}</tr>,
                              th: ({children}) => <th className="px-4 py-2.5 text-left font-semibold text-foreground whitespace-nowrap">{children}</th>,
                              td: ({children}) => <td className="px-4 py-2.5 text-muted-foreground">{children}</td>,
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap break-words leading-relaxed">
                          {message.content}
                        </p>
                      )}
                    </div>
                    {message.role === "assistant" && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => exportToPDF(message.content, index)}
                          className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                        >
                          <FileDown className="h-3.5 w-3.5 mr-1" />
                          PDF
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => exportToWord(message.content, index)}
                          className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                        >
                          <FileDown className="h-3.5 w-3.5 mr-1" />
                          Word
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-4 animate-fade-in">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-accent" />
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area (shown when in conversation) */}
        {messages.length > 0 && (
          <div className="border-t border-border bg-background p-4 shrink-0">
            <div className="max-w-3xl mx-auto">
              {/* Quick actions when documents are loaded */}
              {sessionDocuments.length > 0 && (
                <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInput("Please summarize the key points from all documents.");
                    }}
                    className="shrink-0 text-xs gap-1.5 rounded-full"
                  >
                    <ListChecks className="h-3.5 w-3.5" />
                    Summarize all
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInput("What are the main findings or conclusions?");
                    }}
                    className="shrink-0 text-xs gap-1.5 rounded-full"
                  >
                    <Search className="h-3.5 w-3.5" />
                    Key findings
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInput("Compare and contrast the information across all uploaded documents.");
                    }}
                    className="shrink-0 text-xs gap-1.5 rounded-full"
                  >
                    📊 Compare docs
                  </Button>
                </div>
              )}
              
              <div className="relative flex items-end gap-2 bg-muted rounded-2xl border border-border/50 p-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.xlsx,.xls,.doc,.docx,.txt,.csv,.json,image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="shrink-0 h-9 w-9 rounded-xl"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                
                <div className="flex-1 relative">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Ask about your documents..."
                    disabled={isLoading}
                    className="min-h-[44px] max-h-[200px] resize-none bg-transparent border-0 focus-visible:ring-0 py-3 px-2"
                    rows={1}
                  />
                  {uploadedFiles.length > 0 && (
                    <div className="absolute -top-10 left-0 flex gap-1">
                      {uploadedFiles.map((file, index) => (
                        <span key={index} className="text-xs px-2 py-1 bg-background rounded-full border border-border flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {file.name.length > 15 ? file.name.slice(0, 15) + '...' : file.name}
                          <button onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}>
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handleSend()}
                  disabled={isLoading || (!input.trim() && uploadedFiles.length === 0)}
                  size="icon"
                  className="shrink-0 h-9 w-9 rounded-xl"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <ArrowUp className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Data.chat can make mistakes. Consider checking important information.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DataChat;
