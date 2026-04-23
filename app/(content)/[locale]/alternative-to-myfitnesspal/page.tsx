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

// Locales with a real translation of this article. Others fall back to EN content
// and keep the parent layout's noindex until translated.
const TRANSLATED_LOCALES = new Set(['en', 'es', 'fr', 'de', 'ru']);

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const en = {
    title: 'Best MyFitnessPal Alternative 2026 — Just Text What You Ate | Nuvvoo',
    description:
      'Tired of searching databases and weighing portions? Nuvvoo tracks calories through chat — describe your meal, get calories in seconds. Works in 5 languages.',
    ogDescription:
      'Tired of searching databases and weighing portions? Nuvvoo tracks calories through chat — describe your meal, get calories in seconds. Works in 5 languages.',
  };
  const es = {
    title: 'Alternativa a MyFitnessPal: lleva un registro chateando, sin anotar nada',
    description:
      '¿Buscas una forma más fácil de llevar un registro de lo que comes? Nuvvoo es una alternativa a MyFitnessPal que usa la conversación con IA para registrar tus comidas rápidamente, sin búsquedas en bases de datos ni entradas manuales.',
    ogDescription:
      'Una alternativa a MyFitnessPal que usa la conversación con IA para hacer el seguimiento de calorías más rápido y fácil.',
  };
  const fr = {
    title: "Une alternative à MyFitnessPal : suis ton alimentation par chat, sans saisie manuelle",
    description:
      "Tu cherches un moyen plus simple de suivre ton alimentation ? Nuvvoo est une alternative à MyFitnessPal qui utilise l'IA conversationnelle pour enregistrer tes repas rapidement, sans recherche dans une base de données ni saisie manuelle.",
    ogDescription:
      "Une alternative à MyFitnessPal qui utilise l'IA conversationnelle pour rendre le suivi des calories plus rapide et plus simple.",
  };
  const de = {
    title: 'MyFitnessPal-Alternative: Erfassen durch Chatten statt Eintragen',
    description:
      'Suchst du nach einer einfacheren Möglichkeit, deine Ernährung zu erfassen? Nuvvoo ist eine MyFitnessPal-Alternative, die mit KI-Konversationen dabei hilft, Mahlzeiten schnell zu erfassen – ohne Datenbankrecherchen, ohne manuelle Eingabe.',
    ogDescription:
      'Eine MyFitnessPal-Alternative, die mit KI-Konversationen das Kalorien-Tracking schneller und einfacher macht.',
  };
  const ru = {
    title: 'Альтернатива MyFitnessPal: отслеживай питание через чат, а не через ввод данных',
    description:
      'Ищешь более простой способ отслеживать питание? Nuvvoo — это альтернатива MyFitnessPal, которая использует AI для общения, чтобы помочь тебе быстро регистрировать приёмы пищи: без поиска в базе данных и ручного ввода.',
    ogDescription:
      'Альтернатива MyFitnessPal, которая использует AI-разговор, чтобы сделать подсчёт калорий быстрее и проще.',
  };

  const copy =
    locale === 'es'
      ? es
      : locale === 'fr'
        ? fr
        : locale === 'de'
          ? de
          : locale === 'ru'
            ? ru
            : en;
  const isTranslated = TRANSLATED_LOCALES.has(locale);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nuvvoo.app';
  const slug = 'alternative-to-myfitnesspal';
  const canonical =
    locale === routing.defaultLocale
      ? `${siteUrl}/${slug}`
      : `${siteUrl}/${locale}/${slug}`;

  const languages: Record<string, string> = {
    'x-default': `${siteUrl}/${slug}`,
  };
  for (const loc of routing.locales) {
    languages[loc] =
      loc === routing.defaultLocale
        ? `${siteUrl}/${slug}`
        : `${siteUrl}/${loc}/${slug}`;
  }

  const base: Metadata = {
    title: copy.title,
    description: copy.description,
    openGraph: {
      title: copy.title,
      description: copy.ogDescription,
      type: 'article',
      url: canonical,
    },
    alternates: {
      canonical,
      languages,
    },
  };

  // Only set robots when translated; otherwise inherit layout's noindex.
  if (isTranslated) {
    base.robots = { index: true, follow: true };
  }
  return base;
}

