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
const TRANSLATED_LOCALES = new Set(['en', 'fr']);

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const en = {
    title: 'Food Diary for Weight Loss: The Method That Doubles Results (2026) | Nuvvoo',
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
      "Le journal alimentaire pour maigrir : la méthode qui double les résultats (2026) | Nuvvoo",
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

  const copy = locale === 'fr' ? fr : en;
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

  const h1 = isFrench
    ? 'Le journal alimentaire pour maigrir : la méthode qui double les résultats'
    : 'Food Diary for Weight Loss: The Method That Doubles Results';

  const subtitle = isFrench
    ? "Tenir un journal alimentaire est l'une des stratégies de perte de poids les plus efficaces, comme le prouvent les études. Les personnes qui notent ce qu'elles mangent perdent systématiquement deux fois plus de poids que celles qui ne le font pas. Mais il y a un hic : la plupart des gens abandonnent au bout de quelques semaines, car la méthode traditionnelle est lente, fastidieuse et source de culpabilité. Et si le problème venait du journal lui-même, et non de la personne ?"
    : 'Keeping a food diary is one of the most effective weight loss strategies backed by research. People who track what they eat consistently lose twice as much weight as those who don’t. But there’s a catch — most people quit within weeks because traditional food logging is slow, tedious, and guilt-inducing. What if the diary itself was the problem, not the person?';

  const imageAlt = isFrench
    ? 'Le personnage de Nuvvoo écrit dans un journal alimentaire ouvert, entouré de bulles de chat avec des repas et des boissons — une approche calme et conviviale du suivi alimentaire pour la perte de poids'
    : 'Nuvvoo character writing in an open food diary, surrounded by chat bubbles of meals and drinks — a calm, friendly take on food tracking for weight loss';

  const faqs = isFrench ? faqsFr : faqsEn;

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
            {isFrench ? <FrenchBody /> : <EnglishBody />}

            <div className="my-12 flex flex-col items-center gap-4 text-center">
              <AppStoreBadge buttonLocation="seo_food_diary" />
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
