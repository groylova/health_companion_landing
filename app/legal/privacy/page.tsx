import { Container } from '@/components/container';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';

export default function PrivacyPage({ searchParams }: { searchParams: { mode?: string } }) {
  const isApp = searchParams.mode === 'app';

  return (
    <main>
      {!isApp && <Nav />}
      <Container>
        <div className="prose-nuvvoo mx-auto max-w-3xl py-16">
          <h1 className="text-3xl font-semibold text-slate-900">Privacy Policy</h1>
          <p className="mt-3 text-sm text-slate-500">Last updated: March 31, 2026</p>

          <div className="mt-8 space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-slate-900">1. Who We Are</h2>
              <p>
                Nuvvoo is operated by <strong>Pryvus Inc.</strong>, a company incorporated in the State of Wyoming, United States.
              </p>
              <p>This Privacy Policy covers both the Nuvvoo website (<strong>nuvvoo.app</strong>) and the Nuvvoo mobile application for iOS.</p>
              <p>
                For privacy-related inquiries, contact: <a href="mailto:support.nuvvoo@pryvus.com" className="text-nuvvooGreen-700 underline">support.nuvvoo@pryvus.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">2. Information We Collect</h2>

              <h3 className="mt-4 text-lg font-medium text-slate-900">Account Information</h3>
              <ul>
                <li>User ID (generated automatically)</li>
                <li>Name (optional), language, timezone, measurement preferences</li>
              </ul>

              <h3 className="mt-4 text-lg font-medium text-slate-900">Health &amp; Nutrition Data</h3>
              <ul>
                <li>Meals: food descriptions, calories, macronutrients, meal components</li>
                <li>Weight, height, sex, date of birth (all optional)</li>
                <li>Activity level, calorie targets, dietary goals</li>
                <li>Custom trackers: sleep, water, mood, exercise, and user-defined trackers</li>
                <li>Dietary preferences: allergies, avoided foods, liked foods</li>
              </ul>

              <h3 className="mt-4 text-lg font-medium text-slate-900">Chat Messages</h3>
              <p>Text you send in chat is processed by AI and stored on our servers for your conversation history.</p>
              <p>Chat history can be deleted per date or by deleting your account.</p>

              <h3 className="mt-4 text-lg font-medium text-slate-900">Device Information</h3>
              <ul>
                <li>Push notification token (for daily reminders)</li>
                <li>Timezone (for scheduling and date handling)</li>
              </ul>

              <h3 className="mt-4 text-lg font-medium text-slate-900">Website</h3>
              <ul>
                <li>Email address (if you join the early access list)</li>
                <li>Analytics data via Google Analytics (aggregated, country-level)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">3. How We Use Your Data</h2>
              <ul>
                <li>Provide meal logging, calorie tracking, and progress summaries</li>
                <li>Process chat messages through AI to analyze food and generate responses</li>
                <li>Send push notification reminders at your chosen time</li>
                <li>Manage subscriptions and trial periods</li>
                <li>Improve the service based on aggregated analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">4. AI Data Processing</h2>
              <p>
                Chat messages are sent to third-party AI providers (OpenAI, Google) through <strong>OpenRouter</strong> for processing.
              </p>
              <p>Data is processed to generate responses and returned to the app.</p>
              <p>
                <strong>Your data is not used to train AI models.</strong> This is guaranteed by the API terms of our providers (OpenRouter, OpenAI, Google). AI providers do not retain your messages after processing.
              </p>
              <p>
                You can revoke AI processing consent at any time in Settings. For full details, see our <a href="/legal/ai-disclosure" className="text-nuvvooGreen-700 underline">AI Disclosure</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">5. Third-Party Services</h2>
              <p>We use the following third-party services to operate Nuvvoo:</p>
              <ul>
                <li><strong>OpenRouter</strong> (routes to OpenAI, Google): AI chat processing</li>
                <li><strong>RevenueCat</strong>: subscription and payment management</li>
                <li><strong>Apple Sign-In / Google Sign-In</strong>: authentication</li>
                <li><strong>Apple Push Notification service (APNs)</strong>: push notifications</li>
                <li><strong>Google Analytics</strong> (website only): aggregated usage analytics</li>
                <li><strong>Brevo</strong> (website only): email communication for early access</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">6. Data Sharing</h2>
              <p>We do not sell personal data.</p>
              <p>We do not share food logs or health data for advertising purposes.</p>
              <p>
                Data is shared only with the service providers listed above, solely to operate the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">7. Data Storage &amp; Security</h2>
              <ul>
                <li>Data is stored on our servers and transmitted over HTTPS</li>
                <li>Authentication tokens are encrypted and stored in iOS Keychain on your device</li>
                <li>JWT-based authentication with expiring tokens</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">8. Your Rights &amp; Controls</h2>
              <ul>
                <li><strong>Export</strong>: Download all your data from the app (meals, trackers, settings, saved foods)</li>
                <li><strong>Delete account</strong>: Permanently removes all data &mdash; meals, trackers, settings, chat history, tokens, and subscription records</li>
                <li><strong>Revoke AI consent</strong>: Disables AI chat features; manual logging still works</li>
                <li><strong>Delete chat history</strong>: Clear conversation history for any date</li>
                <li><strong>Manage notifications</strong>: Enable/disable and set reminder time in Settings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">9. Data Retention</h2>
              <p>Your data is retained until you delete your account or request deletion.</p>
              <p>There is no automatic data expiration.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">10. International Transfers</h2>
              <p>Data may be processed in the United States or other countries where our service providers operate.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">11. Children&rsquo;s Privacy</h2>
              <p>Nuvvoo is not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">12. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo; date reflects the latest revision.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">13. Contact</h2>
              <p>For privacy-related questions, contact:</p>
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