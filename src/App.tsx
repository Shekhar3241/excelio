import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import Index from "./pages/Index";
import About from "./pages/About";
import Category from "./pages/Category";
import FormulaDetail from "./pages/FormulaDetail";
import Favorites from "./pages/Favorites";
import Recent from "./pages/Recent";
import AIFormulaGenerator from "./pages/AIFormulaGenerator";

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
import VBAGenerator from "./pages/VBAGenerator";
import ExcelToPdf from "./pages/ExcelToPdf";
import AdminResourceSetup from "./pages/AdminResourceSetup";
import PremiumBudgetDownload from "./pages/PremiumBudgetDownload";
import SentimentAnalysis from "./pages/SentimentAnalysis";
import SQLGenerator from "./pages/SQLGenerator";
import MergePdf from "./pages/MergePdf";
import CompressPdf from "./pages/CompressPdf";

import PdfConverter from "./pages/PdfConverter";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:blogId" element={<BlogPost />} />
            <Route path="/ai-generator" element={<AIFormulaGenerator />} />
            <Route path="/simulator" element={<AIFormulaGenerator />} />
            <Route path="/sentiment-analysis" element={<SentimentAnalysis />} />
            <Route path="/sql-generator" element={<SQLGenerator />} />
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
            <Route path="/excel-to-pdf" element={<ExcelToPdf />} />
            <Route path="/vba-generator" element={<VBAGenerator />} />
            <Route path="/premium-budget" element={<PremiumBudgetDownload />} />
            <Route path="/admin/resource-setup" element={<AdminResourceSetup />} />
            <Route path="/merge-pdf" element={<MergePdf />} />
            <Route path="/compress-pdf" element={<CompressPdf />} />
            
            <Route path="/pdf-converter" element={<PdfConverter />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
