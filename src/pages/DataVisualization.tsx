import { useState } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Plus, Trash2, BarChart3 } from "lucide-react";
import { toast } from "sonner";

interface DataPoint {
  name: string;
  value: number;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#8b5cf6', '#ec4899', '#f59e0b'];

export default function DataVisualization() {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'area'>('bar');
  const [data, setData] = useState<DataPoint[]>([
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
  ]);
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');

  const addDataPoint = () => {
    if (!newName || !newValue) {
      toast.error("Please enter both name and value");
      return;
    }
    setData([...data, { name: newName, value: parseFloat(newValue) }]);
    setNewName('');
    setNewValue('');
    toast.success("Data point added");
  };

  const removeDataPoint = (index: number) => {
    setData(data.filter((_, i) => i !== index));
    toast.success("Data point removed");
  };

  const exportChart = () => {
    toast.success("Chart exported! (Demo)");
    // In real implementation, use html2canvas or similar
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="hsl(var(--primary))" />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="hsl(var(--primary))"
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
          </AreaChart>
        );
    }
  };

  return (
    <>
      <Helmet>
        <title>Data Visualization Tool - Create Excel Charts & Export Visualizations</title>
        <meta name="description" content="Create beautiful charts from your data. Interactive chart builder with bar, line, pie, and area charts. Export as images." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Data Visualization Tool
              </h1>
              <p className="text-lg text-muted-foreground">
                Create beautiful charts from your data with our interactive chart builder
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Data Input Panel */}
              <div className="md:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Chart Type</CardTitle>
                    <CardDescription>Choose your visualization style</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Select value={chartType} onValueChange={(v) => setChartType(v as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bar">Bar Chart</SelectItem>
                        <SelectItem value="line">Line Chart</SelectItem>
                        <SelectItem value="pie">Pie Chart</SelectItem>
                        <SelectItem value="area">Area Chart</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Add Data</CardTitle>
                    <CardDescription>Enter data points for your chart</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Label</Label>
                      <Input
                        id="name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="e.g., January"
                      />
                    </div>
                    <div>
                      <Label htmlFor="value">Value</Label>
                      <Input
                        id="value"
                        type="number"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        placeholder="e.g., 100"
                      />
                    </div>
                    <Button onClick={addDataPoint} className="w-full gap-2">
                      <Plus className="h-4 w-4" />
                      Add Data Point
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Current Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {data.map((point, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm">
                            <span className="font-semibold">{point.name}:</span> {point.value}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDataPoint(idx)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Chart Display */}
              <div className="md:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-primary" />
                          Your Chart
                        </CardTitle>
                        <CardDescription>Live preview of your visualization</CardDescription>
                      </div>
                      <Button onClick={exportChart} variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full h-[500px] flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        {renderChart()}
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Chart Recommendations */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Chart Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="bar">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="bar">Bar</TabsTrigger>
                        <TabsTrigger value="line">Line</TabsTrigger>
                        <TabsTrigger value="pie">Pie</TabsTrigger>
                        <TabsTrigger value="area">Area</TabsTrigger>
                      </TabsList>
                      <TabsContent value="bar" className="mt-4">
                        <p className="text-sm text-muted-foreground">
                          <strong>Best for:</strong> Comparing values across categories, showing rankings, or displaying discrete data points.
                        </p>
                      </TabsContent>
                      <TabsContent value="line" className="mt-4">
                        <p className="text-sm text-muted-foreground">
                          <strong>Best for:</strong> Showing trends over time, continuous data, or relationships between variables.
                        </p>
                      </TabsContent>
                      <TabsContent value="pie" className="mt-4">
                        <p className="text-sm text-muted-foreground">
                          <strong>Best for:</strong> Showing proportions and percentages of a whole. Works best with 3-6 categories.
                        </p>
                      </TabsContent>
                      <TabsContent value="area" className="mt-4">
                        <p className="text-sm text-muted-foreground">
                          <strong>Best for:</strong> Emphasizing magnitude of change over time and showing cumulative totals.
                        </p>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}