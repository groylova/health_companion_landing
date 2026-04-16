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
  title: 'How to Actually Stay Consistent With Calorie Tracking (Without Burning Out)',
  description: 'Most people quit calorie tracking within 3 weeks. Here\'s why it happens and a simpler approach that actually sticks long-term, backed by habit science.',
  alternates: { canonical: `${siteUrl}/how-to-stay-consistent-calorie-tracking` },
  openGraph: {
    title: 'How to Actually Stay Consistent With Calorie Tracking (Without Burning Out)',
    description: 'The problem isn\'t motivation. It\'s friction. Here\'s what habit science says about making food tracking stick, and why most apps are designed wrong.',
    url: `${siteUrl}/how-to-stay-consistent-calorie-tracking`,
    images: [{ url: '/illustrations/scene-consistency.webp', width: 1200, height: 800 }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Why You Keep Quitting Calorie Tracking (And How to Actually Stick With It)',
    description: 'It\'s not about discipline. It\'s about friction. Here\'s the habit science behind food tracking consistency.',
    images: ['/illustrations/scene-consistency.webp'],
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HowToStayConsistentCalorieTracking({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const faqs = [
    {
      question: 'How long does it take to build a tracking habit?',
      answer: 'Research by Phillippa Lally at University College London found that it takes 66 days on average before a behavior becomes automatic, with a wide range from 18 to 254 days (Lally et al., European Journal of Social Psychology, 2010). The good news: even imperfect early attempts count. You don\'t have to be perfect for 66 days. You just have to keep returning.',
    },
    {
      question: 'What if I keep quitting and restarting?',
      answer: 'That\'s completely normal, and each restart still counts toward building the habit. The key is reducing friction so it\'s easier to come back. With Nuvvoo, your minimum viable tracking day is one sentence: "ate a lot today, was stressed." That still counts as data.',
    },
    {
      question: 'Do I need to track every single meal?',
      answer: 'No. A rough daily summary is more valuable than a perfect log you only keep for a week. Consistency beats precision. Even "had a big lunch, light dinner, felt good" gives you useful pattern data over time.',
    },
  ];

  return (
    <main>
      <Nav />
      <article className="py-16 md:py-20">
        <Container>
          <header className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              How to Actually Stay Consistent With Calorie Tracking (Without Burning&nbsp;Out)
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Most people quit calorie tracking within 3 weeks. Here&rsquo;s why it happens, and a simpler approach that actually sticks long-term.
            </p>
          </header>

          <div className="mx-auto mt-10 max-w-3xl">
            <div className="overflow-hidden rounded-[2rem]">
              <Image src="/illustrations/scene-consistency.webp" alt="Person relaxed on couch tracking food habits on phone with Nuvvoo — building a consistent calorie tracking habit" width={1200} height={800} className="h-auto w-full" />
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-3xl space-y-12">
            <ContentSection title="Why Most People Quit Within Three Weeks">
              <p>
                You started tracking on a Monday. By Friday you&rsquo;d logged every meal. By the following Wednesday, you hadn&rsquo;t opened the app in four days.
              </p>
              <p>
                Sound familiar? You&rsquo;re not lazy or undisciplined. You ran into a design problem.
              </p>
              <p>
                <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5332530/" target="_blank" rel="noopener noreferrer" className="text-nuvvooGreen-700 underline hover:text-nuvvooGreen-900">Research on habit formation</a> consistently shows that the harder a behavior is to do, the less likely it is to stick, regardless of motivation. Motivation is temporary. Friction is permanent.
              </p>
              <p>
                Traditional food logging has a lot of friction:
              </p>
              <ul>
                <li>You have to open the app before, during, or after every meal</li>
                <li>You have to search a database for each item, often with confusing results</li>
                <li>You have to weigh or estimate portions accurately</li>
                <li>You have to do this three or more times a day, every single day</li>
                <li>One bad day can feel like a reason to stop entirely</li>
              </ul>
              <p>
                Add in the emotional weight: guilt when you go over, anxiety when you&rsquo;re close to the limit, the mental math running in the background at every meal. It becomes genuinely tiring.
              </p>
              <p>
                Most people aren&rsquo;t quitting because they don&rsquo;t care. They&rsquo;re quitting because the tool is asking too much. If this sounds like your experience, you&rsquo;re not alone. It&rsquo;s the core reason people look for <Link href="/alternative-to-myfitnesspal">alternatives to traditional calorie apps</Link>.
              </p>
            </ContentSection>

            <ContentSection title="The Real Goal of Food Tracking (That Most Apps Get Wrong)">
              <p>
                Here&rsquo;s the thing: <strong>you don&rsquo;t need to track perfectly to benefit from tracking.</strong>
              </p>
              <p>
                The point of food awareness isn&rsquo;t to hit an exact calorie number every single day. The point is to understand your patterns: what you tend to eat, when you eat more than you need, what makes you feel good versus sluggish, where the hidden calories in your routine are hiding.
              </p>
              <p>
                That kind of understanding doesn&rsquo;t require precision. It requires consistency. And consistency requires low friction.
              </p>
              <p>
                <strong>A rough log every day is worth ten times more than a perfect log every four days.</strong>
              </p>
            </ContentSection>

            <ContentSection title="What Actually Makes Tracking Stick: The Habit Science">
              <p>
                Behavioral research points to a few factors that make habits durable:
              </p>
              <ul>
                <li><strong>Low activation energy.</strong> The easier it is to start, the more likely you are to do it. Habits that require opening multiple screens, typing in exact numbers, and scanning barcodes have high activation energy. Habits that require saying one sentence have low activation energy.</li>
                <li><strong>Immediate reward, not delayed gratification.</strong> If the only payoff from tracking is a number on a scale three weeks from now, your brain won&rsquo;t stay engaged. Habits stick when they have a small, immediate reward: a sense of completion, a moment of reflection, a tiny feeling of progress.</li>
                <li><strong>Flexible enough to survive imperfect days.</strong> Rigid systems break on hard days. If the only way to &ldquo;succeed&rdquo; is a perfect log, then a stressful Tuesday where you forget lunch means failure. And failure, psychologically, often leads to abandoning the system entirely.</li>
                <li><strong>Identity-based, not outcome-based.</strong> James Clear&rsquo;s <a href="https://jamesclear.com/identity-based-habits" target="_blank" rel="noopener noreferrer" className="text-nuvvooGreen-700 underline hover:text-nuvvooGreen-900">research on habit formation</a> points to a consistent finding: habits built around identity (&ldquo;I&rsquo;m someone who pays attention to what I eat&rdquo;) are more durable than habits built around outcomes (&ldquo;I&rsquo;m trying to lose 10 pounds&rdquo;). Outcomes fluctuate. Identity persists.</li>
              </ul>
            </ContentSection>

            <SeoCta
              title="Build a tracking habit that actually lasts"
              description="Nuvvoo makes food tracking as easy as describing your day. Consistency over perfection."
              buttonText="Get priority access"
            />

            <ContentSection title="Why the Chat Approach Is Stickier Than Logging">
              <p>
                Describing your day in a few sentences is a fundamentally different behavior than logging it in a database.
              </p>
              <p>
                It takes 10 seconds instead of 3 minutes. It doesn&rsquo;t require a barcode scanner or an exact gram weight. You can do it at the end of the day instead of in the middle of every meal. And it doesn&rsquo;t feel like data entry. It feels like journaling, or like texting a friend.
              </p>
              <p>
                That difference in feel matters enormously for habit formation. The more a behavior feels like a chore, the more cognitive resistance builds around it. The more it feels like a natural part of your day, the more invisible it becomes, which is exactly what you want from a habit.
              </p>
              <p>
                <em>&ldquo;Had a big lunch, wasn&rsquo;t hungry for dinner so I just had soup. Felt a bit tired all afternoon, might have been the pasta.&rdquo;</em>
              </p>
              <p>
                That&rsquo;s it. That&rsquo;s a log. And it contains more useful information than a precise calorie count, because it captures context, not just numbers. This is the core idea behind <Link href="/chat-calorie-tracker">chat-based calorie tracking</Link>.
              </p>
            </ContentSection>

            <ContentSection title="Practical Tips for Building the Habit">
              <p>
                If you want to start tracking and actually stick with it, here&rsquo;s what the evidence suggests:
              </p>
              <ul>
                <li><strong>Attach it to an existing habit.</strong> Stack it on top of something you already do reliably. End-of-day reflection works well right after brushing your teeth, or while the kettle boils for your evening tea. Same time, same trigger, every day.</li>
                <li><strong>Make it small enough to do on bad days.</strong> Your minimum viable tracking day shouldn&rsquo;t be a full log. It should be one sentence. &ldquo;Ate a lot today, stressed, didn&rsquo;t cook.&rdquo; That still counts. On good days you&rsquo;ll write more, but designing for bad days is what keeps the habit alive.</li>
                <li><strong>Forget perfection from the start.</strong> You will miss days. You will have weeks where tracking falls apart. That&rsquo;s not failure, that&rsquo;s normal. The only version of consistency that matters is getting back to it after you stop.</li>
                <li><strong>Look for patterns, not grades.</strong> At the end of each week, the question isn&rsquo;t &ldquo;did I stay under my calories every day?&rdquo; It&rsquo;s &ldquo;what did I notice?&rdquo; Maybe you eat more on Thursdays. Maybe you snack more when you work from home. That&rsquo;s the value of tracking: not compliance, but insight.</li>
              </ul>
              <p>
                And if the emotional side of tracking feels heavy, read about <Link href="/calorie-tracking-without-stress">how to track calories without stress</Link> or explore <Link href="/calorie-tracker-eating-disorders">safer approaches for people with disordered eating patterns</Link>.
              </p>
            </ContentSection>

            <ContentSection title="The Bottom Line">
              <p>
                Consistency in food tracking isn&rsquo;t about discipline. It&rsquo;s about designing a system that&rsquo;s easy enough to do on your worst day, flexible enough to survive imperfect weeks, and rewarding enough that your brain wants to keep doing it.
              </p>
              <p>
                That means low friction. Low stakes. High context. And a format that feels like reflection, not reporting.
              </p>
              <p>
                <strong>Nuvvoo is built around exactly this.</strong> Describe your day in plain language. The AI handles calorie and macro tracking in the background while you focus on the conversation. Streaks encourage you to keep showing up, but a missed day is never punished. The app&rsquo;s mantra says it all: &ldquo;Consistency, not perfection.&rdquo; Think of it as an <Link href="/ai-food-journal">AI food journal</Link> that learns your habits and gets better over time.
              </p>
              <p>
                The goal isn&rsquo;t a perfect log. It&rsquo;s a habit you can actually keep.
              </p>
            </ContentSection>

            <div className="my-12 flex flex-col items-center gap-4 text-center">
              <div className="flex gap-3">
                <TrackedButton
                  href="/#waitlist"
                  variant="primary"
                  eventName="click_platform"
                  eventParams={{ platform: 'ios', button_location: 'seo_consistency' }}
                  className="!bg-slate-900 !shadow-none hover:!bg-slate-800 gap-2 min-w-[140px]"
                >
                  <AppleIcon size={18} />
                  iOS
                </TrackedButton>
                <TrackedButton
                  href="/#waitlist"
                  variant="outline"
                  eventName="click_platform"
                  eventParams={{ platform: 'android', button_location: 'seo_consistency' }}
                  className="gap-2 min-w-[140px]"
                >
                  <AndroidIcon size={18} />
                  Android
                </TrackedButton>
              </div>
            </div>

            <FaqSection faqs={faqs} />
          </div>
        </Container>
      </article>
      <Footer />
    </main>
  );
}
