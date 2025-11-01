import { Mail, Instagram, Youtube, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. We'll get back to you soon.",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground">
            Have questions about Excel formulas? Need help with a specific function? We're here to assist you!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll respond as soon as possible</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    placeholder="How can we help you?"
                    rows={5}
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">For general inquiries and support</p>
                <a href="mailto:support@skillbi.in" className="text-primary hover:underline font-medium">
                  support@skillbi.in
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Connect on Social Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Instagram className="h-5 w-5 text-pink-500" />
                    Instagram
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Follow us for Excel tips, tutorials, and updates
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://www.instagram.com/skillbi.in/" target="_blank" rel="noopener noreferrer">
                      @skillbi.in
                    </a>
                  </Button>
                </div>
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Youtube className="h-5 w-5 text-red-500" />
                    YouTube
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Subscribe for video tutorials and Excel masterclasses
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://www.youtube.com/channel/UCr1CnwN0cp_vsSHkIojDhIw" target="_blank" rel="noopener noreferrer">
                      Visit Channel
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">How can I request a new formula tutorial?</h3>
              <p className="text-muted-foreground">
                Simply send us a message using the contact form above, or reach out on our social media channels. We're always looking to add more helpful content!
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do you offer personalized Excel training?</h3>
              <p className="text-muted-foreground">
                Yes! Contact us via email to discuss custom training sessions tailored to your needs.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How often is the formula database updated?</h3>
              <p className="text-muted-foreground">
                We regularly update our database with new formulas, examples, and improvements based on user feedback and Microsoft Excel updates.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
