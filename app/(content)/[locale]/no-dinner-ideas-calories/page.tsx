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
  title: 'No Idea What to Eat for Dinner? Meals That Actually Fit Your Calories',
  description: 'Staring at the fridge with no dinner ideas and a calorie goal to hit? Here\'s how to think about it, plus 15 simple meals that actually work.',
  alternates: { canonical: `${siteUrl}/no-dinner-ideas-calories` },
  openGraph: {
    title: 'No Dinner Ideas? How to Find Meals That Actually Fit Your Calories',
    description: '15 easy, filling dinners that fit a moderate calorie goal, plus a simpler way to think about dinner when your brain is blank and you\'re already hungry.',
    url: `${siteUrl}/no-dinner-ideas-calories`,
    images: [{ url: '/illustrations/scene-dinner-ideas.webp', width: 1200, height: 800 }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'No Dinner Ideas That Fit Your Calories? Start Here.',
    description: '15 easy meals + a simpler way to think about dinner when you\'re tired and your brain is blank.',
    images: ['/illustrations/scene-dinner-ideas.webp'],
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function NoDinnerIdeasCalories({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const faqs = [
    {
      question: 'How many calories should dinner be?',
      answer: 'It depends on your total daily goal and what you\'ve already eaten. A common split is roughly 30-35% of your daily calories at dinner. For someone eating 1800 calories a day, that\'s about 500-630 calories, enough for a full, satisfying meal.',
    },
    {
      question: 'What if I go over my calorie goal at dinner?',
      answer: 'One bigger dinner doesn\'t ruin anything. Your body doesn\'t work in strict 24-hour windows. Just notice what happened: were you extra hungry, stressed, or eating on autopilot? That awareness is more useful than guilt. A lighter next day naturally balances things out.',
    },
    {
      question: 'How can I track dinner without weighing everything?',
      answer: 'You don\'t need to weigh anything. Just describe what you ate ("had pasta with tomato sauce and chicken, probably a big portion") and Nuvvoo estimates the rest. Rough tracking is far more sustainable than perfect tracking.',
    },
  ];

  return (
    <main>
      <Nav />
      <article className="py-16 md:py-20">
        <Container>
          <header className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              No Idea What to Eat for Dinner? How to Find Meals That Actually Fit Your&nbsp;Calories
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Staring at the fridge with no dinner ideas and a calorie goal to hit? Here&rsquo;s how to think about it, plus 15 simple meals that actually work.
            </p>
          </header>

          <div className="mx-auto mt-10 max-w-3xl">
            <div className="overflow-hidden rounded-[2rem]">
              <Image src="/illustrations/scene-dinner-ideas.webp" alt="Standing at the fridge with no dinner ideas — Nuvvoo offering to help find a meal that fits your calorie goal" width={1200} height={800} className="h-auto w-full" />
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-3xl space-y-12">
            <ContentSection title="Why Dinner Feels Harder Than the Rest of the Day">
              <p>
                It&rsquo;s 6:30pm. You&rsquo;re standing in front of the fridge. You&rsquo;ve eaten reasonably well today (breakfast, a decent lunch) and now your brain is completely blank. <em>What can I make that&rsquo;ll fit without blowing the whole day?</em>
              </p>
              <p>
                This is one of the most common moments where people abandon calorie awareness altogether. Not because of lack of motivation, but because <strong>decision fatigue at dinner is real</strong>. When you&rsquo;re tired and hungry, &ldquo;figure out the math&rdquo; is the last thing you want to do.
              </p>
              <p>
                Breakfast is usually habitual. Most people eat the same few things on rotation. Lunch has structure around it. But dinner is open-ended. You have options. Which means you have decisions.
              </p>
              <p>
                Add in the fact that your willpower and cognitive energy are lowest in the evening, and it&rsquo;s no surprise that dinner is where most people either over-eat, under-eat, or just give up tracking entirely.
              </p>
              <p>
                The solution isn&rsquo;t more willpower. It&rsquo;s building a small, reliable repertoire of dinners you already know work, so the decision is already made before you get hungry.
              </p>
            </ContentSection>

            <ContentSection title="How to Think About Dinner Calories (Without Overthinking It)">
              <p>
                Instead of calculating from scratch every night, try this framework:
              </p>
              <ul>
                <li><strong>Know your rough dinner budget.</strong> If your daily goal is around 1800 calories, and you&rsquo;ve eaten ~600 at breakfast and ~500 at lunch, you have roughly 500-700 for dinner (leaving room for snacks). That&rsquo;s a solid, filling meal, not a punishment.</li>
                <li><strong>Think in protein first.</strong> Protein is the most satiating macronutrient per calorie. If your dinner is built around a protein source (chicken, fish, eggs, legumes, tofu), you&rsquo;ll feel full without needing to pile on calories.</li>
                <li><strong>Vegetables are almost free.</strong> A huge bowl of roasted broccoli, zucchini, or salad adds volume, fiber, and satisfaction for very few calories. Use them generously.</li>
                <li><strong>Watch the invisible calories.</strong> Oils, sauces, dressings, cheese: these are where dinner can quietly double in calories. A tablespoon of olive oil is 120 calories. That&rsquo;s not bad, but it&rsquo;s worth knowing.</li>
              </ul>
              <p>
                You don&rsquo;t need to track any of this precisely. <Link href="/chat-calorie-tracker">Just describe your dinner to Nuvvoo</Link> and it handles the estimation for you.
              </p>
            </ContentSection>

            <ContentSection title="15 Dinners That Are Easy, Filling, and Calorie-Friendly">
              <p>
                These aren&rsquo;t diet foods. They&rsquo;re just normal, satisfying meals that happen to work well within a moderate calorie range.
              </p>
              <p><strong>~300–400 calories</strong></p>
              <ol>
                <li>Grilled chicken breast + roasted vegetables + a side salad</li>
                <li>Shrimp stir-fry with lots of vegetables over cauliflower rice</li>
                <li>Egg white omelette with spinach, mushrooms, and feta</li>
                <li>Lentil soup (large bowl) with a slice of whole grain bread</li>
                <li>Greek salad with grilled chicken and dressing on the side</li>
              </ol>
              <p><strong>~400–500 calories</strong></p>
              <ol start={6}>
                <li>Baked salmon + steamed broccoli + half cup of rice</li>
                <li>Turkey meatballs with zucchini noodles and tomato sauce</li>
                <li>Bean and vegetable chili (no rice, extra veggies)</li>
                <li>Stuffed bell peppers with ground turkey and quinoa</li>
                <li>Tofu scramble with sweet potato and greens</li>
              </ol>
              <p><strong>~500–600 calories</strong></p>
              <ol start={11}>
                <li>Whole grain pasta with tomato sauce, lean ground beef, and a salad</li>
                <li>Chicken and vegetable soup with a slice of bread</li>
                <li>Buddha bowl: brown rice, roasted vegetables, chickpeas, tahini dressing</li>
                <li>Grilled fish tacos in corn tortillas with cabbage slaw and salsa</li>
                <li>Homemade veggie burger on a whole grain bun with a side salad</li>
              </ol>
            </ContentSection>

            <SeoCta
              title="Not sure what fits your day?"
              description="Describe what you have in the fridge. Nuvvoo suggests what to make and estimates the calories for you."
            />

            <ContentSection title='The "I Have Nothing in the Fridge" Problem'>
              <p>
                The real issue usually isn&rsquo;t calories. It&rsquo;s not knowing what to make with what you have. This is where most people either order something heavy or stand there anxious for 20 minutes.
              </p>
              <p>
                A few things that help:
              </p>
              <ul>
                <li><strong>Keep &ldquo;anchor&rdquo; ingredients stocked.</strong> Eggs, canned chickpeas, frozen vegetables, a protein in the freezer, pasta or rice, canned tomatoes. With these five things you can make a meal in 15 minutes.</li>
                <li><strong>Have 3 go-to &ldquo;emergency&rdquo; dinners memorized.</strong> Not meals you love the most, but meals that are fast, reliable, and you know roughly how they fit your day. Eggs + vegetables, pasta with tomato sauce and protein, and a big salad with whatever&rsquo;s in the fridge.</li>
                <li><strong>Just describe it to Nuvvoo.</strong> &ldquo;I&rsquo;m thinking eggs, some leftover rice, and whatever vegetables I have, what can I make and roughly how many calories is it?&rdquo; That&rsquo;s a real question an <Link href="/ai-food-journal">AI food companion</Link> can answer in seconds.</li>
              </ul>
            </ContentSection>

            <ContentSection title="What to Do When You Already Ate Too Much at Dinner">
              <p>
                First: one dinner doesn&rsquo;t ruin anything. The body doesn&rsquo;t work in 24-hour windows. It&rsquo;s a continuous system. One bigger meal followed by a lighter next day is perfectly normal and healthy.
              </p>
              <p>
                What doesn&rsquo;t help: skipping breakfast to &ldquo;compensate.&rdquo; This usually makes the next dinner worse because you arrive at it starving.
              </p>
              <p>
                What does help: just noticing what happened. <em>I was tired. I ate standing up. I finished what was on the plate even though I wasn&rsquo;t hungry anymore.</em> That information is more useful than guilt, because next time you can change one thing.
              </p>
              <p>
                This is exactly what a <Link href="/calorie-tracking-without-stress">stress-free food journal</Link> should be for: not a record of whether you passed or failed, but a running thread of what you notice about yourself. If traditional tracking apps make this feel punishing, there are <Link href="/calorie-tracker-eating-disorders">gentler alternatives designed for people who need a safer approach</Link>.
              </p>
            </ContentSection>

            <ContentSection title="A Simpler Approach to the Whole Thing">
              <p>
                The goal of tracking food isn&rsquo;t to be perfect at dinner every night. It&rsquo;s to understand your patterns well enough to make small, sustainable adjustments over time.
              </p>
              <p>
                Some nights you&rsquo;ll be exhausted and order pizza. That&rsquo;s fine. Some nights you&rsquo;ll make a beautiful 400-calorie salmon bowl. Also fine. What matters is the overall pattern, and the only way to see the pattern is to keep some kind of record, even an imperfect one.
              </p>
              <p>
                <strong>Nuvvoo is built for exactly this.</strong> Instead of searching food databases and scanning barcodes, you describe your evening: <em>&ldquo;Had pasta for dinner, probably ate too much, was stressed after work.&rdquo;</em> That&rsquo;s it. Nuvvoo handles the calorie estimation in the background and tracks the pattern so you don&rsquo;t have to. It&rsquo;s a <Link href="/alternative-to-myfitnesspal">simpler alternative to apps like MyFitnessPal</Link>, built for real life, not perfect tracking. Read more about <Link href="/how-to-stay-consistent-calorie-tracking">how to build a food tracking habit that actually sticks</Link>.
              </p>
            </ContentSection>

            <div className="my-12 flex flex-col items-center gap-4 text-center">
              <AppStoreBadge buttonLocation="seo_dinner_ideas" />
            </div>

            <FaqSection faqs={faqs} />
          </div>
        </Container>
      </article>
      <Footer />
    </main>
  );
}
