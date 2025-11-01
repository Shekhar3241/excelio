import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { blogPosts, blogCategories } from "@/data/blogs";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import { Helmet } from "react-helmet";

export default function Blog() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Excel Tips & Troubleshooting Blog | SkillBI's Hub</title>
        <meta 
          name="description" 
          content="Learn Excel with expert guides on formulas, troubleshooting, and productivity tips. Solve common Excel problems with our step-by-step tutorials." 
        />
        <meta 
          name="keywords" 
          content="Excel blog, Excel tips, Excel troubleshooting, Excel tutorials, Excel formulas guide, Excel how-to" 
        />
      </Helmet>

      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Excel Tips & Guides
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Solve real Excel problems with our comprehensive guides. Learn formulas, troubleshooting, and productivity tips.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          {blogCategories.map((category) => (
            <Badge 
              key={category.id} 
              variant="secondary" 
              className="text-sm px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {category.icon} {category.name}
            </Badge>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {blogPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.id}`}>
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 border-border bg-card cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {post.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground line-clamp-3">
                    {post.metaDescription}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.publishDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-16 p-8 bg-accent/50 rounded-lg border border-border text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Need Help with a Specific Excel Problem?
          </h2>
          <p className="text-muted-foreground mb-6">
            Use our AI-powered chat assistant to get instant answers to your Excel questions
          </p>
          <div className="text-sm text-muted-foreground">
            Click the chat icon at the bottom right of your screen to start
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
