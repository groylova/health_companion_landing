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
          <p className="mt-3 text-sm text-slate-500">Last updated: May 4, 2026</p>

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

              <h3 className="mt-4 text-lg font-medium text-slate-900">Analytics &amp; Crash Reports (mobile app)</h3>
              <p>
                The Nuvvoo iOS app uses <strong>Firebase Analytics</strong> and <strong>Firebase Crashlytics</strong>, provided by Google LLC, to understand how users interact with the app and to detect crashes. The data collected is:
              </p>
              <ul>
                <li><strong>Vendor identifier (IDFV)</strong> &mdash; an identifier scoped to your device and this app, which resets when you uninstall and reinstall the app</li>
                <li><strong>Usage data</strong> &mdash; screens viewed, features used, session duration, app version, OS version, device model, language, and region</li>
                <li><strong>Crash reports</strong> &mdash; stack traces, app state at the time of the crash, and OS version</li>
              </ul>
              <p>
                This data is <strong>aggregated and not linked to your name, email, or any account-level information</strong>. We use it solely to improve the app and fix bugs. It is never used for advertising or to identify you personally.
              </p>
              <p>
                You can disable analytics and crash reports at any time in <strong>Settings &rarr; Privacy &rarr; Analytics</strong> inside the app.
              </p>

              <h3 className="mt-4 text-lg font-medium text-slate-900">Website</h3>
              <ul>
                <li>Email address (if you join the early access list)</li>
                <li>Analytics data via Google Analytics (aggregated, country-level)</li>
              </ul>

              <h3 className="mt-4 text-lg font-medium text-slate-900">Website Cookies &amp; Tracking</h3>
              <p>
                Our website uses essential cookies for basic functionality and Google Analytics cookies (with your consent in the EU) for aggregated, anonymized usage statistics. You can manage cookie preferences via the cookie banner shown on first visit.
              </p>
              <p>
                Cookies set on nuvvoo.app include <strong>_ga</strong> and <strong>_ga_&lt;property-id&gt;</strong> (Google Analytics, ~2 years) and <strong>_gcl_au</strong> (Google Ads conversion linker, ~90 days). These cookies do not contain your name or email and are used solely for aggregated analytics and advertising-attribution measurement.
              </p>
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
                <li><strong>Firebase Analytics &amp; Crashlytics</strong> (Google LLC, mobile app only): aggregated in-app usage analytics and crash reporting</li>
                <li><strong>Google Analytics</strong> (website only): aggregated usage analytics</li>
                <li><strong>Brevo</strong> (website only): email communication for early access</li>
              </ul>

              <h3 className="mt-4 text-lg font-medium text-slate-900">Apple App Tracking Transparency (ATT) and SKAdNetwork</h3>
              <p>
                Nuvvoo does <strong>not</strong> use the IDFA (Identifier for Advertisers) and does not show the App Tracking Transparency prompt. We do not track you across other apps or websites.
              </p>
              <p>
                For aggregate, privacy-preserving measurement of advertising effectiveness, we use Apple&rsquo;s <strong>SKAdNetwork</strong>, which does not involve user-level tracking and does not require your consent.
              </p>
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
                <li>Data at rest is encrypted using <strong>AES-256</strong></li>
                <li>Communications use <strong>TLS 1.3 with HTTPS</strong></li>
                <li>Authentication tokens are encrypted and stored in iOS Keychain on your device</li>
                <li>JWT-based authentication with expiring tokens</li>
              </ul>

              <h3 className="mt-4 text-lg font-medium text-slate-900">Data Breach Notification</h3>
              <p>
                In the event of a data breach affecting your personal information, we will notify affected users and the relevant data protection authorities within <strong>72 hours</strong> of becoming aware, as required by GDPR Article 33.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">8. Your Rights &amp; Controls</h2>
              <ul>
                <li><strong>Export</strong>: Download all your data from the app (meals, trackers, settings, saved foods)</li>
                <li><strong>Delete account</strong>: Permanently removes all data &mdash; meals, trackers, settings, chat history, tokens, and subscription records</li>
                <li><strong>Revoke AI consent</strong>: Disables AI chat features; manual logging still works</li>
                <li><strong>Disable analytics</strong>: Turn off Firebase Analytics and Crashlytics in Settings &rarr; Privacy &rarr; Analytics</li>
                <li><strong>Delete chat history</strong>: Clear conversation history for any date</li>
                <li><strong>Manage notifications</strong>: Enable/disable and set reminder time in Settings</li>
              </ul>

              <h3 className="mt-4 text-lg font-medium text-slate-900">EU / UK / Swiss Residents</h3>
              <p>
                If you are located in the European Economic Area, the United Kingdom, or Switzerland, you have additional rights under the General Data Protection Regulation (GDPR / UK GDPR / FADP), including:
              </p>
              <ul>
                <li>The right to access, rectify, erase, restrict, or object to the processing of your personal data</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent at any time, where processing is based on consent (for example, AI processing or analytics) &mdash; without affecting the lawfulness of processing carried out before withdrawal</li>
                <li>The right to lodge a complaint with your local data protection authority</li>
              </ul>
              <p>
                To exercise these rights, contact <a href="mailto:support.nuvvoo@pryvus.com" className="text-nuvvooGreen-700 underline">support.nuvvoo@pryvus.com</a>. We respond within 30 days.
              </p>

              <h3 className="mt-4 text-lg font-medium text-slate-900">Data Protection Officer / EU Representative</h3>
              <p>
                For users in the European Union, you may contact our designated EU representative at <a href="mailto:support.nuvvoo@pryvus.com" className="text-nuvvooGreen-700 underline">support.nuvvoo@pryvus.com</a>. We will respond to all GDPR-related inquiries within 30 days.
              </p>

              <h3 className="mt-4 text-lg font-medium text-slate-900">California Residents (CCPA / CPRA)</h3>
              <p>
                If you are a California resident, you have the following rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA):
              </p>
              <ul>
                <li>The right to know what personal information we collect, use, and share</li>
                <li>The right to delete your personal information</li>
                <li>The right to opt out of the sale or sharing of personal information (we do not sell or share your data, but you have this right by law)</li>
                <li>The right to correct inaccurate personal information</li>
                <li>The right to limit the use of sensitive personal information</li>
                <li>The right to non-discrimination for exercising these rights</li>
              </ul>
              <p>
                To exercise these rights, contact us at <a href="mailto:support.nuvvoo@pryvus.com" className="text-nuvvooGreen-700 underline">support.nuvvoo@pryvus.com</a>. We will respond within 45 days.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">9. Data Retention</h2>
              <p>
                Your personal content is retained until you delete your account or request deletion &mdash; there is no automatic expiration.
              </p>
              <p>Specific retention periods for system-level data:</p>
              <ul>
                <li><strong>Account data</strong>: until account deletion</li>
                <li><strong>Chat messages</strong>: until manually deleted by user, or until account deletion</li>
                <li><strong>Firebase Analytics events</strong>: 14 months (Google&rsquo;s default retention)</li>
                <li><strong>Firebase Crashlytics</strong>: 90 days</li>
                <li><strong>Server access logs</strong>: 30 days</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">10. International Transfers</h2>
              <p>Your data may be processed in the United States or other countries where our service providers operate. Specifically:</p>
              <ul>
                <li><strong>Firebase Analytics &amp; Crashlytics</strong> (Google LLC): processed on Google&rsquo;s servers in the United States and the European Union, under Google&rsquo;s Data Processing Addendum and EU Standard Contractual Clauses (SCCs)</li>
                <li><strong>OpenRouter, OpenAI, Google AI</strong>: chat messages processed primarily in the United States</li>
                <li><strong>RevenueCat, Apple, Brevo</strong>: processed in the United States and the European Union</li>
              </ul>
              <p>
                For residents of the EU, EEA, UK and Switzerland, transfers outside the EU/EEA/UK are made under appropriate safeguards (Standard Contractual Clauses or equivalent legal mechanisms).
              </p>
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