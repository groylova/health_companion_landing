import { getTranslations } from 'next-intl/server';
import { RelatedCard } from './related-card';

// Canonical map of cross-link slug → href. Slug keys also pick the i18n
// description (relatedLinks.desc{Slug}) and the footer title (footer.{slug}).
const SLUG_TO_HREF = {
  calculator: '/calorie-deficit-calculator',
  bmiCalculator: '/bmi-calculator',
  foodDiary: '/food-diary-for-weight-loss',
  mfpAlternative: '/alternative-to-myfitnesspal',
  loseItAlternative: '/alternative-to-lose-it',
  stayConsistent: '/how-to-stay-consistent-calorie-tracking',
  stressFree: '/calorie-tracking-without-stress',
  chatTracker: '/chat-calorie-tracker',
  aiFoodJournal: '/ai-food-journal',
  photoVsChat: '/photo-vs-chat-calorie-tracking',
  dinnerIdeas: '/no-dinner-ideas-calories',
  eatingDisorderSafety: '/calorie-tracker-eating-disorders',
  bmrCalculator: '/bmr-calculator',
  tdeeCalculator: '/tdee-calculator',
} as const;

export type RelatedSlug = keyof typeof SLUG_TO_HREF;

function descKey(slug: RelatedSlug): string {
  return `desc${slug.charAt(0).toUpperCase()}${slug.slice(1)}`;
}

// Server component: renders a "Related guides" cross-link grid at the
// bottom of an SEO page. Pages pass an array of 4 slugs picked for
// topical relevance. Title comes from footer.<slug>, description from
// relatedLinks.desc<Slug> — both already translated to all 5 locales.
export async function RelatedGuides({ slugs }: { slugs: RelatedSlug[] }) {
  const tRelated = await getTranslations('relatedLinks');
  const tFooter = await getTranslations('footer');

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold tracking-tight text-slate-900">
        {tRelated('heading')}
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {slugs.map((slug) => (
          <RelatedCard
            key={slug}
            href={SLUG_TO_HREF[slug]}
            title={tFooter(slug as 'foodDiary')}
            description={tRelated(descKey(slug) as 'descFoodDiary')}
          />
        ))}
      </div>
    </section>
  );
}
