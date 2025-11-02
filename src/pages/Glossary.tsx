import { Helmet } from "react-helmet";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const glossaryTerms = [
  {
    term: "Absolute Reference",
    definition: "A cell reference that doesn't change when copied to another cell, indicated by dollar signs (e.g., $A$1).",
    example: "=SUM($A$1:$A$10)",
    category: "References",
  },
  {
    term: "Array",
    definition: "A range of cells or a collection of values that are treated as a single unit in a formula.",
    example: "{1,2,3,4,5}",
    category: "Data Structures",
  },
  {
    term: "Array Formula",
    definition: "A formula that can perform multiple calculations on one or more items in an array.",
    example: "=SUM(A1:A10*B1:B10)",
    category: "Formulas",
  },
  {
    term: "Cell",
    definition: "The basic unit of a worksheet where data is entered, identified by column letter and row number.",
    example: "A1, B2, C3",
    category: "Basics",
  },
  {
    term: "Cell Reference",
    definition: "The address of a cell in a worksheet, used in formulas to refer to cell values.",
    example: "A1, B2:B10",
    category: "References",
  },
  {
    term: "Circular Reference",
    definition: "A formula that refers back to its own cell, either directly or indirectly, creating a loop.",
    example: "Cell A1 contains =A1+1",
    category: "Errors",
  },
  {
    term: "Conditional Formatting",
    definition: "A feature that automatically formats cells based on their values or specified conditions.",
    example: "Highlighting cells > 100 in red",
    category: "Formatting",
  },
  {
    term: "Data Validation",
    definition: "A feature that restricts the type of data or values that users can enter into a cell.",
    example: "Only allow numbers between 1-100",
    category: "Data Management",
  },
  {
    term: "Dynamic Array",
    definition: "A formula that returns multiple values automatically spilling into adjacent cells.",
    example: "=SORT(A1:A10)",
    category: "Formulas",
  },
  {
    term: "Formula",
    definition: "An equation that performs calculations on values in your worksheet, always starts with '='.",
    example: "=A1+B1",
    category: "Formulas",
  },
  {
    term: "Function",
    definition: "A predefined formula in Excel that performs a specific calculation.",
    example: "SUM, VLOOKUP, IF",
    category: "Formulas",
  },
  {
    term: "Mixed Reference",
    definition: "A cell reference with one absolute and one relative component (e.g., $A1 or A$1).",
    example: "$A1 or A$1",
    category: "References",
  },
  {
    term: "Named Range",
    definition: "A descriptive name assigned to a cell or range of cells for easier reference in formulas.",
    example: "Sales_Data instead of A1:A10",
    category: "References",
  },
  {
    term: "Nested Function",
    definition: "A function used inside another function to perform complex calculations.",
    example: "=IF(SUM(A1:A10)>100,'High','Low')",
    category: "Formulas",
  },
  {
    term: "Operator",
    definition: "A symbol that specifies the type of calculation to perform (+, -, *, /, ^, &).",
    example: "+, -, *, /, ^",
    category: "Basics",
  },
  {
    term: "Pivot Table",
    definition: "A data summarization tool that automatically sorts, counts, and totals data stored in a table.",
    example: "Summarizing sales by region",
    category: "Data Analysis",
  },
  {
    term: "Range",
    definition: "A group of two or more cells in a worksheet, can be contiguous or non-contiguous.",
    example: "A1:D10 or A1,C3,E5",
    category: "Basics",
  },
  {
    term: "Relative Reference",
    definition: "A cell reference that changes when copied to another cell (default reference type).",
    example: "A1, B2",
    category: "References",
  },
  {
    term: "Spill Range",
    definition: "The range of cells where dynamic array results automatically populate.",
    example: "Result of =UNIQUE(A1:A10)",
    category: "Data Structures",
  },
  {
    term: "Table",
    definition: "A structured range of data with headers, allowing for easier data management and analysis.",
    example: "Created with Ctrl+T or Insert > Table",
    category: "Data Management",
  },
  {
    term: "Volatile Function",
    definition: "A function that recalculates every time Excel recalculates, even if its arguments haven't changed.",
    example: "NOW(), TODAY(), RAND()",
    category: "Functions",
  },
  {
    term: "Wildcard",
    definition: "Special characters (* and ?) used in search criteria to represent one or more characters.",
    example: "* = any characters, ? = one character",
    category: "Search",
  },
  {
    term: "Worksheet",
    definition: "A single sheet within an Excel workbook, containing rows and columns of cells.",
    example: "Sheet1, Sheet2",
    category: "Basics",
  },
  {
    term: "Workbook",
    definition: "An Excel file containing one or more worksheets.",
    example: "Budget.xlsx",
    category: "Basics",
  },
];

export default function Glossary() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTerms = glossaryTerms.filter(
    (item) =>
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [...new Set(glossaryTerms.map((t) => t.category))].sort();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Excel Glossary - Complete Dictionary of Excel Terms & Definitions</title>
        <meta
          name="description"
          content="Comprehensive Excel glossary with definitions of key terms including formulas, functions, cell references, arrays, pivot tables, and more. Learn Excel terminology."
        />
        <meta
          name="keywords"
          content="excel glossary, excel terms, excel definitions, excel dictionary, cell reference, formula, function, pivot table, array, range"
        />
        <link rel="canonical" href="https://yourdomain.com/glossary" />
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
              <BreadcrumbPage>Glossary</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-10 w-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">Excel Glossary</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mb-6">
            Your comprehensive dictionary of Excel terminology. Search and browse definitions for formulas, functions, cell references, and essential Excel concepts.
          </p>

          <Input
            type="search"
            placeholder="Search terms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredTerms.length} of {glossaryTerms.length} terms
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {filteredTerms.map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-xl">{item.term}</CardTitle>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>
                <CardDescription className="text-base">{item.definition}</CardDescription>
              </CardHeader>
              {item.example && (
                <CardContent>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Example:</p>
                  <code className="text-sm bg-muted px-2 py-1 rounded">{item.example}</code>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {filteredTerms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No terms found matching your search.</p>
          </div>
        )}

        <section className="mt-12">
          <h2 className="text-3xl font-bold mb-6">Browse by Category</h2>
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSearchQuery(category)}
                className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-left transition-colors"
              >
                {category} ({glossaryTerms.filter((t) => t.category === category).length})
              </button>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-bold mb-4">Related Resources</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Excel Functions</CardTitle>
                <CardDescription>Browse all Excel functions with examples</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/functions" className="text-primary hover:underline font-medium">
                  View functions →
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Excel Errors Guide</CardTitle>
                <CardDescription>Fix common Excel errors quickly</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/excel-errors" className="text-primary hover:underline font-medium">
                  View errors →
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Blog & Tutorials</CardTitle>
                <CardDescription>Step-by-step Excel guides</CardDescription>
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
