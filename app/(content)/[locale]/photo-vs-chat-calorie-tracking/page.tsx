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
import { AppleIcon, AndroidIcon } from '@/components/icons';
import { TrackedButton } from '@/components/tracked-button';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nuvvoo.app';

export const metadata: Metadata = {
  title: 'Photo vs Chat: Two Approaches to AI Calorie Tracking (And Why It Matters)',
  description: 'Photo-based AI calorie trackers are fast, but research shows 30-40% error rates on complex meals. Here\'s how conversational tracking compares.',
  alternates: { canonical: `${siteUrl}/photo-vs-chat-calorie-tracking` },
  openGraph: {
    title: 'Photo vs Chat: Two Approaches to AI Calorie Tracking',
    description: 'Snap a photo or describe your meal. Two very different approaches to AI food tracking. Here\'s what the research says about accuracy, and which one actually fits how most people eat.',
    url: `${siteUrl}/photo-vs-chat-calorie-tracking`,
    images: [{ url: '/illustrations/scene-photo-vs-chat.webp', width: 1200, height: 800 }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Photo vs Chat: Which AI Calorie Tracker Is More Accurate?',
    description: 'Research shows 30-40% error rates on complex dishes for photo tracking. Here\'s what the alternative looks like.',
    images: ['/illustrations/scene-photo-vs-chat.webp'],
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function PhotoVsChatCalorieTracking({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const faqs = [
    {
      question: 'Are photo-based calorie trackers accurate?',
      answer: 'For simple, single-ingredient foods (an apple, a plain chicken breast), error rates can be as low as 10%. But for complex or mixed dishes, which make up most real meals, research shows error rates of 30-40%. Hidden ingredients like cooking oil, butter, and sauces are essentially invisible to cameras.',
    },
    {
      question: 'Is conversational tracking more accurate than photo tracking?',
      answer: 'Conversational tracking has its own inaccuracies. Language is imprecise and portions are estimated. But the errors are more transparent. When you say "a big bowl of pasta," you know you\'re estimating. When an app confidently shows you 340 calories for a plate that actually has 600, you don\'t know what you don\'t know.',
    },
    {
      question: 'Can I use both photo and chat tracking?',
      answer: 'Some people use photo tracking for simple packaged foods and conversational tracking for home-cooked and restaurant meals. The key is finding what helps you stay consistent. A rough estimate every day beats a precise log every four days.',
    },
  ];

  return (
    <main>
      <Nav />
      <article className="py-16 md:py-20">
        <Container>
          <header className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              Photo vs Chat: Two Approaches to AI Calorie Tracking (And Why It&nbsp;Matters)
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Photo-based AI calorie trackers are fast, but how accurate are they really? A look at the research on AI food recognition vs conversational tracking.
            </p>
          </header>

          <div className="mx-auto mt-10 max-w-3xl">
            <div className="overflow-hidden rounded-[2rem]">
              <Image src="/illustrations/scene-photo-vs-chat.webp" alt="Describing a restaurant meal to Nuvvoo instead of taking a photo — conversational AI calorie tracking at dinner" width={1200} height={800} className="h-auto w-full" />
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-3xl space-y-12">
            <ContentSection title="How Photo-Based Calorie Tracking Works">
              <p>
                AI calorie tracking is having a moment. You can now point your phone at a plate of food and get an estimated calorie count in seconds. Or you can describe what you ate in plain language and let AI do the math. Both approaches use artificial intelligence. Both promise to make food awareness easier.
              </p>
              <p>
                Apps like Cal AI and others use computer vision, the same technology behind face recognition, to identify food in a photo and estimate its nutritional content. You take a picture, the AI identifies what it sees, matches it to a nutritional database, and outputs a calorie count.
              </p>
              <p>
                It sounds frictionless. And for simple foods, it can be. The problem is that most of what we actually eat isn&rsquo;t simple.
              </p>
            </ContentSection>

            <ContentSection title="What the Research Says About Photo Tracking Accuracy">
              <p>
                A 2024 systematic review published in PMC (<a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10836267/" target="_blank" rel="noopener noreferrer" className="text-nuvvooGreen-700 underline hover:text-nuvvooGreen-900"><em>AI-based digital image dietary assessment methods compared to humans and ground truth</em></a>) analyzed the accuracy of AI food recognition across multiple studies. The findings:
              </p>
              <ul>
                <li>For <strong>simple, single-ingredient foods</strong> (an apple, a banana, a plain chicken breast): error rates as low as 10%</li>
                <li>For <strong>complex or mixed dishes</strong> (a stir-fry, a sandwich, a curry): error rates climbing to <strong>30–40%</strong></li>
                <li>Apps consistently <strong>overestimated calories for Western diets</strong> and <strong>underestimated for Asian diets</strong></li>
              </ul>
              <p>
                A 30–40% error on a 600-calorie meal means you could be off by 180–240 calories without knowing it.
              </p>
              <p>
                <strong>The hidden ingredient problem.</strong> The fundamental limitation of photo-based tracking is physics: a camera can only see the surface of food. Cooking oil, one of the most calorie-dense ingredients in a kitchen, is nearly invisible in a photo. So is the butter used to saut&eacute; vegetables, the sugar in a sauce, the cream in a soup.
              </p>
              <p>
                Real user reviews of photo-based apps consistently report the same pattern: <a href="https://fuelnutrition.app/reviews/cal-ai-review" target="_blank" rel="noopener noreferrer" className="text-nuvvooGreen-700 underline hover:text-nuvvooGreen-900">calories undercounted on protein foods by roughly 50%</a>, and produce estimates that can be off by more than 75%.
              </p>
              <p>
                <strong>Portion size is guesswork.</strong> AI recognizes what something is. But it can&rsquo;t tell how much of it is on your plate without a reference point. A chicken breast in a photo could be 150g or 350g. The image looks the same.
              </p>
            </ContentSection>

            <ContentSection title="How Conversational Calorie Tracking Works">
              <p>
                The alternative approach doesn&rsquo;t use a camera at all. Instead of showing AI what you ate, you tell it.
              </p>
              <p>
                <em>&ldquo;Had scrambled eggs with two slices of whole grain toast for breakfast. Used a bit of butter. Large coffee with oat milk.&rdquo;</em>
              </p>
              <p>
                The AI processes natural language, draws on nutritional knowledge, and estimates the calorie content, asking follow-up questions if something is unclear. Over time, it learns your habits: how you typically cook, what portions you usually have, what &ldquo;a bit of butter&rdquo; means for you specifically. This is the core of <Link href="/chat-calorie-tracker">chat-based calorie tracking</Link>.
              </p>
            </ContentSection>

            <SeoCta
              title="Track by talking, not photographing"
              description="Describe your meals in plain language. Nuvvoo handles the estimation, including the hidden ingredients a camera can't see."
              buttonText="Get priority access"
            />

            <ContentSection title="Where Chat Wins Over Photo">
              <ul>
                <li><strong>Hidden ingredients are no longer hidden.</strong> When you describe your meal, you naturally include what you actually used: the oil, the sauce, the dressing. You&rsquo;re not relying on a camera to infer what it can&rsquo;t see.</li>
                <li><strong>Context travels with the food.</strong> &ldquo;I ate the whole thing even though I wasn&rsquo;t hungry&rdquo; is information a photo can never capture. &ldquo;It was a restaurant portion, probably bigger than usual&rdquo; is the kind of nuance that changes an estimate significantly.</li>
                <li><strong>Corrections actually stick.</strong> If an AI misidentifies something in a photo, you&rsquo;re fighting the model. If you described something incorrectly in a conversation, you just say &ldquo;actually, it was more like two cups,&rdquo; and the context updates naturally.</li>
                <li><strong>No photo means lower friction in real situations.</strong> Taking a photo of food at a restaurant table, at a work lunch, or at a friend&rsquo;s dinner feels socially awkward. Sending a quick description is invisible.</li>
              </ul>
            </ContentSection>

            <ContentSection title="Where Photo Wins Over Chat">
              <p>
                To be fair: for simple, whole foods like a piece of fruit, a protein bar, or a packaged item with a barcode, photo recognition can be faster and accurate enough. If your diet is mostly single-ingredient whole foods, photo tracking may work well.
              </p>
              <p>
                It&rsquo;s also useful when you genuinely don&rsquo;t know what something is. You can photograph it and get an identification.
              </p>
              <p>
                But most people&rsquo;s actual eating (home-cooked meals, restaurant food, mixed dishes, social eating) is exactly the territory where photo tracking struggles most.
              </p>
            </ContentSection>

            <ContentSection title="The Accuracy Trade-Off in Practice">
              <p>
                A <a href="https://whatthefood.io/blog/how-accurate-are-ai-calorie-counters" target="_blank" rel="noopener noreferrer" className="text-nuvvooGreen-700 underline hover:text-nuvvooGreen-900">40% error rate on complex dishes</a> might sound tolerable in isolation. But if most of your meals are complex (which most home-cooked and restaurant meals are), you could be consistently off by hundreds of calories per day without any indication that something is wrong.
              </p>
              <p>
                Conversational tracking has its own inaccuracies. Language is imprecise, portions are estimated. But the errors are more transparent. When you say &ldquo;a big bowl of pasta,&rdquo; you know you&rsquo;re estimating. When an app confidently shows you 340 calories for a plate of food that actually has 600, you don&rsquo;t know what you don&rsquo;t know.
              </p>
            </ContentSection>

            <ContentSection title="Which Approach Is Right for You?">
              <p><strong>Photo tracking might work if:</strong></p>
              <ul>
                <li>You mostly eat simple, whole foods</li>
                <li>You eat a lot of packaged items with barcodes</li>
                <li>You want fast logging and can tolerate less accuracy on mixed meals</li>
              </ul>
              <p><strong>Conversational tracking might work better if:</strong></p>
              <ul>
                <li>You cook at home with multiple ingredients</li>
                <li>You eat at restaurants regularly</li>
                <li>You want to track context (stress, hunger, energy) alongside food</li>
                <li>You&rsquo;ve <Link href="/how-to-stay-consistent-calorie-tracking">struggled to stick with traditional logging</Link> before</li>
                <li>You have a <Link href="/calorie-tracker-eating-disorders">complicated relationship with the numbers</Link> and want a gentler approach</li>
              </ul>
            </ContentSection>

            <ContentSection title="The Bigger Picture">
              <p>
                The best calorie tracking approach is the one you&rsquo;ll actually stick with. Accuracy matters, but <Link href="/calorie-tracking-without-stress">consistency matters more</Link>. A rough estimate every day is more useful than a precise log every four days.
              </p>
              <p>
                What&rsquo;s worth asking isn&rsquo;t just &ldquo;which app is more accurate?&rdquo; but &ldquo;which approach fits how I actually live and eat?&rdquo;
              </p>
              <p>
                For a lot of people, that answer is turning out to be conversation.
              </p>
              <p>
                <strong>Nuvvoo is built around the conversational approach.</strong> Describe your meals in plain language. Get estimates that account for what you actually used. Calories and macros are tracked in the background while you focus on the chat. It&rsquo;s a <Link href="/alternative-to-myfitnesspal">different kind of alternative to traditional calorie apps</Link>.
              </p>
            </ContentSection>

            <div className="my-12 flex flex-col items-center gap-4 text-center">
              <div className="flex gap-3">
                <TrackedButton
                  href="/#waitlist"
                  variant="primary"
                  eventName="click_platform"
                  eventParams={{ platform: 'ios', button_location: 'seo_photo_vs_chat' }}
                  className="!bg-slate-900 !shadow-none hover:!bg-slate-800 gap-2 min-w-[140px]"
                >
                  <AppleIcon size={18} />
                  iOS
                </TrackedButton>
                <TrackedButton
                  href="/#waitlist"
                  variant="outline"
                  eventName="click_platform"
                  eventParams={{ platform: 'android', button_location: 'seo_photo_vs_chat' }}
                  className="gap-2 min-w-[140px]"
                >
                  <AndroidIcon size={18} />
                  Android
                </TrackedButton>
              </div>
            </div>

            <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white/70 p-6 text-sm text-slate-500">
              <p className="font-medium text-slate-700">Sources:</p>
              <ul className="mt-2 space-y-1">
                <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10836267/" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-700">AI-based digital image dietary assessment methods, PMC, 2024</a></li>
                <li><a href="https://whatthefood.io/blog/how-accurate-are-ai-calorie-counters" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-700">How Accurate Are AI Calorie Counters? WhatTheFood</a></li>
                <li><a href="https://fuelnutrition.app/reviews/cal-ai-review" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-700">Cal AI Review, FuelNutrition</a></li>
              </ul>
            </div>

            <FaqSection faqs={faqs} />
          </div>
        </Container>
      </article>
      <Footer />
    </main>
  );
}
