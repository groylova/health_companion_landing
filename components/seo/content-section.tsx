export function ContentSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="scroll-mt-20">
      {eyebrow && (
        <div className="mb-2 text-sm font-medium text-nuvvooGreen-700">
          {eyebrow}
        </div>
      )}
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
        {title}
      </h2>
      <div className="prose-nuvvoo mt-6 space-y-6">
        {children}
      </div>
    </section>
  );
}
