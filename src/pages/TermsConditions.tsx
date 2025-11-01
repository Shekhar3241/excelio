import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Terms & Conditions
        </h1>
        
        <div className="prose dark:prose-invert max-w-none space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agreement to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              <p>
                Welcome to SkillBI ("we," "us," or "our"). These Terms and Conditions ("Terms") govern your access to and use of our website, services, and Excel formula reference resources (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms.
              </p>
              <p>
                If you do not agree with any part of these Terms, you must not use our Services. We reserve the right to modify these Terms at any time, and continued use of our Services after changes constitutes acceptance of the updated Terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Use of Our Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">1. Eligibility</h3>
                <p>
                  You must be at least 13 years old to use our Services. By using our Services, you represent and warrant that you meet this age requirement and have the legal capacity to enter into these Terms.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">2. License to Use</h3>
                <p>
                  Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use our Services for personal, non-commercial purposes. You may:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Browse and search our Excel formula database</li>
                  <li>Use our AI-powered tools and features</li>
                  <li>Access tutorials, examples, and educational content</li>
                  <li>Save favorites and track your recent searches</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">3. Prohibited Activities</h3>
                <p>You agree NOT to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Use automated systems (bots, scrapers) to access or extract content from our Services</li>
                  <li>Copy, reproduce, distribute, or create derivative works from our content without permission</li>
                  <li>Attempt to reverse engineer, decompile, or disassemble any part of our Services</li>
                  <li>Use our Services for any illegal, harmful, or fraudulent purposes</li>
                  <li>Interfere with or disrupt the integrity or performance of our Services</li>
                  <li>Transmit viruses, malware, or other harmful code</li>
                  <li>Impersonate others or misrepresent your affiliation with any person or entity</li>
                  <li>Collect personal information about other users without consent</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Intellectual Property Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">1. Our Content</h3>
                <p>
                  All content, features, and functionality on our Services, including but not limited to text, graphics, logos, icons, images, formulas, examples, code snippets, software, and design, are the exclusive property of SkillBI or our licensors and are protected by copyright, trademark, and other intellectual property laws.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">2. Microsoft Excel</h3>
                <p>
                  Microsoft Excel and all related trademarks are the property of Microsoft Corporation. We are not affiliated with, endorsed by, or sponsored by Microsoft Corporation. Our Services provide educational content and references for Excel formulas but do not include Microsoft Excel software.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">3. User-Generated Content</h3>
                <p>
                  If you submit feedback, suggestions, comments, or other content to us ("User Content"), you grant us a worldwide, non-exclusive, royalty-free, perpetual license to use, modify, reproduce, and distribute such content for the purpose of operating and improving our Services.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accuracy and Educational Purpose</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Our Services provide educational information and references for Excel formulas. While we strive to ensure accuracy and keep our content up-to-date, we make no warranties or guarantees about:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The completeness, accuracy, reliability, or currentness of any content</li>
                <li>The suitability of our formulas or examples for your specific use case</li>
                <li>The results you may achieve by using our formulas or advice</li>
              </ul>
              <p className="mt-4">
                You are solely responsible for verifying the accuracy and appropriateness of any formulas or information before using them in your work. We recommend testing formulas thoroughly before applying them to important data.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Disclaimer of Warranties</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Our Services are provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, either express or implied, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Implied warranties of merchantability or fitness for a particular purpose</li>
                <li>Warranties that our Services will be uninterrupted, error-free, or secure</li>
                <li>Warranties regarding the accuracy, reliability, or quality of content</li>
              </ul>
              <p className="mt-4">
                We do not warrant that defects will be corrected or that our Services are free from viruses or other harmful components.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                To the fullest extent permitted by law, SkillBI and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, or goodwill, arising from:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Your use or inability to use our Services</li>
                <li>Any errors, mistakes, or inaccuracies in content</li>
                <li>Unauthorized access to or alteration of your data</li>
                <li>Any interruption or cessation of our Services</li>
              </ul>
              <p className="mt-4">
                In no event shall our total liability to you exceed the amount you paid us, if any, in the past twelve months.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Indemnification</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                You agree to indemnify, defend, and hold harmless SkillBI and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses (including reasonable attorney fees) arising from:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Your use or misuse of our Services</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Any User Content you submit</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Third-Party Services and Links</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Our Services may contain links to third-party websites, services, or resources (such as Microsoft Excel documentation, YouTube videos, or other educational content). We do not control or endorse these third-party resources and are not responsible for their content, privacy practices, or terms of use. Your use of third-party services is at your own risk.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                We reserve the right to suspend or terminate your access to our Services at any time, without notice, for any reason, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violation of these Terms</li>
                <li>Engaging in fraudulent or illegal activities</li>
                <li>Actions that harm our Services or other users</li>
              </ul>
              <p className="mt-4">
                Upon termination, your right to use our Services will immediately cease. Provisions that by their nature should survive termination (such as intellectual property rights, disclaimers, and limitations of liability) will remain in effect.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Governing Law and Dispute Resolution</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
              </p>
              <p>
                Any disputes arising from these Terms or your use of our Services shall be resolved through good faith negotiations. If a resolution cannot be reached, disputes will be subject to the exclusive jurisdiction of the courts in India.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to These Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We reserve the right to modify or update these Terms at any time. When we make changes, we will update the "Last Updated" date at the top of this page. Significant changes will be communicated through a notice on our website or via email (if you have provided one).
              </p>
              <p className="mt-4">
                Your continued use of our Services after changes to these Terms constitutes your acceptance of the updated Terms. If you do not agree to the changes, you must stop using our Services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Miscellaneous</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Severability</h3>
                <p>
                  If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will continue in full force and effect.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Entire Agreement</h3>
                <p>
                  These Terms, along with our Privacy Policy, constitute the entire agreement between you and SkillBI regarding your use of our Services.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">No Waiver</h3>
                <p>
                  Our failure to enforce any right or provision of these Terms will not constitute a waiver of that right or provision.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                If you have any questions, concerns, or feedback about these Terms, please contact us:
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

export default TermsConditions;