export default async function AlternativeToMyFitnessPal({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isSpanish = locale === 'es';
  const isFrench = locale === 'fr';
  const isGerman = locale === 'de';
  const isRussian = locale === 'ru';

  const h1 = isSpanish
    ? 'Alternativa a MyFitnessPal: lleva un registro chateando, sin anotar nada'
    : isFrench
      ? "Une alternative à MyFitnessPal : suis ton alimentation par chat, sans saisie manuelle"
      : isGerman
        ? 'MyFitnessPal-Alternative: Erfassen durch Chatten statt Eintragen'
        : isRussian
          ? 'Альтернатива MyFitnessPal: отслеживай питание через чат, а не через ввод данных'
          : 'Best MyFitnessPal Alternative 2026: Just Text What You Ate';

  const subtitle = isSpanish
    ? '¿Buscas una forma más fácil de llevar un registro de lo que comes? Nuvvoo es una alternativa a MyFitnessPal que usa la conversación con IA para ayudarte a registrar tus comidas rápidamente, sin búsquedas en bases de datos ni entradas manuales.'
    : isFrench
      ? "Tu cherches un moyen plus simple de suivre ton alimentation ? Nuvvoo est une alternative à MyFitnessPal qui utilise l'IA conversationnelle pour t'aider à enregistrer tes repas rapidement — pas besoin de chercher dans une base de données ni de saisir quoi que ce soit manuellement."
      : isGerman
        ? 'Suchst du nach einer einfacheren Möglichkeit, deine Ernährung zu erfassen? Nuvvoo ist eine MyFitnessPal-Alternative, die mit KI-Konversationen dabei hilft, Mahlzeiten schnell zu erfassen – ohne Datenbankrecherchen, ohne manuelle Eingabe.'
        : isRussian
          ? 'Ищешь более простой способ отслеживать питание? Nuvvoo — это альтернатива MyFitnessPal, которая использует AI для общения, чтобы помочь тебе быстро регистрировать приёмы пищи: без поиска в базе данных и ручного ввода.'
          : "Tired of spending 5 minutes logging every meal? Nuvvoo is a MyFitnessPal alternative built around one idea: just describe what you ate, like you'd text a friend. The AI handles the rest — calories, macros, tracking. In 5 languages.";

  const imageAlt = isSpanish
    ? 'Nuvvoo sugiriendo alternativas saludables para la cena'
    : isFrench
      ? 'Nuvvoo suggère des alternatives saines pour le dîner'
      : isGerman
        ? 'Nuvvoo schlägt gesunde Alternativen zum Abendessen vor'
        : isRussian
          ? 'Nuvvoo предлагает здоровые варианты на ужин'
          : 'Nuvvoo suggesting healthy dinner alternatives';

  const faqs = isSpanish
    ? faqsEs
    : isFrench
      ? faqsFr
      : isGerman
        ? faqsDe
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
                src="/illustrations/scene-04-dinner-choices.webp"
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
            ) : isFrench ? (
              <FrenchBody />
            ) : isGerman ? (
              <GermanBody />
            ) : isRussian ? (
              <RussianBody />
            ) : (
              <EnglishBody />
            )}

            <div className="my-12 flex flex-col items-center gap-4 text-center">
              <AppStoreBadge buttonLocation="seo_mfp_alternative" />
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
      <ContentSection title="Why People Seek MyFitnessPal Alternatives">
        <p>
          MyFitnessPal is one of the most popular calorie tracking apps, with millions of users and a comprehensive food database. So why do people look for alternatives?
        </p>
        <p>
          <strong>Common frustrations with MyFitnessPal:</strong>
        </p>
        <ul>
          <li><strong>Overwhelming database:</strong> Searching through hundreds of entries for a single food item can take minutes</li>
          <li><strong>Time-consuming logging:</strong> Manually entering every ingredient, especially for home-cooked meals, feels tedious</li>
          <li><strong>Inconsistent data quality:</strong> User-submitted entries often have errors or outdated information</li>
          <li><strong>Interface complexity:</strong> The app has many features, but navigating them can feel cluttered</li>
          <li><strong>Tracking fatigue:</strong> The manual process creates friction, leading to inconsistent use</li>
          <li><strong>Ads and upsells:</strong> Free version includes frequent ads and prompts to upgrade</li>
        </ul>
        <p>
          These aren&apos;t dealbreakers for everyone. Many people successfully use MyFitnessPal long-term. But for those who value <strong>speed and simplicity</strong> over database precision, alternatives focused on reducing friction make tracking more sustainable.
        </p>
        <p>
          <a href="https://www.businessofapps.com/data/health-fitness-app-benchmarks/" target="_blank" rel="noopener noreferrer" className="text-nuvvooGreen-700 underline hover:text-nuvvooGreen-900">Industry data</a> suggests that most health and fitness apps see significant user drop-off in the first 30 days. The main reason? The tracking method itself becomes a barrier. When logging feels like work, consistency suffers.
        </p>
      </ContentSection>

      <ContentSection title="Different Approaches to Food Tracking">
        <p>
          Not all calorie trackers are built the same. The tool you choose should match your tracking philosophy and lifestyle.
        </p>
        <p>
          <strong>MyFitnessPal&apos;s approach: Precision through databases</strong>
        </p>
        <p>
          MyFitnessPal gives you control. You search a massive database, choose the exact entry that matches your food, and specify portion sizes. This works well if you:
        </p>
        <ul>
          <li>Need precise macro tracking for athletic or medical reasons</li>
          <li>Prefer having control over every data point</li>
          <li>Eat many packaged foods with barcodes</li>
          <li>Have time to search databases and weigh portions</li>
        </ul>
        <p>
          <strong>Nuvvoo&apos;s approach: Awareness through conversation</strong>
        </p>
        <p>
          Nuvvoo prioritizes ease and consistency over precision. Instead of searching databases, you <Link href="/chat-calorie-tracker">chat about what you ate</Link>. The AI handles estimation and calculation. This works well if you:
        </p>
        <ul>
          <li>Want to track consistently without spending 5+ minutes per meal</li>
          <li>Value building awareness over hitting exact numbers</li>
          <li>Prefer talking about meals rather than entering data</li>
          <li>Struggle with tracking fatigue and want a lighter approach</li>
        </ul>
        <p>
          Neither approach is &ldquo;better&rdquo;&mdash;they serve different needs. Precision trackers need tools like MyFitnessPal. Consistency-focused users often prefer <Link href="/calorie-tracking-without-stress">simpler, stress-free tracking</Link>.
        </p>
      </ContentSection>

      <ContentSection title="Comparison: Database vs. Conversation">
        <p>
          Here&apos;s how the two approaches compare in practice:
        </p>
        <div className="prose-nuvvoo">
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>MyFitnessPal</th>
                <th>Nuvvoo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Input Method</td>
                <td>Database search + manual entry</td>
                <td>Natural language chat</td>
              </tr>
              <tr>
                <td>Learning Curve</td>
                <td>Moderate (learn database navigation)</td>
                <td>Minimal (just describe meals)</td>
              </tr>
              <tr>
                <td>Time per entry</td>
                <td>2-5 minutes (depending on meal complexity)</td>
                <td>30-60 seconds (via conversation)</td>
              </tr>
              <tr>
                <td>Focus</td>
                <td>Precision tracking &amp; detailed macros</td>
                <td>Awareness &amp; consistency</td>
              </tr>
              <tr>
                <td>Food Database</td>
                <td>14+ million foods, barcode scanning</td>
                <td>AI-powered recognition (no database search)</td>
              </tr>
              <tr>
                <td>Ideal For</td>
                <td>Athletes, bodybuilders, precision trackers</td>
                <td>Busy people, inconsistent trackers, beginners</td>
              </tr>
              <tr>
                <td>Tone</td>
                <td>Data-focused, neutral</td>
                <td>Conversational, supportive</td>
              </tr>
              <tr>
                <td>Flexibility</td>
                <td>High control, requires detail</td>
                <td>High flexibility, accepts estimates</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>When MyFitnessPal might be better:</strong>
        </p>
        <ul>
          <li>You&apos;re training for competitive sports or bodybuilding</li>
          <li>You need precise macro targets (e.g., 150g protein daily)</li>
          <li>You eat many packaged foods with barcodes</li>
          <li>You prefer seeing granular nutritional details</li>
        </ul>
        <p>
          <strong>When Nuvvoo might be better:</strong>
        </p>
        <ul>
          <li>You&apos;ve tried MyFitnessPal but quit due to tracking fatigue</li>
          <li>You want awareness without obsessing over exact numbers</li>
          <li>You value speed and simplicity over database precision</li>
          <li>You prefer conversational interfaces to form-based logging</li>
          <li>You have a history of <Link href="/calorie-tracker-eating-disorders">disordered eating triggered by calorie apps</Link></li>
        </ul>
        <p>
          Both tools have their place. The best tracker is the one you&apos;ll actually use consistently.
        </p>
      </ContentSection>

      <SeoCta
        title="Try a different approach to tracking"
        description="Join Nuvvoo's early access and experience calorie tracking through conversation instead of databases."
      />

      <ContentSection title="Making the Switch">
        <p>
          If you&apos;re considering switching from MyFitnessPal to Nuvvoo, or trying both to see what works, here&apos;s what to expect:
        </p>
        <p>
          <strong>What you&apos;ll gain:</strong>
        </p>
        <ul>
          <li><strong>Faster logging:</strong> Chat-based entries take 30-60 seconds vs. 3-5 minutes of database searching</li>
          <li><strong>Less friction:</strong> No need to search, weigh, or calculate&mdash;just describe what you ate</li>
          <li><strong>Lower stress:</strong> Estimates are encouraged, removing perfectionism pressure</li>
          <li><strong>Better consistency:</strong> Easier tracking often leads to more consistent use</li>
          <li><strong>Conversational support:</strong> The AI responds like a companion, not a data form</li>
        </ul>
        <p>
          <strong>What you&apos;ll trade off:</strong>
        </p>
        <ul>
          <li><strong>Database precision:</strong> No searching for exact brand-name entries</li>
          <li><strong>Barcode scanning:</strong> Nuvvoo doesn&apos;t use barcodes (yet)</li>
          <li><strong>Granular control:</strong> Less ability to fine-tune every ingredient</li>
          <li><strong>Community features:</strong> MyFitnessPal has forums and social tracking; Nuvvoo focuses on personal journaling</li>
        </ul>
        <p>
          You don&apos;t have to commit to one approach forever. Some people use MyFitnessPal during focused training periods and switch to Nuvvoo for everyday maintenance. Others use Nuvvoo as their primary tracker and only open MyFitnessPal when they need detailed macro breakdowns.
        </p>
        <p>
          The goal isn&apos;t to find the &ldquo;perfect&rdquo; tracker. It&apos;s to find the one that helps you <strong>stay consistent without burning out</strong>.
        </p>
        <p>
          If you&apos;re curious about Nuvvoo&apos;s approach, you can also explore how it functions as an <Link href="/ai-food-journal">AI food journal</Link> that combines tracking with holistic health awareness. Or see how it helps when you&apos;re <Link href="/no-dinner-ideas-calories">stuck with no dinner ideas and a calorie goal to hit</Link>.
        </p>
      </ContentSection>
    </>
  );
}

const faqsEn = [
  {
    question: 'Does Nuvvoo replace MyFitnessPal entirely?',
    answer:
      "It depends on your needs. If you want detailed macro tracking, barcode scanning, and a massive food database, MyFitnessPal remains a strong choice. If you want easier, faster tracking through conversation with less friction, Nuvvoo offers a different approach. Some people use both—MyFitnessPal for precision tracking days, Nuvvoo for everyday consistency.",
  },
  {
    question: 'Can I switch from another calorie tracker?',
    answer:
      "Yes. You can start using Nuvvoo at any time without losing your tracking habit. There's no data import from other apps, but since Nuvvoo focuses on building new patterns through conversation, you don't need your old data. Just start chatting about your meals, and the AI will learn your habits quickly.",
  },
  {
    question: 'Is Nuvvoo free?',
    answer:
      'Nuvvoo is currently in early access. Pricing details will be announced closer to launch. Our goal is to offer a free tier that makes tracking accessible, with premium features for users who want advanced insights and personalization.',
  },
];

