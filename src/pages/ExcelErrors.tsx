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
  {
    error: "#CALC!",
    description: "Calculation Error - occurs in array formulas when the array size is inconsistent",
    severity: "medium",
    category: "Array",
  },
  {
    error: "#GETTING_DATA",
    description: "Temporary status shown while Excel retrieves external data",
    severity: "low",
    category: "Data Connection",
  },
  {
    error: "Circular Reference",
    description: "Formula refers back to itself directly or indirectly, creating an endless loop",
    severity: "high",
    category: "Formula Logic",
  },
  {
    error: "#BLOCKED!",
    description: "Formula references blocked external content or unverified data connection",
    severity: "high",
    category: "Security",
  },
  {
    error: "#CONNECT!",
    description: "Excel can't connect to external data source or Power Query connection failed",
    severity: "medium",
    category: "Data Connection",
  },
  {
    error: "#FIELD!",
    description: "Invalid field reference in data model or PivotTable formula",
    severity: "medium",
    category: "Data Model",
  },
  {
    error: "#UNKNOWN!",
    description: "Function not recognized - often happens with formulas from newer Excel versions",
    severity: "medium",
    category: "Compatibility",
  },
  {
    error: "Volatile Functions",
    description: "Functions like NOW(), RAND(), OFFSET() recalculate every time any cell changes, slowing down large workbooks",
    severity: "medium",
    category: "Performance",
    solution: "Minimize use of volatile functions. Replace NOW() with static timestamps, use INDEX instead of OFFSET, and convert INDIRECT references to direct references when possible. For RAND(), press F9 to convert to static values after generation."
  },
  {
    error: "Array Formula Issues",
    description: "Legacy array formulas (Ctrl+Shift+Enter) may not work correctly or cause calculation errors",
    severity: "medium",
    category: "Array",
    solution: "In Excel 365, use dynamic array formulas instead of legacy CSE arrays. Replace {=SUM(A1:A10*B1:B10)} with =SUM(A1:A10*B1:B10). For older Excel versions, ensure you press Ctrl+Shift+Enter and see curly braces around the formula."
  },
  {
    error: "External Link Broken",
    description: "Formulas referencing other workbooks show #REF! or update prompts when files are moved/renamed",
    severity: "high",
    category: "Links",
    solution: "Go to Data > Edit Links to update paths. To break links and convert to values: Copy the linked cells > Paste Special > Values. Use INDIRECT with defined names as a workaround for dynamic file paths."
  },
  {
    error: "Merged Cell Problems",
    description: "Merged cells cause errors with sorting, filtering, and formula references",
    severity: "medium",
    category: "Formatting",
    solution: "Unmerge cells and use 'Center Across Selection' instead: Select cells > Format Cells > Alignment > Horizontal > Center Across Selection. For formulas, reference only the top-left cell of previously merged ranges."
  },
  {
    error: "Text Formatted Numbers",
    description: "Numbers stored as text cause formula errors and SUM functions to ignore them",
    severity: "high",
    category: "Data Type",
    solution: "Select affected cells > Click the warning icon > Convert to Number. Or multiply by 1: =A1*1. For multiple cells, put 1 in a cell, copy it, select number cells, Paste Special > Multiply. Use VALUE() function to convert: =VALUE(A1)."
  },
  {
    error: "Date Serial Issues",
    description: "Dates showing as numbers (e.g., 45231) or text dates not being recognized by formulas",
    severity: "medium",
    category: "Date/Time",
    solution: "For numbers showing as dates: Format > Number > Date. For text dates: Use DATEVALUE() function or Text to Columns (Data tab) > Date format. Ensure consistent date formats across your workbook. Use DATE(year,month,day) to construct dates programmatically."
  },
  {
    error: "Slow Calculation",
    description: "Excel takes too long to recalculate, especially with complex formulas or large datasets",
    severity: "low",
    category: "Performance",
    solution: "Set calculation to Manual: Formulas > Calculation Options > Manual. Replace volatile functions (NOW, TODAY, RAND, OFFSET). Use tables instead of entire column references (A:A). Break complex formulas into helper columns. Disable automatic workbook saving during heavy calculations."
  },
  {
    error: "Lookup Return Wrong Value",
    description: "VLOOKUP/XLOOKUP returns incorrect results even when value exists",
    severity: "high",
    category: "Lookup",
    solution: "Check for: 1) Extra spaces - use TRIM(). 2) Different data types - ensure both text or both numbers. 3) Approximate match when you need exact - use FALSE/0 as last parameter. 4) Hidden characters - use CLEAN(). 5) Duplicate values in lookup column - VLOOKUP returns first match only."
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
          content="excel errors, fix excel errors, #N/A error, #DIV/0 error, #VALUE error, #REF error, excel troubleshooting, formula errors, #SPILL error, #CALC error, circular reference"
        />
        <link rel="canonical" href="https://skillbi.in/excel-errors" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is the #N/A error in Excel?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The #N/A error occurs when a lookup function can't find the value you're searching for. Common with VLOOKUP, XLOOKUP, and MATCH functions."
                }
              },
              {
                "@type": "Question",
                "name": "How do I fix #DIV/0! error in Excel?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Use IFERROR to handle division by zero: =IFERROR(A1/B1,0) or check before dividing: =IF(B1=0,\"Error\",A1/B1)"
                }
              },
              {
                "@type": "Question",
                "name": "What causes #REF! error in Excel?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "#REF! error happens when a cell reference is deleted or invalid. Check your formulas for references to deleted cells or sheets."
                }
              }
            ]
          })}
        </script>
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
                  ) : error.solution ? (
                    <div className="text-sm text-foreground space-y-2">
                      <p className="font-semibold text-primary">Solution:</p>
                      <p className="leading-relaxed">{error.solution}</p>
                    </div>
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
              <div>
                <h3 className="font-semibold mb-2">5. Enable Error Checking</h3>
                <p className="text-muted-foreground">
                  Go to File → Options → Formulas → Enable background error checking to catch common errors automatically.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">6. Use Formula Auditing Tools</h3>
                <p className="text-muted-foreground">
                  Formulas tab → Formula Auditing → Trace Precedents/Dependents to visualize formula relationships.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">7. Check Data Types</h3>
                <p className="text-muted-foreground">
                  Ensure cells contain the correct data type (numbers vs text). Use VALUE() or TEXT() functions to convert.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">8. Review Circular References</h3>
                <p className="text-muted-foreground">
                  Formulas tab → Error Checking → Circular References to locate and fix circular reference errors.
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
