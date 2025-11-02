import { Helmet } from "react-helmet";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { AlertCircle, Search, TrendingUp } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const commonErrors = [
  {
    error: "#N/A",
    description: "Value Not Available - occurs when a lookup function can't find the value",
    blogId: "fix-na-error-excel",
    severity: "high",
    category: "Lookup",
  },
  {
    error: "#DIV/0!",
    description: "Division by Zero - happens when dividing by zero or empty cell",
    blogId: "fix-div-zero-error",
    severity: "high",
    category: "Math",
  },
  {
    error: "#VALUE!",
    description: "Wrong Value Type - occurs when using wrong data type in formula",
    blogId: "vlookup-not-working",
    severity: "medium",
    category: "Formula",
  },
  {
    error: "#REF!",
    description: "Invalid Cell Reference - happens when a cell reference is deleted or invalid",
    severity: "high",
    category: "Reference",
  },
  {
    error: "#NAME?",
    description: "Excel doesn't recognize text in formula - usually a typo in function name",
    severity: "medium",
    category: "Syntax",
  },
  {
    error: "#NUM!",
    description: "Invalid Numeric Value - occurs when formula contains invalid numeric values",
    severity: "medium",
    category: "Math",
  },
  {
    error: "#NULL!",
    description: "Invalid Intersection - happens when using incorrect range operator",
    severity: "low",
    category: "Range",
  },
  {
    error: "#SPILL!",
    description: "Array Spill Error - occurs when dynamic array can't output all values",
    severity: "medium",
    category: "Array",
  },
];

const quickFixes = [
  {
    title: "VLOOKUP Not Working",
    description: "Common reasons and solutions for VLOOKUP failures",
    link: "/blog/vlookup-not-working",
  },
  {
    title: "Formula Errors Guide",
    description: "Complete guide to identifying and fixing Excel formula errors",
    link: "/blog/fix-na-error-excel",
  },
  {
    title: "Data Validation Errors",
    description: "How to prevent and fix data validation issues",
    link: "/functions",
  },
];

export default function ExcelErrors() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Most Common Excel Errors & How to Fix Them - Complete Guide</title>
        <meta
          name="description"
          content="Complete guide to fixing the most common Excel errors including #N/A, #DIV/0!, #VALUE!, #REF!, and more. Step-by-step solutions with examples."
        />
        <meta
          name="keywords"
          content="excel errors, fix excel errors, #N/A error, #DIV/0 error, #VALUE error, #REF error, excel troubleshooting, formula errors"
        />
        <link rel="canonical" href="https://yourdomain.com/excel-errors" />
        <meta property="og:title" content="Most Common Excel Errors & How to Fix Them" />
        <meta
          property="og:description"
          content="Complete guide to fixing the most common Excel errors. Learn how to troubleshoot and resolve #N/A, #DIV/0!, #VALUE!, and other Excel errors."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Excel Errors</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <h1 className="text-4xl md:text-5xl font-bold">Most Searched Excel Errors</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Encountering Excel errors? You're not alone. This comprehensive guide covers the most common Excel errors and provides step-by-step solutions to fix them quickly.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <Card className="border-primary/20">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <CardTitle>8 Common Errors</CardTitle>
              <CardDescription>
                Detailed explanations and fixes for the most frequent Excel errors
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <Search className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Quick Solutions</CardTitle>
              <CardDescription>
                Fast fixes and troubleshooting tips to resolve errors immediately
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <AlertCircle className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Prevention Tips</CardTitle>
              <CardDescription>
                Best practices to avoid common errors in your Excel workbooks
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Common Excel Error Codes</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {commonErrors.map((error, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <code className="text-2xl font-bold text-destructive">{error.error}</code>
                    <Badge
                      variant={
                        error.severity === "high"
                          ? "destructive"
                          : error.severity === "medium"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {error.severity}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{error.category} Error</CardTitle>
                  <CardDescription className="mt-2">{error.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {error.blogId ? (
                    <Link
                      to={`/blog/${error.blogId}`}
                      className="text-primary hover:underline text-sm font-medium"
                    >
                      View detailed solution →
                    </Link>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Solution guide coming soon
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Quick Fix Guides</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {quickFixes.map((fix, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{fix.title}</CardTitle>
                  <CardDescription>{fix.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    to={fix.link}
                    className="text-primary hover:underline font-medium"
                  >
                    Read guide →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <Card className="bg-muted">
            <CardHeader>
              <CardTitle className="text-2xl">General Troubleshooting Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. Check Your Formula Syntax</h3>
                <p className="text-muted-foreground">
                  Ensure all parentheses are properly closed and function names are spelled correctly.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">2. Verify Cell References</h3>
                <p className="text-muted-foreground">
                  Make sure all cell references exist and contain the expected data types.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">3. Use Error Handling Functions</h3>
                <p className="text-muted-foreground">
                  Wrap formulas with IFERROR() or IFNA() to handle errors gracefully.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">4. Check for Hidden Characters</h3>
                <p className="text-muted-foreground">
                  Use TRIM() and CLEAN() functions to remove extra spaces and non-printable characters.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">Related Resources</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Excel Functions Guide</CardTitle>
                <CardDescription>
                  Browse our complete library of Excel functions and formulas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/functions" className="text-primary hover:underline font-medium">
                  Explore functions →
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Excel Blog & Tutorials</CardTitle>
                <CardDescription>
                  Step-by-step guides and tutorials for Excel mastery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/blog" className="text-primary hover:underline font-medium">
                  Read tutorials →
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
