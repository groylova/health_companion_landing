import Image from 'next/image';
import { Container } from '@/components/container';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { TrackedButton } from '@/components/tracked-button';
import { WaitlistForm } from '@/components/waitlist-form';
import { SectionHeading } from '@/components/section-heading';

export default function HomePage() {
  return (
    <main>
      <Nav />

      {/* ─── HERO ─── */}
      <section className="pt-16 md:pt-24">
        <Container>
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-nuvvooGreen-200 bg-nuvvooGreen-50/60 px-4 py-1.5 text-sm font-medium text-nuvvooGreen-800">
                <span className="h-2 w-2 rounded-full bg-nuvvooGreen-500" />
                Early access is open
              </div>

              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
                Stop restarting your health every&nbsp;Monday
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
                A gentle AI-chat companion that helps you stay on track with food, habits, and energy — without pressure.
              </p>

              <div className="mt-8 flex flex-col items-start gap-3">
                <TrackedButton
                  variant="primary"
                  href="/#waitlist"
                  eventName="click_early_access"
                  eventParams={{ button_location: 'hero' }}
                >
                  Get priority access
                </TrackedButton>
                <p className="text-sm text-slate-500">
                  Track food, habits and symptoms by chatting with Nuvvoo.
                  Missed a day? Just come back.
                </p>
              </div>
            </div>

            {/* Handshake illustration — the first impression is warmth */}
            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-nuvvooGreen-100 via-white to-nuvvooGreen-50 blur-2xl" />
              <div className="overflow-hidden rounded-[2rem] bg-white/60 p-3 shadow-soft">
                <Image
                  src="/illustrations/scene-01-handshake.png"
                  alt="Irene meeting Nuvvoo the blob"
                  width={1200}
                  height={900}
                  priority
                  className="h-auto w-full rounded-[1.6rem]"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── CHAT EXAMPLE ─── */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-lg">
            <p className="mb-6 mt-4 text-center text-base font-medium text-slate-600 md:text-lg">
              One button. That&rsquo;s it. Tap once, speak naturally. Nuvvoo logs it and guides&nbsp;you.
            </p>
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/80 p-5 shadow-soft md:p-6">
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-br-md bg-nuvvooGreen-100 px-4 py-3 text-sm text-slate-800">
                    I had an omelette for breakfast and a turkey sandwich for lunch.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-7 w-7 shrink-0 overflow-hidden rounded-full">
                    <Image src="/illustrations/logo.png" alt="Nuvvoo" width={28} height={28} className="h-full w-full object-contain" />
                  </div>
                  <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 text-sm text-slate-700">
                    <p>Logged. You&rsquo;re still within your calorie range.</p>
                    <p className="mt-2">Want a dinner suggestion to balance your day?</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-br-md bg-nuvvooGreen-100 px-4 py-3 text-sm text-slate-800">
                    Yes! Also log my boxing workout. And btw &mdash; I&rsquo;m in a great mood today.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-7 w-7 shrink-0 overflow-hidden rounded-full">
                    <Image src="/illustrations/logo.png" alt="Nuvvoo" width={28} height={28} className="h-full w-full object-contain" />
                  </div>
                  <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 text-sm text-slate-700">
                    <p>Boxing logged. Mood: great. I&rsquo;m so proud of you!</p>
                    <p className="mt-2">Here&rsquo;s what you could have for dinner&hellip;</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── FOUNDER STORY (rollout) ─── */}
      <section id="founder" className="py-10 md:py-14">
        <Container>
          <div className="mx-auto max-w-[680px]">
            <details className="group">
              <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <SectionHeading
                  eyebrow="Founder story"
                  title="Why I'm building Nuvvoo"
                />
                <p className="mt-4 text-base leading-[1.75] text-slate-600 md:text-lg">
                  Hi! I&rsquo;m Irene. <strong className="font-semibold text-slate-900">A couple of years ago</strong> I started taking medication for migraines. It helped with the pain, but the side effects hit hard: low mood, weight gain, and a feeling of losing control over my routine.
                </p>
                <span className="mt-4 inline-block text-sm font-medium text-nuvvooGreen-700 group-open:hidden">
                  Read more &darr;
                </span>
              </summary>

              <div className="mt-6 space-y-6">
                <p className="text-base leading-[1.75] text-slate-600 md:text-lg">
                  I tried many calorie apps. Not because they were bad — but because I couldn&rsquo;t stay <strong className="font-semibold text-slate-900">consistent</strong>. Searching foods, logging portions... I&rsquo;d abandon it within days. It felt exhausting.
                </p>
                <p className="text-base leading-[1.75] text-slate-600 md:text-lg">
                  One day I told an AI what I&rsquo;d eaten and asked what I could have for dinner to stay within my calories. It didn&rsquo;t judge. It gently guided me.
                </p>
                <p className="text-base leading-[1.75] text-slate-600 md:text-lg">
                  I repeated that conversation the next day. And the next. Within a month, tracking stopped feeling stressful. It became a calm <strong className="font-semibold text-slate-900">daily rhythm</strong>.
                </p>
                <p className="text-base leading-[1.75] text-slate-600 md:text-lg">
                  That&rsquo;s when I decided to build Nuvvoo — a companion that listens first, tracks second, and helps you stay <strong className="font-semibold text-slate-900">balanced</strong> without pressure.
                </p>
              </div>
            </details>
          </div>
        </Container>
      </section>

      {/* ─── THE RESTART LOOP ─── */}
      <section className="py-12 md:py-16">
        <Container>
          <SectionHeading
            eyebrow="The real problem"
            title="The Restart Loop"
            center
          />

          <div className="mt-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-white/70 p-8 shadow-soft md:p-12">
            <div className="grid items-start gap-12 md:grid-cols-2">
              <div>
                <div className="space-y-3.5">
                  <FamiliarBullet>You track perfectly for two weeks</FamiliarBullet>
                  <FamiliarBullet>Then you miss one day</FamiliarBullet>
                  <FamiliarBullet>And suddenly it feels like you failed</FamiliarBullet>
                  <FamiliarBullet>And start again next Monday</FamiliarBullet>
                </div>

                <div className="mt-8 space-y-2">
                  <p className="text-base text-slate-600 md:text-lg">
                    This loop is exhausting. Most health apps require perfection.
                  </p>
                  <p className="text-base font-medium text-nuvvooGreen-700 md:text-lg">
                    Nuvvoo is built to break it.
                  </p>
                  <p className="text-base font-medium text-slate-800 md:text-lg">
                    No punishment. Just a return.
                  </p>
                </div>
              </div>

              {/* Loop diagram — vertical with blob icons */}
              <div className="flex justify-center">
                <div className="relative flex flex-col items-center gap-0">
                  <div className="absolute left-1/2 top-6 bottom-12 -z-10 w-px -translate-x-1/2 bg-gradient-to-b from-slate-200 via-slate-200 to-nuvvooGreen-200" />

                  <LoopStep text="Track perfectly" icon="/illustrations/loop-track.png" />
                  <LoopArrow />
                  <LoopStep text="Miss one day" icon="/illustrations/loop-miss.png" />
                  <LoopArrow />
                  <LoopStep text="Feel guilty" icon="/illustrations/loop-guilty.png" />
                  <LoopArrow />
                  <LoopStep text="Stop logging" icon="/illustrations/loop-stop.png" />
                  <LoopArrow />
                  <LoopStep text="Restart Monday" icon="/illustrations/loop-restart.png" highlight />
                  <LoopReturn />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── EVENING RESCUE ─── */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/70 p-8 shadow-soft md:p-10">
              <div className="grid items-center gap-8 md:grid-cols-[1fr,auto]">
                <div>
                  <SectionHeading
                    eyebrow="Evening rescue"
                    title="Even if the day went wrong, you can still win the evening."
                  />
                  <div className="mt-8 space-y-4 text-base leading-relaxed text-slate-600">
                    <p>Most apps punish imperfect days. Nuvvoo helps you recover.</p>
                    <p>
                      If your day went off track, the AI suggests a dinner that balances your calories and macros.
                    </p>
                    <p className="font-medium text-slate-900">
                      Small recovery beats perfect plans.
                    </p>
                  </div>
                </div>
                <div className="mx-auto w-64 overflow-hidden rounded-[1.5rem] md:w-72">
                  <Image
                    src="/illustrations/evening-rescue.png"
                    alt="Nuvvoo suggesting a balanced dinner after an off-track day"
                    width={900}
                    height={430}
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── APP SCREENSHOTS ─── */}
      <section id="product" className="py-12 md:py-16">
        <Container>
          <SectionHeading
            eyebrow="Product"
            title="No logging. No guilt. Just a calm chat."
            subtitle="Track food and habits by chatting with AI — not logging everything."
            center
          />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Shot src="/screens/screen-journal.png" alt="Journal screen" />
            <Shot src="/screens/screen-today-ring.png" alt="Today screen with ring" />
            <Shot src="/screens/screen-stats.png" alt="Statistics screen" />
          </div>
        </Container>
      </section>

      {/* ─── PHILOSOPHY ─── */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading
              eyebrow="Our philosophy"
              title="Health without perfection"
              center
            />

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white/60 p-6 text-left shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Most health apps say</p>
                <div className="mt-4 space-y-3 text-base text-slate-600">
                  <p>Be disciplined.</p>
                  <p>Log everything.</p>
                  <p>Never miss a day.</p>
                </div>
              </div>

              <div className="rounded-2xl border border-nuvvooGreen-200 bg-nuvvooGreen-50/40 p-6 text-left shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-nuvvooGreen-600">Nuvvoo says</p>
                <div className="mt-4 space-y-3 text-base text-slate-800">
                  <p>Miss a day.</p>
                  <p>Come back tomorrow.</p>
                  <p className="font-semibold">No restart required.</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── HOW IT WORKS (illustrated cards — warm, not clinical) ─── */}
      <section id="how" className="py-16 md:py-20">
        <Container>
          <div className="text-center">
            <SectionHeading
              eyebrow="How it works"
              title="A calm routine, in four steps"
              subtitle="No searching. No weighing. No guilt. Just talk."
              center
            />
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <FeatureCard
              step="1"
              title="Tell Nuvvoo what you had"
              desc="Just talk. What you ate. Workouts. Supplements. Your mood."
              imageSrc="/illustrations/scene-05-salad.png"
              imageAlt="Nuvvoo cheering a healthy meal"
            />
            <FeatureCard
              step="2"
              title="AI logs it automatically"
              desc="Calories and macros calculated. All your health notes saved."
              imageSrc="/illustrations/scene-03-doing-great.png"
              imageAlt="Nuvvoo celebrating your progress"
            />
            <FeatureCard
              step="3"
              title="Get gentle suggestions"
              desc="Dinner ideas, daily balance, and support — not judgment."
              imageSrc="/illustrations/scene-04-dinner-choices.png"
              imageAlt="Nuvvoo suggesting dinner ideas"
            />
            <FeatureCard
              step="4"
              title="Stay consistent, not perfect"
              desc="While you rest, Nuvvoo finds patterns and helps you feel calmer every day."
              imageSrc="/illustrations/scene-07-goodnight.png"
              imageAlt="Nuvvoo says good night"
              highlight
            />
          </div>
        </Container>
      </section>

      {/* ─── SOCIAL PROOF ─── */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-lg font-medium text-slate-900">
              Get priority access
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <QuoteCard name="Mary, photographer" quote="I track perfectly for 10 days and then disappear." />
              <QuoteCard name="Stacy, stylist" quote="I hate logging food but I want to stay consistent." />
              <QuoteCard name="Sarah, busy mom" quote="I just want something that doesn't punish me." />
            </div>
          </div>
        </Container>
      </section>

      {/* ─── WAITLIST ─── */}
      <section id="waitlist" className="mt-16 md:mt-24">
        <Container>
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/70 p-8 shadow-soft md:p-10">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-nuvvooGreen-100 blur-2xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-nuvvooGreen-50 blur-2xl" />

            <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                  Consistency without perfection.
                </h2>
                <p className="mt-3 text-slate-600">
                  Be the first to try Nuvvoo. Leave your email and we'll send you the launch&nbsp;link.
                </p>
                <p className="mt-2 text-sm text-slate-500">Just the launch link + a bonus for first users.</p>
              </div>

              <div>
                <WaitlistForm />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  );
}