/* ─── SPANISH BODY ─── */

function SpanishBody() {
  return (
    <>
      <ContentSection title="Por qué la gente busca alternativas a MyFitnessPal">
        <p>
          MyFitnessPal es una de las apps de control de calorías más populares, con millones de usuarios y una base de datos de alimentos muy completa. Entonces, ¿por qué la gente busca alternativas?
        </p>
        <p>
          <strong>Frustraciones comunes con MyFitnessPal:</strong>
        </p>
        <ul>
          <li><strong>Base de datos abrumadora:</strong> buscar un solo alimento entre cientos de entradas puede llevar varios minutos</li>
          <li><strong>Registro que lleva mucho tiempo:</strong> ingresar manualmente cada ingrediente, sobre todo en las comidas caseras, resulta tedioso</li>
          <li><strong>Calidad de datos inconsistente:</strong> las entradas enviadas por los usuarios suelen tener errores o información desactualizada</li>
          <li><strong>Complejidad de la interfaz:</strong> la app tiene muchas funciones, pero navegar por ellas puede resultar confuso</li>
          <li><strong>Fatiga de llevar un registro:</strong> el proceso manual crea fricción, lo que lleva a un uso inconsistente</li>
          <li><strong>Anuncios y ventas adicionales:</strong> la versión gratuita incluye anuncios frecuentes y mensajes para pasarte a la versión de pago</li>
        </ul>
        <p>
          Esto no es un impedimento para todo el mundo. Mucha gente usa MyFitnessPal con éxito a largo plazo. Pero para quienes valoran la <strong>rapidez y la simplicidad</strong> por encima de la precisión de la base de datos, las alternativas enfocadas en reducir la fricción hacen que el seguimiento sea más sostenible.
        </p>
        <p>
          <a href="https://www.businessofapps.com/data/health-fitness-app-benchmarks/" target="_blank" rel="noopener noreferrer" className="text-nuvvooGreen-700 underline hover:text-nuvvooGreen-900">Los datos de la industria</a> sugieren que la mayoría de las apps de salud y fitness ven una caída significativa de usuarios en los primeros 30 días. ¿La razón principal? El método de seguimiento en sí mismo se convierte en una barrera. Cuando registrar lo que comes se siente como un trabajo, la constancia se resiente.
        </p>
      </ContentSection>

      <ContentSection title="Diferentes enfoques para el seguimiento de alimentos">
        <p>
          No todos los rastreadores de calorías están diseñados igual. La herramienta que elijas debe coincidir con tu filosofía de seguimiento y tu estilo de vida.
        </p>
        <p>
          <strong>El enfoque de MyFitnessPal: precisión a través de bases de datos</strong>
        </p>
        <p>
          MyFitnessPal te da el control. Buscas en una enorme base de datos, eliges la entrada exacta que coincide con tu comida y especificas el tamaño de las porciones. Esto funciona bien si:
        </p>
        <ul>
          <li>Necesitas un seguimiento preciso de macronutrientes por razones deportivas o médicas</li>
          <li>Prefieres tener control sobre cada dato</li>
          <li>Comes muchos alimentos envasados con códigos de barras</li>
          <li>Tienes tiempo para buscar en bases de datos y pesar las porciones</li>
        </ul>
        <p>
          <strong>El enfoque de Nuvvoo: conciencia a través de la conversación</strong>
        </p>
        <p>
          Nuvvoo prioriza la facilidad y la constancia por encima de la precisión. En lugar de buscar en bases de datos, <Link href="/chat-calorie-tracker">chateas sobre lo que comiste</Link>. La IA se encarga de la estimación y el cálculo. Esto funciona bien si:
        </p>
        <ul>
          <li>Quieres llevar un registro constante sin dedicar más de 5 minutos por comida</li>
          <li>Valoras crear conciencia más que alcanzar números exactos</li>
          <li>Prefieres hablar de las comidas en lugar de ingresar datos</li>
          <li>Te cuesta llevar un registro y quieres un enfoque más sencillo</li>
        </ul>
        <p>
          Ningún enfoque es «mejor»: satisfacen necesidades diferentes. Quienes buscan precisión necesitan herramientas como MyFitnessPal. Los usuarios que se centran en la constancia suelen preferir un <Link href="/calorie-tracking-without-stress">seguimiento más sencillo y sin estrés</Link>.
        </p>
      </ContentSection>

      <ContentSection title="Comparación: base de datos vs. conversación">
        <p>
          Así es como se comparan los dos enfoques en la práctica:
        </p>
        <div className="prose-nuvvoo">
          <table>
            <thead>
              <tr>
                <th>Característica</th>
                <th>MyFitnessPal</th>
                <th>Nuvvoo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Método de entrada</td>
                <td>Búsqueda en la base de datos + entrada manual</td>
                <td>Chat en lenguaje natural</td>
              </tr>
              <tr>
                <td>Curva de aprendizaje</td>
                <td>Moderada (aprender a navegar por la base de datos)</td>
                <td>Mínima (solo describir las comidas)</td>
              </tr>
              <tr>
                <td>Tiempo por entrada</td>
                <td>2-5 minutos (según la complejidad de la comida)</td>
                <td>30-60 segundos (a través de la conversación)</td>
              </tr>
              <tr>
                <td>Enfoque</td>
                <td>Seguimiento preciso y macros detalladas</td>
                <td>Conciencia y constancia</td>
              </tr>
              <tr>
                <td>Base de datos de alimentos</td>
                <td>Más de 14 millones de alimentos, escaneo de códigos de barras</td>
                <td>Reconocimiento impulsado por IA (sin búsqueda en la base de datos)</td>
              </tr>
              <tr>
                <td>Ideal para</td>
                <td>Atletas, culturistas, usuarios que buscan un seguimiento preciso</td>
                <td>Personas ocupadas, usuarios inconsistentes, principiantes</td>
              </tr>
              <tr>
                <td>Tono</td>
                <td>Centrado en los datos, neutral</td>
                <td>Conversacional, de apoyo</td>
              </tr>
              <tr>
                <td>Flexibilidad</td>
                <td>Alto control, requiere detalles</td>
                <td>Alta flexibilidad, acepta estimaciones</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>Cuándo MyFitnessPal podría ser mejor:</strong>
        </p>
        <ul>
          <li>Estás entrenando para deportes de competición o culturismo</li>
          <li>Necesitas objetivos de macros precisos (p.&nbsp;ej., 150&nbsp;g de proteína al día)</li>
          <li>Consumes muchos alimentos envasados con códigos de barras</li>
          <li>Prefieres ver detalles nutricionales pormenorizados</li>
        </ul>
        <p>
          <strong>Cuándo Nuvvoo podría ser mejor:</strong>
        </p>
        <ul>
          <li>Has probado MyFitnessPal pero lo dejaste por agotamiento de llevar el registro</li>
          <li>Quieres estar al tanto sin obsesionarte con los números exactos</li>
          <li>Valoras la rapidez y la simplicidad por encima de la precisión de las bases de datos</li>
          <li>Prefieres las interfaces conversacionales al registro mediante formularios</li>
          <li>Tienes <Link href="/calorie-tracker-eating-disorders">antecedentes de trastornos alimentarios provocados por aplicaciones de calorías</Link></li>
        </ul>
        <p>
          Ambas herramientas tienen su lugar. El mejor registro es el que realmente usarás de manera constante.
        </p>
      </ContentSection>

      <SeoCta
        title="Prueba un enfoque diferente para el registro"
        description="Únete al acceso anticipado de Nuvvoo y experimenta el registro de calorías a través de la conversación, no de bases de datos."
      />

      <ContentSection title="Hacer el cambio">
        <p>
          Si estás pensando en cambiar de MyFitnessPal a Nuvvoo, o en probar ambas para ver cuál te funciona mejor, esto es lo que puedes esperar:
        </p>
        <p>
          <strong>Lo que ganarás:</strong>
        </p>
        <ul>
          <li><strong>Registro más rápido:</strong> las entradas por chat tardan entre 30 y 60 segundos, frente a los 3-5 minutos de búsqueda en una base de datos</li>
          <li><strong>Menos complicaciones:</strong> no hay que buscar, pesar ni calcular; solo describe lo que comiste</li>
          <li><strong>Menos estrés:</strong> se fomentan las estimaciones, lo que elimina la presión del perfeccionismo</li>
          <li><strong>Mayor constancia:</strong> un seguimiento más sencillo suele llevar a un uso más constante</li>
          <li><strong>Asistencia conversacional:</strong> la IA responde como un compañero, no como un formulario de datos</li>
        </ul>
        <p>
          <strong>Lo que perderás:</strong>
        </p>
        <ul>
          <li><strong>Precisión de la base de datos:</strong> no hay búsqueda de entradas con marcas exactas</li>
          <li><strong>Escaneo de códigos de barras:</strong> Nuvvoo no usa códigos de barras (todavía)</li>
          <li><strong>Control granular:</strong> menos capacidad para ajustar cada ingrediente</li>
          <li><strong>Funciones comunitarias:</strong> MyFitnessPal tiene foros y seguimiento social; Nuvvoo se enfoca en el diario personal</li>
        </ul>
        <p>
          No tienes que comprometerte con un enfoque para siempre. Algunas personas usan MyFitnessPal durante períodos de entrenamiento intensivo y cambian a Nuvvoo para el mantenimiento diario. Otras usan Nuvvoo como su rastreador principal y solo abren MyFitnessPal cuando necesitan desgloses detallados de macronutrientes.
        </p>
        <p>
          El objetivo no es encontrar el rastreador «perfecto». Es encontrar el que te ayude a <strong>mantener la constancia sin agotarte</strong>.
        </p>
        <p>
          Si tienes curiosidad por el enfoque de Nuvvoo, también puedes explorar cómo funciona como un <Link href="/ai-food-journal">diario de alimentación con IA</Link> que combina el seguimiento con una conciencia holística de la salud. O ver cómo te ayuda cuando estás <Link href="/no-dinner-ideas-calories">atascado sin ideas para la cena y con un objetivo de calorías que alcanzar</Link>.
        </p>
      </ContentSection>
    </>
  );
}

