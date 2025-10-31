import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Instagram, Youtube, Mail, Heart } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              About Skillbi
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your comprehensive Excel formula reference and learning platform
            </p>
          </div>

          {/* Mission Section */}
          <Card className="p-6 md:p-8 mb-8 animate-fade-in hover-scale">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  At Skillbi, we're dedicated to making Excel formulas accessible to everyone. Whether you're a beginner 
                  learning the basics or an advanced user looking for complex formulas, we provide comprehensive resources, 
                  examples, and AI-powered assistance to help you master Excel.
                </p>
              </div>
            </div>
          </Card>

          {/* Features Section */}
          <Card className="p-6 md:p-8 mb-8 animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <h3 className="font-medium">Comprehensive Formula Library</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-4">
                  Access hundreds of Excel formulas across all categories
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <h3 className="font-medium">AI-Powered Assistant</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-4">
                  Get instant help with our intelligent chatbot
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <h3 className="font-medium">Formula Generator</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-4">
                  Describe what you need and get the right formula
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <h3 className="font-medium">Interactive Examples</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-4">
                  Learn with real-world examples and use cases
                </p>
              </div>
            </div>
          </Card>

          {/* Connect Section */}
          <Card className="p-6 md:p-8 animate-fade-in">
            <h2 className="text-2xl font-semibold mb-4 text-center">Connect With Us</h2>
            <p className="text-muted-foreground text-center mb-6">
              Follow us on social media for tips, tutorials, and updates
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto gap-2 hover-scale"
                onClick={() => window.open('https://www.instagram.com/skillbi.in/', '_blank')}
              >
                <Instagram className="h-5 w-5" />
                Follow on Instagram
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto gap-2 hover-scale"
                onClick={() => window.open('https://www.youtube.com/channel/UCr1CnwN0cp_vsSHkIojDhIw', '_blank')}
              >
                <Youtube className="h-5 w-5" />
                Subscribe on YouTube
              </Button>
            </div>

            <div className="mt-8 pt-6 border-t text-center">
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Mail className="h-4 w-4" />
                Have questions? Reach out to us on social media
              </p>
            </div>
          </Card>

          {/* Footer Note */}
          <div className="text-center mt-8 text-sm text-muted-foreground animate-fade-in">
            <p>Made with ❤️ by SkillBI Team</p>
          </div>
        </div>
      </main>
    </div>
  );
}
