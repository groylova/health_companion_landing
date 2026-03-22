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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nuvvoo.app';

export const metadata: Metadata = {
  title: 'Calorie Tracking With an Eating Disorder: Why Chat Works Better | Nuvvoo',
  description: '73% of traditional calorie tracker users with an eating disorder say the app made it worse. Here\'s why a conversational approach is safer — and what to look for instead.',
  alternates: { canonical: `${siteUrl}/calorie-tracker-eating-disorders` },
  openGraph: {
    title: 'Calorie Tracking With an Eating Disorder: Why Conversation Works Better Than Counting',
    description: 'Research shows traditional calorie trackers can worsen disordered eating. A conversational approach — describing your day instead of logging numbers — changes everything.',
    url: `${siteUrl}/calorie-tracker-eating-disorders`,
    images: [{ url: '/illustrations/scene-eating-disorders.png', width: 1200, height: 800 }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calorie Tracking With an Eating Disorder: Why Chat Works Better',
    description: '73% of traditional calorie tracker users with an eating disorder say the app made it worse. There\'s a better way.',
    images: ['/illustrations/scene-eating-disorders.png'],
  },
};

export default function CalorieTrackerEatingDisorders() {
  const faqs = [
    {
      question: 'Is Nuvvoo safe for people with eating disorders?',
      answer: 'Nuvvoo is designed to be gentler than traditional calorie trackers — no red warnings, no rigid limits, no punishment signals. However, if you\'re currently in treatment for an active eating disorder, please consult your treatment team before using any food tracking tool.',
    },
    {
      question: 'Does Nuvvoo show calorie numbers?',
      answer: 'Nuvvoo focuses on patterns and awareness rather than precise calorie counts. You describe your day in your own words, and the AI reflects your habits back to you without judgment or rigid numerical targets.',
    },
    {
      question: 'How is this different from MyFitnessPal?',
      answer: 'MyFitnessPal is built around a food database, barcode scanning, and precise calorie counting — features that can trigger obsessive behavior in vulnerable users. Nuvvoo uses conversation instead: you describe what you ate, how you felt, and the AI looks for patterns over time without grading individual meals.',
    },
  ];

  return (
    <main>
      <Nav />
      <article className="py-16 md:py-20">
        <Container>
          <header className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              Calorie Tracking With an Eating Disorder: Why Conversation Works Better Than&nbsp;Counting
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Traditional calorie trackers can worsen disordered eating. Here&rsquo;s why a conversational approach — like describing your day instead of logging numbers — is a safer, healthier alternative.
            </p>
          </header>

          <div className="mx-auto mt-10 max-w-3xl">
            <div className="overflow-hidden rounded-[2rem]">
              <Image src="/illustrations/scene-eating-disorders.png" alt="A calm conversation about food instead of anxious calorie counting — Nuvvoo gently asking how are you feeling" width={1200} height={800} className="h-auto w-full" />
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-3xl space-y-12">
            <ContentSection title="The Research Is Clear: Traditional Calorie Trackers Can Harm People With Disordered Eating">
              <p>
                You opened a calorie tracking app. You entered your breakfast, watched the calories tally up, and felt your chest tighten. You skipped the afternoon snack because you were &ldquo;already too close to the limit.&rdquo; By dinner, you either ate way under — or way over — because the pressure had become unbearable.
              </p>
              <p>
                If any of that sounds familiar, you&rsquo;re not alone. And more importantly: <strong>the app wasn&rsquo;t helping you. It was working against you.</strong>
              </p>
              <p>
                A 2017 study published in <em>Eating Behaviors</em> found that <strong>73% of traditional calorie tracker users with a history of an eating disorder reported the app contributed to their condition</strong>. Nearly half said it did so moderately or strongly. — <a href="https://www.sciencedirect.com/science/article/abs/pii/S1471015317301484" target="_blank" rel="noopener noreferrer" className="text-nuvvooGreen-700 underline hover:text-nuvvooGreen-900">Levinson, Fewell &amp; Brosof, <em>Eating Behaviors</em>, 2017</a>
              </p>
              <p>
                Separate research linked calorie-counting apps more broadly to higher rates of restrictive behaviors, food obsession, and anxiety around meals — particularly among people already vulnerable to disordered patterns.
              </p>
              <p>
                Why? Because the design of these apps is fundamentally built on a premise that&rsquo;s dangerous for certain people: <strong>food as math</strong>.
              </p>
              <p>
                Red warning colors when you approach your limit. Graphs showing your daily deficit. Macros broken into precise decimal points. A little badge when you log every meal for 30 days straight. These features are motivating for some users. For others, they&rsquo;re a direct trigger for restriction, binging, guilt cycles, and relapse.
              </p>
            </ContentSection>

            <ContentSection title="What Makes Traditional Tracking Apps Harmful">
              <p>
                The problem isn&rsquo;t calorie awareness itself. It&rsquo;s how these apps deliver that awareness.
              </p>
              <ul>
                <li><strong>Rigid numbers with no context.</strong> A calorie counter doesn&rsquo;t know that you barely slept, that you had a stressful meeting, that you&rsquo;re on your period, or that you&rsquo;ve been walking 12,000 steps. It just shows you a number — and expects you to stay under it regardless of what your body actually needs that day.</li>
                <li><strong>Warning signals and color coding.</strong> Red is bad. Green is good. This binary framing teaches your brain to think of food in terms of &ldquo;safe&rdquo; and &ldquo;unsafe&rdquo; — exactly the kind of thinking that fuels restrictive eating disorders.</li>
                <li><strong>Perfectionistic streaks.</strong> &ldquo;You&rsquo;ve logged for 14 days in a row!&rdquo; sounds encouraging, but for someone prone to all-or-nothing thinking, one missed day can feel like total failure — leading to an &ldquo;I ruined it anyway&rdquo; binge.</li>
                <li><strong>Public accountability and social features.</strong> Some apps let you share your food diary. The idea is community support. The reality, for many, is shame and comparison.</li>
                <li><strong>Enormous food databases that invite obsession.</strong> When you can look up the exact calorie count of seven almonds versus eight, the app is actively encouraging a level of precision that goes far beyond healthy awareness.</li>
              </ul>
            </ContentSection>

            <ContentSection title="The Paradox of Calorie Counting and Binge Eating">
              <p>
                Here&rsquo;s something counterintuitive that keeps showing up in research: <strong>strict calorie counting can actually cause binge eating, not prevent it.</strong>
              </p>
              <p>
                The mechanism is straightforward. When you mentally label foods as &ldquo;allowed&rdquo; (under your limit) or &ldquo;forbidden&rdquo; (over it), you create a deprivation cycle. Restriction triggers craving. Craving builds pressure. Eventually the pressure breaks — and you eat past your limit. Which triggers guilt. Which triggers more restriction. And the cycle continues.
              </p>
              <p>
                For people with binge eating disorder specifically, calorie apps can actively worsen symptoms by reinforcing the restrict-binge pattern that drives the disorder.
              </p>
              <p>
                The goal of food awareness shouldn&rsquo;t be tighter control. It should be a <strong>calmer, more informed relationship with what you eat</strong>. This is exactly the approach behind <Link href="/calorie-tracking-without-stress">stress-free calorie tracking</Link>.
              </p>
            </ContentSection>

            <SeoCta
              title="Track food without triggering old patterns"
              description="Join Nuvvoo's early access — a calmer way to stay aware of what you eat, without the numbers game."
              buttonText="Get priority access"
            />

            <ContentSection title="A Different Approach: Describing Instead of Logging">
              <p>
                What if instead of entering grams and calories, you just... described your day?
              </p>
              <p>
                <em>&ldquo;Had oatmeal with berries for breakfast, felt good. Grabbed a sandwich at lunch because I was in a rush. Ate a whole bag of chips at 9pm, I think I was stressed.&rdquo;</em>
              </p>
              <p>
                That single paragraph tells you — and an AI — more than any food log. It captures your hunger cues, your emotional state, your patterns over time. It doesn&rsquo;t require perfection. It doesn&rsquo;t punish you for the chips. It just notices: stress eating happens at night. That&rsquo;s information. Useful, non-judgmental information.
              </p>
              <p>
                This is the approach Nuvvoo is built around. Instead of a database, a barcode scanner, and a calorie counter, Nuvvoo is a <Link href="/chat-calorie-tracker">conversation</Link>. You describe what you ate, how you felt, what your energy was like. Over time, it starts to recognize your patterns — not to judge them, but to reflect them back to you.
              </p>
              <p>
                <strong>You stay on track not through restriction, but through awareness.</strong> There&rsquo;s no red warning color when you eat more than &ldquo;planned.&rdquo; There&rsquo;s no streak to break. There&rsquo;s just an ongoing conversation with something that&rsquo;s paying attention to you.
              </p>
            </ContentSection>

            <ContentSection title="What &ldquo;Safe&rdquo; Calorie Tracking Actually Looks Like">
              <p>
                If you&rsquo;re in eating disorder recovery, or you&rsquo;ve noticed that traditional apps make your relationship with food worse, here&rsquo;s what to look for in a healthier alternative:
              </p>
              <ul>
                <li><strong>Flexibility over precision.</strong> An app that works with estimates and descriptions rather than exact gram weights removes the obsessive precision that feeds disordered thinking.</li>
                <li><strong>No punishment signals.</strong> No red colors, no warning alerts, no &ldquo;you only have 200 calories left.&rdquo; These features train your brain to fear food.</li>
                <li><strong>Context awareness.</strong> Did you sleep badly? Are you stressed? Are you on your period? These things affect your hunger and your needs. A good tracking experience should acknowledge that food doesn&rsquo;t exist in a vacuum.</li>
                <li><strong>No streaks or perfection rewards.</strong> Consistency is valuable — but it should be encouraged gently, not gamified in ways that punish imperfection.</li>
                <li><strong>A focus on patterns, not daily performance.</strong> The goal is to understand yourself over weeks and months, not to grade yourself on every individual meal.</li>
              </ul>
              <p>
                Nuvvoo checks all of these boxes. It&rsquo;s built as a <Link href="/ai-food-journal">food journal you talk to</Link>, not a calorie counter that watches you.
              </p>
            </ContentSection>

            <div className="my-12 flex flex-col items-center gap-4 text-center">
              <p className="text-lg font-medium text-slate-900">Available soon on</p>
              <div className="flex gap-3">
                <TrackedButton
                  href="/#waitlist"
                  variant="primary"
                  eventName="click_platform"
                  eventParams={{ platform: 'ios', button_location: 'seo_eating_disorders' }}
                  className="!bg-slate-900 !shadow-none hover:!bg-slate-800 gap-2 min-w-[140px]"
                >
                  <AppleIcon size={18} />
                  iOS
                </TrackedButton>
                <TrackedButton
                  href="/#waitlist"
                  variant="outline"
                  eventName="click_platform"
                  eventParams={{ platform: 'android', button_location: 'seo_eating_disorders' }}
                  className="gap-2 min-w-[140px]"
                >
                  <AndroidIcon size={18} />
                  Android
                </TrackedButton>
              </div>
            </div>

            <ContentSection title="When to Talk to a Professional">
              <p>
                This article is about finding a less harmful approach to food tracking. But it&rsquo;s not a replacement for professional support.
              </p>
              <p>
                If you&rsquo;re currently experiencing an active eating disorder — whether restrictive, binge-based, or purging behaviors — please reach out to a specialist before experimenting with any tracking tool. The <a href="https://www.allianceforeatingdisorders.com/" target="_blank" rel="noopener noreferrer" className="text-nuvvooGreen-700 underline hover:text-nuvvooGreen-900">National Alliance for Eating Disorders</a> has a helpline and can connect you with treatment options.
              </p>
              <p>
                For people in recovery who want to rebuild a healthy relationship with food awareness, a conversational approach can be a gentler on-ramp than traditional calorie logging. But always work with your treatment team to decide what tools, if any, are right for where you are in your journey.
              </p>
            </ContentSection>

            <ContentSection title="The Bottom Line">
              <p>
                Traditional calorie trackers were built for a certain kind of user: motivated, psychologically neutral about food, comfortable with numbers. For a lot of people, they work.
              </p>
              <p>
                But for people with a history of disordered eating, restrictive patterns, or binge-restrict cycles — the standard design is a mismatch at best, and actively harmful at worst. The research backs this up.
              </p>
              <p>
                The alternative isn&rsquo;t to avoid food awareness entirely. It&rsquo;s to pursue that awareness in a way that doesn&rsquo;t trigger the exact patterns you&rsquo;re trying to move away from.
              </p>
              <p>
                Describe your day. Notice your patterns. Talk to something that listens without judging.
              </p>
              <p>
                See how it compares to what you&rsquo;re using now: <Link href="/alternative-to-myfitnesspal">a gentler alternative to MyFitnessPal</Link>.
              </p>
            </ContentSection>

            <FaqSection faqs={faqs} />
          </div>
        </Container>
      </article>
      <Footer />
    </main>
  );
}
