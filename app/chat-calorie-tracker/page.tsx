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
  title: 'Chat Calorie Tracker: Track Food by Talking, Not Logging | Nuvvoo',
  description: 'Track calories by chatting, not searching databases. Nuvvoo\'s AI calorie tracker lets you talk about food naturally—no manual logging required.',
  openGraph: {
    title: 'Chat Calorie Tracker: Track Food by Talking, Not Logging',
    description: 'Track calories by chatting, not searching databases. AI-powered calorie tracking through natural conversation.',
    type: 'article',
  },
};

export default function ChatCalorieTracker() {
  const faqs = [
    {
      question: 'Is this a real calorie tracker or just a chatbot?',
      answer: 'Nuvvoo is both. It\'s a fully functional calorie tracker that uses AI conversation as the input method. You get accurate calorie counts, macros, and daily summaries—but instead of searching databases or scanning barcodes, you simply tell Nuvvoo what you ate in your own words.',
    },
    {
      question: 'How accurate is AI calorie tracking compared to manual logging?',
      answer: 'AI calorie tracking can be just as accurate as manual logging, especially for whole foods and common meals. Nuvvoo asks clarifying questions when needed (portion size, cooking method) to improve accuracy. The key difference is speed and consistency—most people track more consistently when it\'s easier, leading to better long-term results.',
    },
    {
      question: 'Is chat-based tracking better than searching food databases?',
      answer: 'It depends on your tracking style. Chat-based tracking is faster, more natural, and reduces friction for most people. Traditional database search gives you precise control over every ingredient. If you find yourself tracking inconsistently because logging feels tedious, chat-based tracking usually helps you stay consistent.',
    },
  ];

  return (
    <main>
      <Nav />
      <article className="py-16 md:py-20">
        <Container>
          <header className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              Chat Calorie Tracker: Track Food by Talking, Not Logging
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Track your food by chatting, not searching databases. Nuvvoo's AI-powered calorie tracker understands natural language, so you can describe meals in your own words—no manual logging required.
            </p>
          </header>

          <div className="mx-auto mt-10 max-w-3xl">
            <div className="overflow-hidden rounded-[2rem]">
              <Image src="/illustrations/scene-05-salad.webp" alt="Nuvvoo AI chat tracking a healthy meal" width={1200} height={800} className="h-auto w-full" />
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-3xl space-y-12">
            <ContentSection title="Why Traditional Food Logging Fails">
              <p>
                Most calorie tracking apps follow the same pattern: open the app, search a massive database, pick the closest match, enter portion size, repeat for every ingredient. For a simple breakfast, you might spend 3-5 minutes just logging.
              </p>
              <p>
                This creates friction. And when tracking feels like a chore, most people stop doing it.
              </p>
              <p>
                According to app retention studies, <strong>the majority of people who start calorie tracking abandon it within weeks</strong>. The problem isn't motivation—it's the method. Traditional food logging requires:
              </p>
              <ul>
                <li><strong>Time you don't have:</strong> Searching databases, weighing food, calculating portions</li>
                <li><strong>Perfect accuracy:</strong> Feeling guilty when you estimate or skip entries</li>
                <li><strong>Mental load:</strong> Remembering to log, interrupting meals to track</li>
                <li><strong>Database overwhelm:</strong> Choosing between 47 versions of "grilled chicken"</li>
              </ul>
              <p>
                The tools designed to help you build healthy habits end up feeling like homework. That's why chat-based tracking exists—to remove friction while keeping the benefits.
              </p>
            </ContentSection>

            <ContentSection title="How Chat-Based Tracking Works">
              <p>
                Instead of opening an app and navigating menus, you simply <strong>talk to Nuvvoo like you'd describe your meal to a friend</strong>:
              </p>
              <p>
                <em>"I had scrambled eggs with toast and coffee for breakfast"</em>
              </p>
              <p>
                Nuvvoo's AI understands natural language. It recognizes foods, estimates portions based on context, and calculates calories automatically. If it needs clarification—like whether your eggs included butter or how large your toast slices were—it asks.
              </p>
              <p>
                The entire interaction takes about 30 seconds. Compare that to 3 minutes of database searching, and you've just reduced tracking friction by 80%. Curious how this compares to photo-based AI tracking? See our <Link href="/photo-vs-chat-calorie-tracking">photo vs chat comparison</Link>.
              </p>
              <p>
                <strong>Here's what happens behind the scenes:</strong>
              </p>
              <ol>
                <li><strong>Natural language processing:</strong> Nuvvoo parses your message to identify foods, quantities, and preparation methods</li>
                <li><strong>Context-aware estimation:</strong> The AI uses typical portion sizes unless you specify otherwise</li>
                <li><strong>Smart clarification:</strong> If something's unclear, Nuvvoo asks quick follow-up questions</li>
                <li><strong>Automatic calculation:</strong> Calories and macros are calculated and logged instantly</li>
                <li><strong>Memory over time:</strong> Nuvvoo learns your eating patterns and gets better at understanding your descriptions</li>
              </ol>
              <p>
                Unlike <Link href="/ai-food-journal">traditional food journals</Link>, you don't need to remember to open an app. You can track meals retroactively by chatting: <em>"Earlier today I had a turkey sandwich for lunch."</em>
              </p>
            </ContentSection>

            <SeoCta
              title="Ready to try chat-based tracking?"
              description="Join Nuvvoo's early access and start tracking by conversation, not database search."
              buttonText="Get priority access"
            />

            <ContentSection title="Who Benefits from Conversational Tracking">
              <p>
                Chat-based calorie tracking isn't for everyone. It's designed for people who value <strong>consistency over precision</strong> and want tracking to feel effortless.
              </p>
              <p>
                <strong>You'll benefit most if you:</strong>
              </p>
              <ul>
                <li><strong>Track inconsistently:</strong> You start tracking with enthusiasm but quit after a week because it's too tedious</li>
                <li><strong>Have a busy schedule:</strong> You don't have time to weigh food or search databases between meetings</li>
                <li><strong>Eat simple meals:</strong> Most of your meals are whole foods or common dishes, not complex recipes</li>
                <li><strong>Want awareness, not perfection:</strong> You're building healthy habits, not competing in bodybuilding</li>
                <li><strong>Prefer talking to typing:</strong> You find it faster to describe meals than to search menus</li>
              </ul>
              <p>
                Conversational tracking also helps people who experience <Link href="/calorie-tracking-without-stress">tracking-related stress</Link> or have a complicated relationship with food. If traditional calorie apps have triggered anxiety or disordered patterns, read about why <Link href="/calorie-tracker-eating-disorders">conversation works better than counting for people with eating disorders</Link>.
              </p>
              <p>
                <strong>When database tracking might be better:</strong>
              </p>
              <p>
                If you're training for a specific athletic goal, need precise macro targets, or cook complex recipes with many ingredients, traditional database tracking gives you more control. Chat-based tracking prioritizes ease over precision.
              </p>
            </ContentSection>

            <ContentSection title="Why Talking Reduces Friction">
              <p>
                The shift from database search to conversation isn't just about speed—it's about <strong>cognitive load</strong>.
              </p>
              <p>
                When you search a food database, you're forced to translate your real meal into the app's language. "Grilled chicken breast" becomes a decision: Which entry? How many ounces? Raw or cooked weight? Every decision adds friction.
              </p>
              <p>
                When you chat, you use your natural language. "I had grilled chicken with rice" is enough. The AI handles translation, estimation, and calculation. Your job is simply to remember what you ate.
              </p>
              <p>
                <strong>This matters for habit formation.</strong> The easier a behavior is to do, the more likely you'll do it consistently. And consistency beats perfection in health tracking.
              </p>
              <p>
                Behavioral research consistently shows that the simpler a habit is to perform, the more likely people stick with it. That's why apps like <Link href="/alternative-to-myfitnesspal">alternatives to MyFitnessPal</Link> focus on simplifying the tracking experience.
              </p>
              <p>
                Chat-based tracking also removes the pressure of "doing it right." There's no wrong way to describe your meal. You're not searching for the perfect database entry—you're just talking. This reduces anxiety and makes tracking feel less like a chore. Even when you're <Link href="/no-dinner-ideas-calories">stuck with no dinner ideas</Link>, you can describe what you have and get help.
              </p>
            </ContentSection>

            <div className="my-12 flex flex-col items-center gap-4 text-center">
              <p className="text-lg font-medium text-slate-900">Available soon on</p>
              <div className="flex gap-3">
                <TrackedButton
                  href="/#waitlist"
                  variant="primary"
                  eventName="click_platform"
                  eventParams={{ platform: 'ios', button_location: 'seo_chat_tracker' }}
                  className="!bg-slate-900 !shadow-none hover:!bg-slate-800 gap-2 min-w-[140px]"
                >
                  <AppleIcon size={18} />
                  iOS
                </TrackedButton>
                <TrackedButton
                  href="/#waitlist"
                  variant="outline"
                  eventName="click_platform"
                  eventParams={{ platform: 'android', button_location: 'seo_chat_tracker' }}
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
