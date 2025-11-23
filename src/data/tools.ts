import { Database, FileSpreadsheet, Smile, FileText, Code2, Hash, FileCode, Table, FileImage } from "lucide-react";

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: any;
  iconColor: string;
  path: string;
}

export const tools: Tool[] = [
  {
    id: "ai-data-analysis",
    name: "AI Data Analysis Chat",
    description: "Upload your files and chat with AI to analyze data, get insights, and interact with Excel, PDF, and other documents.",
    icon: Database,
    iconColor: "hsl(270, 60%, 60%)",
    path: "/ai-generator"
  },
  {
    id: "sentiment-analysis",
    name: "Sentiment Analysis Tool",
    description: "Upload a file or list of text to generate the sentiment - positive, negative or neutral.",
    icon: Smile,
    iconColor: "hsl(35, 100%, 60%)",
    path: "/sentiment-analysis"
  },
  {
    id: "pdf-to-excel",
    name: "PDF to Excel AI Converter",
    description: "Convert your PDF into an Excel file in seconds.",
    icon: FileText,
    iconColor: "hsl(0, 75%, 60%)",
    path: "/excel-to-pdf"
  },
  {
    id: "sql-query-generator",
    name: "AI SQL Query Generator",
    description: "Convert your text instructions into SQL queries - powered by AI.",
    icon: Code2,
    iconColor: "hsl(195, 75%, 60%)",
    path: "/sql-generator"
  },
  {
    id: "vba-code-generator",
    name: "AI Excel VBA Code Generator",
    description: "Generate Excel VBA (Visual Basic for Applications) code to automate tasks and create personalized solutions within Microsoft Excel.",
    icon: Code2,
    iconColor: "hsl(15, 75%, 60%)",
    path: "/vba-generator"
  },
  {
    id: "merge-pdf",
    name: "Merge PDF Files",
    description: "Combine multiple PDF files into a single document with ease.",
    icon: FileText,
    iconColor: "hsl(280, 75%, 60%)",
    path: "/merge-pdf"
  },
  {
    id: "compress-pdf",
    name: "Compress PDF",
    description: "Reduce PDF file size while maintaining quality.",
    icon: Hash,
    iconColor: "hsl(320, 75%, 60%)",
    path: "/compress-pdf"
  },
  {
    id: "pdf-converter",
    name: "AI PDF Converter",
    description: "Convert PDF to Word, Markdown, HTML & more using AI.",
    icon: FileCode,
    iconColor: "hsl(280, 75%, 60%)",
    path: "/pdf-converter"
  },
  {
    id: "image-to-pdf",
    name: "Image to PDF",
    description: "Convert and combine images into PDF documents.",
    icon: FileImage,
    iconColor: "hsl(340, 75%, 60%)",
    path: "/image-to-pdf"
  },
  {
    id: "word-to-pdf",
    name: "Word to PDF",
    description: "Convert Word documents to PDF format.",
    icon: FileText,
    iconColor: "hsl(210, 75%, 60%)",
    path: "/word-to-pdf"
  }
];
