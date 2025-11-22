import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileSpreadsheet, TrendingUp, Target, PieChart, BarChart3, Calendar, CheckCircle2, Sparkles, Zap, Shield } from "lucide-react";
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
      icon: <PieChart className="h-10 w-10" />,
      title: "Dashboard Overview",
      description: "Real-time financial health metrics with automatic calculations and instant insights"
    },
    {
      icon: <TrendingUp className="h-10 w-10" />,
      title: "Income Tracking",
      description: "Track multiple income sources with year-to-date summaries and growth trends"
    },
    {
      icon: <BarChart3 className="h-10 w-10" />,
      title: "Expense Categories",
      description: "20+ detailed expense categories with percentage analysis and smart alerts"
    },
    {
      icon: <Target className="h-10 w-10" />,
      title: "Savings Goals",
      description: "Track short, medium, and long-term goals with progress indicators and predictions"
    },
    {
      icon: <Calendar className="h-10 w-10" />,
      title: "Monthly Summary",
      description: "Year-over-year analysis with trend identification and future projections"
    },
    {
      icon: <FileSpreadsheet className="h-10 w-10" />,
      title: "6 Integrated Sheets",
      description: "Professional organization with 100+ automatic formulas and calculations"
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
    <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-glow/20 via-background to-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto space-y-20">
          {/* Hero Section */}
          <div className="text-center space-y-8 animate-fade-in relative">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10" />
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Premium Financial Tool
              </span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent leading-tight">
              Master Your
              <span className="block bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
                Finances
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
              The most comprehensive budget tracker for 2025. 6 integrated sheets, 100+ automatic calculations, 
              and everything you need for complete financial clarity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Button 
                onClick={handleDownload}
                size="lg"
                className="text-lg px-10 py-7 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:shadow-[0_0_60px_rgba(168,85,247,0.6)] transition-all duration-500 hover:scale-105 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Download className="mr-2 h-6 w-6 group-hover:animate-bounce relative z-10" />
                <span className="relative z-10">Download Now - Free</span>
              </Button>
              
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>No signup</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-accent" />
                  <span>Instant download</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="relative border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:-translate-y-2 animate-fade-in group overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="relative z-10">
                  <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 w-fit transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <div className="text-primary">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* What's Included Section */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/5 backdrop-blur-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
            <CardHeader className="relative z-10 text-center pb-8">
              <div className="inline-block mx-auto mb-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold">Complete Package</span>
                </div>
              </div>
              <CardTitle className="text-4xl md:text-5xl font-black mb-4">What's Included</CardTitle>
              <CardDescription className="text-lg max-w-2xl mx-auto">
                Everything you need for professional financial management in one powerful spreadsheet
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {included.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl bg-background/50 backdrop-blur-sm hover:bg-background/80 hover:shadow-md transition-all duration-300 animate-fade-in border border-border/50 group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    </div>
                    <span className="text-foreground leading-relaxed font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sheets Breakdown */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                6 Integrated Sheets
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive tracking across multiple professionally designed worksheets
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  num: "01",
                  title: "Dashboard",
                  desc: "Financial overview with total income, expenses, savings rate, budget health status, top expense categories, and quick stats.",
                  gradient: "from-primary/20 to-primary/5"
                },
                {
                  num: "02",
                  title: "Income Tracker",
                  desc: "Track primary and secondary income sources with budgeted vs actual comparisons and year-to-date calculations.",
                  gradient: "from-accent/20 to-accent/5"
                },
                {
                  num: "03",
                  title: "Expenses",
                  desc: "Detailed expense tracking with 20+ categories including housing, utilities, transportation, food, insurance, and personal expenses.",
                  gradient: "from-primary/20 to-primary/5"
                },
                {
                  num: "04",
                  title: "Savings Goals",
                  desc: "Set and track short, medium, and long-term financial goals with automatic progress calculations and months-to-goal projections.",
                  gradient: "from-accent/20 to-accent/5"
                },
                {
                  num: "05",
                  title: "Monthly Summary",
                  desc: "Track monthly trends throughout the year with income, expenses, savings, and savings rate analysis plus year-end projections.",
                  gradient: "from-primary/20 to-primary/5"
                },
                {
                  num: "06",
                  title: "Instructions",
                  desc: "Comprehensive user guide with tips for success, feature explanations, and best practices for budget management.",
                  gradient: "from-accent/20 to-accent/5"
                }
              ].map((sheet, index) => (
                <Card 
                  key={index}
                  className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:-translate-y-2 group"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${sheet.gradient} rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
                  <CardHeader className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-6xl font-black text-primary/20 group-hover:text-primary/30 transition-colors duration-500">
                        {sheet.num}
                      </span>
                    </div>
                    <CardTitle className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {sheet.title}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {sheet.desc}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-card to-accent/10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
            <CardContent className="pt-16 pb-16 space-y-8 relative z-10">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent leading-tight">
                  Ready to Master Your Finances?
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Download your free Premium Budget Tracker now and start taking control of your financial future today.
                </p>
              </div>
              
              <Button 
                onClick={handleDownload}
                size="lg"
                className="text-xl px-12 py-8 bg-gradient-to-r from-primary via-primary-dark to-primary hover:from-primary-dark hover:via-primary hover:to-primary-dark shadow-[0_0_50px_rgba(168,85,247,0.5)] hover:shadow-[0_0_80px_rgba(168,85,247,0.7)] transition-all duration-500 hover:scale-110 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Download className="mr-3 h-7 w-7 group-hover:animate-bounce relative z-10" />
                <span className="relative z-10 font-bold">Download Premium Budget Tracker</span>
              </Button>
              
              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>100% Free</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span>No Email Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Instant Download</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span>Commercial License Included</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
