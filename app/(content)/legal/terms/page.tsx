import { Container } from '@/components/container';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';

export default function TermsPage({ searchParams }: { searchParams: { mode?: string } }) {
  const isApp = searchParams.mode === 'app';

  return (
    <main>
      {!isApp && <Nav />}
      <Container>
        <div className="prose-nuvvoo mx-auto max-w-3xl py-16">
          <h1 className="text-3xl font-semibold text-slate-900">Terms of Service</h1>
          <p className="mt-3 text-sm text-slate-500">Last updated: March 31, 2026</p>

          <div className="mt-8 space-y-8">
            <p>Welcome to Nuvvoo.</p>
            <p>
              These Terms of Service (&ldquo;Terms&rdquo;) govern your use of the Nuvvoo website and mobile application, operated by <strong>Pryvus Inc.</strong>, a company incorporated in the State of Wyoming, United States (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;).
            </p>
            <p>
              By accessing or using Nuvvoo, you agree to these Terms. <strong>If you do not agree, please do not use the service.</strong>
            </p>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">1. About Nuvvoo</h2>
              <p>
                Nuvvoo is a personal wellness tracking application that helps you log meals, track calories and nutrients, and monitor health-related habits.
              </p>
              <p>These Terms apply to:</p>
              <ul>
                <li>The Nuvvoo website (<strong>nuvvoo.app</strong>)</li>
                <li>The Nuvvoo mobile application for iOS</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">2. Medical Disclaimer</h2>
              <p><strong>Nuvvoo is not a medical device.</strong></p>
              <p>
                Nuvvoo provides estimated nutritional information for informational purposes only. It does not diagnose, treat, cure, or prevent any disease or condition.
              </p>
              <p>
                Calorie and nutrient estimates are approximate and should not replace professional medical or nutritional advice. Always consult a qualified healthcare provider before making decisions related to your health or diet.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">3. AI-Powered Features</h2>
              <p>
                Core features of Nuvvoo, including food analysis and chat, are powered by third-party AI providers (OpenAI, Google) accessed through OpenRouter.
              </p>
              <p>
                By using these features, you agree that your messages are transmitted to AI providers for processing. For details on what data is sent, see our <a href="/legal/ai-disclosure" className="text-nuvvooGreen-700 underline">AI Disclosure</a>.
              </p>
              <p>AI estimates may vary and are not guaranteed to be accurate.</p>
              <p>You can disable AI features at any time by revoking consent in Settings.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">4. Subscriptions &amp; Payments</h2>
              <p>
                Subscriptions are managed through Apple&rsquo;s App Store via <strong>RevenueCat</strong>.
              </p>
              <ul>
                <li>A free trial period may be offered; billing starts after the trial ends</li>
                <li>Subscriptions auto-renew unless cancelled before the renewal date</li>
                <li>Cancellation and refund policies follow Apple&rsquo;s App Store terms</li>
              </ul>
              <p>Nuvvoo does not process payments directly.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">5. Your Account</h2>
              <p>You are responsible for maintaining access to your account.</p>
              <p>You can link Apple Sign-In or Google Sign-In for account recovery.</p>
              <p>
                You can delete your account at any time from Settings. Account deletion permanently removes all your data, including meals, trackers, settings, chat history, and subscription records.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">6. Acceptable Use</h2>
              <p>You agree to use Nuvvoo only for lawful, personal wellness tracking purposes. You may not:</p>
              <ul>
                <li>Submit unlawful, harmful, or offensive content</li>
                <li>Interfere with the service infrastructure or other users</li>
                <li>Attempt to access accounts or data belonging to others</li>
                <li>Use the service for any commercial purpose without permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">7. Intellectual Property</h2>
              <p>
                All content, branding, illustrations, and software are the property of Pryvus Inc. unless otherwise stated. You may not copy, distribute, or reproduce any content without prior written permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">8. Disclaimer of Warranties</h2>
              <p>
                The service is provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; We do not guarantee that the service will be uninterrupted, error-free, or that information provided will be complete or accurate.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">9. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Pryvus Inc. shall not be liable for any indirect, incidental, special, consequential, or medical damages arising from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">10. Changes to These Terms</h2>
              <p>
                We may update these Terms from time to time. The &ldquo;Last updated&rdquo; date reflects the latest revision. Continued use of the service after changes constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">11. Contact</h2>
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
      {!isApp && <Footer />}
    </main>
  );
}