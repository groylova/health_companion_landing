export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? 'text-center' : ''}>
      {eyebrow ? (
        <div className={center ? 'mx-auto' : ''}>
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-600 shadow-sm">
            {eyebrow}
          </span>
        </div>
      ) : null}
      <h2 className={(center ? 'mx-auto ' : '') + 'mt-3 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl'}>
        {title}
      </h2>
      {subtitle ? (
        <p className={(center ? 'mx-auto ' : '') + 'mt-3 max-w-2xl text-slate-600'}>{subtitle}</p>
      ) : null}
    </div>
  );
}
