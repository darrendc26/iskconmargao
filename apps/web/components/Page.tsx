import Link from "next/link";

export function PageHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mx-auto max-w-3xl px-4 pt-8 sm:pt-12 md:pt-16 pb-6 md:pb-8">
      {eyebrow && <p className="text-xs font-bold tracking-widest uppercase text-saffron">{eyebrow}</p>}
      <h1 className="font-serif text-2xl sm:text-3xl md:text-5xl text-forest mt-2 leading-tight break-words">{title}</h1>
      {children && <div className="mt-3 md:mt-4 text-base sm:text-lg text-ink-muted leading-relaxed">{children}</div>}
    </header>
  );
}

export function Breadcrumbs({ items }: { items: { href: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-3xl px-4 pt-6 md:pt-8 text-xs sm:text-sm text-ink-muted">
      <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {items.map((it, i) => (
          <li key={it.href} className="flex items-center gap-1.5 sm:gap-2">
            {i > 0 && <span className="opacity-40">/</span>}
            {i === items.length - 1 ? (
              <span className="text-ink font-medium truncate max-w-[180px] sm:max-w-none">{it.label}</span>
            ) : (
              <Link href={it.href} className="hover:underline">
                {it.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Prose({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-3xl px-4 pb-12 sm:pb-16 prose-devotional">{children}</div>;
}