const faqsEs = [
  {
    question: '¿Reemplaza Nuvvoo a MyFitnessPal por completo?',
    answer:
      'Depende de tus necesidades. Si quieres un seguimiento detallado de macronutrientes, escaneo de códigos de barras y una enorme base de datos de alimentos, MyFitnessPal sigue siendo una excelente opción. Si prefieres un seguimiento más fácil y rápido a través de una conversación con menos fricción, Nuvvoo ofrece un enfoque diferente. Algunas personas usan ambas: MyFitnessPal para los días de seguimiento de precisión y Nuvvoo para la constancia diaria.',
  },
  {
    question: '¿Puedo cambiar desde otro rastreador de calorías?',
    answer:
      'Sí. Puedes empezar a usar Nuvvoo en cualquier momento sin perder tu hábito de seguimiento. No se pueden importar datos de otras apps, pero como Nuvvoo se enfoca en crear nuevos patrones a través de la conversación, no necesitas tus datos antiguos. Solo empieza a charlar sobre tus comidas y la IA aprenderá tus hábitos rápidamente.',
  },
  {
    question: '¿Es Nuvvoo gratis?',
    answer:
      'Nuvvoo está actualmente en acceso anticipado. Los detalles de precios se anunciarán más cerca del lanzamiento. Nuestro objetivo es ofrecer un plan gratuito que haga accesible el seguimiento, con funciones premium para los usuarios que quieran información avanzada y personalización.',
  },
];

/* ─── FRENCH BODY ─── */

