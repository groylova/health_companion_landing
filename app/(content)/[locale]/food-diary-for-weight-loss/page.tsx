import type { Metadata } from 'next';
import { Container } from '@/components/container';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { ContentSection } from '@/components/seo/content-section';
import { FaqSection } from '@/components/seo/faq-section';
import { RelatedGuides } from '@/components/seo/related-guides';
import { SeoCta } from '@/components/seo/seo-cta';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { AppStoreBadge } from '@/components/app-store-badge';

type Props = { params: Promise<{ locale: string }> };

// Locales with a real translation of this article. Others fall back to EN
// content and keep the parent layout's noindex until translated.
const TRANSLATED_LOCALES = new Set(['en', 'fr', 'de', 'es', 'ru']);

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const en = {
    title: 'Food Diary for Weight Loss: The Method That Doubles Results (2026)',
    description:
      "Research shows food diaries double weight loss — but most people quit because tracking is tedious. Nuvvoo makes it easy: just text what you ate. No databases, no weighing, no guilt.",
    ogTitle: 'Food Diary for Weight Loss: The Method That Doubles Results',
    ogDescription:
      "Research shows food diaries double weight loss — but most people quit because tracking is tedious. Nuvvoo makes it easy: just text what you ate.",
    twitterTitle: 'Food Diary for Weight Loss: The Method That Doubles Results',
    twitterDescription:
      "Food diaries double weight loss, but most people quit. Here's how to keep one without the tedium.",
  };
  const fr = {
    title:
      "Le journal alimentaire pour maigrir : la méthode qui double les résultats (2026)",
    description:
      "Les études montrent que les journaux alimentaires doublent la perte de poids — mais la plupart des gens abandonnent parce que le suivi est fastidieux. Avec Nuvvoo, c'est simple : il suffit d'écrire ce que tu as mangé. Pas de bases de données, pas de pesée, pas de culpabilité.",
    ogTitle:
      "Le journal alimentaire pour maigrir : la méthode qui double les résultats",
    ogDescription:
      "Les études montrent que les journaux alimentaires doublent la perte de poids — mais la plupart des gens abandonnent parce que le suivi est fastidieux. Avec Nuvvoo, c'est simple : il suffit d'écrire ce que tu as mangé.",
    twitterTitle:
      "Le journal alimentaire pour maigrir : la méthode qui double les résultats",
    twitterDescription:
      "Les journaux alimentaires doublent la perte de poids, mais la plupart des gens abandonnent. Voici comment en tenir un sans la corvée.",
  };
  const de = {
    title:
      'Ernährungstagebuch zur Gewichtsabnahme: Die Methode, die die Ergebnisse verdoppelt (2026)',
    description:
      'Studien zeigen, dass Ernährungstagebücher die Gewichtsabnahme verdoppeln – aber die meisten geben auf, weil das Tracken mühsam ist. Mit Nuvvoo wird es einfach: schreib einfach, was du gegessen hast. Keine Datenbanken, kein Wiegen, keine Schuldgefühle.',
    ogTitle:
      'Ernährungstagebuch zur Gewichtsabnahme: Die Methode, die die Ergebnisse verdoppelt',
    ogDescription:
      'Studien zeigen, dass Ernährungstagebücher die Gewichtsabnahme verdoppeln – aber die meisten geben auf, weil das Tracken mühsam ist. Mit Nuvvoo wird es einfach: schreib einfach, was du gegessen hast.',
    twitterTitle:
      'Ernährungstagebuch zur Gewichtsabnahme: Die Methode, die die Ergebnisse verdoppelt',
    twitterDescription:
      'Ernährungstagebücher verdoppeln den Gewichtsverlust, doch die meisten geben auf. So führst du eines, ohne die Plackerei.',
  };
  const es = {
    title:
      'Diario alimenticio para bajar de peso: el método que duplica los resultados (2026)',
    description:
      'Las investigaciones demuestran que los diarios alimenticios duplican la pérdida de peso, pero la mayoría de la gente lo deja porque llevar un registro es tedioso. Nuvvoo lo hace fácil: solo envía un mensaje de texto con lo que comiste. Sin bases de datos, sin pesajes, sin culpa.',
    ogTitle:
      'Diario alimenticio para bajar de peso: el método que duplica los resultados',
    ogDescription:
      'Las investigaciones demuestran que los diarios alimenticios duplican la pérdida de peso, pero la mayoría de la gente lo deja porque llevar un registro es tedioso. Nuvvoo lo hace fácil: solo envía un mensaje con lo que comiste.',
    twitterTitle:
      'Diario alimenticio para bajar de peso: el método que duplica los resultados',
    twitterDescription:
      'Los diarios alimenticios duplican la pérdida de peso, pero la mayoría de la gente lo deja. Así puedes llevar uno sin la tediosa rutina.',
  };
  const ru = {
    title:
      'Пищевой дневник для похудения: метод, который удваивает результаты (2026)',
    description:
      'Исследования показывают, что ведение пищевого дневника удваивает эффективность похудения, но большинство людей бросают это занятие, потому что отслеживание еды — утомительный процесс. Nuvvoo упрощает задачу: просто напиши в чате, что ты съел. Никаких баз данных, никаких взвешиваний, никаких угрызений совести.',
    ogTitle:
      'Пищевой дневник для похудения: метод, который удваивает результаты',
    ogDescription:
      'Исследования показывают, что ведение пищевого дневника удваивает эффективность похудения, но большинство людей бросают это занятие, потому что отслеживание еды — утомительный процесс. Nuvvoo упрощает задачу: просто напиши, что ты съел.',
    twitterTitle:
      'Пищевой дневник для похудения: метод, который удваивает результаты',
    twitterDescription:
      'Пищевые дневники удваивают потерю веса, но большинство бросает. Вот как вести его без рутины.',
  };

  const copy = locale === 'fr' ? fr : locale === 'de' ? de : locale === 'es' ? es : locale === 'ru' ? ru : en;
  const isTranslated = TRANSLATED_LOCALES.has(locale);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nuvvoo.app';
  const slug = 'food-diary-for-weight-loss';
  const canonical =
    locale === routing.defaultLocale
      ? `${siteUrl}/${slug}`
      : `${siteUrl}/${locale}/${slug}`;

  // hreflang only spans locales we actually translated. Other locales render
  // EN with noindex from the layout default and shouldn't claim to be a
  // translation alternate.
  const languages: Record<string, string> = {
    'x-default': `${siteUrl}/${slug}`,
  };
  for (const loc of TRANSLATED_LOCALES) {
    languages[loc] =
      loc === routing.defaultLocale
        ? `${siteUrl}/${slug}`
        : `${siteUrl}/${loc}/${slug}`;
  }

  const base: Metadata = {
    title: copy.title,
    description: copy.description,
    openGraph: {
      title: copy.ogTitle,
      description: copy.ogDescription,
      type: 'article',
      url: canonical,
      images: [{ url: '/illustrations/scene-food-diary.webp', width: 1200, height: 800 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.twitterTitle,
      description: copy.twitterDescription,
      images: ['/illustrations/scene-food-diary.webp'],
    },
    alternates: {
      canonical,
      languages,
    },
  };

  if (isTranslated) {
    base.robots = { index: true, follow: true };
  }
  return base;
}

export default async function FoodDiaryForWeightLoss({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isFrench = locale === 'fr';
  const isGerman = locale === 'de';
  const isSpanish = locale === 'es';
  const isRussian = locale === 'ru';

  const h1 = isFrench
    ? 'Le journal alimentaire pour maigrir : la méthode qui double les résultats'
    : isGerman
      ? 'Ernährungstagebuch zur Gewichtsabnahme: Die Methode, die die Ergebnisse verdoppelt'
      : isSpanish
        ? 'Diario de alimentación para bajar de peso: el método que duplica los resultados'
        : isRussian
          ? 'Пищевой дневник для похудения: метод, который удваивает результаты'
          : 'Food Diary for Weight Loss: The Method That Doubles Results';

  const subtitle = isFrench
    ? "Tenir un journal alimentaire est l'une des stratégies de perte de poids les plus efficaces, comme le prouvent les études. Les personnes qui notent ce qu'elles mangent perdent systématiquement deux fois plus de poids que celles qui ne le font pas. Mais il y a un hic : la plupart des gens abandonnent au bout de quelques semaines, car la méthode traditionnelle est lente, fastidieuse et source de culpabilité. Et si le problème venait du journal lui-même, et non de la personne ?"
    : isGerman
      ? 'Das Führen eines Ernährungstagebuchs ist eine der wirksamsten Strategien zur Gewichtsabnahme, die durch wissenschaftliche Studien belegt ist. Menschen, die konsequent aufzeichnen, was sie essen, nehmen doppelt so viel ab wie diejenigen, die das nicht tun. Aber es gibt einen Haken – die meisten geben innerhalb weniger Wochen auf, weil das herkömmliche Aufzeichnen von Mahlzeiten langsam, mühsam und schuldbewusst macht. Was wäre, wenn das Tagebuch selbst das Problem wäre, nicht die Person?'
      : isSpanish
        ? 'Llevar un diario de alimentación es una de las estrategias más efectivas para bajar de peso, respaldada por investigaciones. Las personas que registran lo que comen de manera constante pierden el doble de peso que aquellas que no lo hacen. Pero hay un problema: la mayoría de la gente lo deja a las pocas semanas porque el registro tradicional de alimentos es lento, tedioso y genera culpa. ¿Y si el problema fuera el diario en sí, y no la persona?'
        : isRussian
          ? 'Ведение пищевого дневника — одна из самых эффективных стратегий похудения, подтверждённая исследованиями. Люди, которые отслеживают, что они едят, в среднем теряют в два раза больше веса, чем те, кто этого не делает. Но есть одна загвоздка — большинство бросает это дело через несколько недель, потому что традиционное ведение дневника — это медленный, утомительный процесс, вызывающий чувство вины. А что, если проблема не в человеке, а в самом дневнике?'
          : 'Keeping a food diary is one of the most effective weight loss strategies backed by research. People who track what they eat consistently lose twice as much weight as those who don’t. But there’s a catch — most people quit within weeks because traditional food logging is slow, tedious, and guilt-inducing. What if the diary itself was the problem, not the person?';

  const imageAlt = isFrench
    ? 'Le personnage de Nuvvoo écrit dans un journal alimentaire ouvert, entouré de bulles de chat avec des repas et des boissons — une approche calme et conviviale du suivi alimentaire pour la perte de poids'
    : isGerman
      ? 'Die Nuvvoo-Figur schreibt in ein offenes Ernährungstagebuch, umgeben von Chat-Blasen mit Mahlzeiten und Getränken – eine ruhige, freundliche Sicht auf das Tracken zur Gewichtsabnahme'
      : isSpanish
        ? 'El personaje de Nuvvoo escribiendo en un diario de alimentación abierto, rodeado de burbujas de chat con comidas y bebidas — una mirada tranquila y amigable al registro de comidas para bajar de peso'
        : isRussian
          ? 'Персонаж Nuvvoo пишет в открытом пищевом дневнике, вокруг — чат-облака с блюдами и напитками — спокойный, дружелюбный взгляд на дневник питания для похудения'
          : 'Nuvvoo character writing in an open food diary, surrounded by chat bubbles of meals and drinks — a calm, friendly take on food tracking for weight loss';

  const faqs = isFrench ? faqsFr : isGerman ? faqsDe : isSpanish ? faqsEs : isRussian ? faqsRu : faqsEn;

  return (
    <main>
      <Nav />
      <article className="py-16 md:py-20">
        <Container>
          <header className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              {h1}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              {subtitle}
            </p>
          </header>

          <div className="mx-auto mt-10 max-w-3xl">
            <div className="overflow-hidden rounded-[2rem]">
              <Image
                src="/illustrations/scene-food-diary.webp"
                alt={imageAlt}
                width={1200}
                height={800}
                className="h-auto w-full"
              />
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-3xl space-y-12">
            {isFrench ? (
              <FrenchBody />
            ) : isGerman ? (
              <GermanBody />
            ) : isSpanish ? (
              <SpanishBody />
            ) : isRussian ? (
              <RussianBody />
            ) : (
              <EnglishBody />
            )}

            <div className="my-12 flex flex-col items-center gap-4 text-center">
              <AppStoreBadge buttonLocation="seo_food_diary" />
            </div>

            <FaqSection faqs={faqs} />

            <RelatedGuides slugs={['calculator', 'stressFree', 'stayConsistent', 'chatTracker']} />
          </div>
        </Container>
      </article>
      <Footer />
    </main>
  );
}

/* ─── ENGLISH BODY ─── */

function EnglishBody() {
  return (
    <>
      <ContentSection title="The Science: Why Food Diaries Work">
        <p>
          The evidence is clear and consistent across decades of research.
        </p>
        <p>
          <strong>Tracking doubles weight loss.</strong> A landmark study by Kaiser Permanente found that people who kept daily food records lost twice as much weight as those who didn&rsquo;t track. This isn&rsquo;t a marginal improvement — it&rsquo;s a 2x difference.
        </p>
        <p>
          <strong>Consistency is what matters.</strong> Research published in the Journal of the Academy of Nutrition and Dietetics showed that participants who tracked more than 66% of days lost nearly 10 pounds. The more consistently someone records, the more weight they lose. Frequency of tracking matters more than perfection.
        </p>
        <p>
          <strong>Awareness changes behavior automatically.</strong> Studies show that when you anticipate writing down your meals, you&rsquo;re more likely to choose nutrient-dense foods and stay on track. The act of recording itself creates a feedback loop — you notice patterns, catch mindless eating, and make better choices without willpower.
        </p>
        <p>
          <strong>Calorie consistency predicts success.</strong> A 2026 study found that for every 100-calorie increase in daily fluctuation, weight loss decreased by about 0.6%. Food diaries help smooth out these fluctuations by making daily intake visible.
        </p>
        <p>
          The science isn&rsquo;t controversial. Food diaries work. The question is: why do most people stop using them?
        </p>
      </ContentSection>

      <ContentSection title="The Problem: Why People Quit">
        <p>
          If food diaries are so effective, why does nearly everyone stop? Research from Carnegie Mellon University identified the core barriers by surveying 141 current and lapsed food journalers and analyzing thousands of community forum posts.
        </p>
        <p>
          <strong>It&rsquo;s slow and tedious.</strong> Users describe food journaling as &ldquo;such a slow and tedious process.&rdquo; Searching databases, selecting portions, entering every ingredient for homemade meals — this takes 3&ndash;7 minutes per meal, three or more times a day. That&rsquo;s up to 20 minutes of daily data entry.
        </p>
        <p>
          <strong>Databases are frustrating.</strong> Search results are often incorrect or overwhelming. Too many options for the same food, irrelevant entries, and missing items for homemade or regional dishes. The tool designed to help becomes a source of friction.
        </p>
        <p>
          <strong>Guilt and shame compound.</strong> Four common emotional obstacles to keeping a food diary: embarrassment about what you ate, feeling bad when you &ldquo;slip up,&rdquo; a sense that it won&rsquo;t help anyway, and finding it too inconvenient. Traditional trackers amplify these feelings with streak counters, red warnings, and deficit alerts.
        </p>
        <p>
          <strong>The method, not the person, fails.</strong> Most people who quit food diaries don&rsquo;t lack discipline. They&rsquo;re using tools that make a simple concept — write down what you eat — into a complex, time-consuming process. The 2x weight loss benefit disappears when you stop tracking after two weeks.
        </p>
        <p>
          This is the core tension: <strong>food diaries work, but traditional food diary tools don&rsquo;t work for most people</strong>. If you&rsquo;ve quit <Link href="/alternative-to-myfitnesspal">MyFitnessPal</Link> or <Link href="/alternative-to-lose-it">Lose It</Link> after a few weeks, you&rsquo;re not the exception — you&rsquo;re the norm.
        </p>
      </ContentSection>

      <ContentSection title="A Different Kind of Food Diary">
        <p>
          What if you could get the benefits of food tracking — the awareness, the consistency, the 2x weight loss — without the tedious data entry?
        </p>
        <p>
          That&rsquo;s the idea behind Nuvvoo. Instead of searching databases and selecting portions, you <Link href="/chat-calorie-tracker">describe your meals the way you&rsquo;d text a friend</Link>:
        </p>
        <ul>
          <li>&ldquo;Had oatmeal with banana and coffee for breakfast&rdquo;</li>
          <li>&ldquo;Grabbed a chicken wrap and fries for lunch&rdquo;</li>
          <li>&ldquo;Made pasta with pesto and salad for dinner&rdquo;</li>
        </ul>
        <p>
          The AI handles the estimation. Calories and macros appear in seconds. No database navigation, no portion size dropdowns, no barcode scanning required.
        </p>
        <p>
          <strong>Why this approach changes the equation:</strong>
        </p>
        <p>
          <strong>30 seconds instead of 5 minutes.</strong> When logging takes less than a minute, it stops feeling like a chore. The barrier to consistency drops dramatically.
        </p>
        <p>
          <strong>Estimates are encouraged.</strong> You don&rsquo;t need to weigh your chicken to the gram. &ldquo;A big plate of rice with chicken&rdquo; is enough. Research shows that the awareness benefit of tracking doesn&rsquo;t require laboratory precision — it requires consistency. And you&rsquo;re more consistent when the tool doesn&rsquo;t punish approximation.
        </p>
        <p>
          <strong>No guilt on missed days.</strong> Nuvvoo doesn&rsquo;t use streaks, red warnings, or shame-based notifications. Missed a day? Come back tomorrow. Your progress isn&rsquo;t reset. This matters because guilt is one of the top reasons people abandon food diaries entirely — see how <Link href="/calorie-tracking-without-stress">stress-free tracking</Link> changes outcomes.
        </p>
        <p>
          <strong>Beyond just food.</strong> Nuvvoo tracks sleep, exercise, mood, and water in the same conversational format. This gives you a fuller picture — closer to an <Link href="/ai-food-journal">AI food journal</Link> than a database app — where you start seeing connections between how you slept, what you ate, and how you feel.
        </p>
        <p>
          <strong>Works in 5 languages.</strong> Track in English, German, Russian, Spanish, or French. Describe your meals in your own language, with local food names — no need to translate &ldquo;борщ&rdquo; or &ldquo;Schnitzel&rdquo; into English database entries.
        </p>
      </ContentSection>

      <ContentSection title="Traditional Food Diary vs. Chat-Based Food Diary">
        <div className="prose-nuvvoo">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Traditional diary apps</th>
                <th>Nuvvoo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>How you log</td>
                <td>Search database → select item → choose portion</td>
                <td>Describe in your own words</td>
              </tr>
              <tr>
                <td>Time per meal</td>
                <td>3&ndash;7 minutes</td>
                <td>30&ndash;60 seconds</td>
              </tr>
              <tr>
                <td>Home-cooked meals</td>
                <td>Build custom recipe (tedious)</td>
                <td>&ldquo;Chicken stir-fry with rice&rdquo;</td>
              </tr>
              <tr>
                <td>Regional/local food</td>
                <td>Often missing from database</td>
                <td>Describe it — AI understands</td>
              </tr>
              <tr>
                <td>Missed days</td>
                <td>Streak broken, guilt notifications</td>
                <td>&ldquo;Come back when you&rsquo;re ready&rdquo;</td>
              </tr>
              <tr>
                <td>Learning curve</td>
                <td>Moderate (navigate database, understand portions)</td>
                <td>None (just type)</td>
              </tr>
              <tr>
                <td>Emotional tone</td>
                <td>Achievement-based, streak-driven</td>
                <td>Calm, no pressure</td>
              </tr>
              <tr>
                <td>What you track</td>
                <td>Food only (most apps)</td>
                <td>Food, sleep, exercise, mood, water</td>
              </tr>
              <tr>
                <td>Languages</td>
                <td>Usually English only</td>
                <td>5 languages</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ContentSection>

      <ContentSection title="Who Is a Chat-Based Food Diary For?">
        <p>
          <strong>People who&rsquo;ve tried tracking before and quit.</strong> If you&rsquo;ve downloaded MyFitnessPal, Lose It, or Yazio and stopped using them within a month, the problem probably wasn&rsquo;t you — it was the method. A chat-based diary removes the friction that caused you to stop.
        </p>
        <p>
          <strong>People who cook at home.</strong> Traditional databases are built for packaged foods with barcodes. If you cook from scratch, every meal becomes a recipe-building exercise. In a chat diary, &ldquo;lentil soup with bread&rdquo; is all you need.
        </p>
        <p>
          <strong>People who eat food from different cultures.</strong> If your meals include dishes that Western food databases don&rsquo;t recognize — or recognize poorly — describing them in your own language is faster and more accurate than searching for English approximations.
        </p>
        <p>
          <strong>People who want awareness, not obsession.</strong> If you want to understand your eating patterns without weighing every gram and tracking every micronutrient, a lighter approach to logging keeps the benefits without the burnout.
        </p>
        <p>
          <strong>People starting their weight loss journey.</strong> If you&rsquo;ve never tracked food before, starting with a complex database app can be overwhelming. A chat diary has zero learning curve — if you can send a text message, you can track your food.
        </p>
      </ContentSection>

      <SeoCta
        title="Start your food diary today"
        description="Join Nuvvoo's early access and experience food tracking through conversation — the method designed to keep you consistent."
        buttonLocation="seo_food_diary"
      />

      <ContentSection title="How to Get the Most From Your Food Diary">
        <p>
          Whether you use Nuvvoo or any other tool, these principles make food diaries more effective:
        </p>
        <p>
          <strong>Track consistently, not perfectly.</strong> Research shows that tracking frequency matters more than precision. Logging 80% of your meals with rough estimates beats logging 30% with exact measurements. See <Link href="/how-to-stay-consistent-calorie-tracking">how to stay consistent with calorie tracking</Link> for the practical version of this.
        </p>
        <p>
          <strong>Don&rsquo;t wait until the end of the day.</strong> Log meals as you eat them, or shortly after. End-of-day recall is less accurate and feels like homework. Quick, real-time logging is easier to sustain.
        </p>
        <p>
          <strong>Include context, not just food.</strong> Note how you felt, how you slept, whether you were stressed. Over time, patterns emerge — maybe you overeat on days you sleep poorly, or snack more when stressed. This awareness is more valuable than knowing you had 47g of protein.
        </p>
        <p>
          <strong>Don&rsquo;t punish missed days.</strong> If you miss a day (or a week), just start again. The research on food diaries doesn&rsquo;t require perfection — it requires persistence. A diary you return to after a break is infinitely more valuable than one you abandon permanently.
        </p>
      </ContentSection>
    </>
  );
}

const faqsEn = [
  {
    question: 'Do food diaries actually help you lose weight?',
    answer:
      'Yes. Multiple studies confirm that consistent food tracking is associated with significantly more weight loss. The most cited finding: people who keep daily food records lose twice as much weight as non-trackers. The key is consistency — tracking most days matters more than tracking every meal perfectly.',
  },
  {
    question: 'How is a chat-based food diary different from MyFitnessPal?',
    answer:
      'Traditional apps like MyFitnessPal require you to search a database, select the exact food item, and specify portion sizes. A chat-based diary like Nuvvoo lets you describe meals in natural language — "chicken sandwich and a coffee" — and the AI estimates calories automatically. It\'s faster, simpler, and easier to maintain long-term.',
  },
  {
    question: 'How accurate is AI-based food tracking?',
    answer:
      "AI estimation is less precise than looking up exact database entries for packaged foods. But for most people, the accuracy is more than sufficient for weight loss. Research consistently shows that tracking consistency matters more than tracking precision — and you're more consistent when the tool is easy to use.",
  },
  {
    question: 'Can I use Nuvvoo as my only food diary?',
    answer:
      'Yes. Nuvvoo tracks food, calories, macros, water, sleep, exercise, and mood — all through conversation. For most people pursuing weight loss through awareness and consistency, it covers everything you need.',
  },
  {
    question: 'Is Nuvvoo free?',
    answer:
      'Yes — Nuvvoo has a Free Plan that covers the core tracking features, plus Pro Features for users who want more advanced capabilities. Check nuvvoo.app for current pricing and availability.',
  },
];

/* ─── FRENCH BODY ─── */

function FrenchBody() {
  return (
    <>
      <ContentSection title="La science : pourquoi les journaux alimentaires fonctionnent">
        <p>
          Les preuves sont claires et cohérentes, issues de décennies de recherche.
        </p>
        <p>
          <strong>La notation double la perte de poids.</strong> Une étude phare menée par Kaiser Permanente a révélé que les personnes qui tenaient un journal alimentaire quotidien perdaient deux fois plus de poids que celles qui ne notaient pas. Ce n&rsquo;est pas une amélioration marginale : c&rsquo;est une différence de 2 pour 1.
        </p>
        <p>
          <strong>C&rsquo;est la régularité qui compte.</strong> Une étude publiée dans le Journal of the Academy of Nutrition and Dietetics a montré que les participants qui enregistraient plus de 66&nbsp;% de leurs jours perdaient près de 5&nbsp;kg. Plus on note régulièrement, plus on perd de poids. La fréquence de l&rsquo;enregistrement compte plus que la perfection.
        </p>
        <p>
          <strong>La prise de conscience change automatiquement le comportement.</strong> Des études montrent que lorsque tu prévois de noter tes repas, tu es plus enclin à choisir des aliments riches en nutriments et à rester sur la bonne voie. Le simple fait de noter crée une boucle de rétroaction : tu remarques des tendances, tu repères les grignotages inconscients et tu fais de meilleurs choix sans avoir besoin de volonté.
        </p>
        <p>
          <strong>La régularité calorique est un gage de réussite.</strong> Une étude de 2026 a révélé que pour chaque augmentation de 100&nbsp;calories dans les fluctuations quotidiennes, la perte de poids diminuait d&rsquo;environ 0,6&nbsp;%. Les journaux alimentaires aident à lisser ces fluctuations en rendant l&rsquo;apport quotidien visible.
        </p>
        <p>
          La science ne fait pas débat. Les journaux alimentaires, ça marche. La question est : pourquoi la plupart des gens arrêtent-ils de les utiliser ?
        </p>
      </ContentSection>

      <ContentSection title="Le problème : pourquoi les gens abandonnent">
        <p>
          Si les journaux alimentaires sont si efficaces, pourquoi presque tout le monde arrête ? Une étude de l&rsquo;université Carnegie Mellon a identifié les principaux obstacles en interrogeant 141 personnes tenant ou ayant tenu un journal alimentaire et en analysant des milliers de messages sur des forums communautaires.
        </p>
        <p>
          <strong>C&rsquo;est lent et fastidieux.</strong> Les utilisateurs décrivent la tenue d&rsquo;un journal alimentaire comme &laquo;&nbsp;un processus tellement lent et fastidieux&nbsp;&raquo;. Rechercher dans les bases de données, sélectionner les portions, saisir chaque ingrédient des repas faits maison — cela prend 3 à 7 minutes par repas, trois fois ou plus par jour. Cela représente jusqu&rsquo;à 20 minutes de saisie quotidienne.
        </p>
        <p>
          <strong>Les bases de données sont frustrantes.</strong> Les résultats de recherche sont souvent incorrects ou trop nombreux. Trop d&rsquo;options pour un même aliment, des entrées non pertinentes et des éléments manquants pour les plats faits maison ou régionaux. L&rsquo;outil conçu pour aider devient une source de friction.
        </p>
        <p>
          <strong>La culpabilité et la honte s&rsquo;accumulent.</strong> Quatre obstacles émotionnels courants à la tenue d&rsquo;un journal alimentaire : la gêne par rapport à ce que tu as mangé, le sentiment de culpabilité quand tu &laquo;&nbsp;dérapes&nbsp;&raquo;, l&rsquo;impression que ça ne servira à rien de toute façon, et le fait de trouver ça trop contraignant. Les trackers traditionnels amplifient ces sentiments avec des compteurs de jours consécutifs, des avertissements en rouge et des alertes de déficit.
        </p>
        <p>
          <strong>C&rsquo;est la méthode qui échoue, pas la personne.</strong> La plupart des gens qui abandonnent leur journal alimentaire ne manquent pas de discipline. Ils utilisent des outils qui transforment un concept simple — noter ce que tu manges — en un processus complexe et chronophage. L&rsquo;avantage de perdre deux fois plus de poids disparaît quand tu arrêtes de noter après deux semaines.
        </p>
        <p>
          C&rsquo;est là le nœud du problème : <strong>les journaux alimentaires fonctionnent, mais les outils traditionnels ne fonctionnent pas pour la plupart des gens</strong>. Si tu as arrêté <Link href="/alternative-to-myfitnesspal">MyFitnessPal</Link> ou <Link href="/alternative-to-lose-it">Lose It</Link> après quelques semaines, tu n&rsquo;es pas l&rsquo;exception — tu es la norme.
        </p>
      </ContentSection>

      <ContentSection title="Un journal alimentaire d'un autre genre">
        <p>
          Et si tu pouvais profiter des avantages du suivi alimentaire — la prise de conscience, la régularité, la perte de poids doublée — sans la saisie fastidieuse des données ?
        </p>
        <p>
          C&rsquo;est l&rsquo;idée derrière Nuvvoo. Au lieu de fouiller dans des bases de données et de sélectionner des portions, <Link href="/chat-calorie-tracker">tu décris tes repas comme tu enverrais un SMS à un ami</Link> :
        </p>
        <ul>
          <li>&laquo;&nbsp;J&rsquo;ai mangé des flocons d&rsquo;avoine avec une banane et du café au petit-déjeuner&nbsp;&raquo;</li>
          <li>&laquo;&nbsp;J&rsquo;ai pris un wrap au poulet et des frites pour le déjeuner&nbsp;&raquo;</li>
          <li>&laquo;&nbsp;J&rsquo;ai préparé des pâtes au pesto et une salade pour le dîner&nbsp;&raquo;</li>
        </ul>
        <p>
          L&rsquo;IA se charge de l&rsquo;estimation. Les calories et les macros s&rsquo;affichent en quelques secondes. Pas besoin de naviguer dans une base de données, pas de menus déroulants pour les portions, pas de scan de codes-barres.
        </p>
        <p>
          <strong>Pourquoi cette approche change la donne :</strong>
        </p>
        <p>
          <strong>30 secondes au lieu de 5 minutes.</strong> Quand l&rsquo;enregistrement prend moins d&rsquo;une minute, ça ne ressemble plus à une corvée. L&rsquo;obstacle à la régularité diminue considérablement.
        </p>
        <p>
          <strong>Les estimations sont encouragées.</strong> Tu n&rsquo;as pas besoin de peser ton poulet au gramme près. &laquo;&nbsp;Une grande assiette de riz avec du poulet&nbsp;&raquo; suffit. Des études montrent que le bénéfice de la prise de conscience qu&rsquo;apporte le suivi ne nécessite pas une précision de laboratoire — il nécessite de la régularité. Et tu es plus régulier quand l&rsquo;outil ne pénalise pas les approximations.
        </p>
        <p>
          <strong>Pas de culpabilité pour les jours manqués.</strong> Nuvvoo n&rsquo;utilise pas de séries, d&rsquo;avertissements rouges ou de notifications culpabilisantes. Tu as manqué un jour ? Reviens demain. Tes progrès ne sont pas remis à zéro. C&rsquo;est important, car la culpabilité est l&rsquo;une des principales raisons pour lesquelles les gens abandonnent complètement les journaux alimentaires — découvre comment un <Link href="/calorie-tracking-without-stress">suivi sans stress</Link> change les résultats.
        </p>
        <p>
          <strong>Au-delà de la simple alimentation.</strong> Nuvvoo suit le sommeil, l&rsquo;activité physique, l&rsquo;humeur et l&rsquo;hydratation dans le même format conversationnel. Cela te donne une vision plus complète — plus proche d&rsquo;un <Link href="/ai-food-journal">journal alimentaire basé sur l&rsquo;IA</Link> que d&rsquo;une application de base de données — où tu commences à voir les liens entre la façon dont tu as dormi, ce que tu as mangé et comment tu te sens.
        </p>
        <p>
          <strong>Fonctionne en 5 langues.</strong> Suis tes données en anglais, allemand, russe, espagnol ou français. Décris tes repas dans ta propre langue, avec les noms locaux des aliments — pas besoin de traduire &laquo;&nbsp;борщ&nbsp;&raquo; ou &laquo;&nbsp;Schnitzel&nbsp;&raquo; en entrées de base de données en anglais.
        </p>
      </ContentSection>

      <ContentSection title="Journal alimentaire traditionnel vs journal alimentaire basé sur le chat">
        <div className="prose-nuvvoo">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Applications de journal traditionnelles</th>
                <th>Nuvvoo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Comment tu enregistres</td>
                <td>Recherche dans la base de données → sélectionne un élément → choisis une portion</td>
                <td>Décris avec tes propres mots</td>
              </tr>
              <tr>
                <td>Temps par repas</td>
                <td>3 à 7 minutes</td>
                <td>30 à 60 secondes</td>
              </tr>
              <tr>
                <td>Repas faits maison</td>
                <td>Crée une recette personnalisée (fastidieux)</td>
                <td>&laquo;&nbsp;Sauté de poulet avec du riz&nbsp;&raquo;</td>
              </tr>
              <tr>
                <td>Aliments régionaux/locaux</td>
                <td>Souvent absents de la base de données</td>
                <td>Décris-les — l&rsquo;IA comprend</td>
              </tr>
              <tr>
                <td>Jours manqués</td>
                <td>Série interrompue, notifications culpabilisantes</td>
                <td>&laquo;&nbsp;Reviens quand tu seras prêt&nbsp;&raquo;</td>
              </tr>
              <tr>
                <td>Courbe d&rsquo;apprentissage</td>
                <td>Modérée (naviguer dans la base de données, comprendre les portions)</td>
                <td>Aucune (il suffit de taper)</td>
              </tr>
              <tr>
                <td>Ton émotionnel</td>
                <td>Axé sur les accomplissements, motivé par la série</td>
                <td>Calme, sans pression</td>
              </tr>
              <tr>
                <td>Ce que tu suis</td>
                <td>Uniquement l&rsquo;alimentation (la plupart des applications)</td>
                <td>Alimentation, sommeil, exercice, humeur, eau</td>
              </tr>
              <tr>
                <td>Langues</td>
                <td>Généralement l&rsquo;anglais uniquement</td>
                <td>5 langues</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ContentSection>

      <ContentSection title="À qui s'adresse un journal alimentaire sous forme de chat ?">
        <p>
          <strong>Aux personnes qui ont déjà essayé de suivre leur alimentation et qui ont abandonné.</strong> Si tu as téléchargé MyFitnessPal, Lose It ou Yazio et que tu as arrêté de les utiliser en moins d&rsquo;un mois, le problème ne venait probablement pas de toi, mais de la méthode. Un journal sous forme de chat élimine les obstacles qui t&rsquo;ont poussé à arrêter.
        </p>
        <p>
          <strong>Les personnes qui cuisinent à la maison.</strong> Les bases de données traditionnelles sont conçues pour les aliments emballés dotés de codes-barres. Si tu cuisines tout toi-même, chaque repas devient un exercice de création de recette. Dans un journal sous forme de chat, &laquo;&nbsp;soupe de lentilles avec du pain&nbsp;&raquo; suffit.
        </p>
        <p>
          <strong>Les personnes qui mangent des plats issus de différentes cultures.</strong> Si tes repas comprennent des plats que les bases de données alimentaires occidentales ne reconnaissent pas — ou reconnaissent mal —, les décrire dans ta propre langue est plus rapide et plus précis que de chercher des approximations en anglais.
        </p>
        <p>
          <strong>Les personnes qui recherchent la prise de conscience, pas l&rsquo;obsession.</strong> Si tu veux comprendre tes habitudes alimentaires sans peser chaque gramme ni suivre chaque micronutriment, une approche plus légère de l&rsquo;enregistrement te permet de profiter des avantages sans te lasser.
        </p>
        <p>
          <strong>Les personnes qui entament leur parcours de perte de poids.</strong> Si tu n&rsquo;as jamais suivi ton alimentation auparavant, commencer avec une application de base de données complexe peut être intimidant. Un journal sous forme de chat ne nécessite aucun apprentissage : si tu sais envoyer un SMS, tu peux suivre ton alimentation.
        </p>
      </ContentSection>

      <SeoCta
        title="Commence ton journal alimentaire dès aujourd'hui"
        description="Rejoins l'accès anticipé à Nuvvoo et découvre le suivi alimentaire par la conversation — la méthode conçue pour t'aider à rester constant."
        buttonLocation="seo_food_diary"
      />

      <ContentSection title="Comment tirer le meilleur parti de ton journal alimentaire">
        <p>
          Que tu utilises Nuvvoo ou tout autre outil, ces principes rendent les journaux alimentaires plus efficaces :
        </p>
        <p>
          <strong>Enregistre régulièrement, pas parfaitement.</strong> Des études montrent que la fréquence d&rsquo;enregistrement importe plus que la précision. Enregistrer 80&nbsp;% de tes repas avec des estimations approximatives vaut mieux que d&rsquo;en enregistrer 30&nbsp;% avec des mesures exactes. Découvre <Link href="/how-to-stay-consistent-calorie-tracking">comment rester constant dans le suivi des calories</Link> pour une version pratique de ce principe.
        </p>
        <p>
          <strong>N&rsquo;attends pas la fin de la journée.</strong> Enregistre tes repas au fur et à mesure que tu les manges, ou peu après. Se souvenir de tout en fin de journée est moins précis et ressemble à des devoirs. Un enregistrement rapide et en temps réel est plus facile à maintenir.
        </p>
        <p>
          <strong>Inclus le contexte, pas seulement la nourriture.</strong> Note comment tu te sentais, comment tu as dormi, si tu étais stressé. Au fil du temps, des tendances se dessinent — peut-être que tu manges trop les jours où tu dors mal, ou que tu grignotes davantage quand tu es stressé. Cette prise de conscience est plus précieuse que de savoir que tu as consommé 47&nbsp;g de protéines.
        </p>
        <p>
          <strong>Ne te punis pas pour les jours manqués.</strong> Si tu manques un jour (ou une semaine), recommence simplement. Les recherches sur les journaux alimentaires n&rsquo;exigent pas la perfection — elles exigent de la persévérance. Un journal que tu reprends après une pause a infiniment plus de valeur que celui que tu abandonnes définitivement.
        </p>
      </ContentSection>
    </>
  );
}

const faqsFr = [
  {
    question: 'Les journaux alimentaires aident-ils vraiment à perdre du poids ?',
    answer:
      "Oui. De nombreuses études confirment qu'un suivi alimentaire régulier est associé à une perte de poids nettement plus importante. La conclusion la plus souvent citée : les personnes qui tiennent un journal alimentaire quotidien perdent deux fois plus de poids que celles qui ne le font pas. La clé, c'est la régularité : il est plus important de noter la plupart des jours que de noter chaque repas à la perfection.",
  },
  {
    question: 'En quoi un journal alimentaire sous forme de chat diffère-t-il de MyFitnessPal ?',
    answer:
      "Les applications traditionnelles comme MyFitnessPal t'obligent à rechercher dans une base de données, à sélectionner l'aliment exact et à préciser la taille des portions. Un journal sous forme de chat comme Nuvvoo te permet de décrire tes repas en langage naturel — « un sandwich au poulet et un café » — et l'IA estime automatiquement les calories. C'est plus rapide, plus simple et plus facile à tenir sur le long terme.",
  },
  {
    question: "Quelle est la précision du suivi alimentaire basé sur l'IA ?",
    answer:
      "L'estimation par l'IA est moins précise que la recherche d'entrées exactes dans une base de données pour les aliments emballés. Mais pour la plupart des gens, la précision est largement suffisante pour perdre du poids. Les recherches montrent systématiquement que la régularité du suivi est plus importante que sa précision — et tu es plus régulier quand l'outil est facile à utiliser.",
  },
  {
    question: 'Puis-je utiliser Nuvvoo comme seul journal alimentaire ?',
    answer:
      "Oui. Nuvvoo suit l'alimentation, les calories, les macros, l'eau, le sommeil, l'exercice et l'humeur — le tout par le biais d'une conversation. Pour la plupart des personnes qui cherchent à perdre du poids grâce à la prise de conscience et à la régularité, il couvre tout ce dont tu as besoin.",
  },
  {
    question: 'Nuvvoo est-il gratuit ?',
    answer:
      'Oui — Nuvvoo propose un Free Plan qui couvre les fonctionnalités de suivi de base, ainsi que des Pro Features pour qui souhaite des capacités plus avancées. Rends-toi sur nuvvoo.app pour connaître les tarifs et la disponibilité actuels.',
  },
];

/* ─── GERMAN BODY ─── */

function GermanBody() {
  return (
    <>
      <ContentSection title="Die Wissenschaft: Warum Ernährungstagebücher funktionieren">
        <p>
          Die Beweislage ist eindeutig und konsistent — und das schon seit Jahrzehnten der Forschung.
        </p>
        <p>
          <strong>Das Aufzeichnen verdoppelt den Gewichtsverlust.</strong> Eine bahnbrechende Studie von Kaiser Permanente ergab, dass Menschen, die täglich ihre Ernährung protokollierten, doppelt so viel Gewicht verloren wie diejenigen, die dies nicht taten. Das ist keine marginale Verbesserung – es ist ein 2-facher Unterschied.
        </p>
        <p>
          <strong>Konsistenz ist entscheidend.</strong> Eine im Journal of the Academy of Nutrition and Dietetics veröffentlichte Studie zeigte, dass Teilnehmer, die an mehr als 66&nbsp;% der Tage ihre Ernährung protokollierten, fast 10&nbsp;Pfund abnahmen. Je konsequenter jemand protokolliert, desto mehr Gewicht verliert er. Die Häufigkeit der Protokollierung ist wichtiger als Perfektion.
        </p>
        <p>
          <strong>Bewusstsein verändert das Verhalten automatisch.</strong> Studien zeigen, dass man, wenn man damit rechnet, seine Mahlzeiten aufzuschreiben, eher nährstoffreiche Lebensmittel wählt und am Ball bleibt. Das Aufzeichnen selbst schafft eine Rückkopplungsschleife – du erkennst Muster, merkst unbewusstes Essen und triffst bessere Entscheidungen, ohne Willenskraft aufbringen zu müssen.
        </p>
        <p>
          <strong>Kalorienkonsistenz sagt den Erfolg voraus.</strong> Eine Studie aus dem Jahr 2026 ergab, dass mit jeder Zunahme der täglichen Schwankungen um 100&nbsp;Kalorien der Gewichtsverlust um etwa 0,6&nbsp;% abnahm. Ernährungstagebücher helfen, diese Schwankungen auszugleichen, indem sie die tägliche Aufnahme sichtbar machen.
        </p>
        <p>
          Die Wissenschaft ist unumstritten. Ernährungstagebücher funktionieren. Die Frage ist: Warum hören die meisten Menschen auf, sie zu führen?
        </p>
      </ContentSection>

      <ContentSection title="Das Problem: Warum geben die Leute auf?">
        <p>
          Wenn Ernährungstagebücher so effektiv sind, warum hört dann fast jeder damit auf? Eine Studie der Carnegie Mellon University identifizierte die Hauptbarrieren, indem sie 141 aktuelle und ehemalige Nutzer von Ernährungstagebüchern befragte und Tausende von Beiträgen in Community-Foren analysierte.
        </p>
        <p>
          <strong>Es ist langsam und mühsam.</strong> Nutzer beschreiben das Führen eines Ernährungstagebuchs als &bdquo;einen so langsamen und mühsamen Prozess&ldquo;. Datenbanken durchsuchen, Portionen auswählen, jede Zutat für selbstgekochte Mahlzeiten eingeben – das dauert 3&ndash;7 Minuten pro Mahlzeit, drei- oder mehrmals am Tag. Das sind bis zu 20 Minuten tägliche Dateneingabe.
        </p>
        <p>
          <strong>Datenbanken sind frustrierend.</strong> Suchergebnisse sind oft falsch oder überwältigend. Zu viele Optionen für dasselbe Lebensmittel, irrelevante Einträge und fehlende Angaben für selbstgemachte oder regionale Gerichte. Das Tool, das eigentlich helfen soll, wird zur Quelle von Reibungspunkten.
        </p>
        <p>
          <strong>Schuldgefühle und Scham verstärken sich.</strong> Vier häufige emotionale Hindernisse beim Führen eines Ernährungstagebuchs: Verlegenheit darüber, was man gegessen hat, ein schlechtes Gewissen, wenn man &bdquo;ausrutscht&ldquo;, das Gefühl, dass es sowieso nichts bringt, und die Vorstellung, dass es zu umständlich ist. Herkömmliche Tracker verstärken diese Gefühle noch mit Streak-Zählern, roten Warnungen und Defizit-Alarmen.
        </p>
        <p>
          <strong>Die Methode versagt, nicht die Person.</strong> Den meisten Menschen, die mit dem Ernährungstagebuch aufhören, fehlt es nicht an Disziplin. Sie nutzen Tools, die aus einem einfachen Konzept – aufschreiben, was man isst – einen komplexen, zeitaufwändigen Prozess machen. Der doppelte Gewichtsverlust-Effekt verschwindet, wenn man nach zwei Wochen aufhört zu tracken.
        </p>
        <p>
          Das ist der Kernkonflikt: <strong>Ernährungstagebücher funktionieren, aber traditionelle Tools dafür funktionieren für die meisten Menschen nicht</strong>. Wenn du <Link href="/alternative-to-myfitnesspal">MyFitnessPal</Link> oder <Link href="/alternative-to-lose-it">Lose It</Link> nach ein paar Wochen aufgegeben hast, bist du keine Ausnahme – du bist die Regel.
        </p>
      </ContentSection>

      <ContentSection title="Eine andere Art von Ernährungstagebuch">
        <p>
          Was wäre, wenn du die Vorteile der Ernährungsprotokollierung – das Bewusstsein, die Beständigkeit, den doppelten Gewichtsverlust – ohne die mühsame Dateneingabe nutzen könntest?
        </p>
        <p>
          Das ist die Idee hinter Nuvvoo. Anstatt Datenbanken zu durchsuchen und Portionsgrößen auszuwählen, <Link href="/chat-calorie-tracker">beschreibst du deine Mahlzeiten so, wie du es einem Freund in einer SMS schreiben würdest</Link>:
        </p>
        <ul>
          <li>&bdquo;Hatte Haferflocken mit Banane und Kaffee zum Frühstück&ldquo;</li>
          <li>&bdquo;Habe mir zum Mittagessen einen Chicken-Wrap und Pommes geholt&ldquo;</li>
          <li>&bdquo;Habe zum Abendessen Pasta mit Pesto und Salat gemacht&ldquo;</li>
        </ul>
        <p>
          Die KI übernimmt die Schätzung. Kalorien und Makros werden in Sekundenschnelle angezeigt. Kein Durchsuchen von Datenbanken, keine Dropdown-Menüs für Portionsgrößen, kein Scannen von Barcodes erforderlich.
        </p>
        <p>
          <strong>Warum dieser Ansatz alles verändert:</strong>
        </p>
        <p>
          <strong>30 Sekunden statt 5 Minuten.</strong> Wenn das Protokollieren weniger als eine Minute dauert, fühlt es sich nicht mehr wie eine lästige Pflicht an. Die Hürde für die Kontinuität sinkt drastisch.
        </p>
        <p>
          <strong>Schätzungen sind erwünscht.</strong> Du musst dein Hähnchen nicht auf das Gramm genau wiegen. &bdquo;Ein großer Teller Reis mit Hähnchen&ldquo; reicht aus. Studien zeigen, dass der Bewusstseinsgewinn durch das Protokollieren keine Laborpräzision erfordert – sondern Kontinuität. Und du bist konsequenter, wenn das Tool dich nicht für Ungenauigkeiten bestraft.
        </p>
        <p>
          <strong>Keine Schuldgefühle bei versäumten Tagen.</strong> Nuvvoo verwendet keine Serien, roten Warnungen oder beschämenden Benachrichtigungen. Einen Tag versäumt? Komm morgen wieder. Dein Fortschritt wird nicht zurückgesetzt. Das ist wichtig, denn Schuldgefühle sind einer der Hauptgründe, warum Menschen ihre Ernährungstagebücher ganz aufgeben – sieh dir an, wie <Link href="/calorie-tracking-without-stress">stressfreies Protokollieren</Link> die Ergebnisse verändert.
        </p>
        <p>
          <strong>Mehr als nur Essen.</strong> Nuvvoo erfasst Schlaf, Bewegung, Stimmung und Wasser im gleichen dialogorientierten Format. Das gibt dir ein umfassenderes Bild – eher wie ein <Link href="/ai-food-journal">KI-Ernährungstagebuch</Link> als eine Datenbank-App –, in dem du Zusammenhänge zwischen deinem Schlaf, deiner Ernährung und deinem Befinden erkennst.
        </p>
        <p>
          <strong>Funktioniert in 5 Sprachen.</strong> Erfasse deine Daten auf Englisch, Deutsch, Russisch, Spanisch oder Französisch. Beschreibe deine Mahlzeiten in deiner eigenen Sprache mit lokalen Bezeichnungen – du musst &bdquo;борщ&ldquo; oder &bdquo;Schnitzel&ldquo; nicht in englische Datenbankeinträge übersetzen.
        </p>
      </ContentSection>

      <ContentSection title="Traditionelles Ernährungstagebuch vs. Chat-basiertes Ernährungstagebuch">
        <div className="prose-nuvvoo">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Traditionelle Tagebuch-Apps</th>
                <th>Nuvvoo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>So protokollierst du</td>
                <td>Suche in der Datenbank → Artikel auswählen → Portion wählen</td>
                <td>Beschreibe es mit deinen eigenen Worten</td>
              </tr>
              <tr>
                <td>Zeitaufwand pro Mahlzeit</td>
                <td>3&ndash;7 Minuten</td>
                <td>30&ndash;60 Sekunden</td>
              </tr>
              <tr>
                <td>Selbstgekochte Mahlzeiten</td>
                <td>Erstelle ein benutzerdefiniertes Rezept (mühsam)</td>
                <td>&bdquo;Hühnchen-Pfanne mit Reis&ldquo;</td>
              </tr>
              <tr>
                <td>Regionale/lokale Gerichte</td>
                <td>Fehlen oft in der Datenbank</td>
                <td>Beschreibe es – KI versteht es</td>
              </tr>
              <tr>
                <td>Verpasste Tage</td>
                <td>Serie unterbrochen, Schuldgefühle auslösende Benachrichtigungen</td>
                <td>&bdquo;Komm zurück, wenn du bereit bist&ldquo;</td>
              </tr>
              <tr>
                <td>Lernkurve</td>
                <td>Mäßig (in der Datenbank navigieren, Portionen verstehen)</td>
                <td>Keine (einfach eintippen)</td>
              </tr>
              <tr>
                <td>Emotionaler Ton</td>
                <td>Leistungsorientiert, seriengetrieben</td>
                <td>Ruhig, kein Druck</td>
              </tr>
              <tr>
                <td>Was du trackst</td>
                <td>Nur Essen (die meisten Apps)</td>
                <td>Essen, Schlaf, Bewegung, Stimmung, Wasser</td>
              </tr>
              <tr>
                <td>Sprachen</td>
                <td>Meist nur Englisch</td>
                <td>5 Sprachen</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ContentSection>

      <ContentSection title="Für wen ist ein chatbasiertes Ernährungstagebuch gedacht?">
        <p>
          <strong>Leute, die es schon mal versucht haben und aufgegeben haben.</strong> Wenn du MyFitnessPal, Lose It oder Yazio heruntergeladen und innerhalb eines Monats wieder aufgehört hast, lag das Problem wahrscheinlich nicht bei dir – sondern bei der Methode. Ein chatbasiertes Tagebuch beseitigt die Reibungspunkte, die dich zum Aufhören gebracht haben.
        </p>
        <p>
          <strong>Menschen, die zu Hause kochen.</strong> Herkömmliche Datenbanken sind für verpackte Lebensmittel mit Barcodes ausgelegt. Wenn du von Grund auf selbst kochst, wird jede Mahlzeit zu einer Übung im Erstellen von Rezepten. In einem Chat-Tagebuch reicht &bdquo;Linsensuppe mit Brot&ldquo; völlig aus.
        </p>
        <p>
          <strong>Menschen, die Gerichte aus verschiedenen Kulturen essen.</strong> Wenn deine Mahlzeiten Gerichte enthalten, die westliche Lebensmitteldatenbanken nicht oder nur unzureichend erkennen, ist es schneller und genauer, sie in deiner eigenen Sprache zu beschreiben, als nach englischen Entsprechungen zu suchen.
        </p>
        <p>
          <strong>Menschen, die Achtsamkeit wollen, keine Besessenheit.</strong> Wenn du deine Essgewohnheiten verstehen willst, ohne jedes Gramm abzuwiegen und jeden Mikronährstoff zu erfassen, sorgt ein lockerer Ansatz beim Protokollieren für die Vorteile ohne Burnout.
        </p>
        <p>
          <strong>Menschen, die gerade mit dem Abnehmen beginnen.</strong> Wenn du noch nie deine Ernährung protokolliert hast, kann der Einstieg mit einer komplexen Datenbank-App überwältigend sein. Ein Chat-Tagebuch hat null Lernkurve – wenn du eine SMS senden kannst, kannst du deine Ernährung protokollieren.
        </p>
      </ContentSection>

      <SeoCta
        title="Starte noch heute dein Ernährungstagebuch"
        description="Nimm am Early Access von Nuvvoo teil und erlebe die Ernährungsprotokollierung durch Unterhaltung – die Methode, die dafür entwickelt wurde, dass du dranbleibst."
        buttonLocation="seo_food_diary"
      />

      <ContentSection title="So holst du das Beste aus deinem Ernährungstagebuch heraus">
        <p>
          Egal, ob du Nuvvoo oder ein anderes Tool nutzt, diese Prinzipien machen Ernährungstagebücher effektiver:
        </p>
        <p>
          <strong>Protokolliere konsequent, nicht perfekt.</strong> Studien zeigen, dass die Häufigkeit der Erfassung wichtiger ist als die Genauigkeit. 80&nbsp;% deiner Mahlzeiten mit groben Schätzungen zu erfassen ist besser, als 30&nbsp;% mit exakten Messungen. Sieh dir an, <Link href="/how-to-stay-consistent-calorie-tracking">wie du bei der Kalorienerfassung konsequent bleibst</Link>, um eine praktische Umsetzung zu erfahren.
        </p>
        <p>
          <strong>Warte nicht bis zum Ende des Tages.</strong> Erfasse Mahlzeiten direkt beim Essen oder kurz danach. Sich am Ende des Tages zu erinnern ist ungenauer und fühlt sich wie Hausaufgaben an. Eine schnelle Erfassung in Echtzeit ist leichter durchzuhalten.
        </p>
        <p>
          <strong>Erfasse den Kontext, nicht nur das Essen.</strong> Notiere, wie du dich gefühlt hast, wie du geschlafen hast, ob du gestresst warst. Mit der Zeit zeigen sich Muster – vielleicht isst du an Tagen, an denen du schlecht schläfst, zu viel, oder naschst mehr, wenn du gestresst bist. Dieses Bewusstsein ist wertvoller als zu wissen, dass du 47&nbsp;g Protein zu dir genommen hast.
        </p>
        <p>
          <strong>Bestrafe dich nicht für ausgelassene Tage.</strong> Wenn du einen Tag (oder eine Woche) auslässt, fang einfach wieder an. Die Forschung zu Ernährungstagebüchern verlangt keine Perfektion – sie verlangt Ausdauer. Ein Tagebuch, zu dem du nach einer Pause zurückkehrst, ist unendlich viel wertvoller als eines, das du endgültig aufgibst.
        </p>
      </ContentSection>
    </>
  );
}

const faqsDe = [
  {
    question: 'Helfen Ernährungstagebücher tatsächlich beim Abnehmen?',
    answer:
      'Ja. Mehrere Studien bestätigen, dass konsequentes Aufzeichnen der Ernährung mit deutlich mehr Gewichtsverlust verbunden ist. Das am häufigsten zitierte Ergebnis: Menschen, die täglich ihre Ernährung protokollieren, nehmen doppelt so viel ab wie diejenigen, die dies nicht tun. Der Schlüssel ist Konsequenz – es ist wichtiger, an den meisten Tagen zu protokollieren, als jede Mahlzeit perfekt zu erfassen.',
  },
  {
    question: 'Wie unterscheidet sich ein chatbasiertes Ernährungstagebuch von MyFitnessPal?',
    answer:
      'Bei herkömmlichen Apps wie MyFitnessPal musst du eine Datenbank durchsuchen, das genaue Lebensmittel auswählen und die Portionsgrößen angeben. Ein chatbasiertes Tagebuch wie Nuvvoo ermöglicht es dir, Mahlzeiten in natürlicher Sprache zu beschreiben – „Hühnchensandwich und einen Kaffee" – und die KI schätzt die Kalorien automatisch. Das ist schneller, einfacher und langfristig leichter durchzuhalten.',
  },
  {
    question: 'Wie genau ist die KI-basierte Ernährungsprotokollierung?',
    answer:
      'Die KI-Schätzung ist weniger präzise als das Nachschlagen exakter Datenbankeinträge für verpackte Lebensmittel. Aber für die meisten Menschen ist die Genauigkeit mehr als ausreichend, um abzunehmen. Studien zeigen immer wieder, dass die Regelmäßigkeit der Erfassung wichtiger ist als die Genauigkeit – und du bist regelmäßiger, wenn das Tool einfach zu bedienen ist.',
  },
  {
    question: 'Kann ich Nuvvoo als mein einziges Ernährungstagebuch nutzen?',
    answer:
      'Ja. Nuvvoo erfasst Essen, Kalorien, Makros, Wasser, Schlaf, Bewegung und Stimmung – alles per Chat oder Sprachnachricht. Für die meisten Menschen, die durch Achtsamkeit und Beständigkeit abnehmen wollen, deckt es alles ab, was du brauchst.',
  },
  {
    question: 'Ist Nuvvoo kostenlos?',
    answer:
      'Ja — Nuvvoo hat einen Free Plan mit den wichtigsten Tracking-Funktionen, dazu Pro Features für alle, die erweiterte Funktionen wollen. Aktuelle Preise und Verfügbarkeit findest du auf nuvvoo.app.',
  },
];

/* ─── SPANISH BODY ─── */

function SpanishBody() {
  return (
    <>
      <ContentSection title="La ciencia: por qué funcionan los diarios de alimentación">
        <p>
          La evidencia es clara y consistente a lo largo de décadas de investigación.
        </p>
        <p>
          <strong>Llevar un registro duplica la pérdida de peso.</strong> Un estudio histórico de Kaiser Permanente descubrió que las personas que llevaban un registro diario de lo que comían perdían el doble de peso que las que no lo hacían. No se trata de una mejora marginal, sino de una diferencia del doble.
        </p>
        <p>
          <strong>La constancia es lo que importa.</strong> Una investigación publicada en el Journal of the Academy of Nutrition and Dietetics mostró que los participantes que registraron más del 66&nbsp;% de los días perdieron casi 4,5&nbsp;kilos. Cuanto más constante es alguien al registrar, más peso pierde. La frecuencia del registro importa más que la perfección.
        </p>
        <p>
          <strong>La conciencia cambia el comportamiento automáticamente.</strong> Los estudios muestran que cuando anticipas que vas a anotar tus comidas, es más probable que elijas alimentos ricos en nutrientes y te mantengas en el camino correcto. El simple hecho de anotar crea un ciclo de retroalimentación: notas patrones, detectas el comer sin pensar y tomas mejores decisiones sin necesidad de fuerza de voluntad.
        </p>
        <p>
          <strong>La consistencia calórica predice el éxito.</strong> Un estudio de 2026 descubrió que por cada aumento de 100&nbsp;calorías en la fluctuación diaria, la pérdida de peso disminuía en aproximadamente un 0,6&nbsp;%. Los diarios de comida ayudan a suavizar estas fluctuaciones al hacer visible la ingesta diaria.
        </p>
        <p>
          La ciencia no es controvertida. Los diarios de comida funcionan. La pregunta es: ¿por qué la mayoría de la gente deja de usarlos?
        </p>
      </ContentSection>

      <ContentSection title="El problema: por qué la gente lo deja">
        <p>
          Si los diarios de comida son tan eficaces, ¿por qué casi todo el mundo los deja? Una investigación de la Universidad Carnegie Mellon identificó las principales barreras al encuestar a 141 personas que llevan o han llevado un diario de comida y al analizar miles de publicaciones en foros comunitarios.
        </p>
        <p>
          <strong>Es lento y tedioso.</strong> Los usuarios describen llevar un diario de comida como «un proceso muy lento y tedioso». Buscar en bases de datos, seleccionar porciones, ingresar cada ingrediente de las comidas caseras: esto lleva de 3 a 7&nbsp;minutos por comida, tres o más veces al día. Eso son hasta 20&nbsp;minutos diarios de ingresar datos.
        </p>
        <p>
          <strong>Las bases de datos son frustrantes.</strong> Los resultados de búsqueda suelen ser incorrectos o abrumadores. Demasiadas opciones para el mismo alimento, entradas irrelevantes y faltas de datos para platos caseros o regionales. La herramienta diseñada para ayudar se convierte en una fuente de fricción.
        </p>
        <p>
          <strong>La culpa y la vergüenza se acumulan.</strong> Cuatro obstáculos emocionales comunes para llevar un diario de alimentación: vergüenza por lo que comiste, sentirte mal cuando «te descuidas», la sensación de que de todos modos no servirá de nada y encontrarlo demasiado incómodo. Los rastreadores tradicionales amplifican estos sentimientos con contadores de rachas, advertencias en rojo y alertas de déficit.
        </p>
        <p>
          <strong>El método falla, no la persona.</strong> La mayoría de las personas que dejan los diarios de alimentación no carecen de disciplina. Están usando herramientas que convierten un concepto simple —anotar lo que comes— en un proceso complejo que lleva mucho tiempo. El beneficio de perder el doble de peso desaparece cuando dejas de llevar el registro después de dos semanas.
        </p>
        <p>
          Esta es la tensión principal: <strong>los diarios de alimentación funcionan, pero las herramientas tradicionales para llevarlos no funcionan para la mayoría de las personas</strong>. Si dejaste <Link href="/alternative-to-myfitnesspal">MyFitnessPal</Link> o <Link href="/alternative-to-lose-it">Lose It</Link> al cabo de unas semanas, no eres la excepción, eres la norma.
        </p>
      </ContentSection>

      <ContentSection title="Un tipo diferente de diario de comida">
        <p>
          ¿Y si pudieras obtener los beneficios del seguimiento de la comida —la conciencia, la constancia, la pérdida de peso duplicada— sin la tediosa entrada de datos?
        </p>
        <p>
          Esa es la idea detrás de Nuvvoo. En lugar de buscar en bases de datos y seleccionar porciones, <Link href="/chat-calorie-tracker">describes tus comidas como si le enviaras un mensaje a un amigo</Link>:
        </p>
        <ul>
          <li>«Desayuné avena con plátano y café»</li>
          <li>«Me comí un wrap de pollo con papas fritas para el almuerzo»</li>
          <li>«Hice pasta con pesto y ensalada para la cena»</li>
        </ul>
        <p>
          La IA se encarga de la estimación. Las calorías y los macronutrientes aparecen en segundos. No hay que navegar por bases de datos, ni usar menús desplegables de tamaños de porciones, ni escanear códigos de barras.
        </p>
        <p>
          <strong>Por qué este enfoque cambia la ecuación:</strong>
        </p>
        <p>
          <strong>30 segundos en lugar de 5&nbsp;minutos.</strong> Cuando registrar lo que comes te lleva menos de un minuto, deja de parecer una tarea pesada. La barrera para la constancia se reduce drásticamente.
        </p>
        <p>
          <strong>Se fomentan las estimaciones.</strong> No necesitas pesar el pollo al gramo. «Un plato grande de arroz con pollo» es suficiente. Las investigaciones demuestran que el beneficio de la conciencia que aporta el seguimiento no requiere precisión de laboratorio, sino constancia. Y eres más constante cuando la herramienta no castiga las aproximaciones.
        </p>
        <p>
          <strong>Sin culpa por los días que te saltas.</strong> Nuvvoo no usa rachas, advertencias rojas ni notificaciones que te hagan sentir mal. ¿Te saltaste un día? Vuelve mañana. Tu progreso no se reinicia. Esto es importante porque la culpa es una de las principales razones por las que la gente abandona por completo los diarios de alimentación — descubre cómo un <Link href="/calorie-tracking-without-stress">seguimiento sin estrés</Link> cambia los resultados.
        </p>
        <p>
          <strong>Más allá de la comida.</strong> Nuvvoo lleva un registro del sueño, el ejercicio, el estado de ánimo y el consumo de agua en el mismo formato coloquial. Esto te da una visión más completa — más cercana a un <Link href="/ai-food-journal">diario de alimentación con IA</Link> que a una app de base de datos — donde empiezas a ver conexiones entre cómo dormiste, qué comiste y cómo te sientes.
        </p>
        <p>
          <strong>Funciona en 5 idiomas.</strong> Lleva un registro en inglés, alemán, ruso, español o francés. Describe tus comidas en tu propio idioma, con los nombres locales de los alimentos: no hace falta traducir «борщ» o «Schnitzel» a entradas de la base de datos en inglés.
        </p>
      </ContentSection>

      <ContentSection title="Diario de comida tradicional vs. diario de comida basado en chat">
        <div className="prose-nuvvoo">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Aplicaciones de diario tradicionales</th>
                <th>Nuvvoo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cómo registras</td>
                <td>Buscar en la base de datos → seleccionar el alimento → elegir la porción</td>
                <td>Describir con tus propias palabras</td>
              </tr>
              <tr>
                <td>Tiempo por comida</td>
                <td>3–7&nbsp;minutos</td>
                <td>30–60&nbsp;segundos</td>
              </tr>
              <tr>
                <td>Comidas caseras</td>
                <td>Crear una receta personalizada (tedioso)</td>
                <td>«Pollo salteado con arroz»</td>
              </tr>
              <tr>
                <td>Comida regional/local</td>
                <td>A menudo no aparece en la base de datos</td>
                <td>Descríbela: la IA la entiende</td>
              </tr>
              <tr>
                <td>Días perdidos</td>
                <td>Racha rota, notificaciones de culpa</td>
                <td>«Vuelve cuando estés listo»</td>
              </tr>
              <tr>
                <td>Curva de aprendizaje</td>
                <td>Moderada (navegar por la base de datos, entender las porciones)</td>
                <td>Ninguna (solo escribe)</td>
              </tr>
              <tr>
                <td>Tono emocional</td>
                <td>Basado en logros, impulsado por rachas</td>
                <td>Tranquilo, sin presión</td>
              </tr>
              <tr>
                <td>Lo que registras</td>
                <td>Solo comida (la mayoría de las apps)</td>
                <td>Comida, sueño, ejercicio, estado de ánimo, agua</td>
              </tr>
              <tr>
                <td>Idiomas</td>
                <td>Normalmente solo inglés</td>
                <td>5&nbsp;idiomas</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ContentSection>

      <ContentSection title="¿Para quién es un diario de comida basado en chat?">
        <p>
          <strong>Personas que han intentado llevar un registro antes y lo han dejado.</strong> Si descargaste MyFitnessPal, Lose It o Yazio y dejaste de usarlas en menos de un mes, probablemente el problema no eras tú, sino el método. Un diario basado en chat elimina la fricción que te hizo dejarlo.
        </p>
        <p>
          <strong>Personas que cocinan en casa.</strong> Las bases de datos tradicionales están diseñadas para alimentos envasados con códigos de barras. Si cocinas desde cero, cada comida se convierte en un ejercicio de creación de recetas. En un diario de chat, «sopa de lentejas con pan» es todo lo que necesitas.
        </p>
        <p>
          <strong>Personas que comen comida de diferentes culturas.</strong> Si tus comidas incluyen platos que las bases de datos de comida occidental no reconocen —o reconocen mal—, describirlos en tu propio idioma es más rápido y preciso que buscar aproximaciones en inglés.
        </p>
        <p>
          <strong>Personas que buscan conciencia, no obsesión.</strong> Si quieres entender tus patrones alimenticios sin pesar cada gramo ni llevar un registro de cada micronutriente, un enfoque más sencillo para llevar un registro te permite obtener los beneficios sin agotarte.
        </p>
        <p>
          <strong>Personas que están comenzando su camino hacia la pérdida de peso.</strong> Si nunca has llevado un registro de lo que comes, empezar con una aplicación de base de datos compleja puede ser abrumador. Un diario de chat no tiene curva de aprendizaje: si puedes enviar un mensaje de texto, puedes llevar un registro de lo que comes.
        </p>
      </ContentSection>

      <SeoCta
        title="Empieza tu diario de alimentación hoy mismo"
        description="Únete al acceso anticipado de Nuvvoo y experimenta el seguimiento de la alimentación a través de la conversación: el método diseñado para que seas constante."
        buttonLocation="seo_food_diary"
      />

      <ContentSection title="Cómo sacar el máximo provecho de tu diario de alimentos">
        <p>
          Ya sea que uses Nuvvoo o cualquier otra herramienta, estos principios hacen que los diarios de alimentos sean más efectivos:
        </p>
        <p>
          <strong>Lleva un registro de manera constante, no perfecta.</strong> Las investigaciones muestran que la frecuencia del registro importa más que la precisión. Registrar el 80&nbsp;% de tus comidas con estimaciones aproximadas es mejor que registrar el 30&nbsp;% con medidas exactas. Descubre <Link href="/how-to-stay-consistent-calorie-tracking">cómo mantener la constancia en el seguimiento de calorías</Link> para la versión práctica de este principio.
        </p>
        <p>
          <strong>No esperes hasta el final del día.</strong> Registra las comidas a medida que las comes, o poco después. Recordar al final del día es menos preciso y se siente como una tarea. El registro rápido y en tiempo real es más fácil de mantener.
        </p>
        <p>
          <strong>Incluye el contexto, no solo la comida.</strong> Anota cómo te sentiste, cómo dormiste, si estabas estresado. Con el tiempo, surgen patrones: tal vez comes de más los días que duermes mal, o picas más cuando estás estresado. Esta conciencia es más valiosa que saber que consumiste 47&nbsp;g de proteína.
        </p>
        <p>
          <strong>No te castigues por los días que te saltas.</strong> Si te saltas un día (o una semana), simplemente vuelve a empezar. Las investigaciones sobre los diarios de alimentación no exigen perfección, sino constancia. Un diario al que vuelves después de un descanso es infinitamente más valioso que uno que abandonas para siempre.
        </p>
      </ContentSection>
    </>
  );
}

const faqsEs = [
  {
    question: '¿Los diarios de alimentación realmente te ayudan a bajar de peso?',
    answer:
      'Sí. Múltiples estudios confirman que el seguimiento constante de la alimentación está asociado con una pérdida de peso significativamente mayor. El hallazgo más citado: las personas que llevan registros diarios de lo que comen pierden el doble de peso que quienes no lo hacen. La clave es la constancia: llevar un registro la mayoría de los días es más importante que registrar cada comida a la perfección.',
  },
  {
    question: '¿En qué se diferencia un diario de alimentación basado en chat de MyFitnessPal?',
    answer:
      'Las apps tradicionales como MyFitnessPal te obligan a buscar en una base de datos, seleccionar el alimento exacto y especificar el tamaño de las porciones. Un diario basado en chat como Nuvvoo te permite describir las comidas en lenguaje natural —«sándwich de pollo y un café»— y la IA calcula las calorías automáticamente. Es más rápido, más sencillo y más fácil de mantener a largo plazo.',
  },
  {
    question: '¿Qué tan preciso es el registro de alimentos basado en IA?',
    answer:
      'La estimación de la IA es menos precisa que buscar entradas exactas en la base de datos para alimentos envasados. Pero para la mayoría de las personas, la precisión es más que suficiente para bajar de peso. Las investigaciones demuestran sistemáticamente que la constancia en el seguimiento importa más que la precisión del seguimiento, y eres más constante cuando la herramienta es fácil de usar.',
  },
  {
    question: '¿Puedo usar Nuvvoo como mi único diario de alimentos?',
    answer:
      'Sí. Nuvvoo registra alimentos, calorías, macronutrientes, agua, sueño, ejercicio y estado de ánimo, todo a través de una conversación. Para la mayoría de las personas que buscan perder peso a través de la conciencia y la constancia, cubre todo lo que necesitas.',
  },
  {
    question: '¿Nuvvoo es gratis?',
    answer:
      'Sí — Nuvvoo tiene un Plan Gratuito con las funciones de seguimiento esenciales, además de funciones Pro para quien quiera capacidades avanzadas. Consulta los precios y la disponibilidad actuales en nuvvoo.app.',
  },
];

/* ─── RUSSIAN BODY ─── */

function RussianBody() {
  return (
    <>
      <ContentSection title="Наука: почему дневники питания работают">
        <p>
          Доказательства ясны и согласуются с результатами десятилетий исследований.
        </p>
        <p>
          <strong>Ведение дневника удваивает потерю веса.</strong> Знаковое исследование Kaiser Permanente показало, что люди, которые ежедневно записывали своё питание, теряли в два раза больше веса, чем те, кто этого не делал. Это не незначительное улучшение — это разница в 2 раза.
        </p>
        <p>
          <strong>Важна именно последовательность.</strong> Исследование, опубликованное в Journal of the Academy of Nutrition and Dietetics, показало, что участники, которые вели учёт более чем в 66&nbsp;% дней, похудели почти на 10&nbsp;фунтов. Чем последовательнее человек ведёт записи, тем больше веса он теряет. Частота ведения учёта важнее, чем его идеальность.
        </p>
        <p>
          <strong>Осознанность автоматически меняет поведение.</strong> Исследования показывают, что когда ты заранее знаешь, что будешь записывать свои приёмы пищи, ты с большей вероятностью выбираешь питательную еду и не сбиваешься с курса. Сам процесс записи создаёт цикл обратной связи — ты замечаешь закономерности, ловишь себя на бессмысленном переедании и делаешь лучший выбор без особых усилий.
        </p>
        <p>
          <strong>Стабильность калорийности предсказывает успех.</strong> Исследование 2026 года показало, что с каждым увеличением суточного колебания на 100&nbsp;калорий похудение снижалось примерно на 0,6&nbsp;%. Пищевые дневники помогают сгладить эти колебания, делая суточное потребление видимым.
        </p>
        <p>
          Научные данные не вызывают споров. Пищевые дневники работают. Вопрос в том: почему большинство людей перестают их использовать?
        </p>
      </ContentSection>

      <ContentSection title="Проблема: почему люди бросают">
        <p>
          Если пищевые дневники так эффективны, почему почти все бросают? Исследование Университета Карнеги-Меллона выявило основные препятствия, опросив 141 человека, ведущих или бросивших вести пищевые дневники, и проанализировав тысячи постов на форумах.
        </p>
        <p>
          <strong>Это медленно и утомительно.</strong> Пользователи описывают ведение дневника питания как «такой медленный и утомительный процесс». Поиск в базах данных, выбор порций, ввод каждого ингредиента для домашних блюд — на это уходит 3–7&nbsp;минут на каждый приём пищи, три или более раз в день. Это до 20&nbsp;минут ежедневного ввода данных.
        </p>
        <p>
          <strong>Базы данных вызывают разочарование.</strong> Результаты поиска часто бывают неверными или перегруженными. Слишком много вариантов для одного и того же блюда, нерелевантные записи и отсутствующие позиции для домашних или региональных блюд. Инструмент, призванный помочь, становится источником раздражения.
        </p>
        <p>
          <strong>Чувство вины и стыда усугубляется.</strong> Четыре распространённых эмоциональных препятствия для ведения пищевого дневника: стыд за то, что ты съел, плохое самочувствие, когда ты «сорвался», ощущение, что это всё равно не поможет, и то, что это слишком неудобно. Традиционные трекеры усиливают эти чувства с помощью счётчиков серий, красных предупреждений и оповещений о дефиците.
        </p>
        <p>
          <strong>Неудача — в методе, а не в человеке.</strong> Большинству людей, которые бросают вести дневники питания, не хватает не дисциплины. Они используют инструменты, которые превращают простую концепцию — записывать то, что ты ешь — в сложный, отнимающий много времени процесс. Преимущество в виде удвоенного похудения исчезает, когда ты прекращаешь вести дневник через две недели.
        </p>
        <p>
          В этом и заключается основная проблема: <strong>дневники питания работают, но традиционные инструменты для их ведения не работают для большинства людей</strong>. Если ты бросил <Link href="/alternative-to-myfitnesspal">MyFitnessPal</Link> или <Link href="/alternative-to-lose-it">Lose It</Link> через пару недель, ты не исключение — ты норма.
        </p>
      </ContentSection>

      <ContentSection title="Пищевой дневник другого рода">
        <p>
          А что, если бы ты мог получить все преимущества отслеживания питания — осознанность, последовательность, удвоенный эффект похудения — без утомительного ввода данных?
        </p>
        <p>
          Именно в этом и заключается идея Nuvvoo. Вместо поиска в базах данных и выбора порций <Link href="/chat-calorie-tracker">ты описываешь свои приёмы пищи так, как будто пишешь сообщение другу</Link>:
        </p>
        <ul>
          <li>«На завтрак съел овсянку с бананом и кофе»</li>
          <li>«На обед взял ролл с курицей и картошку фри»</li>
          <li>«На ужин приготовил пасту с песто и салат»</li>
        </ul>
        <p>
          ИИ сам занимается расчётами. Калории и макроэлементы появляются за секунды. Не нужно искать в базах данных, выбирать размер порций из списка или сканировать штрих-коды.
        </p>
        <p>
          <strong>Почему этот подход меняет ситуацию:</strong>
        </p>
        <p>
          <strong>30 секунд вместо 5 минут.</strong> Когда запись занимает меньше минуты, это перестаёт казаться рутинной работой. Барьер для постоянства резко снижается.
        </p>
        <p>
          <strong>Приветствуются приблизительные оценки.</strong> Тебе не нужно взвешивать курицу с точностью до грамма. Достаточно написать «большая тарелка риса с курицей». Исследования показывают, что для осознания пользы от ведения дневника не нужна лабораторная точность — нужно постоянство. А ты будешь более последователен, если инструмент не будет наказывать за приблизительные оценки.
        </p>
        <p>
          <strong>Никаких угрызений совести за пропущенные дни.</strong> Nuvvoo не использует серии, красные предупреждения или уведомления, вызывающие чувство стыда. Пропустил день? Вернись завтра. Твой прогресс не сбрасывается. Это важно, потому что чувство вины — одна из главных причин, по которой люди полностью бросают вести дневники питания — посмотри, как <Link href="/calorie-tracking-without-stress">трекинг без стресса</Link> меняет результат.
        </p>
        <p>
          <strong>Не только еда.</strong> Nuvvoo отслеживает сон, физическую активность, настроение и потребление воды в том же разговорном формате. Это даёт тебе более полную картину — ближе к <Link href="/ai-food-journal">AI-дневнику питания</Link>, чем к приложению с базой данных, — где ты начинаешь видеть связи между тем, как ты спал, что ел и как себя чувствуешь.
        </p>
        <p>
          <strong>Работает на 5 языках.</strong> Веди дневник на английском, немецком, русском, испанском или французском. Описывай свои блюда на родном языке, используя местные названия продуктов — не нужно переводить «борщ» или «шницель» в записи базы данных на английском.
        </p>
      </ContentSection>

      <ContentSection title="Традиционный дневник питания vs. дневник питания в формате чата">
        <div className="prose-nuvvoo">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Традиционные приложения-дневники</th>
                <th>Nuvvoo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Как вести записи</td>
                <td>Поиск в базе данных → выбор продукта → выбор порции</td>
                <td>Опиши своими словами</td>
              </tr>
              <tr>
                <td>Время на один приём пищи</td>
                <td>3–7&nbsp;минут</td>
                <td>30–60&nbsp;секунд</td>
              </tr>
              <tr>
                <td>Домашние блюда</td>
                <td>Создание собственного рецепта (утомительно)</td>
                <td>«Курица с рисом, приготовленная в воке»</td>
              </tr>
              <tr>
                <td>Региональные/местные блюда</td>
                <td>Часто отсутствуют в базе данных</td>
                <td>Опиши их — ИИ поймёт</td>
              </tr>
              <tr>
                <td>Пропущенные дни</td>
                <td>Серия прервана, уведомления о вине</td>
                <td>«Вернись, когда будешь готов»</td>
              </tr>
              <tr>
                <td>Кривая обучения</td>
                <td>Умеренная (навигация по базе данных, понимание порций)</td>
                <td>Нет (просто печатай)</td>
              </tr>
              <tr>
                <td>Эмоциональный тон</td>
                <td>Ориентирован на достижения, движим серией</td>
                <td>Спокойный, без давления</td>
              </tr>
              <tr>
                <td>Что ты отслеживаешь</td>
                <td>Только еду (большинство приложений)</td>
                <td>Еду, сон, физическую активность, настроение, воду</td>
              </tr>
              <tr>
                <td>Языки</td>
                <td>Обычно только английский</td>
                <td>5&nbsp;языков</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ContentSection>

      <ContentSection title="Для кого предназначен пищевой дневник на основе чата?">
        <p>
          <strong>Людям, которые раньше пробовали вести учёт, но бросили.</strong> Если ты скачивал MyFitnessPal, Lose It или Yazio и перестал ими пользоваться в течение месяца, проблема, скорее всего, была не в тебе — а в методе. Дневник на основе чата устраняет те препятствия, из-за которых ты бросил.
        </p>
        <p>
          <strong>Людям, которые готовят дома.</strong> Традиционные базы данных созданы для упакованных продуктов со штрих-кодами. Если ты готовишь с нуля, каждый приём пищи превращается в составление рецепта. В чат-дневнике достаточно просто написать «чечевичный суп с хлебом».
        </p>
        <p>
          <strong>Людям, которые едят блюда разных культур.</strong> Если в твоём рационе есть блюда, которые западные базы данных не распознают — или распознают плохо — описать их на своём языке быстрее и точнее, чем искать приблизительные варианты на английском.
        </p>
        <p>
          <strong>Тем, кому нужна осознанность, а не одержимость.</strong> Если ты хочешь понять свои пищевые привычки, не взвешивая каждый грамм и не отслеживая каждый микроэлемент, более лёгкий подход к ведению дневника сохранит все преимущества без переутомления.
        </p>
        <p>
          <strong>Тем, кто начинает свой путь к похудению.</strong> Если ты никогда раньше не вёл дневник питания, начать со сложного приложения с базой данных может быть сложно. Чат-дневник не требует никакого обучения — если ты можешь отправить сообщение, ты можешь вести дневник питания.
        </p>
      </ContentSection>

      <SeoCta
        title="Начни вести пищевой дневник сегодня"
        description="Присоединяйся к раннему доступу Nuvvoo и попробуй отслеживание питания через разговоры — метод, разработанный, чтобы помочь тебе не сбиваться с курса."
        buttonLocation="seo_food_diary"
      />

      <ContentSection title="Как получить максимальную пользу от своего пищевого дневника">
        <p>
          Независимо от того, используешь ли ты Nuvvoo или любой другой инструмент, эти принципы сделают пищевые дневники более эффективными:
        </p>
        <p>
          <strong>Веди учёт последовательно, а не идеально.</strong> Исследования показывают, что частота учёта важнее точности. Запись 80&nbsp;% твоих приёмов пищи с приблизительными оценками лучше, чем запись 30&nbsp;% с точными измерениями. Посмотри <Link href="/how-to-stay-consistent-calorie-tracking">как не сбиваться с курса при подсчёте калорий</Link> — это практическая версия принципа.
        </p>
        <p>
          <strong>Не жди до конца дня.</strong> Записывай приёмы пищи по мере их употребления или сразу после. Воспоминания в конце дня менее точны и похожи на домашнюю работу. Быстрое ведение записей в режиме реального времени легче поддерживать.
        </p>
        <p>
          <strong>Учитывай контекст, а не только еду.</strong> Отмечай, как ты себя чувствовал, как спал, был ли ты в стрессе. Со временем вырисовываются закономерности — может быть, ты переедаешь в дни, когда плохо спишь, или больше перекусываешь, когда нервничаешь. Это осознание ценнее, чем знание о том, что ты съел 47&nbsp;г белка.
        </p>
        <p>
          <strong>Не наказывай себя за пропущенные дни.</strong> Если ты пропустил день (или неделю), просто начни заново. Исследования по пищевым дневникам не требуют совершенства — они требуют настойчивости. Дневник, к которому ты возвращаешься после перерыва, бесконечно ценнее того, который ты бросил навсегда.
        </p>
      </ContentSection>
    </>
  );
}

const faqsRu = [
  {
    question: 'Действительно ли дневники питания помогают похудеть?',
    answer:
      'Да. Многочисленные исследования подтверждают, что регулярное отслеживание питания связано со значительно большей потерей веса. Самый цитируемый вывод: люди, которые ведут ежедневные записи о еде, теряют в два раза больше веса, чем те, кто не ведёт дневник. Ключ — в постоянстве: отслеживать большинство дней важнее, чем идеально фиксировать каждый приём пищи.',
  },
  {
    question: 'Чем дневник питания на основе чата отличается от MyFitnessPal?',
    answer:
      'Традиционные приложения, такие как MyFitnessPal, требуют от тебя поиска в базе данных, выбора точного продукта и указания размера порции. Дневник на основе чата, такой как Nuvvoo, позволяет описывать еду естественным языком — «сэндвич с курицей и кофе» — и ИИ автоматически рассчитывает калории. Это быстрее, проще и легче поддерживать в долгосрочной перспективе.',
  },
  {
    question: 'Насколько точно отслеживание питания с помощью ИИ?',
    answer:
      'Оценка ИИ менее точна, чем поиск точных записей в базе данных для упакованных продуктов. Но для большинства людей этой точности более чем достаточно для похудения. Исследования постоянно показывают, что постоянство в отслеживании важнее точности — а ты будешь более последователен, если инструмент прост в использовании.',
  },
  {
    question: 'Могу ли я использовать Nuvvoo в качестве единственного дневника питания?',
    answer:
      'Да. Nuvvoo отслеживает еду, калории, макроэлементы, воду, сон, физическую активность и настроение — всё это через чат. Для большинства людей, стремящихся похудеть за счёт осознанности и постоянства, это покрывает всё необходимое.',
  },
  {
    question: 'Nuvvoo бесплатен?',
    answer:
      'Да — у Nuvvoo есть бесплатный план с базовыми функциями трекинга, плюс Pro-функции для тех, кому нужны расширенные возможности. Актуальные цены и условия — на nuvvoo.app.',
  },
];
