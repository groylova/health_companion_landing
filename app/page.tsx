import Image from 'next/image';
import { Container } from '@/components/container';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { TrackedButton } from '@/components/tracked-button';
import { WaitlistForm } from '@/components/waitlist-form';
import { SectionHeading } from '@/components/section-heading';
import { AppleIcon, AndroidIcon } from '@/components/icons';

export default function HomePage() {
  return (
    <main>
      <Nav />

      {/* HERO */}
      <section className="pt-14 md:pt-20">
        <Container>
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-600 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-nuvvooGreen-500" />
                Early access is open
              </div>

              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
                Track by chatting, not logging
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
                Nuvvoo is a gentle AI companion that helps you stay on track with food, habits, and energy, without pressure or perfection.
              </p>

              <div className="mt-6 flex flex-col items-center gap-3">
                <div className="flex justify-center gap-2 md:gap-3">
                  <TrackedButton
                    variant="ghost"
                    href="/#waitlist"
                    className="text-xs md:text-sm"
                    eventName="click_ios_button"
                    eventParams={{ button_location: 'hero', platform: 'ios' }}
                  >
                    <span className="flex items-center">
                      <AppleIcon className="mr-1 md:mr-2 h-4 w-4" /> iOS - coming soon
                    </span>
                  </TrackedButton>
                  <TrackedButton
                    variant="ghost"
                    href="/#waitlist"
                    className="text-xs md:text-sm"
                    eventName="click_android_button"
                    eventParams={{ button_location: 'hero', platform: 'android' }}
                  >
                    <span className="flex items-center">
                      <AndroidIcon className="mr-1 md:mr-2 h-4 w-4" /> Android - coming soon
                    </span>
                  </TrackedButton>
                </div>
                <TrackedButton
                  variant="primary"
                  href="/#waitlist"
                  eventName="click_early_access"
                  eventParams={{ button_location: 'hero' }}
                >
                  Join early access
                </TrackedButton>
              </div>

              <p className="mt-3 text-center text-sm text-slate-500">Launching soon on iOS and Android.</p>
            </div>

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

      {/* FOUNDER STORY */}
      <section id="founder" className="pt-20 pb-12 md:pt-28 md:pb-16">
        <Container>
          {/* Mobile: Clean layout (matches desktop) */}
          <div className="mx-auto max-w-3xl md:hidden">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-600 shadow-sm">
              Founder story
            </div>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
              Why I built Nuvvoo
            </h2>

            <div className="mt-8 space-y-6">
              <p className="text-base leading-[1.75] text-black/70">
                Hi! I'm Irene. <strong className="font-semibold text-slate-900">A couple of years ago</strong> I started taking medication for migraines. It helped with the pain, but the side effects hit hard: low mood, weight gain, and a feeling of losing control over my routine.
              </p>

              <p className="text-base leading-[1.75] text-black/70">
                I tried many calorie apps. Not because they were bad — but because I couldn't stay <strong className="font-semibold text-slate-900">consistent</strong>. Searching foods, logging portions… I'd abandon it within days. It felt exhausting.
              </p>

              <p className="text-base leading-[1.75] text-black/70">
                One day I told an AI what I'd eaten and asked what I could have for dinner to stay within my calories. It didn't judge. It gently guided me.
              </p>

              <p className="text-base leading-[1.75] text-black/70">
                I repeated that conversation the next day. And the next. Within a month I lost 5 kg — but more importantly, tracking stopped feeling stressful. It became a calm <strong className="font-semibold text-slate-900">daily rhythm</strong>.
              </p>

              <p className="text-base leading-[1.75] text-black/70">
                That's when I decided to build Nuvvoo — a companion that listens first, tracks second, and helps you stay <strong className="font-semibold text-slate-900">balanced</strong> without pressure.
              </p>
            </div>
          </div>

          {/* Desktop: Clean single-column layout */}
          <div className="hidden md:block md:mx-auto md:max-w-[680px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-600 shadow-sm">
              Founder story
            </div>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 lg:text-5xl">
              Why I built Nuvvoo
            </h2>

            <div className="mt-8 space-y-6">
              <p className="text-base leading-[1.75] text-black/70 lg:text-lg">
                <strong className="font-semibold text-slate-900">A couple of years ago</strong> I started taking medication for migraines. It helped with the pain, but the side effects hit hard: low mood, weight gain, and a feeling of losing control over my routine.
              </p>

              <p className="text-base leading-[1.75] text-black/70 lg:text-lg">
                I tried many calorie apps. Not because they were bad — but because I couldn't stay <strong className="font-semibold text-slate-900">consistent</strong>. Searching foods, logging portions… I'd abandon it within days. It felt exhausting.
              </p>

              <p className="text-base leading-[1.75] text-black/70 lg:text-lg">
                One day I told an AI what I'd eaten and asked what I could have for dinner to stay within my calories. It didn't judge. It gently guided me.
              </p>

              <p className="text-base leading-[1.75] text-black/70 lg:text-lg">
                I repeated that conversation the next day. And the next. Within a month I lost 5 kg — but more importantly, tracking stopped feeling stressful. It became a calm <strong className="font-semibold text-slate-900">daily rhythm</strong>.
              </p>

              <p className="text-base leading-[1.75] text-black/70 lg:text-lg">
                That's when I decided to build Nuvvoo — a companion that listens first, tracks second, and helps you stay <strong className="font-semibold text-slate-900">balanced</strong> without pressure.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-12 md:py-16">
        <Container>
          <div className="text-center">
            <SectionHeading
              eyebrow="How it works"
              title="A calm routine, in three steps"
              subtitle="Talk to Nuvvoo like a helper. The app keeps the history and turns it into insights over time."
              center
            />
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <FeatureCard
              step="1"
              title="Tell Nuvvoo what you had"
              desc="Just talk. What you ate. How you feel. Your mood."
              imageSrc="/illustrations/scene-05-salad.png"
              imageAlt="Nuvvoo cheering a healthy meal"
            />
            <FeatureCard
              step="2"
              title="Get gentle guidance"
              desc="Suggestions, balance, and support — not judgment."
              imageSrc="/illustrations/scene-04-dinner-choices.png"
              imageAlt="Asking Nuvvoo for dinner ideas"
            />
            <FeatureCard
              step="3"
              title="See your patterns"
              desc="Nuvvoo remembers your days and shows insights later."
              imageSrc="/illustrations/scene-03-doing-great.png"
              imageAlt="Nuvvoo celebrating your progress"
            />
          </div>
        </Container>
      </section>

      {/* CALM ENDING */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <div className="relative overflow-hidden rounded-[2rem] bg-white/60 p-3 shadow-soft">
                <Image
                  src="/illustrations/scene-07-goodnight.png"
                  alt="Nuvvoo says good night" 
                  width={1200}
                  height={900}
                  className="h-auto w-full rounded-[1.6rem]"
                />
              </div>
            </div>

            <div className="order-1 md:order-2">
              <SectionHeading
                eyebrow="The vibe"
                title="Health can feel calm."
                subtitle="Nuvvoo turns tracking into a quiet daily rhythm — something that supports you instead of stressing you."
              />
              <div className="mt-6 flex flex-col gap-3">
                <MiniBullet>Progress, not grades</MiniBullet>
                <MiniBullet>No shame, no pressure</MiniBullet>
                <MiniBullet>Simple insights when you’re ready</MiniBullet>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* APP SCREENSHOTS */}
      <section id="product" className="py-12 md:py-16">
        <Container>
          <SectionHeading
            eyebrow="Product"
            title="Built to feel human, not mechanical"
            subtitle="A chat-first journal with calm statistics and gentle check-ins."
            center
          />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Shot src="/screens/screen-journal.png" alt="Journal screen" />
            <Shot src="/screens/screen-today-ring.png" alt="Today screen with ring" />
            <Shot src="/screens/screen-stats.png" alt="Statistics screen" />
          </div>
        </Container>
      </section>

      {/* WAITLIST */}
      <section id="waitlist" className="mt-16 md:mt-24">
        <Container>
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/70 p-8 shadow-soft md:p-10">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-nuvvooGreen-100 blur-2xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-nuvvooGreen-50 blur-2xl" />

            <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                  Be among the first to try Nuvvoo.
                </h2>
                <p className="mt-3 text-slate-600">
                  iOS and Android are coming soon. Leave your email and I’ll send you the launch link.
                </p>
                <p className="mt-2 text-sm text-slate-500">No spam. Just the launch.</p>
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

function FeatureCard(props: {
  step: string;
  title: string;
  desc: string;
  imageSrc: string;
  imageAlt: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white/70 p-5 shadow-soft">
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

function Shot({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white/70 p-3 shadow-soft">
      <Image src={src} alt={alt} width={900} height={1200} className="h-auto w-full rounded-[1.4rem]" />
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
