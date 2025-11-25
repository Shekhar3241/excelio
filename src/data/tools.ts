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
    id: "convertx",
    name: "ConvertX",
    description: "27 free PDF tools for managing, editing, and converting PDF files directly in your browser.",
    icon: FileText,
    iconColor: "hsl(280, 75%, 60%)",
    path: "/converter"
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
  }
];
