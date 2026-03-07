import { Container } from '@/components/container';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';

export default async function PrivacyPage({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const { mode } = await searchParams;
  const isApp = mode === 'app';

  return (
    <main>
      {!isApp && <Nav />}
      <Container>
        <div className="prose-nuvvoo mx-auto max-w-3xl py-16">
          <h1 className="text-3xl font-semibold text-slate-900">Privacy Policy</h1>
          <p className="mt-3 text-sm text-slate-500">&ldquo;Last updated&rdquo;: March 2, 2026</p>

          <div className="mt-8 space-y-8">
            <p>
              This Privacy Policy explains how Nuvvoo collects and uses information when you visit our website.
            </p>
            <p>
              Nuvvoo is operated by <strong>Pryvus Inc.</strong>, a company incorporated in the State of Wyoming, United States.
            </p>
            <p>
              For privacy-related inquiries, contact: <a href="mailto:support.nuvvoo@pryvus.com" className="text-nuvvooGreen-700 underline">support.nuvvoo@pryvus.com</a>
            </p>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">1. Information We Collect</h2>

              <h3 className="mt-4 text-lg font-medium text-slate-900">Email Information</h3>
              <p>If you join the early access list, we collect your email address.</p>
              <p>This information is used only to:</p>
              <ul>
                <li>notify you about product updates</li>
                <li>inform you about launch availability</li>
                <li>provide relevant service-related communication</li>
              </ul>
              <p>We do not send unrelated marketing content.</p>

              <h3 className="mt-4 text-lg font-medium text-slate-900">Analytics Information</h3>
              <p>We use Google Analytics to understand how visitors interact with the website. This may include:</p>
              <ul>
                <li>pages visited</li>
                <li>time spent on pages</li>
                <li>general location (country-level)</li>
                <li>device type and browser</li>
              </ul>
              <p>This information is collected in aggregated form and is used to improve the website experience.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">2. Email Processing</h2>
              <p>Email addresses are processed and stored using <strong>Brevo</strong> (email service provider).</p>
              <p>Brevo processes data on our behalf solely for managing early access communication.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">3. Cookies</h2>
              <p>The website may use cookies for:</p>
              <ul>
                <li>analytics purposes</li>
                <li>basic functionality</li>
              </ul>
              <p>We do not use advertising cookies or cross-site tracking technologies.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">4. Data Retention</h2>
              <p>Email addresses are retained until:</p>
              <ul>
                <li>you unsubscribe</li>
                <li>or we discontinue the early access list</li>
              </ul>
              <p>
                You may request deletion of your email at any time by contacting{' '}
                <a href="mailto:support.nuvvoo@pryvus.com" className="text-nuvvooGreen-700 underline">support.nuvvoo@pryvus.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">5. Data Sharing</h2>
              <p>We do not sell personal data.</p>
              <p>We only share limited information with service providers necessary to operate the website:</p>
              <ul>
                <li>Google Analytics</li>
                <li>Brevo</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">6. International Transfers</h2>
              <p>Data may be processed in the United States or other countries where our service providers operate.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">7. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. The "&ldquo;Last updated&rdquo;" date will reflect the latest revision.
              </p>
            </section>
          </div>
        </div>
      </Container>
      {!isApp && <Footer />}
    </main>
  );
}
