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

type Props = { params: Promise<{ locale: string }> };

// Locales with a real translation of this article. Others fall back to EN
// content and keep the parent layout's noindex until translated.
const TRANSLATED_LOCALES = new Set(['en', 'es']);

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const en = {
    title: 'Best Lose It Alternative 2026 — Track Calories Without the Hassle | Nuvvoo',
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
      'La mejor alternativa a Lose It en 2026: controla tus calorías sin complicaciones | Nuvvoo',
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

  const copy = locale === 'es' ? es : en;
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

  const h1 = isSpanish
    ? 'La mejor alternativa a Lose It en 2026: controla tus calorías sin complicaciones'
    : 'Best Lose It Alternative 2026: Track Calories Without the Hassle';

  const subtitle = isSpanish
    ? 'Lose It ha sido un buen controlador de calorías durante años, pero las últimas actualizaciones han dejado a muchos usuarios frustrados. Si pasas más tiempo navegando por los menús que controlando realmente lo que comes, tal vez sea hora de buscar un enfoque más sencillo. Nuvvoo reemplaza las búsquedas en la base de datos y la entrada manual con una sola idea: simplemente envía un mensaje de texto con lo que comiste.'
    : 'Lose It has been a solid calorie tracker for years, but recent updates have left many users frustrated. If you’re spending more time navigating menus than actually tracking food, it might be time for a simpler approach. Nuvvoo replaces database searches and manual entry with a single idea: just text what you ate.';

  const imageAlt = isSpanish
    ? 'Nuvvoo da la bienvenida a un nuevo usuario — una alternativa más amigable al seguimiento de calorías de Lose It'
    : 'Nuvvoo welcoming a new user — a friendlier alternative to Lose It calorie tracking';

  const faqs = isSpanish ? faqsEs : faqsEn;

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
            {isSpanish ? <SpanishBody /> : <EnglishBody />}

            <div className="my-12 flex flex-col items-center gap-4 text-center">
              <AppStoreBadge buttonLocation="seo_loseit_alternative" />
            </div>

            <FaqSection faqs={faqs} />
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
      'Nuvvoo is currently in early access. Check nuvvoo.app for current pricing and availability.',
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
      'Nuvvoo ofrece acceso anticipado. Visita nuvvoo.app para conocer los precios y la disponibilidad actuales.',
  },
];
