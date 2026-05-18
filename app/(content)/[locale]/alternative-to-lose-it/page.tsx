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
const TRANSLATED_LOCALES = new Set(['en', 'es', 'de', 'fr', 'ru']);

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const en = {
    title: 'Best Lose It Alternative 2026 — Track Calories Without the Hassle',
    description:
      "Frustrated with Lose It's clunky updates and premium paywalls? Nuvvoo lets you track calories by texting what you ate — no database searching, no weighing. Works in 5 languages.",
    ogTitle: 'Best Lose It Alternative 2026 — Track Calories Without the Hassle',
    ogDescription:
      "Frustrated with Lose It's clunky updates and premium paywalls? Nuvvoo lets you track calories by texting what you ate — no database searching, no weighing.",
    twitterTitle: 'Best Lose It Alternative 2026 — Track Without the Hassle',
    twitterDescription:
      "Tired of Lose It's clunky updates and premium paywalls? Track calories by texting what you ate.",
  };
  const es = {
    title:
      'La mejor alternativa a Lose It en 2026: controla tus calorías sin complicaciones',
    description:
      '¿Frustrado con las actualizaciones complicadas y los muros de pago de Lose It? Nuvvoo te permite controlar tus calorías enviando un mensaje de texto con lo que comiste: sin buscar en bases de datos ni pesar nada. Funciona en 5 idiomas.',
    ogTitle:
      'La mejor alternativa a Lose It en 2026: controla tus calorías sin complicaciones',
    ogDescription:
      '¿Frustrado con las actualizaciones complicadas y los muros de pago de Lose It? Nuvvoo te permite controlar tus calorías enviando un mensaje de texto con lo que comiste.',
    twitterTitle: 'La mejor alternativa a Lose It en 2026',
    twitterDescription:
      'Cansado de las actualizaciones complicadas y los muros de pago de Lose It? Controla tus calorías por chat.',
  };
  const de = {
    title:
      'Die beste Alternative zu Lose It 2026 – Kalorien zählen ohne Stress',
    description:
      'Bist du genervt von den umständlichen Updates und den Premium-Bezahlschranken bei Lose It? Mit Nuvvoo kannst du Kalorien zählen, indem du einfach per SMS eintippst, was du gegessen hast – kein Suchen in Datenbanken, kein Abwiegen. Funktioniert in 5 Sprachen.',
    ogTitle: 'Die beste Alternative zu Lose It 2026 – Kalorien zählen ohne Stress',
    ogDescription:
      'Bist du genervt von den umständlichen Updates und den Premium-Bezahlschranken bei Lose It? Mit Nuvvoo kannst du Kalorien zählen, indem du einfach per SMS eintippst, was du gegessen hast.',
    twitterTitle: 'Die beste Alternative zu Lose It 2026',
    twitterDescription:
      'Genervt von den umständlichen Updates und Premium-Bezahlschranken bei Lose It? Track Kalorien per Chat.',
  };
  const fr = {
    title:
      'Meilleure alternative à Lose It en 2026 — Suis tes calories sans tracas',
    description:
      "Tu en as marre des mises à jour maladroites et des abonnements payants de Lose It ? Nuvvoo te permet de suivre tes calories en envoyant par SMS ce que tu as mangé — pas besoin de chercher dans une base de données, ni de peser quoi que ce soit. Fonctionne en 5 langues.",
    ogTitle:
      'Meilleure alternative à Lose It en 2026 — Suis tes calories sans tracas',
    ogDescription:
      "Tu en as marre des mises à jour maladroites et des abonnements payants de Lose It ? Nuvvoo te permet de suivre tes calories en envoyant par SMS ce que tu as mangé.",
    twitterTitle: 'Meilleure alternative à Lose It en 2026',
    twitterDescription:
      "Marre des mises à jour maladroites et des abonnements payants de Lose It ? Suis tes calories par chat.",
  };
  const ru = {
    title:
      'Лучшая альтернатива Lose It в 2026 году — отслеживай калории без лишних хлопот',
    description:
      'Надоели неудобные обновления и платные функции в Lose It? Nuvvoo позволяет отслеживать калории, просто отправляя SMS с информацией о том, что ты съел — без поиска в базе данных и без взвешивания. Работает на 5 языках.',
    ogTitle:
      'Лучшая альтернатива Lose It в 2026 году — отслеживай калории без лишних хлопот',
    ogDescription:
      'Надоели неудобные обновления и платные функции в Lose It? Nuvvoo позволяет отслеживать калории, просто отправляя SMS с информацией о том, что ты съел.',
    twitterTitle: 'Лучшая альтернатива Lose It в 2026 году',
    twitterDescription:
      'Надоели неудобные обновления и платные функции в Lose It? Отслеживай калории через чат.',
  };

  const copy =
    locale === 'es'
      ? es
      : locale === 'de'
        ? de
        : locale === 'fr'
          ? fr
          : locale === 'ru'
            ? ru
            : en;
  const isTranslated = TRANSLATED_LOCALES.has(locale);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nuvvoo.app';
  const slug = 'alternative-to-lose-it';
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
      images: [{ url: '/illustrations/scene-01-handshake.webp', width: 1200, height: 800 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.twitterTitle,
      description: copy.twitterDescription,
      images: ['/illustrations/scene-01-handshake.webp'],
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

export default async function AlternativeToLoseIt({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isSpanish = locale === 'es';
  const isGerman = locale === 'de';
  const isFrench = locale === 'fr';
  const isRussian = locale === 'ru';

  const h1 = isSpanish
    ? 'La mejor alternativa a Lose It en 2026: controla tus calorías sin complicaciones'
    : isGerman
      ? 'Beste Lose-It-Alternative 2026: Kalorien ohne Ärger tracken'
      : isFrench
        ? 'Meilleure alternative à Lose It en 2026 : suis tes calories sans tracas'
        : isRussian
          ? 'Лучшая альтернатива Lose It в 2026 году: отслеживай калории без лишних хлопот'
          : 'Best Lose It Alternative 2026: Track Calories Without the Hassle';

  const subtitle = isSpanish
    ? 'Lose It ha sido un buen controlador de calorías durante años, pero las últimas actualizaciones han dejado a muchos usuarios frustrados. Si pasas más tiempo navegando por los menús que controlando realmente lo que comes, tal vez sea hora de buscar un enfoque más sencillo. Nuvvoo reemplaza las búsquedas en la base de datos y la entrada manual con una sola idea: simplemente envía un mensaje de texto con lo que comiste.'
    : isGerman
      ? 'Lose It ist seit Jahren ein solider Kalorien-Tracker, aber die jüngsten Updates haben viele Nutzer frustriert. Wenn du mehr Zeit damit verbringst, durch Menüs zu navigieren, als tatsächlich Essen zu tracken, ist es vielleicht Zeit für einen einfacheren Ansatz. Nuvvoo ersetzt Datenbank-Suchen und manuelle Eingaben durch eine einzige Idee: Schreib einfach per SMS, was du gegessen hast.'
      : isFrench
        ? "Lose It est un outil de suivi des calories fiable depuis des années, mais ses récentes mises à jour ont frustré de nombreux utilisateurs. Si tu passes plus de temps à naviguer dans les menus qu’à suivre réellement ce que tu manges, il est peut-être temps d’adopter une approche plus simple. Nuvvoo remplace les recherches dans la base de données et la saisie manuelle par une idée simple : il suffit d’envoyer par SMS ce que tu as mangé."
        : isRussian
          ? 'Lose It уже много лет является надёжным калькулятором калорий, но последние обновления разочаровали многих пользователей. Если ты тратишь больше времени на навигацию по меню, чем на фактическое отслеживание еды, возможно, пришло время перейти к более простому подходу. Nuvvoo заменяет поиск в базе данных и ручной ввод одной идеей: просто отправляй SMS с информацией о том, что ты съел.'
          : 'Lose It has been a solid calorie tracker for years, but recent updates have left many users frustrated. If you’re spending more time navigating menus than actually tracking food, it might be time for a simpler approach. Nuvvoo replaces database searches and manual entry with a single idea: just text what you ate.';

  const imageAlt = isSpanish
    ? 'Nuvvoo da la bienvenida a un nuevo usuario — una alternativa más amigable al seguimiento de calorías de Lose It'
    : isGerman
      ? 'Nuvvoo begrüßt einen neuen Nutzer – eine freundlichere Alternative zum Kalorien-Tracking von Lose It'
      : isFrench
        ? "Nuvvoo accueille un nouvel utilisateur — une alternative plus conviviale au suivi des calories de Lose It"
        : isRussian
          ? 'Nuvvoo приветствует нового пользователя — более дружелюбная альтернатива отслеживанию калорий в Lose It'
          : 'Nuvvoo welcoming a new user — a friendlier alternative to Lose It calorie tracking';

  const faqs = isSpanish
    ? faqsEs
    : isGerman
      ? faqsDe
      : isFrench
        ? faqsFr
        : isRussian
          ? faqsRu
          : faqsEn;

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
                src="/illustrations/scene-01-handshake.webp"
                alt={imageAlt}
                width={1200}
                height={800}
                className="h-auto w-full"
              />
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-3xl space-y-12">
            {isSpanish ? (
              <SpanishBody />
            ) : isGerman ? (
              <GermanBody />
            ) : isFrench ? (
              <FrenchBody />
            ) : isRussian ? (
              <RussianBody />
            ) : (
              <EnglishBody />
            )}

            <div className="my-12 flex flex-col items-center gap-4 text-center">
              <AppStoreBadge buttonLocation="seo_loseit_alternative" />
            </div>

            <FaqSection faqs={faqs} />

            <RelatedGuides slugs={['calculator', 'bmiCalculator', 'foodDiary', 'stressFree']} />
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
      <ContentSection title="Why People Seek Lose It Alternatives">
        <p>
          Lose It is a well-established calorie tracker with a clean design and a loyal user base. But several pain points push people to look for something different:
        </p>
        <ul>
          <li><strong>Recent update frustrations:</strong> The latest redesign moved key features like the &ldquo;Done Logging&rdquo; button and calendar navigation behind extra taps. What used to be one click now takes three or four.</li>
          <li><strong>Sluggish performance:</strong> Users report the app has become noticeably slower over recent months, with freezes during food searches and meal logging.</li>
          <li><strong>Premium paywalls:</strong> Custom macro targets, per-meal macro breakdowns, and advanced features are locked behind Lose It Premium. If you&rsquo;re on keto or high-protein, the free version feels deliberately limited.</li>
          <li><strong>Subscription traps:</strong> Some users report difficulty canceling subscriptions, with customer service described as &ldquo;running in loops&rdquo; without resolving issues.</li>
          <li><strong>Same old approach:</strong> Despite updates, the core experience is still database search → select portion → log manually. For many people, this process itself is why they stop tracking.</li>
        </ul>
        <p>
          These aren&rsquo;t problems for everyone. Lose It works well for people who want a structured, database-driven tracker. But if the manual process is what makes you quit, a different approach might help you <Link href="/how-to-stay-consistent-calorie-tracking">stay consistent</Link>.
        </p>
      </ContentSection>

      <ContentSection title="Different Approaches to Food Tracking">
        <p>
          <strong>Lose It&rsquo;s approach: Visual logging with database precision</strong>
        </p>
        <p>
          Lose It offers a colorful, gamified experience built around searching a food database and scanning barcodes. You find the item, choose the portion size, and the app tallies everything. This works well if you:
        </p>
        <ul>
          <li>Enjoy the visual progress of filling daily goals</li>
          <li>Eat many packaged foods with barcodes</li>
          <li>Want community challenges and social features</li>
          <li>Don&rsquo;t mind spending a few minutes per meal on logging</li>
        </ul>
        <p>
          <strong>Nuvvoo&rsquo;s approach: Awareness through conversation</strong>
        </p>
        <p>
          Nuvvoo skips the database entirely. Instead of searching and selecting, you <Link href="/chat-calorie-tracker">describe your meal in your own words</Link> — like texting a friend. The AI handles estimation and calculation. This works well if you:
        </p>
        <ul>
          <li>Have quit Lose It because logging felt like a chore</li>
          <li>Want to track consistently without spending 5+ minutes per meal</li>
          <li>Prefer talking about meals rather than entering data</li>
          <li>Value building awareness over hitting exact numbers</li>
        </ul>
      </ContentSection>

      <ContentSection title="Comparison: Lose It vs. Nuvvoo">
        <div className="prose-nuvvoo">
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Lose It</th>
                <th>Nuvvoo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Input method</td>
                <td>Database search + barcode scan</td>
                <td>Natural language chat</td>
              </tr>
              <tr>
                <td>Time per entry</td>
                <td>2&ndash;4 minutes</td>
                <td>30&ndash;60 seconds</td>
              </tr>
              <tr>
                <td>Learning curve</td>
                <td>Moderate (navigate menus, find foods)</td>
                <td>Minimal (just describe meals)</td>
              </tr>
              <tr>
                <td>Free version limits</td>
                <td>Macro targets locked behind Premium</td>
                <td>Full tracking available</td>
              </tr>
              <tr>
                <td>Focus</td>
                <td>Gamified weight loss with goals</td>
                <td>Awareness &amp; consistency</td>
              </tr>
              <tr>
                <td>Tone</td>
                <td>Achievement-driven, badges &amp; streaks</td>
                <td>Conversational, no guilt</td>
              </tr>
              <tr>
                <td>Languages</td>
                <td>English</td>
                <td>5 languages</td>
              </tr>
              <tr>
                <td>Ideal for</td>
                <td>Structured trackers who like gamification</td>
                <td>People who quit trackers due to friction</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>When Lose It might be better:</strong>
        </p>
        <ul>
          <li>You thrive on gamification, streaks, and visual progress bars</li>
          <li>You eat mostly packaged food and rely on barcode scanning</li>
          <li>You want community challenges and social accountability</li>
          <li>You need integration with specific fitness wearables</li>
        </ul>
        <p>
          <strong>When Nuvvoo might be better:</strong>
        </p>
        <ul>
          <li>You&rsquo;ve tried Lose It but quit because logging felt tedious</li>
          <li>Recent app updates have made your workflow slower</li>
          <li>You don&rsquo;t want to pay for Premium just to set custom macros</li>
          <li>You cook at home and describing meals is faster than searching a database</li>
          <li>You prefer <Link href="/calorie-tracking-without-stress">tracking without stress or guilt</Link>, or speak a language other than English</li>
        </ul>
      </ContentSection>

      <SeoCta
        title="Try a different approach to tracking"
        description="Join Nuvvoo's early access and experience calorie tracking through conversation instead of databases."
        buttonLocation="seo_loseit_alternative"
      />

      <ContentSection title="Making the Switch">
        <p>
          <strong>What you&rsquo;ll gain:</strong>
        </p>
        <ul>
          <li><strong>Speed:</strong> Chat-based entries take 30&ndash;60 seconds vs. navigating menus and databases</li>
          <li><strong>No paywalls on basics:</strong> Full tracking without needing a premium subscription for macro targets</li>
          <li><strong>Less friction:</strong> No searching, no weighing, no portion size selections</li>
          <li><strong>Multilingual support:</strong> Track in English, German, Russian, Spanish, or French</li>
          <li><strong>No guilt on missed days:</strong> Skip a day, come back whenever — no lost streaks</li>
        </ul>
        <p>
          <strong>What you&rsquo;ll trade off:</strong>
        </p>
        <ul>
          <li><strong>Barcode scanning:</strong> Nuvvoo doesn&rsquo;t use barcodes (yet)</li>
          <li><strong>Gamification:</strong> No badges, challenges, or streak rewards</li>
          <li><strong>Social features:</strong> Nuvvoo focuses on personal tracking, not community</li>
          <li><strong>Granular control:</strong> Less ability to fine-tune every ingredient</li>
        </ul>
        <p>
          The best tracker is the one you&rsquo;ll actually use consistently. If Lose It&rsquo;s approach works for you, keep using it. If not, Nuvvoo offers a fundamentally different experience — one closer to an <Link href="/ai-food-journal">AI food journal</Link> than a database lookup.
        </p>
      </ContentSection>
    </>
  );
}

const faqsEn = [
  {
    question: 'Does Nuvvoo replace Lose It entirely?',
    answer:
      'It depends on what you need. If you rely on barcode scanning and gamified goals, Lose It may still serve you better for those specific use cases. But if you have been frustrated by the logging process itself, Nuvvoo offers a faster, simpler alternative focused on consistency over precision.',
  },
  {
    question: 'Can I switch from Lose It to Nuvvoo?',
    answer:
      "Yes. You can start using Nuvvoo right away — there's no data migration needed since Nuvvoo builds your profile through conversation. Some people use both during a transition period.",
  },
  {
    question: 'Is Nuvvoo free?',
    answer:
      'Yes — Nuvvoo has a Free Plan that covers the core tracking features, plus Pro Features for users who want more advanced capabilities. Check nuvvoo.app for current pricing and availability.',
  },
];

/* ─── SPANISH BODY ─── */

function SpanishBody() {
  return (
    <>
      <ContentSection title="Por qué la gente busca alternativas a Lose It">
        <p>
          Lose It es un contador de calorías bien establecido con un diseño limpio y una base de usuarios leales. Pero varios puntos débiles empujan a la gente a buscar algo diferente:
        </p>
        <ul>
          <li><strong>Frustraciones por las actualizaciones recientes:</strong> el último rediseño ocultó funciones clave como el botón &laquo;Done Logging&raquo; y la navegación por el calendario tras toques adicionales. Lo que antes era un clic ahora requiere tres o cuatro.</li>
          <li><strong>Rendimiento lento:</strong> los usuarios informan de que la app se ha vuelto notablemente más lenta en los últimos meses, con bloqueos durante las búsquedas de alimentos y el registro de comidas.</li>
          <li><strong>Barreras de pago de la versión Premium:</strong> los objetivos de macronutrientes personalizados, los desgloses de macronutrientes por comida y las funciones avanzadas están bloqueadas en Lose It Premium. Si sigues una dieta cetogénica o alta en proteínas, la versión gratuita se siente deliberadamente limitada.</li>
          <li><strong>Trampas de suscripción:</strong> algunos usuarios dicen que les cuesta cancelar las suscripciones, y describen el servicio al cliente como &laquo;un círculo vicioso&raquo; que no resuelve los problemas.</li>
          <li><strong>El mismo enfoque de siempre:</strong> a pesar de las actualizaciones, la experiencia básica sigue siendo buscar en la base de datos → seleccionar la porción → registrar manualmente. Para mucha gente, este proceso en sí es la razón por la que dejan de llevar el registro.</li>
        </ul>
        <p>
          Estos problemas no afectan a todo el mundo. Lose It funciona bien para quienes buscan un registro estructurado y basado en una base de datos. Pero si el proceso manual es lo que te hace rendirte, un enfoque diferente podría ayudarte a <Link href="/how-to-stay-consistent-calorie-tracking">mantener la constancia</Link>.
        </p>
      </ContentSection>

      <ContentSection title="Diferentes enfoques para el registro de alimentos">
        <p>
          <strong>El enfoque de Lose It: registro visual con precisión de base de datos</strong>
        </p>
        <p>
          Lose It ofrece una experiencia colorida y gamificada basada en la búsqueda en una base de datos de alimentos y el escaneo de códigos de barras. Encuentras el alimento, eliges el tamaño de la porción y la app lo suma todo. Esto funciona bien si:
        </p>
        <ul>
          <li>Disfrutas del progreso visual al cumplir tus objetivos diarios</li>
          <li>Consumes muchos alimentos envasados con códigos de barras</li>
          <li>Quieres desafíos comunitarios y funciones sociales</li>
          <li>No te molesta dedicar unos minutos por comida al registro</li>
        </ul>
        <p>
          <strong>El enfoque de Nuvvoo: concienciación a través de la conversación</strong>
        </p>
        <p>
          Nuvvoo se salta la base de datos por completo. En lugar de buscar y seleccionar, <Link href="/chat-calorie-tracker">describes tu comida con tus propias palabras</Link>, como si le enviaras un mensaje de texto a un amigo. La IA se encarga de la estimación y el cálculo. Esto funciona bien si:
        </p>
        <ul>
          <li>Has dejado de usar Lose It porque registrar las comidas te parecía una tarea pesada</li>
          <li>Quieres llevar un seguimiento constante sin dedicar más de 5 minutos por comida</li>
          <li>Prefieres hablar de las comidas en lugar de introducir datos</li>
          <li>Valoras crear conciencia más que alcanzar números exactos</li>
        </ul>
      </ContentSection>

      <ContentSection title="Comparación: Lose It vs. Nuvvoo">
        <div className="prose-nuvvoo">
          <table>
            <thead>
              <tr>
                <th>Característica</th>
                <th>Lose It</th>
                <th>Nuvvoo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Método de entrada</td>
                <td>Búsqueda en la base de datos + escaneo de códigos de barras</td>
                <td>Chat en lenguaje natural</td>
              </tr>
              <tr>
                <td>Tiempo por entrada</td>
                <td>2&ndash;4 minutos</td>
                <td>30&ndash;60 segundos</td>
              </tr>
              <tr>
                <td>Curva de aprendizaje</td>
                <td>Moderada (navegar por los menús, buscar alimentos)</td>
                <td>Mínima (solo describir las comidas)</td>
              </tr>
              <tr>
                <td>La versión gratuita tiene límites</td>
                <td>Objetivos de macronutrientes bloqueados en la versión Premium</td>
                <td>Seguimiento completo disponible</td>
              </tr>
              <tr>
                <td>Enfoque</td>
                <td>Pérdida de peso gamificada con objetivos</td>
                <td>Conciencia y constancia</td>
              </tr>
              <tr>
                <td>Tono</td>
                <td>Orientado a los logros, insignias y rachas</td>
                <td>Conversacional, sin culpa</td>
              </tr>
              <tr>
                <td>Idiomas</td>
                <td>Inglés</td>
                <td>5 idiomas</td>
              </tr>
              <tr>
                <td>Ideal para</td>
                <td>Usuarios estructurados a quienes les gusta la gamificación</td>
                <td>Personas que dejaron de usar aplicaciones de seguimiento debido a la fricción</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>Cuándo Lose It podría ser mejor:</strong>
        </p>
        <ul>
          <li>Te motivan la gamificación, las rachas y las barras de progreso visuales</li>
          <li>Comes principalmente alimentos envasados y dependes del escaneo de códigos de barras</li>
          <li>Quieres desafíos comunitarios y responsabilidad social</li>
          <li>Necesitas integración con dispositivos portátiles de fitness específicos</li>
        </ul>
        <p>
          <strong>Cuándo Nuvvoo podría ser mejor:</strong>
        </p>
        <ul>
          <li>Has probado Lose It pero lo dejaste porque registrar las comidas te resultaba tedioso</li>
          <li>Las actualizaciones recientes de la app han ralentizado tu flujo de trabajo</li>
          <li>No quieres pagar por Premium solo para configurar macros personalizadas</li>
          <li>Cocinas en casa y describir las comidas es más rápido que buscar en una base de datos</li>
          <li>Prefieres un <Link href="/calorie-tracking-without-stress">seguimiento sin estrés ni culpa</Link>, o hablas un idioma distinto al inglés</li>
        </ul>
      </ContentSection>

      <SeoCta
        title="Prueba un enfoque diferente para el seguimiento"
        description="Únete al acceso anticipado de Nuvvoo y experimenta el seguimiento de calorías a través de la conversación en lugar de bases de datos."
        buttonLocation="seo_loseit_alternative"
      />

      <ContentSection title="Hacer el cambio">
        <p>
          <strong>Lo que ganarás:</strong>
        </p>
        <ul>
          <li><strong>Velocidad:</strong> las entradas por chat tardan entre 30 y 60 segundos, en comparación con navegar por menús y bases de datos</li>
          <li><strong>Sin barreras de pago en lo básico:</strong> seguimiento completo sin necesidad de una suscripción premium para los objetivos de macros</li>
          <li><strong>Menos complicaciones:</strong> sin búsquedas, sin pesajes, sin selecciones de tamaño de porciones</li>
          <li><strong>Soporte multilingüe:</strong> realiza el seguimiento en inglés, alemán, ruso, español o francés</li>
          <li><strong>Sin culpa por los días que te saltas:</strong> sáltate un día, vuelve cuando quieras — no pierdes rachas</li>
        </ul>
        <p>
          <strong>Lo que perderás:</strong>
        </p>
        <ul>
          <li><strong>Escaneo de códigos de barras:</strong> Nuvvoo no usa códigos de barras (todavía)</li>
          <li><strong>Gamificación:</strong> sin insignias, desafíos ni recompensas por rachas</li>
          <li><strong>Funciones sociales:</strong> Nuvvoo se centra en el seguimiento personal, no en la comunidad</li>
          <li><strong>Control detallado:</strong> menos capacidad para ajustar cada ingrediente</li>
        </ul>
        <p>
          El mejor registro es el que realmente vas a usar de forma constante. Si el enfoque de Lose It te funciona, sigue usándolo. Si no, Nuvvoo ofrece una experiencia fundamentalmente diferente — más cercana a un <Link href="/ai-food-journal">diario de alimentación con IA</Link> que a una búsqueda en una base de datos.
        </p>
      </ContentSection>
    </>
  );
}

const faqsEs = [
  {
    question: '¿Nuvvoo reemplaza por completo a Lose It?',
    answer:
      'Depende de lo que necesites. Si te basas en el escaneo de códigos de barras y los objetivos gamificados, es posible que Lose It te siga sirviendo mejor para esos casos de uso específicos. Pero si te ha frustrado el proceso de registro en sí, Nuvvoo ofrece una alternativa más rápida y sencilla centrada en la constancia más que en la precisión.',
  },
  {
    question: '¿Puedo cambiar de Lose It a Nuvvoo?',
    answer:
      'Sí. Puedes empezar a usar Nuvvoo de inmediato; no es necesario migrar datos, ya que Nuvvoo crea tu perfil a través de la conversación. Algunas personas usan ambos durante un período de transición.',
  },
  {
    question: '¿Nuvvoo es gratis?',
    answer:
      'Sí — Nuvvoo tiene un Free Plan que cubre las funciones básicas de seguimiento, además de Pro Features para quienes quieran capacidades más avanzadas. Visita nuvvoo.app para conocer los precios y la disponibilidad actuales.',
  },
];

/* ─── GERMAN BODY ─── */

function GermanBody() {
  return (
    <>
      <ContentSection title="Warum Leute nach Alternativen zu Lose It suchen">
        <p>
          Lose It ist ein etablierter Kalorien-Tracker mit klarem Design und einer treuen Nutzerbasis. Doch einige Probleme treiben die Leute dazu, nach etwas anderem zu suchen:
        </p>
        <ul>
          <li><strong>Frust über die jüngsten Updates:</strong> durch das letzte Redesign sind wichtige Funktionen wie der &bdquo;Done Logging&ldquo;-Button und die Kalendernavigation hinter zusätzlichen Klicks versteckt. Was früher ein Klick war, braucht jetzt drei oder vier.</li>
          <li><strong>Langsame Leistung:</strong> Nutzer berichten, dass die App in den letzten Monaten merklich langsamer geworden ist, mit Einfrieren bei der Lebensmittelsuche und der Mahlzeitenerfassung.</li>
          <li><strong>Premium-Zahlschranken:</strong> individuelle Makroziele, Makroaufschlüsselungen pro Mahlzeit und erweiterte Funktionen sind hinter Lose It Premium gesperrt. Wenn du eine Keto- oder proteinreiche Diät machst, fühlt sich die kostenlose Version absichtlich eingeschränkt an.</li>
          <li><strong>Abonnement-Fallen:</strong> einige Nutzer berichten von Schwierigkeiten beim Kündigen von Abonnements, wobei der Kundenservice als &bdquo;sich im Kreis drehend&ldquo; beschrieben wird, ohne Probleme zu lösen.</li>
          <li><strong>Immer derselbe Ansatz:</strong> trotz Updates besteht das Kern-Erlebnis immer noch aus: Datenbank-Suche → Portion auswählen → manuell eintragen. Für viele Menschen ist genau dieser Prozess der Grund, warum sie mit dem Tracking aufhören.</li>
        </ul>
        <p>
          Das sind nicht für jeden Probleme. Lose It funktioniert gut für Leute, die einen strukturierten, datenbankgestützten Tracker wollen. Aber wenn der manuelle Prozess der Grund ist, warum du aufgibst, könnte ein anderer Ansatz dir helfen, <Link href="/how-to-stay-consistent-calorie-tracking">dranzubleiben</Link>.
        </p>
      </ContentSection>

      <ContentSection title="Verschiedene Ansätze zur Ernährungsprotokollierung">
        <p>
          <strong>Der Ansatz von Lose It: Visuelle Erfassung mit Datenbankgenauigkeit</strong>
        </p>
        <p>
          Lose It bietet ein farbenfrohes, spielerisches Erlebnis, das auf der Suche in einer Lebensmitteldatenbank und dem Scannen von Barcodes basiert. Du suchst den Artikel, wählst die Portionsgröße aus und die App rechnet alles zusammen. Das funktioniert gut, wenn du:
        </p>
        <ul>
          <li>Spaß daran hast, den Fortschritt beim Erreichen deiner Tagesziele visuell zu verfolgen</li>
          <li>Viele verpackte Lebensmittel mit Barcodes isst</li>
          <li>Community-Herausforderungen und soziale Funktionen möchtest</li>
          <li>Nichts dagegen hast, pro Mahlzeit ein paar Minuten mit der Erfassung zu verbringen</li>
        </ul>
        <p>
          <strong>Der Ansatz von Nuvvoo: Bewusstsein durch Gespräche</strong>
        </p>
        <p>
          Nuvvoo verzichtet komplett auf eine Datenbank. Anstatt zu suchen und auszuwählen, <Link href="/chat-calorie-tracker">beschreibst du deine Mahlzeit mit deinen eigenen Worten</Link> – so wie du einem Freund eine SMS schreibst. Die KI übernimmt die Schätzung und Berechnung. Das funktioniert gut, wenn du:
        </p>
        <ul>
          <li>Lose It aufgegeben hast, weil dir das Protokollieren wie eine lästige Pflicht vorkam</li>
          <li>Konsequent tracken möchtest, ohne mehr als 5 Minuten pro Mahlzeit aufzuwenden</li>
          <li>Lieber über Mahlzeiten sprichst, als Daten einzugeben</li>
          <li>Mehr Wert auf Bewusstseinsbildung legst als auf das Erreichen exakter Zahlen</li>
        </ul>
      </ContentSection>

      <ContentSection title="Vergleich: Lose It vs. Nuvvoo">
        <div className="prose-nuvvoo">
          <table>
            <thead>
              <tr>
                <th>Funktion</th>
                <th>Lose It</th>
                <th>Nuvvoo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Eingabemethode</td>
                <td>Datenbank-Suche + Barcode-Scan</td>
                <td>Chat in natürlicher Sprache</td>
              </tr>
              <tr>
                <td>Zeit pro Eintrag</td>
                <td>2&ndash;4 Minuten</td>
                <td>30&ndash;60 Sekunden</td>
              </tr>
              <tr>
                <td>Lernkurve</td>
                <td>Mäßig (Menüs navigieren, Lebensmittel suchen)</td>
                <td>Minimal (einfach Mahlzeiten beschreiben)</td>
              </tr>
              <tr>
                <td>Einschränkungen der kostenlosen Version</td>
                <td>Makro-Ziele hinter Premium gesperrt</td>
                <td>Vollständige Erfassung verfügbar</td>
              </tr>
              <tr>
                <td>Fokus</td>
                <td>Gamifizierte Gewichtsabnahme mit Zielen</td>
                <td>Bewusstsein &amp; Beständigkeit</td>
              </tr>
              <tr>
                <td>Ton</td>
                <td>Leistungsorientiert, Abzeichen &amp; Serien</td>
                <td>Konversationell, keine Schuldgefühle</td>
              </tr>
              <tr>
                <td>Sprachen</td>
                <td>Englisch</td>
                <td>5 Sprachen</td>
              </tr>
              <tr>
                <td>Ideal für</td>
                <td>Strukturierte Nutzer, die Gamification mögen</td>
                <td>Menschen, die Tracker wegen Reibungsverlusten aufgegeben haben</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>Wann Lose It besser sein könnte:</strong>
        </p>
        <ul>
          <li>Du blühst bei Gamification, Serien und visuellen Fortschrittsbalken auf</li>
          <li>Du isst hauptsächlich Fertiggerichte und bist auf das Scannen von Barcodes angewiesen</li>
          <li>Du möchtest Community-Herausforderungen und soziale Rechenschaftspflicht</li>
          <li>Du benötigst die Integration mit bestimmten Fitness-Wearables</li>
        </ul>
        <p>
          <strong>Wann Nuvvoo besser sein könnte:</strong>
        </p>
        <ul>
          <li>Du hast Lose It ausprobiert, aber aufgehört, weil dir das Protokollieren zu mühsam war</li>
          <li>Aktuelle App-Updates haben deinen Arbeitsablauf verlangsamt</li>
          <li>Du möchtest nicht für Premium bezahlen, nur um benutzerdefinierte Makros festzulegen</li>
          <li>Du kochst zu Hause und das Beschreiben von Mahlzeiten geht schneller als das Durchsuchen einer Datenbank</li>
          <li>Du bevorzugst <Link href="/calorie-tracking-without-stress">Tracking ohne Stress oder Schuldgefühle</Link> oder sprichst eine andere Sprache als Englisch</li>
        </ul>
      </ContentSection>

      <SeoCta
        title="Probier einen anderen Ansatz zur Nachverfolgung aus"
        description="Nimm am Early Access von Nuvvoo teil und erlebe Kalorien-Tracking durch Gespräche statt durch Datenbanken."
        buttonLocation="seo_loseit_alternative"
      />

      <ContentSection title="Der Wechsel">
        <p>
          <strong>Was du gewinnst:</strong>
        </p>
        <ul>
          <li><strong>Geschwindigkeit:</strong> Chat-basierte Eingaben dauern 30&ndash;60 Sekunden im Vergleich zum Navigieren durch Menüs und Datenbanken</li>
          <li><strong>Keine Bezahlschranken für die Grundfunktionen:</strong> vollständige Nachverfolgung ohne Premium-Abonnement für Makroziele</li>
          <li><strong>Weniger Reibungsverluste:</strong> kein Suchen, kein Wiegen, keine Auswahl von Portionsgrößen</li>
          <li><strong>Mehrsprachige Unterstützung:</strong> erfasse deine Daten auf Englisch, Deutsch, Russisch, Spanisch oder Französisch</li>
          <li><strong>Kein schlechtes Gewissen bei verpassten Tagen:</strong> lass einen Tag aus, komm zurück, wann immer du willst – keine verlorenen Serien</li>
        </ul>
        <p>
          <strong>Was du dafür einbüßt:</strong>
        </p>
        <ul>
          <li><strong>Barcode-Scannen:</strong> Nuvvoo verwendet keine Barcodes (noch nicht)</li>
          <li><strong>Gamification:</strong> keine Abzeichen, Herausforderungen oder Belohnungen für Serien</li>
          <li><strong>Soziale Funktionen:</strong> Nuvvoo konzentriert sich auf die persönliche Nachverfolgung, nicht auf die Community</li>
          <li><strong>Detaillierte Kontrolle:</strong> weniger Möglichkeiten, jede Zutat genau anzupassen</li>
        </ul>
        <p>
          Der beste Tracker ist der, den du tatsächlich konsequent nutzt. Wenn der Ansatz von Lose It für dich funktioniert, bleib dabei. Wenn nicht, bietet Nuvvoo eine grundlegend andere Erfahrung – näher an einem <Link href="/ai-food-journal">KI-Ernährungstagebuch</Link> als an einer Datenbankabfrage.
        </p>
      </ContentSection>
    </>
  );
}

const faqsDe = [
  {
    question: 'Ersetzt Nuvvoo Lose It vollständig?',
    answer:
      'Das hängt davon ab, was du brauchst. Wenn du auf das Scannen von Barcodes und spielerische Ziele setzt, ist Lose It für diese speziellen Anwendungsfälle vielleicht immer noch besser für dich geeignet. Wenn dich jedoch der Erfassungsprozess selbst frustriert hat, bietet Nuvvoo eine schnellere, einfachere Alternative, bei der Konsistenz vor Präzision steht.',
  },
  {
    question: 'Kann ich von Lose It zu Nuvvoo wechseln?',
    answer:
      'Ja. Du kannst Nuvvoo sofort nutzen – eine Datenmigration ist nicht erforderlich, da Nuvvoo dein Profil durch Gespräche erstellt. Manche Nutzer verwenden während einer Übergangsphase beide Apps.',
  },
  {
    question: 'Ist Nuvvoo kostenlos?',
    answer:
      'Ja — Nuvvoo hat einen Free Plan mit den wichtigsten Tracking-Funktionen, dazu Pro Features für alle, die erweiterte Funktionen wollen. Aktuelle Preise und Verfügbarkeit findest du auf nuvvoo.app.',
  },
];

/* ─── FRENCH BODY ─── */

function FrenchBody() {
  return (
    <>
      <ContentSection title="Pourquoi les gens cherchent des alternatives à Lose It">
        <p>
          Lose It est un compteur de calories bien établi, avec un design épuré et une base d&apos;utilisateurs fidèles. Mais plusieurs points faibles poussent les gens à chercher autre chose :
        </p>
        <ul>
          <li><strong>Frustrations liées aux mises à jour récentes :</strong> la dernière refonte a déplacé des fonctionnalités clés comme le bouton &laquo;&nbsp;Fin de l&apos;enregistrement&nbsp;&raquo; et la navigation dans le calendrier, qui nécessitent désormais des clics supplémentaires. Ce qui ne demandait qu&apos;un clic en nécessite désormais trois ou quatre.</li>
          <li><strong>Performances médiocres :</strong> les utilisateurs signalent que l&apos;application est devenue nettement plus lente ces derniers mois, avec des blocages lors de la recherche d&apos;aliments et de l&apos;enregistrement des repas.</li>
          <li><strong>Abonnements payants :</strong> les objectifs nutritionnels personnalisés, la répartition des macronutriments par repas et les fonctionnalités avancées sont réservés à Lose It Premium. Si tu suis un régime cétogène ou riche en protéines, la version gratuite semble délibérément limitée.</li>
          <li><strong>Les pièges des abonnements :</strong> certains utilisateurs signalent des difficultés à résilier leur abonnement, le service client étant décrit comme &laquo;&nbsp;tournant en rond&nbsp;&raquo; sans résoudre les problèmes.</li>
          <li><strong>Toujours la même approche :</strong> malgré les mises à jour, l&rsquo;expérience de base reste la même : recherche dans la base de données → sélectionner une portion → enregistrer manuellement. Pour beaucoup, c&rsquo;est ce processus lui-même qui les pousse à arrêter de suivre leur alimentation.</li>
        </ul>
        <p>
          Ces problèmes ne concernent pas tout le monde. Lose It fonctionne bien pour ceux qui veulent un outil de suivi structuré et basé sur une base de données. Mais si c&apos;est le processus manuel qui te fait abandonner, une approche différente pourrait t&apos;aider à <Link href="/how-to-stay-consistent-calorie-tracking">rester assidu</Link>.
        </p>
      </ContentSection>

      <ContentSection title="Différentes approches du suivi alimentaire">
        <p>
          <strong>L&apos;approche de Lose It : enregistrement visuel avec la précision d&apos;une base de données</strong>
        </p>
        <p>
          Lose It offre une expérience colorée et ludique, basée sur la recherche dans une base de données alimentaire et la lecture de codes-barres. Tu trouves l&apos;aliment, choisis la taille de la portion, et l&apos;appli calcule tout. Ça marche bien si tu :
        </p>
        <ul>
          <li>Aimes voir tes progrès visuels pour atteindre tes objectifs quotidiens</li>
          <li>Manges beaucoup d&apos;aliments emballés avec des codes-barres</li>
          <li>Souhaites des défis communautaires et des fonctionnalités sociales</li>
          <li>N&rsquo;as pas d&rsquo;objection à passer quelques minutes par repas à enregistrer tes données</li>
        </ul>
        <p>
          <strong>L&apos;approche de Nuvvoo : la prise de conscience par la conversation</strong>
        </p>
        <p>
          Nuvvoo fait l&apos;impasse sur la base de données. Au lieu de rechercher et de sélectionner, <Link href="/chat-calorie-tracker">tu décris ton repas avec tes propres mots</Link> — comme si tu envoyais un SMS à un ami. L&apos;IA se charge de l&apos;estimation et du calcul. Cela fonctionne bien si :
        </p>
        <ul>
          <li>As arrêté Lose It parce que la saisie te semblait fastidieuse</li>
          <li>Souhaites suivre tes progrès de manière régulière sans passer plus de 5 minutes par repas</li>
          <li>Préfères parler de tes repas plutôt que de saisir des données</li>
          <li>Accordes plus d&rsquo;importance à la prise de conscience qu&rsquo;à l&rsquo;atteinte de chiffres exacts</li>
        </ul>
      </ContentSection>

      <ContentSection title="Comparaison : Lose It vs Nuvvoo">
        <div className="prose-nuvvoo">
          <table>
            <thead>
              <tr>
                <th>Fonctionnalité</th>
                <th>Lose It</th>
                <th>Nuvvoo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Méthode de saisie</td>
                <td>Recherche dans la base de données + scan de codes-barres</td>
                <td>Conversation en langage naturel</td>
              </tr>
              <tr>
                <td>Temps par saisie</td>
                <td>2 à 4 minutes</td>
                <td>30 à 60 secondes</td>
              </tr>
              <tr>
                <td>Courbe d&apos;apprentissage</td>
                <td>Modérée (naviguer dans les menus, trouver les aliments)</td>
                <td>Minimale (il suffit de décrire les repas)</td>
              </tr>
              <tr>
                <td>Limites de la version gratuite</td>
                <td>Objectifs nutritionnels verrouillés derrière l&apos;abonnement Premium</td>
                <td>Suivi complet disponible</td>
              </tr>
              <tr>
                <td>Objectif</td>
                <td>Perte de poids ludique avec des objectifs</td>
                <td>Prise de conscience et régularité</td>
              </tr>
              <tr>
                <td>Ton</td>
                <td>Axé sur la réussite, badges et séries de jours consécutifs</td>
                <td>Conversationnel, sans culpabilité</td>
              </tr>
              <tr>
                <td>Langues</td>
                <td>Anglais</td>
                <td>5 langues</td>
              </tr>
              <tr>
                <td>Idéal pour</td>
                <td>Les personnes qui aiment suivre leur alimentation de manière structurée et apprécient la gamification</td>
                <td>Les personnes qui ont arrêté d&apos;utiliser des applications de suivi à cause de difficultés</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>Quand Lose It pourrait être préférable :</strong>
        </p>
        <ul>
          <li>Tu adores la gamification, les séries de jours consécutifs et les barres de progression visuelles</li>
          <li>Tu manges principalement des aliments emballés et tu utilises la lecture de codes-barres</li>
          <li>Tu veux des défis communautaires et une responsabilisation sociale</li>
          <li>Tu as besoin d&rsquo;une intégration avec des appareils portables de fitness spécifiques</li>
        </ul>
        <p>
          <strong>Quand Nuvvoo pourrait être mieux :</strong>
        </p>
        <ul>
          <li>Tu as essayé Lose It mais tu as arrêté parce que la saisie te semblait fastidieuse</li>
          <li>Les récentes mises à jour de l&rsquo;appli ont ralenti ton flux de travail</li>
          <li>Tu ne veux pas payer pour la version Premium juste pour définir des macros personnalisées</li>
          <li>Tu cuisines à la maison et décrire tes repas est plus rapide que de chercher dans une base de données</li>
          <li>Tu préfères <Link href="/calorie-tracking-without-stress">un suivi sans stress ni culpabilité</Link>, ou tu parles une autre langue que l&apos;anglais</li>
        </ul>
      </ContentSection>

      <SeoCta
        title="Essaie une approche différente du suivi"
        description="Rejoins l'accès anticipé de Nuvvoo et découvre le suivi des calories par le dialogue plutôt que par des bases de données."
        buttonLocation="seo_loseit_alternative"
      />

      <ContentSection title="Faire le changement">
        <p>
          <strong>Ce que tu y gagnes :</strong>
        </p>
        <ul>
          <li><strong>Rapidité :</strong> les saisies via le chat prennent 30 à 60 secondes, contre la navigation dans les menus et les bases de données</li>
          <li><strong>Pas de paywall pour les fonctionnalités de base :</strong> suivi complet sans abonnement Premium pour les objectifs de macros</li>
          <li><strong>Moins de friction :</strong> pas de recherche, pas de pesée, pas de sélection de portions</li>
          <li><strong>Prise en charge multilingue :</strong> suis tes progrès en anglais, allemand, russe, espagnol ou français</li>
          <li><strong>Pas de culpabilité si tu sautes un jour :</strong> saute un jour, reviens quand tu veux — tu ne perds pas ta série</li>
        </ul>
        <p>
          <strong>Ce que tu devras laisser de côté :</strong>
        </p>
        <ul>
          <li><strong>Lecture de codes-barres :</strong> Nuvvoo n&apos;utilise pas de codes-barres (pour l&apos;instant)</li>
          <li><strong>Gamification :</strong> pas de badges, de défis ni de récompenses pour les séries</li>
          <li><strong>Fonctionnalités sociales :</strong> Nuvvoo se concentre sur le suivi personnel, pas sur la communauté</li>
          <li><strong>Contrôle précis :</strong> moins de possibilités de régler chaque ingrédient avec précision</li>
        </ul>
        <p>
          Le meilleur outil de suivi est celui que tu utiliseras réellement de manière régulière. Si l&apos;approche de Lose It te convient, continue à l&apos;utiliser. Sinon, Nuvvoo offre une expérience fondamentalement différente — plus proche d&apos;un <Link href="/ai-food-journal">journal alimentaire IA</Link> que d&apos;une recherche dans une base de données.
        </p>
      </ContentSection>
    </>
  );
}

const faqsFr = [
  {
    question: 'Nuvvoo remplace-t-il complètement Lose It ?',
    answer:
      "Cela dépend de tes besoins. Si tu comptes sur la lecture de codes-barres et les objectifs ludiques, Lose It pourrait encore mieux te convenir pour ces cas d'utilisation spécifiques. Mais si le processus de saisie lui-même te frustre, Nuvvoo offre une alternative plus rapide et plus simple, axée sur la régularité plutôt que sur la précision.",
  },
  {
    question: 'Puis-je passer de Lose It à Nuvvoo ?',
    answer:
      "Oui. Tu peux commencer à utiliser Nuvvoo dès maintenant — aucune migration de données n'est nécessaire puisque Nuvvoo construit ton profil par le biais de conversations. Certaines personnes utilisent les deux pendant une période de transition.",
  },
  {
    question: 'Nuvvoo est-il gratuit ?',
    answer:
      'Oui — Nuvvoo propose un Free Plan qui couvre les fonctionnalités de suivi de base, ainsi que des Pro Features pour qui souhaite des capacités plus avancées. Rends-toi sur nuvvoo.app pour connaître les tarifs et la disponibilité actuels.',
  },
];

/* ─── RUSSIAN BODY ─── */

function RussianBody() {
  return (
    <>
      <ContentSection title="Почему люди ищут альтернативы Lose It">
        <p>
          Lose It — это хорошо зарекомендовавший себя калькулятор калорий с лаконичным дизайном и лояльной аудиторией. Но несколько проблем заставляют людей искать что-то другое:
        </p>
        <ul>
          <li><strong>Разочарования от последних обновлений:</strong> в результате последнего редизайна к ключевым функциям, таким как кнопка &laquo;Завершить ввод&raquo; и навигация по календарю, теперь требуется больше нажатий. То, что раньше делалось одним нажатием, теперь требует трёх или четырёх.</li>
          <li><strong>Низкая производительность:</strong> пользователи отмечают, что приложение за последние месяцы заметно замедлилось — при поиске продуктов и вводе данных о еде оно зависает.</li>
          <li><strong>Платные функции:</strong> индивидуальные цели по макроэлементам, разбивка макроэлементов по каждому приёму пищи и расширенные функции доступны только в Lose It Premium. Если ты сидишь на кето-диете или высокобелковой диете, бесплатная версия кажется намеренно ограниченной.</li>
          <li><strong>Ловушки подписок:</strong> некоторые пользователи жалуются на сложности с отменой подписок, а службу поддержки описывают как &laquo;зацикленную&raquo;, которая не решает проблемы.</li>
          <li><strong>Старый подход:</strong> несмотря на обновления, основной процесс по-прежнему выглядит так: поиск в базе данных → выбор порции → ручной ввод. Для многих именно этот процесс и становится причиной, по которой они перестают вести учёт.</li>
        </ul>
        <p>
          Это не проблемы для всех. Lose It хорошо подходит тем, кто хочет структурированный трекер на основе базы данных. Но если именно ручной процесс заставляет тебя бросить, другой подход может помочь тебе <Link href="/how-to-stay-consistent-calorie-tracking">оставаться последовательным</Link>.
        </p>
      </ContentSection>

      <ContentSection title="Различные подходы к отслеживанию питания">
        <p>
          <strong>Подход Lose It: визуальный учёт с точностью базы данных</strong>
        </p>
        <p>
          Lose It предлагает красочный игровой интерфейс, построенный на поиске в базе данных продуктов и сканировании штрих-кодов. Ты находишь продукт, выбираешь размер порции, и приложение подсчитывает всё. Это хорошо работает, если ты:
        </p>
        <ul>
          <li>Любишь визуально отслеживать прогресс в достижении ежедневных целей</li>
          <li>Ешь много упакованных продуктов со штрих-кодами</li>
          <li>Хочешь участвовать в челленджах сообщества и пользоваться социальными функциями</li>
          <li>Не против тратить несколько минут на каждый приём пищи на ведение журнала</li>
        </ul>
        <p>
          <strong>Подход Nuvvoo: осознанность через общение</strong>
        </p>
        <p>
          Nuvvoo полностью обходит базу данных стороной. Вместо поиска и выбора <Link href="/chat-calorie-tracker">ты описываешь свой приём пищи своими словами</Link> — как будто пишешь SMS другу. ИИ занимается оценкой и расчётами. Это хорошо работает, если ты:
        </p>
        <ul>
          <li>Бросил Lose It, потому что ведение дневника казалось рутинной работой</li>
          <li>Хочешь вести учёт регулярно, не тратя более 5 минут на каждый приём пищи</li>
          <li>Предпочитаешь говорить о еде, а не вводить данные</li>
          <li>Ценишь осознанность больше, чем достижение точных цифр</li>
        </ul>
      </ContentSection>

      <ContentSection title="Сравнение: Lose It vs. Nuvvoo">
        <div className="prose-nuvvoo">
          <table>
            <thead>
              <tr>
                <th>Функция</th>
                <th>Lose It</th>
                <th>Nuvvoo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Способ ввода</td>
                <td>Поиск в базе данных + сканирование штрих-кода</td>
                <td>Чат на естественном языке</td>
              </tr>
              <tr>
                <td>Время на одну запись</td>
                <td>2&ndash;4 минуты</td>
                <td>30&ndash;60 секунд</td>
              </tr>
              <tr>
                <td>Кривая освоения</td>
                <td>Умеренная (навигация по меню, поиск продуктов)</td>
                <td>Минимальная (просто описываешь приёмы пищи)</td>
              </tr>
              <tr>
                <td>Ограничения бесплатной версии</td>
                <td>Цели по макроэлементам доступны только в Premium</td>
                <td>Полное отслеживание доступно</td>
              </tr>
              <tr>
                <td>Фокус</td>
                <td>Игровое похудение с целями</td>
                <td>Осознанность и постоянство</td>
              </tr>
              <tr>
                <td>Тон</td>
                <td>Ориентирован на достижения, значки и серии</td>
                <td>Разговорный, без чувства вины</td>
              </tr>
              <tr>
                <td>Языки</td>
                <td>Английский</td>
                <td>5 языков</td>
              </tr>
              <tr>
                <td>Идеально подходит для</td>
                <td>Структурированных пользователей, которым нравится геймификация</td>
                <td>Людей, которые бросили приложения из-за сложностей</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>Когда Lose It может быть лучше:</strong>
        </p>
        <ul>
          <li>Тебе нравится геймификация, серии и визуальные индикаторы прогресса</li>
          <li>Ты ешь в основном готовые продукты и сканируешь штрих-коды</li>
          <li>Тебе нужны челленджи сообщества и социальная ответственность</li>
          <li>Тебе нужна интеграция с определёнными фитнес-гаджетами</li>
        </ul>
        <p>
          <strong>Когда Nuvvoo может быть лучше:</strong>
        </p>
        <ul>
          <li>Ты пробовал Lose It, но бросил, потому что ввод данных казался утомительным</li>
          <li>Последние обновления приложения замедлили твой рабочий процесс</li>
          <li>Ты не хочешь платить за Premium только для того, чтобы настроить макросы</li>
          <li>Ты готовишь дома, и описывать блюда быстрее, чем искать их в базе данных</li>
          <li>Тебе ближе <Link href="/calorie-tracking-without-stress">отслеживание без стресса и чувства вины</Link>, или ты говоришь на языке, отличном от английского</li>
        </ul>
      </ContentSection>

      <SeoCta
        title="Попробуй другой подход к отслеживанию"
        description="Присоединяйся к раннему доступу Nuvvoo и испытай отслеживание калорий через диалог вместо баз данных."
        buttonLocation="seo_loseit_alternative"
      />

      <ContentSection title="Переход на новое приложение">
        <p>
          <strong>Что ты получишь:</strong>
        </p>
        <ul>
          <li><strong>Скорость:</strong> ввод данных через чат занимает 30&ndash;60 секунд, в отличие от навигации по меню и базам данных</li>
          <li><strong>Нет платных ограничений на базовые функции:</strong> полное отслеживание без необходимости премиум-подписки для целей по макроэлементам</li>
          <li><strong>Меньше неудобств:</strong> никаких поисков, никаких взвешиваний, никакого выбора размера порций</li>
          <li><strong>Многоязычная поддержка:</strong> веди учёт на английском, немецком, русском, испанском или французском</li>
          <li><strong>Никаких угрызений совести за пропущенные дни:</strong> пропусти день, вернись когда захочешь — серия не прервётся</li>
        </ul>
        <p>
          <strong>Чем тебе придётся пожертвовать:</strong>
        </p>
        <ul>
          <li><strong>Сканирование штрих-кодов:</strong> Nuvvoo пока не использует штрих-коды</li>
          <li><strong>Геймификация:</strong> нет значков, испытаний или наград за серию</li>
          <li><strong>Социальные функции:</strong> Nuvvoo ориентирован на личное отслеживание, а не на сообщество</li>
          <li><strong>Детальный контроль:</strong> меньше возможностей для точной настройки каждого ингредиента</li>
        </ul>
        <p>
          Лучший трекер — это тот, которым ты действительно будешь пользоваться регулярно. Если подход Lose It тебе подходит, продолжай им пользоваться. Если нет, Nuvvoo предлагает принципиально другой опыт — ближе к <Link href="/ai-food-journal">AI-дневнику питания</Link>, чем к поиску в базе данных.
        </p>
      </ContentSection>
    </>
  );
}

const faqsRu = [
  {
    question: 'Заменяет ли Nuvvoo Lose It полностью?',
    answer:
      'Это зависит от того, что тебе нужно. Если ты полагаешься на сканирование штрих-кодов и игровые цели, Lose It по-прежнему может лучше подходить тебе для этих конкретных задач. Но если тебя раздражает сам процесс ведения дневника, Nuvvoo предлагает более быструю и простую альтернативу, ориентированную на постоянство, а не на точность.',
  },
  {
    question: 'Могу ли я перейти с Lose It на Nuvvoo?',
    answer:
      'Да. Ты можешь начать использовать Nuvvoo прямо сейчас — перенос данных не требуется, так как Nuvvoo создаёт твой профиль на основе разговора. Некоторые люди используют обе программы в переходный период.',
  },
  {
    question: 'Nuvvoo бесплатен?',
    answer:
      'Да — у Nuvvoo есть Free Plan с основными функциями отслеживания, а также Pro Features для тех, кому нужны расширенные возможности. Проверь nuvvoo.app, чтобы узнать текущие цены и доступность.',
  },
];
