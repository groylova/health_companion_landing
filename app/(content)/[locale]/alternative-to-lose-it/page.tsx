import type { Metadata } from 'next';
import { Container } from '@/components/container';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { ContentSection } from '@/components/seo/content-section';
import { FaqSection } from '@/components/seo/faq-section';
import { SeoCta } from '@/components/seo/seo-cta';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { AppStoreBadge } from '@/components/app-store-badge';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nuvvoo.app';

export const metadata: Metadata = {
  title: 'Best Lose It Alternative 2026 — Track Calories Without the Hassle | Nuvvoo',
  description:
    "Frustrated with Lose It's clunky updates and premium paywalls? Nuvvoo lets you track calories by texting what you ate — no database searching, no weighing. Works in 5 languages.",
  alternates: { canonical: `${siteUrl}/alternative-to-lose-it` },
  openGraph: {
    title: 'Best Lose It Alternative 2026 — Track Calories Without the Hassle',
    description:
      "Frustrated with Lose It's clunky updates and premium paywalls? Nuvvoo lets you track calories by texting what you ate — no database searching, no weighing.",
    url: `${siteUrl}/alternative-to-lose-it`,
    images: [{ url: '/illustrations/scene-01-handshake.webp', width: 1200, height: 800 }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Lose It Alternative 2026 — Track Without the Hassle',
    description:
      "Tired of Lose It's clunky updates and premium paywalls? Track calories by texting what you ate.",
    images: ['/illustrations/scene-01-handshake.webp'],
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function AlternativeToLoseIt({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const faqs = [
    {
      question: 'Does Nuvvoo replace Lose It entirely?',
      answer:
        'It depends on what you need. If you rely on barcode scanning and gamified goals, Lose It may still serve you better for those specific use cases. But if you have been frustrated by the logging process itself, Nuvvoo offers a faster, simpler alternative focused on consistency over precision.',
    },
    {
      question: 'Can I switch from Lose It to Nuvvoo?',
      answer:
        "Yes. You can start using Nuvvoo right away — there's no data migration needed since Nuvvoo builds your profile through conversation. Some people use both during a transition period.",
    },
    {
      question: 'Is Nuvvoo free?',
      answer:
        'Nuvvoo is currently in early access. Check nuvvoo.app for current pricing and availability.',
    },
  ];

  return (
    <main>
      <Nav />
      <article className="py-16 md:py-20">
        <Container>
          <header className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              Best Lose It Alternative 2026: Track Calories Without the Hassle
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Lose It has been a solid calorie tracker for years, but recent updates have left many users frustrated. If you&rsquo;re spending more time navigating menus than actually tracking food, it might be time for a simpler approach. Nuvvoo replaces database searches and manual entry with a single idea: just text what you ate.
            </p>
          </header>

          <div className="mx-auto mt-10 max-w-3xl">
            <div className="overflow-hidden rounded-[2rem]">
              <Image
                src="/illustrations/scene-01-handshake.webp"
                alt="Nuvvoo welcoming a new user — a friendlier alternative to Lose It calorie tracking"
                width={1200}
                height={800}
                className="h-auto w-full"
              />
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-3xl space-y-12">
            <ContentSection title="Why People Seek Lose It Alternatives">
              <p>
                Lose It is a well-established calorie tracker with a clean design and a loyal user base. But several pain points push people to look for something different:
              </p>
              <ul>
                <li><strong>Recent update frustrations:</strong> The latest redesign moved key features like the &ldquo;Done Logging&rdquo; button and calendar navigation behind extra taps. What used to be one click now takes three or four.</li>
                <li><strong>Sluggish performance:</strong> Users report the app has become noticeably slower over recent months, with freezes during food searches and meal logging.</li>
                <li><strong>Premium paywalls:</strong> Custom macro targets, per-meal macro breakdowns, and advanced features are locked behind Lose It Premium. If you&rsquo;re on keto or high-protein, the free version feels deliberately limited.</li>
                <li><strong>Subscription traps:</strong> Some users report difficulty canceling subscriptions, with customer service described as &ldquo;running in loops&rdquo; without resolving issues.</li>
                <li><strong>Same old approach:</strong> Despite updates, the core experience is still database search → select portion → log manually. For many people, this process itself is why they stop tracking.</li>
              </ul>
              <p>
                These aren&rsquo;t problems for everyone. Lose It works well for people who want a structured, database-driven tracker. But if the manual process is what makes you quit, a different approach might help you <Link href="/how-to-stay-consistent-calorie-tracking">stay consistent</Link>.
              </p>
            </ContentSection>

            <ContentSection title="Different Approaches to Food Tracking">
              <p>
                <strong>Lose It&rsquo;s approach: Visual logging with database precision</strong>
              </p>
              <p>
                Lose It offers a colorful, gamified experience built around searching a food database and scanning barcodes. You find the item, choose the portion size, and the app tallies everything. This works well if you:
              </p>
              <ul>
                <li>Enjoy the visual progress of filling daily goals</li>
                <li>Eat many packaged foods with barcodes</li>
                <li>Want community challenges and social features</li>
                <li>Don&rsquo;t mind spending a few minutes per meal on logging</li>
              </ul>
              <p>
                <strong>Nuvvoo&rsquo;s approach: Awareness through conversation</strong>
              </p>
              <p>
                Nuvvoo skips the database entirely. Instead of searching and selecting, you <Link href="/chat-calorie-tracker">describe your meal in your own words</Link> — like texting a friend. The AI handles estimation and calculation. This works well if you:
              </p>
              <ul>
                <li>Have quit Lose It because logging felt like a chore</li>
                <li>Want to track consistently without spending 5+ minutes per meal</li>
                <li>Prefer talking about meals rather than entering data</li>
                <li>Value building awareness over hitting exact numbers</li>
              </ul>
            </ContentSection>

            <ContentSection title="Comparison: Lose It vs. Nuvvoo">
              <div className="prose-nuvvoo">
                <table>
                  <thead>
                    <tr>
                      <th>Feature</th>
                      <th>Lose It</th>
                      <th>Nuvvoo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Input method</td>
                      <td>Database search + barcode scan</td>
                      <td>Natural language chat</td>
                    </tr>
                    <tr>
                      <td>Time per entry</td>
                      <td>2&ndash;4 minutes</td>
                      <td>30&ndash;60 seconds</td>
                    </tr>
                    <tr>
                      <td>Learning curve</td>
                      <td>Moderate (navigate menus, find foods)</td>
                      <td>Minimal (just describe meals)</td>
                    </tr>
                    <tr>
                      <td>Free version limits</td>
                      <td>Macro targets locked behind Premium</td>
                      <td>Full tracking available</td>
                    </tr>
                    <tr>
                      <td>Focus</td>
                      <td>Gamified weight loss with goals</td>
                      <td>Awareness &amp; consistency</td>
                    </tr>
                    <tr>
                      <td>Tone</td>
                      <td>Achievement-driven, badges &amp; streaks</td>
                      <td>Conversational, no guilt</td>
                    </tr>
                    <tr>
                      <td>Languages</td>
                      <td>English</td>
                      <td>5 languages</td>
                    </tr>
                    <tr>
                      <td>Ideal for</td>
                      <td>Structured trackers who like gamification</td>
                      <td>People who quit trackers due to friction</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                <strong>When Lose It might be better:</strong>
              </p>
              <ul>
                <li>You thrive on gamification, streaks, and visual progress bars</li>
                <li>You eat mostly packaged food and rely on barcode scanning</li>
                <li>You want community challenges and social accountability</li>
                <li>You need integration with specific fitness wearables</li>
              </ul>
              <p>
                <strong>When Nuvvoo might be better:</strong>
              </p>
              <ul>
                <li>You&rsquo;ve tried Lose It but quit because logging felt tedious</li>
                <li>Recent app updates have made your workflow slower</li>
                <li>You don&rsquo;t want to pay for Premium just to set custom macros</li>
                <li>You cook at home and describing meals is faster than searching a database</li>
                <li>You prefer <Link href="/calorie-tracking-without-stress">tracking without stress or guilt</Link>, or speak a language other than English</li>
              </ul>
            </ContentSection>

            <SeoCta
              title="Try a different approach to tracking"
              description="Join Nuvvoo's early access and experience calorie tracking through conversation instead of databases."
              buttonLocation="seo_loseit_alternative"
            />

            <ContentSection title="Making the Switch">
              <p>
                <strong>What you&rsquo;ll gain:</strong>
              </p>
              <ul>
                <li><strong>Speed:</strong> Chat-based entries take 30&ndash;60 seconds vs. navigating menus and databases</li>
                <li><strong>No paywalls on basics:</strong> Full tracking without needing a premium subscription for macro targets</li>
                <li><strong>Less friction:</strong> No searching, no weighing, no portion size selections</li>
                <li><strong>Multilingual support:</strong> Track in English, German, Russian, Spanish, or French</li>
                <li><strong>No guilt on missed days:</strong> Skip a day, come back whenever — no lost streaks</li>
              </ul>
              <p>
                <strong>What you&rsquo;ll trade off:</strong>
              </p>
              <ul>
                <li><strong>Barcode scanning:</strong> Nuvvoo doesn&rsquo;t use barcodes (yet)</li>
                <li><strong>Gamification:</strong> No badges, challenges, or streak rewards</li>
                <li><strong>Social features:</strong> Nuvvoo focuses on personal tracking, not community</li>
                <li><strong>Granular control:</strong> Less ability to fine-tune every ingredient</li>
              </ul>
              <p>
                The best tracker is the one you&rsquo;ll actually use consistently. If Lose It&rsquo;s approach works for you, keep using it. If not, Nuvvoo offers a fundamentally different experience — one closer to an <Link href="/ai-food-journal">AI food journal</Link> than a database lookup.
              </p>
            </ContentSection>

            <div className="my-12 flex flex-col items-center gap-4 text-center">
              <AppStoreBadge buttonLocation="seo_loseit_alternative" />
            </div>

            <FaqSection faqs={faqs} />
          </div>
        </Container>
      </article>
      <Footer />
    </main>
  );
}
