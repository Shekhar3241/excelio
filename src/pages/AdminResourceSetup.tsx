import { useState } from "react";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  generatePersonalBudget,
  generateBusinessBudget,
  generateProjectCalendar,
  generateSalesTracker,
  generateInventoryTracker,
  uploadTemplateToStorage
} from "@/utils/generateTemplates";

export default function AdminResourceSetup() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<Record<string, boolean>>({});

  const templates = [
    { name: 'Personal Budget', path: 'templates/personal-budget.xlsx', generator: generatePersonalBudget },
    { name: 'Business Budget', path: 'templates/business-budget.xlsx', generator: generateBusinessBudget },
    { name: 'Project Calendar', path: 'templates/project-calendar.xlsx', generator: generateProjectCalendar },
    { name: 'Sales Tracker', path: 'templates/sales-tracker.xlsx', generator: generateSalesTracker },
    { name: 'Inventory Tracker', path: 'templates/inventory-tracker.xlsx', generator: generateInventoryTracker },
  ];

  const handleGenerateAll = async () => {
    setIsGenerating(true);
    setUploadStatus({});
    const newStatus: Record<string, boolean> = {};

    toast.loading('Generating and uploading templates...', { id: 'upload' });

    for (const template of templates) {
      try {
        const blob = template.generator();
        await uploadTemplateToStorage(blob, template.path);
        newStatus[template.name] = true;
        setUploadStatus({ ...newStatus });
        toast.success(`✓ ${template.name} uploaded`, { id: `upload-${template.name}` });
      } catch (error) {
        console.error(`Error uploading ${template.name}:`, error);
        newStatus[template.name] = false;
        toast.error(`✗ ${template.name} failed`, { id: `upload-${template.name}` });
      }
    }

    setIsGenerating(false);
    toast.success('All templates processed!', { id: 'upload' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Resource Setup
            </h1>
            <p className="text-lg text-muted-foreground">
              Generate and upload Excel templates to the resource library
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Generate Templates</CardTitle>
              <CardDescription>
                Click below to generate all Excel templates and upload them to storage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button 
                onClick={handleGenerateAll}
                disabled={isGenerating}
                className="w-full gap-2"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    Generate All Templates
                  </>
                )}
              </Button>

              {Object.keys(uploadStatus).length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold mb-3">Upload Status:</h3>
                  {templates.map((template) => (
                    <div key={template.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">{template.name}</span>
                      {uploadStatus[template.name] !== undefined && (
                        uploadStatus[template.name] ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <span className="text-red-500 text-sm">Failed</span>
                        )
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">Templates to Generate:</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Personal Budget Tracker (with formulas)</li>
                  <li>• Small Business Budget (quarterly)</li>
                  <li>• Project Timeline Calendar</li>
                  <li>• Sales Pipeline Tracker</li>
                  <li>• Inventory Management System</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
