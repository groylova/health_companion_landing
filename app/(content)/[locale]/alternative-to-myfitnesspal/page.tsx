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
import { AppleIcon, AndroidIcon } from '@/components/icons';
import { TrackedButton } from '@/components/tracked-button';

type Props = { params: Promise<{ locale: string }> };

// Locales with a real translation of this article. Others fall back to EN content
// and keep the parent layout's noindex until translated.
const TRANSLATED_LOCALES = new Set(['en', 'es', 'fr']);

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const en = {
    title: 'MyFitnessPal Alternative: Track by Chatting, Not Logging',
    description:
      'Looking for a MyFitnessPal alternative? Nuvvoo helps you track food consistently with chat-based logging—no database searches or manual entry.',
    ogDescription:
      'A MyFitnessPal alternative that uses AI conversation to make calorie tracking faster and easier.',
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

  const copy = locale === 'es' ? es : locale === 'fr' ? fr : en;
  const isTranslated = TRANSLATED_LOCALES.has(locale);

  const base: Metadata = {
    title: copy.title,
    description: copy.description,
    openGraph: {
      title: copy.title,
      description: copy.ogDescription,
      type: 'article',
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

  const h1 = isSpanish
    ? 'Alternativa a MyFitnessPal: lleva un registro chateando, sin anotar nada'
    : isFrench
      ? "Une alternative à MyFitnessPal : suis ton alimentation par chat, sans saisie manuelle"
      : 'MyFitnessPal Alternative: Track by Chatting, Not Logging';

  const subtitle = isSpanish
    ? '¿Buscas una forma más fácil de llevar un registro de lo que comes? Nuvvoo es una alternativa a MyFitnessPal que usa la conversación con IA para ayudarte a registrar tus comidas rápidamente, sin búsquedas en bases de datos ni entradas manuales.'
    : isFrench
      ? "Tu cherches un moyen plus simple de suivre ton alimentation ? Nuvvoo est une alternative à MyFitnessPal qui utilise l'IA conversationnelle pour t'aider à enregistrer tes repas rapidement — pas besoin de chercher dans une base de données ni de saisir quoi que ce soit manuellement."
      : 'Looking for an easier way to track food? Nuvvoo is a MyFitnessPal alternative that uses AI conversation to help you log meals quickly—no database searches, no manual entry.';

  const imageAlt = isSpanish
    ? 'Nuvvoo sugiriendo alternativas saludables para la cena'
    : isFrench
      ? 'Nuvvoo suggère des alternatives saines pour le dîner'
      : 'Nuvvoo suggesting healthy dinner alternatives';

  const faqs = isSpanish ? faqsEs : isFrench ? faqsFr : faqsEn;

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
            {isSpanish ? <SpanishBody /> : isFrench ? <FrenchBody /> : <EnglishBody />}

            <div className="my-12 flex flex-col items-center gap-4 text-center">
              <div className="flex gap-3">
                <TrackedButton
                  href="/#waitlist"
                  variant="primary"
                  eventName="click_platform"
                  eventParams={{ platform: 'ios', button_location: 'seo_mfp_alternative' }}
                  className="!bg-slate-900 !shadow-none hover:!bg-slate-800 gap-2 min-w-[140px]"
                >
                  <AppleIcon size={18} />
                  iOS
                </TrackedButton>
                <TrackedButton
                  href="/#waitlist"
                  variant="outline"
                  eventName="click_platform"
                  eventParams={{ platform: 'android', button_location: 'seo_mfp_alternative' }}
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
        buttonText="Get priority access"
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
        buttonText="Obtén acceso prioritario"
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
        buttonText="Obtenir un accès prioritaire"
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
