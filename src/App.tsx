import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { ChatBot } from "@/components/ChatBot";
import Index from "./pages/Index";
import About from "./pages/About";
import Category from "./pages/Category";
import FormulaDetail from "./pages/FormulaDetail";
import Favorites from "./pages/Favorites";
import Recent from "./pages/Recent";
import AIFormulaGenerator from "./pages/AIFormulaGenerator";
import Simulator from "./pages/Simulator";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import NotFound from "./pages/NotFound";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Functions from "./pages/Functions";
import ExcelErrors from "./pages/ExcelErrors";
import Glossary from "./pages/Glossary";
import Resources from "./pages/Resources";
import FileAnalyzer from "./pages/FileAnalyzer";
import DataVisualization from "./pages/DataVisualization";
import VBAGenerator from "./pages/VBAGenerator";
import ExcelToPdf from "./pages/ExcelToPdf";
import AdminResourceSetup from "./pages/AdminResourceSetup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ChatBot />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:blogId" element={<BlogPost />} />
            <Route path="/ai-generator" element={<AIFormulaGenerator />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/recent" element={<Recent />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/category/:categoryId" element={<Category />} />
            <Route path="/formula/:formulaId" element={<FormulaDetail />} />
            <Route path="/functions" element={<Functions />} />
            <Route path="/excel-errors" element={<ExcelErrors />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/file-analyzer" element={<FileAnalyzer />} />
            <Route path="/data-visualization" element={<DataVisualization />} />
            <Route path="/vba-generator" element={<VBAGenerator />} />
            <Route path="/excel-to-pdf" element={<ExcelToPdf />} />
            <Route path="/admin/resource-setup" element={<AdminResourceSetup />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