/* ─── LOCAL COMPONENTS ─── */

function LoopStep({ text, icon, highlight }: { text: string; icon: string; highlight?: boolean }) {
  return (
    <div
      className={
        'flex items-center gap-2 rounded-full py-1.5 pl-2 pr-6 text-sm font-medium shadow-sm md:text-base ' +
        (highlight
          ? 'border-2 border-nuvvooGreen-300 bg-nuvvooGreen-50 text-nuvvooGreen-800'
          : 'border border-slate-200 bg-white text-slate-700')
      }
    >
      <Image src={icon} alt={text} width={48} height={48} className="h-10 w-10 shrink-0 object-contain md:h-12 md:w-12" />
      {text}
    </div>
  );
}

function LoopArrow() {
  return (
    <div className="flex h-6 items-center justify-center text-slate-300">
      <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
        <path d="M6 0v16M6 16l-4-4M6 16l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function LoopReturn() {
  return (
    <div className="relative mt-1 flex justify-center">
      <svg width="80" height="48" viewBox="0 0 80 48" fill="none" className="text-nuvvooGreen-400">
        <path
          d="M40 4 C60 4, 68 16, 68 24 C68 32, 60 44, 40 44 C20 44, 12 32, 12 24 C12 16, 20 4, 40 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="4 3"
          fill="none"
        />
        <path d="M36 8l4-5 4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function FamiliarBullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
      <span className="text-base text-slate-600 md:text-lg">{children}</span>
    </div>
  );
}

function MiniBullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-2 w-2 rounded-full bg-nuvvooGreen-500" />
      <span className="text-slate-700">{children}</span>
    </div>
  );
}

