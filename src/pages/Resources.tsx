import { useState } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileSpreadsheet, FileText, BookOpen, Building2 } from "lucide-react";
import { resources, categories, industries } from "@/data/resources";
import { toast } from "sonner";

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIndustry, setSelectedIndustry] = useState("All");

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    const matchesIndustry = selectedIndustry === "All" || resource.industry === selectedIndustry;

    return matchesSearch && matchesCategory && matchesIndustry;
  });

  const handleDownload = (resource: typeof resources[0]) => {
    toast.success(`Downloading ${resource.title}...`);
    // In a real implementation, this would trigger an actual download
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'template':
        return <FileSpreadsheet className="h-5 w-5" />;
      case 'cheat-sheet':
        return <FileText className="h-5 w-5" />;
      case 'workbook':
        return <BookOpen className="h-5 w-5" />;
      case 'industry':
        return <Building2 className="h-5 w-5" />;
      default:
        return <FileSpreadsheet className="h-5 w-5" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Downloadable Resources - Excel Templates, Cheat Sheets & Practice Workbooks</title>
        <meta name="description" content="Download free Excel templates, PDF cheat sheets, and practice workbooks. Industry-specific templates for accounting, sales, HR, and more." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Resource Library
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Download professional Excel templates, quick reference guides, and practice workbooks to boost your productivity
            </p>
            
            <div className="max-w-2xl mx-auto">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search resources by name, type, or tag..."
              />
            </div>
          </div>

          {/* Categories Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2 h-auto p-1">
              {categories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.id} className="flex items-center gap-2">
                  <span>{cat.label}</span>
                  <Badge variant="secondary" className="ml-auto">{cat.count}</Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Industry Filter (only for industry-specific) */}
          {selectedCategory === 'industry' && (
            <div className="mb-6 flex flex-wrap gap-2">
              <span className="text-sm font-medium text-muted-foreground">Industry:</span>
              {industries.map((industry) => (
                <Button
                  key={industry}
                  variant={selectedIndustry === industry ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedIndustry(industry)}
                >
                  {industry}
                </Button>
              ))}
            </div>
          )}

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                      {getCategoryIcon(resource.category)}
                    </div>
                    <Badge variant="outline">.{resource.fileType}</Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {resource.title}
                  </CardTitle>
                  {resource.industry && (
                    <Badge variant="secondary" className="w-fit">
                      {resource.industry}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 min-h-[48px]">
                    {resource.description}
                  </CardDescription>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {resource.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {resource.downloads.toLocaleString()} downloads
                    </span>
                    <Button 
                      onClick={() => handleDownload(resource)}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <FileSpreadsheet className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No resources found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}