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
  title: 'AI Food Journal: Smart Food Diary That Remembers',
  description: 'A gentle AI food journal that learns your patterns, tracks mood & energy, and helps you stay consistent without the pressure of manual logging.',
  openGraph: {
    title: 'AI Food Journal: Smart Food Diary That Remembers',
    description: 'AI-powered food journal that learns your eating patterns and tracks holistic health—mood, energy, and food.',
    type: 'article',
  },
};

export default function AiFoodJournal() {
  const faqs = [
    {
      question: 'Is this for weight loss or general wellness?',
      answer: 'Nuvvoo is designed for general wellness and building awareness around food, mood, and energy. While many people use food journals as part of weight management, Nuvvoo focuses on sustainable habits rather than restrictive dieting. It tracks calories and macros in the background, but the emphasis is on understanding patterns, like how certain foods affect your energy, rather than obsessing over numbers.',
    },
    {
      question: 'Does it count macros and micronutrients?',
      answer: 'Yes, Nuvvoo tracks calories, macros (protein, carbs, fat), and basic nutritional information. However, the focus is on awareness and patterns, not precision. If you need detailed micronutrient tracking for medical reasons, consult a registered dietitian and use specialized nutrition software.',
    },
    {
      question: 'Where is my data stored?',
      answer: 'All data is stored securely and encrypted. Nuvvoo uses your food journal data to personalize your experience and learn your patterns, but your information is never shared with third parties. You can export or delete your data at any time. See our privacy policy for details.',
    },
  ];

  return (
    <main>
      <Nav />
      <article className="py-16 md:py-20">
        <Container>
          <header className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              AI Food Journal: Smart Food Diary That Remembers
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              A gentle AI food journal that learns your eating patterns, tracks mood and energy alongside food, and helps you stay consistent without the pressure of perfect logging.
            </p>
          </header>

          <div className="mx-auto mt-10 max-w-3xl">
            <div className="overflow-hidden rounded-[2rem]">
              <Image src="/illustrations/scene-03-doing-great.webp" alt="Nuvvoo celebrating your food journal progress" width={1200} height={800} className="h-auto w-full" />
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-3xl space-y-12">
            <ContentSection title="Food Journaling vs. Calorie Tracking">
              <p>
                There's a difference between <strong>tracking</strong> and <strong>journaling</strong>. Tracking focuses on numbers—calories in, calories out. Journaling focuses on awareness—what you ate, how you felt, what patterns emerge.
              </p>
              <p>
                Traditional calorie tracking apps treat food as data points. You log "200g chicken breast, 150g rice" and get numbers back. This works for people who need precision, like athletes or those following specific meal plans.
              </p>
              <p>
                Food journaling takes a different approach. It asks: <em>What did I eat today? How did I feel? What patterns do I notice?</em> The goal isn't perfection—it's <strong>awareness</strong>.
              </p>
              <p>
                <a href="https://www.cambridge.org/core/journals/nutrition-research-reviews/article/mindful-eating-and-common-diet-programs-lower-body-weight-similarly-systematic-review-and-metaanalysis/0B1A848D72AE1BF8535B42509E04EA03" target="_blank" rel="noopener noreferrer" className="text-nuvvooGreen-700 underline hover:text-nuvvooGreen-900">Emerging evidence in nutrition psychology</a> suggests that awareness-based approaches lead to more sustainable behavior change than restrictive counting. When you understand your patterns—like noticing you crave sweets when stressed—you can make informed choices without rigid rules.
              </p>
              <p>
                <strong>Nuvvoo combines both approaches:</strong> You get the structure of calorie tracking (if you want it) with the flexibility and self-awareness of journaling. Instead of feeling like you're logging data, it feels like you're <Link href="/chat-calorie-tracker">chatting with a supportive companion</Link>.
              </p>
            </ContentSection>

            <ContentSection title="How AI Learns Your Patterns">
              <p>
                Unlike static food diaries or database-driven apps, Nuvvoo's AI learns from your entries over time. This creates a <strong>personalized tracking experience</strong> that gets easier the more you use it.
              </p>
              <p>
                <strong>Here's how it works:</strong>
              </p>
              <ul>
                <li><strong>Memory of your meals:</strong> If you frequently eat "oatmeal with berries," Nuvvoo remembers your typical portion and preparation style</li>
                <li><strong>Context understanding:</strong> When you say "the usual breakfast," Nuvvoo knows what that means for you</li>
                <li><strong>Pattern recognition:</strong> The AI identifies trends, like eating lighter on busy days or craving certain foods in the evening</li>
                <li><strong>Personalized suggestions:</strong> Based on your history, Nuvvoo can ask relevant follow-up questions or suggest reflection prompts</li>
                <li><strong>Adaptive responses:</strong> The more you journal, the better Nuvvoo understands your communication style and preferences</li>
              </ul>
              <p>
                This is different from apps that treat every entry as isolated data. Nuvvoo builds a continuous narrative of your eating habits, making it easier to spot patterns and make gradual improvements.
              </p>
              <p>
                For example, if Nuvvoo notices you often skip breakfast on weekday mornings, it might gently ask about your morning routine. This kind of contextual awareness helps you identify habits you might not notice on your own.
              </p>
            </ContentSection>

            <SeoCta
              title="Ready to start your AI food journal?"
              description="Join Nuvvoo's early access and begin tracking food, mood, and energy with a journal that remembers."
              buttonText="Get priority access"
            />

            <ContentSection title="Track Mood & Energy, Not Just Food">
              <p>
                One of the biggest differences between Nuvvoo and traditional <Link href="/alternative-to-myfitnesspal">calorie tracking apps</Link> is the focus on <strong>holistic health</strong>.
              </p>
              <p>
                Food doesn't exist in a vacuum. What you eat affects how you feel—your energy levels, mood, focus, and sleep. But most tracking apps only ask about food, ignoring the connection between diet and wellbeing.
              </p>
              <p>
                <strong>Nuvvoo lets you journal beyond food:</strong>
              </p>
              <ul>
                <li><strong>Energy levels:</strong> "Felt sluggish after lunch today"</li>
                <li><strong>Mood:</strong> "Been stressed all week, noticing more snacking"</li>
                <li><strong>Physical sensations:</strong> "Stomach felt off after dinner"</li>
                <li><strong>Context:</strong> "Ate quickly between meetings"</li>
                <li><strong>Cravings:</strong> "Really wanted something sweet in the afternoon"</li>
              </ul>
              <p>
                Over time, these entries help you see patterns. Maybe you notice that skipping breakfast leads to low energy by 3pm. Or that eating processed snacks correlates with afternoon crashes. This kind of insight is more valuable than calorie counts alone.
              </p>
              <p>
                <strong>Why this matters for behavior change:</strong> Understanding the <em>why</em> behind your eating habits makes it easier to adjust them. If you realize you're stress-eating because work is overwhelming, you can address the root cause rather than just trying to "eat less."
              </p>
              <p>
                This approach aligns with intuitive eating and mindful eating practices, which focus on awareness and self-compassion rather than restriction. It's what makes Nuvvoo feel less like <Link href="/calorie-tracking-without-stress">a stressful calorie counter</Link> and more like a wellness tool, especially for people who need a <Link href="/calorie-tracker-eating-disorders">safer alternative to traditional calorie tracking</Link>.
              </p>
            </ContentSection>

            <ContentSection title="Why People Quit Food Journals (And How AI Helps)">
              <p>
                Traditional food journaling—whether paper-based or app-based—has a consistency problem. <strong>The initial enthusiasm rarely lasts beyond a few weeks.</strong>
              </p>
              <p>
                <strong>Common reasons people stop journaling:</strong>
              </p>
              <ul>
                <li><strong>It feels tedious:</strong> Writing down every meal, every day, requires discipline that fades over time</li>
                <li><strong>Missed days create guilt:</strong> Skip one day, feel behind, quit altogether</li>
                <li><strong>No immediate benefit:</strong> Journaling only helps if you review and reflect, which few people do consistently</li>
                <li><strong>Perfectionism:</strong> Feeling like entries need to be detailed and accurate, making it exhausting</li>
                <li><strong>Lack of feedback:</strong> Paper journals don't respond; static apps don't provide insights</li>
              </ul>
              <p>
                <strong>How AI solves these problems:</strong>
              </p>
              <p>
                Nuvvoo's AI makes food journaling feel more like a conversation than a chore. You can journal in natural language, skip days without guilt (the AI gently nudges you back), and receive personalized insights without manually reviewing entries.
              </p>
              <p>
                The AI also removes the pressure of perfection. You don't need to write long, detailed entries. "Had pizza for dinner" is enough. Nuvvoo will ask follow-ups if needed, but it doesn't demand perfection.
              </p>
              <p>
                Over time, the AI helps you stay consistent by:
              </p>
              <ul>
                <li>Remembering your usual meals so entries get faster</li>
                <li>Asking relevant reflection questions based on your patterns</li>
                <li>Celebrating small wins and progress</li>
                <li>Adapting to your journaling style (some people journal daily, others weekly—both work)</li>
              </ul>
              <p>
                This adaptive, supportive approach is what helps people stick with food journaling long-term. It's not about rigid tracking. It's about building sustainable awareness. Learn more about <Link href="/how-to-stay-consistent-calorie-tracking">how to actually stay consistent with food tracking</Link>.
              </p>
            </ContentSection>

            <div className="my-12 flex flex-col items-center gap-4 text-center">
              <div className="flex gap-3">
                <TrackedButton
                  href="/#waitlist"
                  variant="primary"
                  eventName="click_platform"
                  eventParams={{ platform: 'ios', button_location: 'seo_food_journal' }}
                  className="!bg-slate-900 !shadow-none hover:!bg-slate-800 gap-2 min-w-[140px]"
                >
                  <AppleIcon size={18} />
                  iOS
                </TrackedButton>
                <TrackedButton
                  href="/#waitlist"
                  variant="outline"
                  eventName="click_platform"
                  eventParams={{ platform: 'android', button_location: 'seo_food_journal' }}
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