function FrenchBody() {
  return (
    <>
      <ContentSection title="Pourquoi les gens cherchent-ils des alternatives à MyFitnessPal">
        <p>
          MyFitnessPal est l&apos;une des applications de suivi des calories les plus populaires, avec des millions d&apos;utilisateurs et une base de données alimentaire complète. Alors pourquoi les gens cherchent-ils des alternatives ?
        </p>
        <p>
          <strong>Frustrations courantes avec MyFitnessPal :</strong>
        </p>
        <ul>
          <li><strong>Une base de données écrasante :</strong> chercher un seul aliment parmi des centaines d&apos;entrées peut prendre plusieurs minutes</li>
          <li><strong>Une saisie chronophage :</strong> saisir manuellement chaque ingrédient, surtout pour les repas faits maison, est fastidieux</li>
          <li><strong>Qualité des données inégale :</strong> les entrées soumises par les utilisateurs contiennent souvent des erreurs ou des informations obsolètes</li>
          <li><strong>Complexité de l&apos;interface :</strong> l&apos;appli propose de nombreuses fonctionnalités, mais la navigation peut sembler encombrée</li>
          <li><strong>Fatigue liée au suivi :</strong> le processus manuel crée des frictions, ce qui conduit à une utilisation irrégulière</li>
          <li><strong>Publicités et incitations à l&apos;achat :</strong> la version gratuite inclut des publicités fréquentes et des invites à passer à la version supérieure</li>
        </ul>
        <p>
          Ce ne sont pas des éléments rédhibitoires pour tout le monde. Beaucoup de gens utilisent MyFitnessPal avec succès sur le long terme. Mais pour ceux qui privilégient la <strong>rapidité et la simplicité</strong> à la précision des données, des alternatives visant à réduire les obstacles rendent le suivi plus tenable.
        </p>
        <p>
          <a href="https://www.businessofapps.com/data/health-fitness-app-benchmarks/" target="_blank" rel="noopener noreferrer" className="text-nuvvooGreen-700 underline hover:text-nuvvooGreen-900">Les données du secteur</a> indiquent que la plupart des applications de santé et de fitness enregistrent une baisse significative du nombre d&apos;utilisateurs au cours des 30 premiers jours. La raison principale ? La méthode de suivi elle-même devient un obstacle. Quand la saisie ressemble à une corvée, la régularité en pâtit.
        </p>
      </ContentSection>

      <ContentSection title="Différentes approches du suivi alimentaire">
        <p>
          Tous les outils de suivi des calories ne se valent pas. L&apos;outil que tu choisis doit correspondre à ta philosophie de suivi et à ton mode de vie.
        </p>
        <p>
          <strong>L&apos;approche de MyFitnessPal : la précision grâce aux bases de données</strong>
        </p>
        <p>
          MyFitnessPal te donne le contrôle. Tu effectues une recherche dans une immense base de données, tu choisis l&apos;entrée exacte qui correspond à ton aliment et tu précises la taille des portions. Cela fonctionne bien si :
        </p>
        <ul>
          <li>Tu as besoin d&apos;un suivi précis des macros pour des raisons sportives ou médicales</li>
          <li>Tu préfères avoir le contrôle sur chaque donnée</li>
          <li>Tu manges beaucoup d&apos;aliments emballés avec des codes-barres</li>
          <li>Tu as le temps de faire des recherches dans les bases de données et de peser les portions</li>
        </ul>
        <p>
          <strong>L&apos;approche de Nuvvoo : la prise de conscience par la conversation</strong>
        </p>
        <p>
          Nuvvoo privilégie la simplicité et la régularité plutôt que la précision. Au lieu de faire des recherches dans des bases de données, tu <Link href="/chat-calorie-tracker">discutes de ce que tu as mangé</Link>. L&apos;IA se charge de l&apos;estimation et du calcul. Cela fonctionne bien si :
        </p>
        <ul>
          <li>Tu veux suivre ton alimentation de manière régulière sans passer plus de 5 minutes par repas</li>
          <li>Tu privilégies la prise de conscience plutôt que l&apos;atteinte de chiffres exacts</li>
          <li>Tu préfères parler de tes repas plutôt que de saisir des données</li>
          <li>Tu as du mal à suivre ton alimentation et tu souhaites une approche plus légère</li>
        </ul>
        <p>
          Aucune approche n&apos;est «&nbsp;meilleure&nbsp;» : elles répondent à des besoins différents. Les adeptes de la précision ont besoin d&apos;outils comme MyFitnessPal. Les utilisateurs axés sur la régularité préfèrent souvent un <Link href="/calorie-tracking-without-stress">suivi plus simple et sans stress</Link>.
        </p>
      </ContentSection>

      <ContentSection title="Comparaison : base de données vs conversation">
        <p>
          Voici comment les deux approches se comparent dans la pratique :
        </p>
        <div className="prose-nuvvoo">
          <table>
            <thead>
              <tr>
                <th>Fonctionnalité</th>
                <th>MyFitnessPal</th>
                <th>Nuvvoo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Méthode de saisie</td>
                <td>Recherche dans la base de données + saisie manuelle</td>
                <td>Discussion en langage naturel</td>
              </tr>
              <tr>
                <td>Courbe d&apos;apprentissage</td>
                <td>Modérée (apprendre à naviguer dans la base de données)</td>
                <td>Minime (il suffit de décrire les repas)</td>
              </tr>
              <tr>
                <td>Temps par saisie</td>
                <td>2 à 5 minutes (selon la complexité du repas)</td>
                <td>30 à 60 secondes (via la conversation)</td>
              </tr>
              <tr>
                <td>Priorité</td>
                <td>Suivi précis et macros détaillées</td>
                <td>Prise de conscience et régularité</td>
              </tr>
              <tr>
                <td>Base de données alimentaire</td>
                <td>Plus de 14 millions d&apos;aliments, lecture de codes-barres</td>
                <td>Reconnaissance par IA (pas de recherche dans la base de données)</td>
              </tr>
              <tr>
                <td>Idéal pour</td>
                <td>Athlètes, culturistes, adeptes du suivi précis</td>
                <td>Personnes très occupées, adeptes du suivi irrégulier, débutants</td>
              </tr>
              <tr>
                <td>Ton</td>
                <td>Axé sur les données, neutre</td>
                <td>Conversationnel, encourageant</td>
              </tr>
              <tr>
                <td>Flexibilité</td>
                <td>Contrôle élevé, nécessite des détails</td>
                <td>Grande flexibilité, accepte les estimations</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>Quand MyFitnessPal pourrait être préférable :</strong>
        </p>
        <ul>
          <li>Tu t&apos;entraînes pour des sports de compétition ou la musculation</li>
          <li>Tu as besoin d&apos;objectifs macro précis (par ex., 150&nbsp;g de protéines par jour)</li>
          <li>Tu manges beaucoup d&apos;aliments emballés avec des codes-barres</li>
          <li>Tu préfères voir des détails nutritionnels précis</li>
        </ul>
        <p>
          <strong>Quand Nuvvoo pourrait être préférable :</strong>
        </p>
        <ul>
          <li>Tu as essayé MyFitnessPal mais tu as arrêté à cause de la fatigue liée au suivi</li>
          <li>Tu veux être conscient de ce que tu manges sans te focaliser sur les chiffres exacts</li>
          <li>Tu privilégies la rapidité et la simplicité à la précision des bases de données</li>
          <li>Tu préfères les interfaces conversationnelles à la saisie via des formulaires</li>
          <li>Tu as des <Link href="/calorie-tracker-eating-disorders">antécédents de troubles alimentaires déclenchés par les applications de comptage de calories</Link></li>
        </ul>
        <p>
          Les deux outils ont leur place. Le meilleur outil de suivi est celui que tu utiliseras réellement de manière régulière.
        </p>
      </ContentSection>

      <SeoCta
        title="Essaie une approche différente du suivi"
        description="Rejoins l'accès anticipé de Nuvvoo et découvre le suivi des calories par la conversation plutôt que par des bases de données."
      />

      <ContentSection title="Faire le changement">
        <p>
          Si tu envisages de passer de MyFitnessPal à Nuvvoo, ou d&apos;essayer les deux pour voir ce qui te convient, voici à quoi t&apos;attendre :
        </p>
        <p>
          <strong>Ce que tu y gagneras :</strong>
        </p>
        <ul>
          <li><strong>Enregistrement plus rapide :</strong> les saisies par chat prennent 30 à 60 secondes contre 3 à 5 minutes de recherche dans une base de données</li>
          <li><strong>Moins de friction :</strong> pas besoin de chercher, de peser ou de calculer&mdash;il suffit de décrire ce que tu as mangé</li>
          <li><strong>Moins de stress :</strong> les estimations sont encouragées, ce qui élimine la pression du perfectionnisme</li>
          <li><strong>Meilleure régularité :</strong> un suivi plus facile conduit souvent à une utilisation plus régulière</li>
          <li><strong>Assistance conversationnelle :</strong> l&apos;IA répond comme un compagnon, pas comme un formulaire de données</li>
        </ul>
        <p>
          <strong>Ce que tu perdras :</strong>
        </p>
        <ul>
          <li><strong>Précision de la base de données :</strong> pas de recherche d&apos;entrées avec le nom exact de la marque</li>
          <li><strong>Lecture de codes-barres :</strong> Nuvvoo n&apos;utilise pas (encore) les codes-barres</li>
          <li><strong>Contrôle granulaire :</strong> moins de possibilités d&apos;ajuster chaque ingrédient</li>
          <li><strong>Fonctionnalités communautaires :</strong> MyFitnessPal propose des forums et un suivi social&nbsp;; Nuvvoo se concentre sur la tenue d&apos;un journal personnel</li>
        </ul>
        <p>
          Tu n&apos;es pas obligé de t&apos;engager pour toujours dans une seule approche. Certaines personnes utilisent MyFitnessPal pendant les périodes d&apos;entraînement intensif et passent à Nuvvoo pour le suivi quotidien. D&apos;autres utilisent Nuvvoo comme outil principal et n&apos;ouvrent MyFitnessPal que lorsqu&apos;ils ont besoin d&apos;une ventilation détaillée des macros.
        </p>
        <p>
          Le but n&apos;est pas de trouver l&apos;outil de suivi «&nbsp;parfait&nbsp;». C&apos;est de trouver celui qui t&apos;aide à <strong>rester constant sans te lasser</strong>.
        </p>
        <p>
          Si l&apos;approche de Nuvvoo t&apos;intéresse, tu peux aussi découvrir comment il fonctionne en tant que <Link href="/ai-food-journal">journal alimentaire IA</Link> qui combine le suivi avec une approche holistique de la santé. Ou voir comment il t&apos;aide quand tu es <Link href="/no-dinner-ideas-calories">à court d&apos;idées pour le dîner et que tu dois atteindre un objectif calorique</Link>.
        </p>
      </ContentSection>
    </>
  );
}

const faqsFr = [
  {
    question: 'Nuvvoo remplace-t-il complètement MyFitnessPal ?',
    answer:
      "Ça dépend de tes besoins. Si tu veux un suivi détaillé des macros, la lecture de codes-barres et une énorme base de données alimentaire, MyFitnessPal reste un excellent choix. Si tu veux un suivi plus simple et plus rapide via une conversation sans friction, Nuvvoo propose une approche différente. Certaines personnes utilisent les deux : MyFitnessPal pour les jours où elles veulent un suivi précis, et Nuvvoo pour rester cohérentes au quotidien.",
  },
  {
    question: "Puis-je changer depuis un autre outil de suivi des calories ?",
    answer:
      "Oui. Tu peux commencer à utiliser Nuvvoo à tout moment sans perdre ton habitude de suivi. Il n'y a pas d'importation de données depuis d'autres applications, mais comme Nuvvoo se concentre sur la création de nouveaux schémas via la conversation, tu n'as pas besoin de tes anciennes données. Commence simplement à discuter de tes repas, et l'IA apprendra rapidement tes habitudes.",
  },
  {
    question: 'Nuvvoo est-il gratuit ?',
    answer:
      "Nuvvoo est actuellement en accès anticipé. Les détails sur les tarifs seront annoncés à l'approche du lancement. Notre objectif est de proposer une offre gratuite qui rende le suivi accessible, avec des fonctionnalités premium pour les utilisateurs qui souhaitent des analyses avancées et une personnalisation.",
  },
];

/* ─── GERMAN BODY ─── */

