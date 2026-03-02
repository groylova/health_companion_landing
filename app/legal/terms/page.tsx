import { Container } from '@/components/container';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';

export default function TermsPage() {
  return (
    <main>
      <Nav />
      <Container>
        <div className="prose-nuvvoo mx-auto max-w-3xl py-16">
          <h1 className="text-3xl font-semibold text-slate-900">Terms of Service</h1>
          <p className="mt-3 text-sm text-slate-500">Last updated: March 2, 2026</p>

          <div className="mt-8 space-y-8">
            <p>Welcome to Nuvvoo.</p>
            <p>
              These Terms of Service ("Terms") govern your use of the Nuvvoo website and early access sign-up page, operated by <strong>Pryvus Inc.</strong>, a company incorporated in the State of Wyoming, United States ("we", "us", or "our").
            </p>
            <p>
              By accessing or using this website, you agree to these Terms.
            </p>
            <p>
              <strong>If you do not agree, please do not use the site.</strong>
            </p>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">1. Website Use</h2>
              <p>The Nuvvoo website is intended to:</p>
              <ul>
                <li>provide information about the product</li>
                <li>allow users to join the early access list</li>
              </ul>
              <p>You agree to use the website only for lawful purposes and not to interfere with its normal operation.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">2. Early Access Sign-Up</h2>
              <p>By submitting your email address, you agree to receive service-related communications about:</p>
              <ul>
                <li>product updates</li>
                <li>launch announcements</li>
                <li>availability notifications</li>
              </ul>
              <p>You may unsubscribe at any time.</p>
              <p>We reserve the right to limit or deny early access at our discretion.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">3. No Medical Advice</h2>
              <p><strong>Nuvvoo is not a medical service.</strong></p>
              <p>
                Information provided on this website is for informational purposes only and does not constitute medical, nutritional, or professional advice.
              </p>
              <p>
                Always consult a qualified healthcare professional before making decisions related to your health, diet, or medical treatment.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">4. Intellectual Property</h2>
              <p>All content on this website, including:</p>
              <ul>
                <li>text</li>
                <li>graphics</li>
                <li>illustrations</li>
                <li>branding</li>
                <li>logos</li>
              </ul>
              <p>is the property of Pryvus Inc. unless otherwise stated.</p>
              <p>You may not copy, distribute, or reproduce any content without prior written permission.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">5. Disclaimer of Warranties</h2>
              <p>The website is provided "as is" and "as available."</p>
              <p>We do not guarantee that:</p>
              <ul>
                <li>the website will be uninterrupted</li>
                <li>the website will be error-free</li>
                <li>the information provided will be complete or accurate</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">6. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Pryvus Inc. shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">7. Future Application</h2>
              <p>These Terms apply only to the website and early access sign-up.</p>
              <p>Separate terms may apply when the Nuvvoo application is officially released.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">8. Governing Law</h2>
              <p>
                These Terms are governed by the laws of the State of Wyoming, United States, without regard to conflict of law principles.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">9. Changes to These Terms</h2>
              <p>
                We may update these Terms from time to time. The "Last updated" date reflects the latest revision.
              </p>
              <p>
                Continued use of the website after changes constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">10. Contact</h2>
              <p>For questions regarding these Terms, contact:</p>
              <p>
                <a href="mailto:support.nuvvoo@pryvus.com" className="text-nuvvooGreen-700 underline">
                  support.nuvvoo@pryvus.com
                </a>
              </p>
              <p>
                <strong>Pryvus Inc.</strong><br />
                Wyoming, United States
              </p>
            </section>
          </div>
        </div>
      </Container>
      <Footer />
    </main>
  );
}
