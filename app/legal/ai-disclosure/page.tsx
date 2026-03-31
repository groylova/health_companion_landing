import { Container } from '@/components/container';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';

export default function AiDisclosurePage({ searchParams }: { searchParams: { mode?: string } }) {
  const isApp = searchParams.mode === 'app';

  return (
    <main>
      {!isApp && <Nav />}
      <Container>
        <div className="prose-nuvvoo mx-auto max-w-3xl py-16">
          <h1 className="text-3xl font-semibold text-slate-900">AI Disclosure</h1>
          <p className="mt-3 text-sm text-slate-500">Last updated: March 31, 2026</p>

          <div className="mt-8 space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-slate-900">How Nuvvoo Uses AI</h2>
              <p>
                Nuvvoo uses AI to analyze your food descriptions, estimate calories and nutrients, and respond to your messages in chat.
              </p>
              <p>
                The AI is powered by third-party providers (OpenAI, Google) accessed through <strong>OpenRouter</strong>, an API routing service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">What Data Is Sent to AI Providers</h2>
              <p>When you use chat features, the following information is sent to AI providers for processing:</p>
              <ul>
                <li>The text of your chat messages (food descriptions, questions)</li>
                <li>Your dietary preferences (allergies, avoided foods) to personalize responses</li>
                <li>Your recent meal history for that day (for context, e.g. to infer meal type)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">What Is NOT Sent</h2>
              <ul>
                <li>Your name, email, or account ID</li>
                <li>Payment or subscription information</li>
                <li>Device identifiers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">Your Data Is Not Used to Train AI Models</h2>
              <p>
                This is guaranteed by the API terms of our providers (OpenRouter, OpenAI, Google).
              </p>
              <p>
                Your messages are processed and returned &mdash; they are not stored by AI providers for training purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">AI Provides Estimates, Not Medical Data</h2>
              <p>Calorie and nutrient values are approximate and may vary.</p>
              <p>AI-generated responses are for informational purposes only.</p>
              <p>
                <strong>Nuvvoo is not a medical device and does not provide medical advice.</strong>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">You Are in Control</h2>
              <ul>
                <li>You can revoke AI processing consent at any time in Settings</li>
                <li>When AI consent is revoked, chat features are disabled, but you can still log meals manually via the REST interface</li>
                <li>You can delete your chat history at any time</li>
              </ul>
            </section>
          </div>
        </div>
      </Container>
      {!isApp && <Footer />}
    </main>
  );
}