function GermanBody() {
  return (
    <>
      <ContentSection title="Warum suchen Menschen nach Alternativen zu MyFitnessPal?">
        <p>
          MyFitnessPal ist eine der beliebtesten Apps zur Kalorienerfassung mit Millionen von Nutzern und einer umfassenden Lebensmitteldatenbank. Warum suchen Menschen also nach Alternativen?
        </p>
        <p>
          <strong>Häufige Frustrationen mit MyFitnessPal:</strong>
        </p>
        <ul>
          <li><strong>Überwältigende Datenbank:</strong> Die Suche nach einem einzelnen Lebensmittel unter Hunderten von Einträgen kann Minuten dauern</li>
          <li><strong>Zeitaufwändige Erfassung:</strong> Die manuelle Eingabe jeder Zutat, besonders bei selbstgekochten Mahlzeiten, ist mühsam</li>
          <li><strong>Uneinheitliche Datenqualität:</strong> Von Nutzern eingereichte Einträge enthalten oft Fehler oder veraltete Informationen</li>
          <li><strong>Komplexe Benutzeroberfläche:</strong> Die App hat viele Funktionen, aber die Navigation kann sich unübersichtlich anfühlen</li>
          <li><strong>Ermüdung durch das Erfassen:</strong> Der manuelle Prozess sorgt für Reibungsverluste, was zu einer unregelmäßigen Nutzung führt</li>
          <li><strong>Werbung und Upsells:</strong> Die kostenlose Version enthält häufige Werbeanzeigen und Aufforderungen zum Upgrade</li>
        </ul>
        <p>
          Das sind nicht für jeden ein Ausschlusskriterium. Viele Menschen nutzen MyFitnessPal langfristig erfolgreich. Aber für diejenigen, die <strong>Schnelligkeit und Einfachheit</strong> über die Präzision der Datenbank stellen, machen Alternativen, die darauf abzielen, Reibungsverluste zu reduzieren, das Tracking nachhaltiger.
        </p>
        <p>
          <a href="https://www.businessofapps.com/data/health-fitness-app-benchmarks/" target="_blank" rel="noopener noreferrer" className="text-nuvvooGreen-700 underline hover:text-nuvvooGreen-900">Branchendaten</a> deuten darauf hin, dass die meisten Gesundheits- und Fitness-Apps in den ersten 30 Tagen einen erheblichen Nutzerrückgang verzeichnen. Der Hauptgrund? Die Tracking-Methode selbst wird zur Hürde. Wenn das Protokollieren sich wie Arbeit anfühlt, leidet die Kontinuität.
        </p>
      </ContentSection>

      <ContentSection title="Verschiedene Ansätze zum Food-Tracking">
        <p>
          Nicht alle Kalorien-Tracker sind gleich aufgebaut. Das Tool, das du wählst, sollte zu deiner Tracking-Philosophie und deinem Lebensstil passen.
        </p>
        <p>
          <strong>Der Ansatz von MyFitnessPal: Präzision durch Datenbanken</strong>
        </p>
        <p>
          MyFitnessPal gibt dir die Kontrolle. Du durchsuchst eine riesige Datenbank, wählst den genauen Eintrag aus, der zu deinem Essen passt, und gibst die Portionsgrößen an. Das funktioniert gut, wenn du:
        </p>
        <ul>
          <li>aus sportlichen oder medizinischen Gründen eine präzise Makro-Erfassung benötigst</li>
          <li>die Kontrolle über jeden Datenpunkt bevorzugst</li>
          <li>viele verpackte Lebensmittel mit Barcodes isst</li>
          <li>Zeit hast, Datenbanken zu durchsuchen und Portionen abzuwiegen</li>
        </ul>
        <p>
          <strong>Der Ansatz von Nuvvoo: Bewusstsein durch Konversation</strong>
        </p>
        <p>
          Nuvvoo stellt Einfachheit und Beständigkeit über Präzision. Anstatt Datenbanken zu durchsuchen, <Link href="/chat-calorie-tracker">chattest du darüber, was du gegessen hast</Link>. Die KI übernimmt die Schätzung und Berechnung. Das funktioniert gut, wenn du:
        </p>
        <ul>
          <li>konsequent tracken möchtest, ohne mehr als 5 Minuten pro Mahlzeit aufzuwenden</li>
          <li>Bewusstseinsbildung wichtiger findest als das Erreichen exakter Zahlen</li>
          <li>lieber über Mahlzeiten sprichst, als Daten einzugeben</li>
          <li>mit Tracking-Müdigkeit zu kämpfen hast und einen leichteren Ansatz suchst</li>
        </ul>
        <p>
          Keiner der Ansätze ist &bdquo;besser&ldquo; &ndash; sie dienen unterschiedlichen Bedürfnissen. Präzisions-Tracker brauchen Tools wie MyFitnessPal. Nutzer, denen Beständigkeit wichtig ist, bevorzugen oft eine <Link href="/calorie-tracking-without-stress">einfachere, stressfreie Erfassung</Link>.
        </p>
      </ContentSection>

      <ContentSection title="Vergleich: Datenbank vs. Gespräch">
        <p>
          So sehen die beiden Ansätze in der Praxis im Vergleich aus:
        </p>
        <div className="prose-nuvvoo">
          <table>
            <thead>
              <tr>
                <th>Funktion</th>
                <th>MyFitnessPal</th>
                <th>Nuvvoo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Eingabemethode</td>
                <td>Datenbanksuche + manuelle Eingabe</td>
                <td>Chat in natürlicher Sprache</td>
              </tr>
              <tr>
                <td>Lernkurve</td>
                <td>Mittel (Datenbanknavigation lernen)</td>
                <td>Minimal (einfach Mahlzeiten beschreiben)</td>
              </tr>
              <tr>
                <td>Zeitaufwand pro Eintrag</td>
                <td>2&ndash;5 Minuten (je nach Komplexität der Mahlzeit)</td>
                <td>30&ndash;60 Sekunden (über Konversation)</td>
              </tr>
              <tr>
                <td>Schwerpunkt</td>
                <td>Präzise Erfassung &amp; detaillierte Makros</td>
                <td>Bewusstsein &amp; Beständigkeit</td>
              </tr>
              <tr>
                <td>Lebensmitteldatenbank</td>
                <td>Über 14 Millionen Lebensmittel, Barcode-Scan</td>
                <td>KI-gestützte Erkennung (keine Datenbank-Suche)</td>
              </tr>
              <tr>
                <td>Ideal für</td>
                <td>Sportler, Bodybuilder, präzise Erfasser</td>
                <td>Vielbeschäftigte, unregelmäßige Erfasser, Anfänger</td>
              </tr>
              <tr>
                <td>Tonfall</td>
                <td>Datenorientiert, neutral</td>
                <td>Konversationell, unterstützend</td>
              </tr>
              <tr>
                <td>Flexibilität</td>
                <td>Hohe Kontrolle, erfordert Details</td>
                <td>Hohe Flexibilität, akzeptiert Schätzungen</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>Wann MyFitnessPal besser sein könnte:</strong>
        </p>
        <ul>
          <li>Du trainierst für Leistungssport oder Bodybuilding</li>
          <li>Du brauchst präzise Makro-Ziele (z.&nbsp;B. 150&nbsp;g Protein täglich)</li>
          <li>Du isst viele verpackte Lebensmittel mit Barcodes</li>
          <li>Du möchtest detaillierte Nährwertangaben sehen</li>
        </ul>
        <p>
          <strong>Wann Nuvvoo besser sein könnte:</strong>
        </p>
        <ul>
          <li>Du hast MyFitnessPal ausprobiert, aber wegen Tracking-Müdigkeit aufgehört</li>
          <li>Du möchtest ein Bewusstsein entwickeln, ohne dich auf exakte Zahlen zu versteifen</li>
          <li>Du legst mehr Wert auf Schnelligkeit und Einfachheit als auf die Präzision der Datenbank</li>
          <li>Du bevorzugst dialogorientierte Oberflächen gegenüber der Protokollierung über Formulare</li>
          <li>Du hast in der Vergangenheit <Link href="/calorie-tracker-eating-disorders">Essstörungen erlebt, die durch Kalorien-Apps ausgelöst wurden</Link></li>
        </ul>
        <p>
          Beide Tools haben ihre Berechtigung. Der beste Tracker ist der, den du tatsächlich konsequent nutzt.
        </p>
      </ContentSection>

      <SeoCta
        title="Probier mal einen anderen Ansatz zum Tracken aus"
        description="Melde dich für den Early Access von Nuvvoo an und erlebe Kalorien-Tracking durch Konversation statt über Datenbanken."
      />

      <ContentSection title="Der Wechsel">
        <p>
          Wenn du darüber nachdenkst, von MyFitnessPal zu Nuvvoo zu wechseln oder beides auszuprobieren, um zu sehen, was besser passt, kannst du Folgendes erwarten:
        </p>
        <p>
          <strong>Was du gewinnst:</strong>
        </p>
        <ul>
          <li><strong>Schnelleres Protokollieren:</strong> Chat-basierte Einträge dauern 30&ndash;60 Sekunden statt 3&ndash;5 Minuten für die Datensuche</li>
          <li><strong>Weniger Aufwand:</strong> Kein Suchen, Wiegen oder Rechnen &ndash; beschreibe einfach, was du gegessen hast</li>
          <li><strong>Weniger Stress:</strong> Schätzungen werden gefördert, wodurch der Perfektionismusdruck wegfällt</li>
          <li><strong>Bessere Kontinuität:</strong> Einfacheres Tracking führt oft zu einer konsequenteren Nutzung</li>
          <li><strong>Unterstützung durch Konversation:</strong> Die KI reagiert wie ein Begleiter, nicht wie ein Datenformular</li>
        </ul>
        <p>
          <strong>Was du einbüßt:</strong>
        </p>
        <ul>
          <li><strong>Präzision der Datenbank:</strong> Keine Suche nach exakten Markeneinträgen</li>
          <li><strong>Barcode-Scannen:</strong> Nuvvoo nutzt (noch) keine Barcodes</li>
          <li><strong>Detaillierte Kontrolle:</strong> Weniger Möglichkeiten, jede Zutat genau anzupassen</li>
          <li><strong>Community-Funktionen:</strong> MyFitnessPal bietet Foren und Social Tracking; Nuvvoo konzentriert sich auf das persönliche Tagebuch</li>
        </ul>
        <p>
          Du musst dich nicht für immer auf einen Ansatz festlegen. Manche nutzen MyFitnessPal während intensiver Trainingsphasen und wechseln für die tägliche Erhaltung zu Nuvvoo. Andere nutzen Nuvvoo als ihren primären Tracker und öffnen MyFitnessPal nur, wenn sie detaillierte Makro-Aufschlüsselungen benötigen.
        </p>
        <p>
          Das Ziel ist nicht, den &bdquo;perfekten&ldquo; Tracker zu finden. Es geht darum, denjenigen zu finden, der dir hilft, <strong>konsequent zu bleiben, ohne auszubrennen</strong>.
        </p>
        <p>
          Wenn du neugierig auf den Ansatz von Nuvvoo bist, kannst du auch erkunden, wie es als <Link href="/ai-food-journal">KI-Ernährungstagebuch</Link> funktioniert, das Tracking mit ganzheitlichem Gesundheitsbewusstsein verbindet. Oder schau dir an, wie es hilft, wenn du <Link href="/no-dinner-ideas-calories">keine Ideen für das Abendessen hast und ein Kalorienziel erreichen musst</Link>.
        </p>
      </ContentSection>
    </>
  );
}

