import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        
        <div className="prose dark:prose-invert max-w-none space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              <p>
                Welcome to SkillBI ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our Excel formula reference services.
              </p>
              <p>
                By accessing or using SkillBI, you agree to the terms outlined in this Privacy Policy. If you do not agree with our practices, please do not use our services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">1. Information You Provide Directly</h3>
                <p>We may collect information that you voluntarily provide when using our services, including:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Contact information (name, email address) when you submit forms or contact us</li>
                  <li>Search queries and formula preferences to improve your experience</li>
                  <li>Feedback, comments, or questions you share with us</li>
                  <li>Account information if you create an account (username, preferences)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">2. Automatically Collected Information</h3>
                <p>When you visit our website, we automatically collect certain information, including:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Browser type and version</li>
                  <li>Device information (type, operating system)</li>
                  <li>IP address and approximate geographic location</li>
                  <li>Pages visited, time spent on pages, and navigation paths</li>
                  <li>Referring website or source that led you to our site</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">3. Cookies and Tracking Technologies</h3>
                <p>
                  We use cookies, web beacons, and similar technologies to enhance your experience and analyze website usage. Cookies are small text files stored on your device that help us remember your preferences and understand how you interact with our site.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">We use the collected information for various purposes, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Providing, operating, and maintaining our Excel formula reference services</li>
                <li>Improving and personalizing your user experience</li>
                <li>Understanding how users interact with our website through analytics</li>
                <li>Developing new features, content, and services</li>
                <li>Responding to your inquiries and providing customer support</li>
                <li>Sending you updates, newsletters, and educational content (with your consent)</li>
                <li>Detecting, preventing, and addressing technical issues or fraudulent activity</li>
                <li>Complying with legal obligations and protecting our rights</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Share Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">We respect your privacy and do not sell your personal information. We may share your information in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service Providers:</strong> We may share information with third-party service providers who help us operate our website, conduct analytics, or provide services on our behalf (e.g., hosting providers, email services)</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law, court order, or governmental request</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity</li>
                <li><strong>With Your Consent:</strong> We may share information for any other purpose with your explicit consent</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We implement appropriate technical and organizational security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Privacy Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Depending on your location, you may have the following rights:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Opt-Out:</strong> Opt out of marketing communications at any time</li>
                <li><strong>Data Portability:</strong> Request a copy of your data in a structured format</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us at support@skillbi.in
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Third-Party Links and Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Our website may contain links to third-party websites or services (such as Microsoft Excel documentation, YouTube, Instagram). We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately so we can delete it.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes by posting the updated policy on this page with a new "Last Updated" date. We encourage you to review this policy periodically.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> support@skillbi.in</p>
                <p><strong>Website:</strong> <a href="/" className="text-primary hover:underline">SkillBI's Hub</a></p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
