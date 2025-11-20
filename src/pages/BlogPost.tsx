import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { blogPosts } from "@/data/blogs";
import { ArrowLeft, Clock, Calendar, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Helmet } from "react-helmet";

export default function BlogPost() {
  const { blogId } = useParams<{ blogId: string }>();
  const post = blogPosts.find(p => p.id === blogId);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <p className="text-center text-muted-foreground">Blog post not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Schema.org structured data for SEO
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.metaTitle,
    "description": post.metaDescription,
    "datePublished": post.publishDate,
    "author": {
      "@type": "Organization",
      "name": "SkillBI's Hub"
    },
    "publisher": {
      "@type": "Organization",
      "name": "SkillBI's Hub",
      "logo": {
        "@type": "ImageObject",
        "url": "https://skillbi.in/logo.png"
      }
    },
    "mainEntity": {
      "@type": "FAQPage",
      "mainEntity": post.faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{post.metaTitle}</title>
        <meta name="description" content={post.metaDescription} />
        <meta name="keywords" content={post.keywords.join(', ')} />
        <link rel="canonical" href={`https://skillbi.in/blog/${post.id}`} />
        
        <meta property="og:title" content={post.metaTitle} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://skillbi.in/blog/${post.id}`} />
        <meta property="article:published_time" content={post.publishDate} />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.metaTitle} />
        <meta name="twitter:description" content={post.metaDescription} />
        
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      <Header />
      
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/blog">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          <Badge variant="secondary" className="mb-4">
            {post.category}
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(post.publishDate).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readTime} read
            </div>
          </div>

          <p className="text-lg text-foreground leading-relaxed">
            {post.introduction}
          </p>
        </header>

        {/* Problem Question */}
        <section className="mb-8">
          <Card className="border-l-4 border-l-primary bg-accent/30">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">
                {post.problemQuestion}
              </CardTitle>
            </CardHeader>
          </Card>
        </section>

        {/* Quick Answer */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">Quick Answer</h2>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-foreground font-medium leading-relaxed">
                {post.quickAnswer}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Detailed Solution Steps */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-6">Step-by-Step Solution</h2>
          <div className="space-y-6">
            {post.detailedSteps.map((step) => (
              <Card key={step.step} className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-start gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
                      {step.step}
                    </span>
                    <span className="text-foreground">{step.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pl-14">
                  <p className="text-foreground mb-3 leading-relaxed whitespace-pre-line">
                    {step.description}
                  </p>
                  {step.example && (
                    <div className="p-4 bg-accent/50 rounded-lg space-y-2">
                      {step.example.split('\n').map((line, idx) => {
                        // Check if line contains a URL
                        const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
                        if (urlMatch) {
                          const url = urlMatch[1];
                          const beforeUrl = line.substring(0, line.indexOf(url));
                          const afterUrl = line.substring(line.indexOf(url) + url.length);
                          return (
                            <div key={idx} className="text-sm">
                              <span className="text-accent-foreground">{beforeUrl}</span>
                              <a 
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary-dark underline font-medium break-all"
                              >
                                {url}
                              </a>
                              <span className="text-accent-foreground">{afterUrl}</span>
                            </div>
                          );
                        }
                        return (
                          <div key={idx} className="text-sm text-accent-foreground">
                            {line}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Sample Data Table */}
        {post.sampleData && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">Example Data</h2>
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted">
                    {post.sampleData.headers.map((header, idx) => (
                      <TableHead key={idx} className="font-semibold text-foreground">
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {post.sampleData.rows.map((row, rowIdx) => (
                    <TableRow key={rowIdx}>
                      {row.map((cell, cellIdx) => (
                        <TableCell key={cellIdx} className="font-mono text-sm">
                          {cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        )}

        {/* Comparison Table */}
        {post.comparisonTable && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">Quick Comparison Table</h2>
            <div className="border border-border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/10">
                    {post.comparisonTable.headers.map((header, idx) => (
                      <TableHead key={idx} className="font-semibold text-foreground whitespace-nowrap">
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {post.comparisonTable.rows.map((row, rowIdx) => (
                    <TableRow key={rowIdx} className="hover:bg-accent/50">
                      {row.map((cell, cellIdx) => (
                        <TableCell key={cellIdx} className="text-sm whitespace-nowrap">
                          {cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        )}

        {/* Why This Happens */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">Why This Happens</h2>
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <p className="text-foreground leading-relaxed">
                {post.whyThisHappens}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Common Mistakes */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">Common Mistakes to Avoid</h2>
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <ul className="space-y-3">
                {post.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-destructive mt-1">✗</span>
                    <span className="text-foreground">{mistake}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Alternative Method */}
        {post.alternativeMethod && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">Alternative Method</h2>
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-xl text-primary">
                  {post.alternativeMethod.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-4 leading-relaxed">
                  {post.alternativeMethod.description}
                </p>
                <ol className="space-y-2 list-decimal list-inside">
                  {post.alternativeMethod.steps.map((step, idx) => (
                    <li key={idx} className="text-foreground">
                      {step}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Advanced Tip */}
        {post.advancedTip && (
          <section className="mb-10">
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30">
              <CardHeader>
                <CardTitle className="text-xl text-foreground flex items-center gap-2">
                  💡 Pro Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">
                  {post.advancedTip}
                </p>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Related Questions */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">Related Topics</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {post.relatedQuestions.map((related, idx) => (
              <Link key={idx} to={related.link}>
                <Card className="h-full border-border hover:border-primary/50 hover:bg-accent/50 transition-all cursor-pointer group">
                  <CardContent className="pt-4 flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                      {related.question}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {post.faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`faq-${idx}`}>
                <AccordionTrigger className="text-left text-foreground hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Conclusion */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">Conclusion</h2>
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <p className="text-foreground leading-relaxed">
                {post.conclusion}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <div className="mt-12 p-8 bg-accent rounded-lg border border-border text-center">
          <h3 className="font-semibold text-xl mb-3 text-foreground">
            Found This Helpful?
          </h3>
          <p className="text-muted-foreground mb-6">
            Explore our complete Excel formula reference with 230+ functions and AI-powered tools
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/">
              <Button>
                Browse Formulas
              </Button>
            </Link>
            <Link to="/blog">
              <Button variant="outline">
                More Guides
              </Button>
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