const faqsDe = [
  {
    question: 'Ersetzt Nuvvoo MyFitnessPal vollständig?',
    answer:
      'Das hängt von deinen Bedürfnissen ab. Wenn du detaillierte Makro-Erfassung, Barcode-Scannen und eine riesige Lebensmitteldatenbank willst, bleibt MyFitnessPal eine gute Wahl. Wenn du eine einfachere, schnellere Erfassung durch Konversation mit weniger Reibungsverlusten willst, bietet Nuvvoo einen anderen Ansatz. Manche Leute nutzen beides – MyFitnessPal für Tage mit präziser Erfassung, Nuvvoo für die tägliche Beständigkeit.',
  },
  {
    question: 'Kann ich von einem anderen Kalorien-Tracker wechseln?',
    answer:
      'Ja. Du kannst jederzeit mit Nuvvoo anfangen, ohne deine Erfassungsgewohnheiten zu verlieren. Es gibt keinen Datenimport aus anderen Apps, aber da Nuvvoo sich darauf konzentriert, durch Gespräche neue Muster aufzubauen, brauchst du deine alten Daten nicht. Fang einfach an, über deine Mahlzeiten zu chatten, und die KI wird deine Gewohnheiten schnell lernen.',
  },
  {
    question: 'Ist Nuvvoo kostenlos?',
    answer:
      'Nuvvoo befindet sich derzeit in der Early-Access-Phase. Preisdetails werden kurz vor dem Start bekannt gegeben. Unser Ziel ist es, eine kostenlose Stufe anzubieten, die das Tracking zugänglich macht, mit Premium-Funktionen für Nutzer, die erweiterte Einblicke und Personalisierung wünschen.',
  },
];

/* ─── RUSSIAN BODY ─── */

