import type { Metadata } from 'next';
import { Container } from '@/components/container';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { ContentSection } from '@/components/seo/content-section';
import { FaqSection } from '@/components/seo/faq-section';
import { SeoCta } from '@/components/seo/seo-cta';
import Image from 'next/image';
import Link from 'next/link';
import { AppleIcon, AndroidIcon } from '@/components/icons';
import { TrackedButton } from '@/components/tracked-button';

export const metadata: Metadata = {
  title: 'Calorie Tracking Without Stress or Anxiety | Nuvvoo',
  description: 'Track calories without anxiety. Nuvvoo offers stress-free, mindful calorie tracking that helps you stay consistent without perfectionism or pressure.',
  openGraph: {
    title: 'Calorie Tracking Without Stress or Anxiety',
    description: 'A calorie tracker that reduces anxiety and supports consistency without perfectionism.',
    type: 'article',
  },
};

export default function CalorieTrackingWithoutStress() {
  const faqs = [
    {
      question: 'Can I use this if I struggle with consistency?',
      answer: 'Yes. Nuvvoo is specifically designed for people who struggle with tracking consistently. The chat-based interface removes friction, and the AI\'s supportive tone makes it easier to pick back up after missed days. There\'s no judgment for imperfect tracking. The goal is progress, not perfection.',
    },
    {
      question: 'Is it suitable for complete beginners?',
      answer: 'Absolutely. You don\'t need to know anything about calories, macros, or nutrition to use Nuvvoo. Just describe what you ate in your own words, and the AI handles the rest. It\'s designed to feel more like chatting than data entry, making it accessible even if you\'ve never tracked food before.',
    },
    {
      question: 'Is this medical or nutritional advice?',
      answer: 'No. Nuvvoo is a tracking tool, not a medical device or personalized nutrition service. It helps you build awareness of your eating habits but does not provide medical advice, diagnose conditions, or replace guidance from healthcare professionals. If you have specific health concerns, consult a registered dietitian or doctor.',
    },
  ];

  return (
    <main>
      <Nav />
      <article className="py-16 md:py-20">
        <Container>
          <header className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              Calorie Tracking Without Stress or Anxiety
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Track calories without the anxiety. Nuvvoo offers a calm, judgment-free approach to calorie tracking that prioritizes consistency and awareness over perfectionism.
            </p>
          </header>

          <div className="mx-auto mt-10 max-w-3xl">
            <div className="overflow-hidden rounded-[2rem]">
              <Image src="/illustrations/scene-07-goodnight.webp" alt="Nuvvoo offering a calm end-of-day check-in" width={1200} height={800} className="h-auto w-full" />
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-3xl space-y-12">
            <ContentSection title="Why Calorie Apps Create Anxiety">
              <p>
                For many people, calorie tracking apps become a source of stress rather than support. What starts as a healthy habit can quickly turn into an anxious obsession with numbers, guilt over missed entries, and fear of "going over budget."
              </p>
              <p>
                <strong>Common sources of tracking-related anxiety:</strong>
              </p>
              <ul>
                <li><strong>Bright red warnings:</strong> Apps that scold you for eating "too much" create a fear-based relationship with food</li>
                <li><strong>All-or-nothing thinking:</strong> Miss one meal or go over your goal, and the whole day feels ruined</li>
                <li><strong>Perfectionism pressure:</strong> Feeling like every entry must be exact, down to the gram, or it doesn't count</li>
                <li><strong>Food as moral judgment:</strong> Labeling foods as "good" or "bad," "allowed" or "forbidden"</li>
                <li><strong>Guilt over inconsistency:</strong> Skipping a day creates shame, making it harder to return to tracking</li>
                <li><strong>Obsessive checking:</strong> Constantly opening the app to see if you're "on track," turning meals into math problems</li>
              </ul>
              <p>
                <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8485346/" target="_blank" rel="noopener noreferrer" className="text-nuvvooGreen-700 underline hover:text-nuvvooGreen-900">Studies in eating behavior</a> suggest that rigid calorie tracking can increase anxiety around food, especially for people prone to perfectionism. When tracking becomes stressful, it stops being helpful, even if the original intention was health.
              </p>
              <p>
                The problem isn't tracking itself. It's <em>how</em> most apps approach tracking: with rigid rules, judgment, and a focus on restriction rather than awareness.
              </p>
            </ContentSection>

            <ContentSection title="The Problem with Perfectionism in Tracking">
              <p>
                Perfectionism is one of the biggest reasons people quit calorie tracking, or worse, develop unhealthy relationships with food.
              </p>
              <p>
                <strong>What perfectionism looks like in tracking:</strong>
              </p>
              <ul>
                <li>Weighing every ingredient to the exact gram</li>
                <li>Refusing to eat out because restaurant meals are "hard to track"</li>
                <li>Feeling anxious if you can't log something immediately</li>
                <li>Deleting entries and starting over if you go over your calorie goal</li>
                <li>Avoiding social events because they might involve untrackable food</li>
                <li>Feeling like tracking is "pointless" if you can't do it perfectly</li>
              </ul>
              <p>
                This all-or-nothing mindset is exhausting. And it misses the point of tracking: <strong>building awareness, not achieving perfection</strong>.
              </p>
              <p>
                The truth is, <strong>imperfect tracking is still useful tracking</strong>. Knowing you ate roughly 1800-2000 calories is more helpful than having no data at all. Estimating portions is better than skipping meals because you can't weigh them.
              </p>
              <p>
                Stress-free tracking embraces this. It's not about hitting exact numbers every day. It's about understanding your eating patterns over time. Some days you'll track perfectly. Other days you'll estimate. Both are valuable.
              </p>
              <p>
                Apps like <Link href="/alternative-to-myfitnesspal">alternatives to MyFitnessPal</Link> are designed to reduce this perfectionism by making tracking feel more flexible and forgiving. If perfectionism has crossed into disordered eating territory, read about <Link href="/calorie-tracker-eating-disorders">why conversation-based tracking is safer for people with eating disorders</Link>.
              </p>
            </ContentSection>

            <SeoCta
              title="Track calories without the stress"
              description="Join Nuvvoo's early access and experience calorie tracking that's calm, flexible, and judgment-free."
              buttonText="Get priority access"
            />

            <ContentSection title="How Nuvvoo Enables Calm Tracking">
              <p>
                Nuvvoo is designed from the ground up to make calorie tracking feel <strong>supportive rather than stressful</strong>.
              </p>
              <p>
                <strong>Key features that reduce anxiety:</strong>
              </p>
              <ul>
                <li><strong>Conversational interface:</strong> <Link href="/chat-calorie-tracker">Chat-based tracking</Link> feels natural, not clinical. You describe meals in your own words, removing the pressure of finding "perfect" database entries</li>
                <li><strong>Supportive tone:</strong> Nuvvoo never scolds or uses shame language. If you go over your goal, the response is &ldquo;It&rsquo;s okay. Tomorrow is a new day&rdquo; rather than a warning</li>
                <li><strong>Soft visual feedback:</strong> Instead of bright red alerts, Nuvvoo uses a gentle coral tone when you exceed your target. No panic, just awareness</li>
                <li><strong>Flexible accuracy:</strong> Estimates are encouraged. The AI helps you track even when you don't know exact portions</li>
                <li><strong>Pattern focus:</strong> The stats screen is labeled &ldquo;Your progress, not your grades.&rdquo; Nuvvoo helps you see weekly patterns and trends, not judge individual meals</li>
                <li><strong>Skip-friendly:</strong> Missed a day? No problem. Nuvvoo gently welcomes you back without guilt</li>
              </ul>
              <p>
                The goal is to make tracking feel like <Link href="/ai-food-journal">keeping a food journal</Link> with a supportive friend, not entering data into a strict system.
              </p>
              <p>
                <strong>Example of the difference:</strong>
              </p>
              <p>
                <em>Traditional app:</em> "You are 340 calories over your goal. Reduce portion sizes."
              </p>
              <p>
                <em>Nuvvoo:</em> "It&rsquo;s okay. Tomorrow is a new day."
              </p>
              <p>
                This shift in tone makes a huge difference in how tracking feels emotionally. One creates anxiety, the other creates space to try again.
              </p>
            </ContentSection>

            <ContentSection title="Reducing Mental Load While Staying Consistent">
              <p>
                Stress-free tracking isn't just about tone. It's about reducing the <strong>mental effort</strong> of tracking itself.
              </p>
              <p>
                Traditional calorie tracking requires constant decision-making:
              </p>
              <ul>
                <li>Which database entry is closest to what I ate?</li>
                <li>Should I weigh this or estimate?</li>
                <li>Do I log this now or later?</li>
                <li>How do I track this restaurant meal?</li>
                <li>Is this entry accurate or should I search for another?</li>
              </ul>
              <p>
                Every decision adds mental load. And when tracking feels mentally exhausting, consistency suffers.
              </p>
              <p>
                <strong>Nuvvoo reduces mental load by:</strong>
              </p>
              <ul>
                <li><strong>Removing database decisions:</strong> No searching through 50 versions of "grilled chicken." Just say what you ate</li>
                <li><strong>Handling estimation:</strong> The AI makes reasonable assumptions based on context, so you don't have to calculate everything</li>
                <li><strong>Remembering your meals:</strong> Over time, Nuvvoo learns your common meals, making logging even faster</li>
                <li><strong>Accepting rough data:</strong> "I had pasta for dinner" is enough. You don't need precise measurements</li>
                <li><strong>Flexible timing:</strong> Track meals retroactively or in real-time, whatever works for your schedule</li>
              </ul>
              <p>
                When tracking becomes this simple, it's easier to stay consistent. And <strong>consistency is more important than accuracy</strong> for long-term health habits.
              </p>
              <p>
                Habit research consistently points to one principle: the easier something is to do, the more likely you'll keep doing it. Nuvvoo applies this to calorie tracking: remove the busywork, and consistency follows naturally.
              </p>
              <p>
                The result? Tracking that actually helps you build sustainable habits instead of burning you out. Even on those evenings when you have <Link href="/no-dinner-ideas-calories">no idea what to eat for dinner</Link>, a quick chat is all it takes.
              </p>
            </ContentSection>

            <div className="my-12 flex flex-col items-center gap-4 text-center">
              <div className="flex gap-3">
                <TrackedButton
                  href="/#waitlist"
                  variant="primary"
                  eventName="click_platform"
                  eventParams={{ platform: 'ios', button_location: 'seo_stress_free' }}
                  className="!bg-slate-900 !shadow-none hover:!bg-slate-800 gap-2 min-w-[140px]"
                >
                  <AppleIcon size={18} />
                  iOS
                </TrackedButton>
                <TrackedButton
                  href="/#waitlist"
                  variant="outline"
                  eventName="click_platform"
                  eventParams={{ platform: 'android', button_location: 'seo_stress_free' }}
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