function FeatureCard(props: {
  step: string;
  title: string;
  desc: string;
  imageSrc: string;
  imageAlt: string;
  highlight?: boolean;
}) {
  return (
    <div className={'group relative overflow-hidden rounded-[1.5rem] p-5 shadow-soft ' + (props.highlight ? 'border-2 border-nuvvooGreen-300 bg-nuvvooGreen-50/30' : 'border border-slate-200 bg-white/70')}>
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-nuvvooGreen-100 text-nuvvooGreen-800">
          {props.step}
        </span>
        <span>Step</span>
      </div>
      <h3 className="mt-3 text-lg font-semibold text-slate-900">{props.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">{props.desc}</p>
      <div className="mt-4 overflow-hidden rounded-[1.2rem] border border-slate-200 bg-white">
        <Image src={props.imageSrc} alt={props.imageAlt} width={1200} height={900} className="h-auto w-full" />
      </div>
    </div>
  );
}

function QuoteCard({ name, quote }: { name: string; quote: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm">
      <p className="text-sm italic leading-relaxed text-slate-600">"{quote}"</p>
      <p className="mt-3 text-xs font-medium text-slate-400">— {name}</p>
    </div>
  );
}

function Shot({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white/70 p-3 shadow-soft">
      <Image src={src} alt={alt} width={900} height={1200} className="h-auto w-full rounded-[1.4rem]" />
    </div>
  );
}