function RussianBody() {
  return (
    <>
      <ContentSection title="Почему люди ищут альтернативы MyFitnessPal">
        <p>
          MyFitnessPal — одно из самых популярных приложений для подсчёта калорий, с миллионами пользователей и обширной базой данных продуктов. Так почему же люди ищут альтернативы?
        </p>
        <p>
          <strong>Распространённые проблемы с MyFitnessPal:</strong>
        </p>
        <ul>
          <li><strong>Огромная база данных:</strong> поиск одного продукта среди сотен записей может занять несколько минут</li>
          <li><strong>Затратный процесс ввода:</strong> вручную вводить каждый ингредиент, особенно для домашних блюд, очень утомительно</li>
          <li><strong>Нестабильное качество данных:</strong> записи, добавленные пользователями, часто содержат ошибки или устаревшую информацию</li>
          <li><strong>Сложность интерфейса:</strong> в приложении много функций, но навигация по ним может казаться запутанной</li>
          <li><strong>Усталость от учёта:</strong> ручной процесс создаёт трудности, что приводит к нерегулярному использованию</li>
          <li><strong>Реклама и предложения о переходе на платную версию:</strong> бесплатная версия включает частую рекламу и предложения об обновлении</li>
        </ul>
        <p>
          Это не для всех является причиной отказа от приложения. Многие люди успешно используют MyFitnessPal в течение длительного времени. Но для тех, кто ценит <strong>скорость и простоту</strong> больше, чем точность базы данных, альтернативы, ориентированные на уменьшение неудобств, делают отслеживание более устойчивым.
        </p>
        <p>
          <a href="https://www.businessofapps.com/data/health-fitness-app-benchmarks/" target="_blank" rel="noopener noreferrer" className="text-nuvvooGreen-700 underline hover:text-nuvvooGreen-900">Отраслевые данные</a> показывают, что большинство приложений для здоровья и фитнеса теряют значительную часть пользователей в первые 30 дней. Главная причина? Сам метод отслеживания становится препятствием. Когда ввод данных кажется работой, страдает постоянство.
        </p>
      </ContentSection>

      <ContentSection title="Разные подходы к отслеживанию питания">
        <p>
          Не все калькуляторы калорий одинаковы. Инструмент, который ты выберешь, должен соответствовать твоей философии отслеживания и образу жизни.
        </p>
        <p>
          <strong>Подход MyFitnessPal: точность благодаря базам данных</strong>
        </p>
        <p>
          MyFitnessPal даёт тебе контроль. Ты ищешь в огромной базе данных, выбираешь точную запись, соответствующую твоей еде, и указываешь размер порций. Это хорошо работает, если ты:
        </p>
        <ul>
          <li>нуждаешься в точном отслеживании макроэлементов по спортивным или медицинским причинам</li>
          <li>предпочитаешь контролировать каждую деталь</li>
          <li>ешь много упакованных продуктов со штрих-кодами</li>
          <li>имеешь время искать в базах данных и взвешивать порции</li>
        </ul>
        <p>
          <strong>Подход Nuvvoo: осознание через разговор</strong>
        </p>
        <p>
          Nuvvoo ставит простоту и постоянство выше точности. Вместо поиска в базах данных ты <Link href="/chat-calorie-tracker">рассказываешь о том, что съел</Link>. AI занимается оценкой и расчётами. Это хорошо работает, если ты:
        </p>
        <ul>
          <li>хочешь вести учёт регулярно, не тратя более 5 минут на каждый приём пищи</li>
          <li>ценишь осознанность больше, чем точные цифры</li>
          <li>предпочитаешь говорить о еде, а не вводить данные</li>
          <li>испытываешь усталость от учёта и хочешь более лёгкий подход</li>
        </ul>
        <p>
          Ни один из подходов не «лучше» — они удовлетворяют разные потребности. Для тех, кто ценит точность, нужны такие инструменты, как MyFitnessPal. Пользователи, ориентированные на постоянство, часто предпочитают более <Link href="/calorie-tracking-without-stress">простой трекинг без стресса</Link>.
        </p>
      </ContentSection>

      <ContentSection title="Сравнение: база данных против разговора">
        <p>
          Вот как эти два подхода сравниваются на практике:
        </p>
        <div className="prose-nuvvoo">
          <table>
            <thead>
              <tr>
                <th>Функция</th>
                <th>MyFitnessPal</th>
                <th>Nuvvoo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Способ ввода</td>
                <td>Поиск в базе данных + ручной ввод</td>
                <td>Чат на естественном языке</td>
              </tr>
              <tr>
                <td>Кривая освоения</td>
                <td>Умеренная (нужно научиться пользоваться базой данных)</td>
                <td>Минимальная (просто описываешь еду)</td>
              </tr>
              <tr>
                <td>Время на одну запись</td>
                <td>2–5 минут (в зависимости от сложности блюда)</td>
                <td>30–60 секунд (через чат)</td>
              </tr>
              <tr>
                <td>Фокус</td>
                <td>Точное отслеживание и подробные макроэлементы</td>
                <td>Осознанность и постоянство</td>
              </tr>
              <tr>
                <td>База данных продуктов</td>
                <td>Более 14 миллионов продуктов, сканирование штрих-кодов</td>
                <td>Распознавание на основе AI (без поиска в базе данных)</td>
              </tr>
              <tr>
                <td>Идеально подходит для</td>
                <td>Спортсменов, бодибилдеров, тех, кто любит точное отслеживание</td>
                <td>Занятых людей, тех, кто не всегда ведёт учёт, новичков</td>
              </tr>
              <tr>
                <td>Тон</td>
                <td>Ориентированный на данные, нейтральный</td>
                <td>Разговорный, поддерживающий</td>
              </tr>
              <tr>
                <td>Гибкость</td>
                <td>Высокий уровень контроля, требует деталей</td>
                <td>Высокая гибкость, допускает приблизительные оценки</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>Когда MyFitnessPal может быть лучше:</strong>
        </p>
        <ul>
          <li>ты тренируешься для участия в соревнованиях или занимаешься бодибилдингом</li>
          <li>тебе нужны точные целевые показатели макроэлементов (например, 150&nbsp;г белка в день)</li>
          <li>ты ешь много упакованных продуктов со штрих-кодами</li>
          <li>ты предпочитаешь видеть подробные данные о питании</li>
        </ul>
        <p>
          <strong>Когда Nuvvoo может быть лучше:</strong>
        </p>
        <ul>
          <li>ты пробовал MyFitnessPal, но бросил из-за усталости от отслеживания</li>
          <li>ты хочешь быть в курсе, но не хочешь зацикливаться на точных цифрах</li>
          <li>ты ценишь скорость и простоту больше, чем точность базы данных</li>
          <li>ты предпочитаешь диалоговые интерфейсы ведению записей через формы</li>
          <li>у тебя в анамнезе есть <Link href="/calorie-tracker-eating-disorders">расстройства пищевого поведения, вызванные приложениями для подсчёта калорий</Link></li>
        </ul>
        <p>
          У обоих инструментов есть своё место. Лучший трекер — это тот, которым ты действительно будешь пользоваться регулярно.
        </p>
      </ContentSection>

      <SeoCta
        title="Попробуй другой подход к отслеживанию"
        description="Присоединяйся к раннему доступу Nuvvoo и попробуй отслеживать калории через диалог, а не через базы данных."
      />

      <ContentSection title="Переход">
        <p>
          Если ты думаешь перейти с MyFitnessPal на Nuvvoo или попробовать оба, чтобы понять, что подходит, вот чего стоит ожидать:
        </p>
        <p>
          <strong>Что ты получишь:</strong>
        </p>
        <ul>
          <li><strong>Более быструю регистрацию:</strong> ввод данных через чат занимает 30–60 секунд против 3–5 минут поиска в базе данных</li>
          <li><strong>Меньше хлопот:</strong> не нужно искать, взвешивать или считать — просто опиши, что ты съел</li>
          <li><strong>Меньше стресса:</strong> приветствуются приблизительные оценки, что снимает давление перфекционизма</li>
          <li><strong>Больше последовательности:</strong> более простой учёт часто приводит к более регулярному использованию</li>
          <li><strong>Поддержку в формате диалога:</strong> AI отвечает как собеседник, а не как форма для данных</li>
        </ul>
        <p>
          <strong>Чем тебе придётся пожертвовать:</strong>
        </p>
        <ul>
          <li><strong>Точность базы данных:</strong> нет поиска точных записей по брендам</li>
          <li><strong>Сканирование штрих-кодов:</strong> Nuvvoo (пока) не использует штрих-коды</li>
          <li><strong>Детальная настройка:</strong> меньше возможностей для точной настройки каждого ингредиента</li>
          <li><strong>Функции сообщества:</strong> в MyFitnessPal есть форумы и возможность отслеживать результаты в социальных сетях; Nuvvoo фокусируется на ведении личного дневника</li>
        </ul>
        <p>
          Тебе не обязательно привязываться к одному подходу навсегда. Некоторые люди используют MyFitnessPal во время интенсивных тренировок и переключаются на Nuvvoo для повседневного поддержания формы. Другие используют Nuvvoo в качестве основного трекера и открывают MyFitnessPal только тогда, когда им нужна подробная разбивка макроэлементов.
        </p>
        <p>
          Цель не в том, чтобы найти «идеальный» трекер. Цель — найти тот, который поможет тебе <strong>оставаться последовательным, не выгорая</strong>.
        </p>
        <p>
          Если тебе интересен подход Nuvvoo, ты также можешь узнать, как он работает в качестве <Link href="/ai-food-journal">AI-дневника питания</Link>, сочетающего отслеживание с комплексным подходом к здоровью. Или посмотри, как он помогает, когда ты <Link href="/no-dinner-ideas-calories">застрял без идей на ужин, а калорийную цель нужно выполнить</Link>.
        </p>
      </ContentSection>
    </>
  );
}

const faqsRu = [
  {
    question: 'Полностью ли Nuvvoo заменяет MyFitnessPal?',
    answer:
      'Это зависит от твоих потребностей. Если тебе нужен подробный учёт макроэлементов, сканирование штрих-кодов и обширная база данных продуктов, MyFitnessPal по-прежнему остаётся отличным выбором. Если же ты хочешь более простое и быстрое отслеживание через диалог с меньшими усилиями, Nuvvoo предлагает другой подход. Некоторые люди используют и то, и другое — MyFitnessPal для дней точного учёта, Nuvvoo для повседневной последовательности.',
  },
  {
    question: 'Могу ли я перейти с другого трекера калорий?',
    answer:
      'Да. Ты можешь начать пользоваться Nuvvoo в любой момент, не теряя привычки вести учёт. Импорт данных из других приложений не предусмотрен, но поскольку Nuvvoo фокусируется на формировании новых привычек через общение, тебе не нужны старые данные. Просто начни рассказывать о своих приёмах пищи, и AI быстро изучит твои привычки.',
  },
  {
    question: 'Nuvvoo бесплатный?',
    answer:
      'Nuvvoo сейчас находится в раннем доступе. Подробности о ценах будут объявлены ближе к запуску. Наша цель — предложить бесплатный тариф, который сделает отслеживание доступным, а также премиум-функции для пользователей, желающих получить расширенную аналитику и персонализацию.',
  },
];
