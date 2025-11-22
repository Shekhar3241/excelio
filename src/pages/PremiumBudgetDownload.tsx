import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileSpreadsheet, TrendingUp, Target, PieChart, BarChart3, Calendar, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { generatePremiumBudgetTracker } from "@/utils/generateTemplates";
import { toast } from "sonner";

export default function PremiumBudgetDownload() {
  const handleDownload = () => {
    try {
      const blob = generatePremiumBudgetTracker();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Premium-Budget-Tracker-2025.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Download started!", {
        description: "Your premium budget tracker is downloading now."
      });
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Download failed", {
        description: "Please try again or contact support."
      });
    }
  };

  const features = [
    {
      icon: <PieChart className="h-8 w-8 text-primary" />,
      title: "Dashboard Overview",
      description: "Real-time financial health metrics with automatic calculations"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "Income Tracking",
      description: "Track multiple income sources with year-to-date summaries"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: "Expense Categories",
      description: "20+ detailed expense categories with percentage analysis"
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Savings Goals",
      description: "Track short, medium, and long-term goals with progress indicators"
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary" />,
      title: "Monthly Summary",
      description: "Year-over-year analysis with trend identification"
    },
    {
      icon: <FileSpreadsheet className="h-8 w-8 text-primary" />,
      title: "6 Integrated Sheets",
      description: "Professional organization with 100+ automatic formulas"
    }
  ];

  const included = [
    "Dashboard with KPIs and quick stats",
    "Income tracker with YTD calculations",
    "Detailed expense tracking (20+ categories)",
    "Savings goals with months-to-goal calculations",
    "Monthly summary with projections",
    "Comprehensive user guide",
    "Advanced Excel formulas included",
    "Percentage-based spending analysis",
    "Automatic deficit/surplus calculations",
    "Professional formatting and design"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6 animate-fade-in">
            <div className="inline-block p-3 rounded-2xl bg-primary/10 backdrop-blur-sm">
              <FileSpreadsheet className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent">
              Premium Budget Tracker 2025
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Take control of your finances with our comprehensive, professionally-designed budget tracker. 
              Features 6 integrated sheets, 100+ automatic calculations, and everything you need for complete financial management.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button 
                onClick={handleDownload}
                size="lg"
                className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <Download className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                Download Now - Free
              </Button>
              <p className="text-sm text-muted-foreground">
                No signup required • Instant download • Excel format
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* What's Included Section */}
          <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
            <CardHeader>
              <CardTitle className="text-3xl text-center">What's Included</CardTitle>
              <CardDescription className="text-center text-lg">
                Everything you need for professional financial management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {included.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-background/50 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sheets Breakdown */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-3xl text-center">6 Integrated Sheets</CardTitle>
              <CardDescription className="text-center text-lg">
                Comprehensive tracking across multiple worksheets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3 p-6 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10">
                  <h3 className="text-xl font-semibold text-primary">1. Dashboard</h3>
                  <p className="text-muted-foreground">
                    Financial overview with total income, expenses, savings rate, budget health status, top expense categories, and quick stats.
                  </p>
                </div>
                
                <div className="space-y-3 p-6 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10">
                  <h3 className="text-xl font-semibold text-primary">2. Income Tracker</h3>
                  <p className="text-muted-foreground">
                    Track primary and secondary income sources with budgeted vs actual comparisons and year-to-date calculations.
                  </p>
                </div>
                
                <div className="space-y-3 p-6 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10">
                  <h3 className="text-xl font-semibold text-primary">3. Expenses</h3>
                  <p className="text-muted-foreground">
                    Detailed expense tracking with 20+ categories including housing, utilities, transportation, food, insurance, and personal expenses.
                  </p>
                </div>
                
                <div className="space-y-3 p-6 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10">
                  <h3 className="text-xl font-semibold text-primary">4. Savings Goals</h3>
                  <p className="text-muted-foreground">
                    Set and track short, medium, and long-term financial goals with automatic progress calculations and months-to-goal projections.
                  </p>
                </div>
                
                <div className="space-y-3 p-6 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10">
                  <h3 className="text-xl font-semibold text-primary">5. Monthly Summary</h3>
                  <p className="text-muted-foreground">
                    Track monthly trends throughout the year with income, expenses, savings, and savings rate analysis plus year-end projections.
                  </p>
                </div>
                
                <div className="space-y-3 p-6 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10">
                  <h3 className="text-xl font-semibold text-primary">6. Instructions</h3>
                  <p className="text-muted-foreground">
                    Comprehensive user guide with tips for success, feature explanations, and best practices for budget management.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="border-primary bg-gradient-to-br from-primary/10 to-primary/5 text-center">
            <CardContent className="pt-12 pb-12 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to Master Your Finances?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Download your free Premium Budget Tracker now and start taking control of your financial future today.
              </p>
              <Button 
                onClick={handleDownload}
                size="lg"
                className="text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
              >
                <Download className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                Download Premium Budget Tracker
              </Button>
              <p className="text-sm text-muted-foreground pt-4">
                100% Free • No Email Required • Instant Download • Commercial License Included
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
