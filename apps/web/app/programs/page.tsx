import { getPrograms, siteUrl } from "@/lib/api";
import { Breadcrumbs, PageHero, Prose } from "@/components/Page";
import Link from "next/link";
import type { Metadata } from "next";
import { formatProgramWhen, onwards } from "@/lib/when";
import { Photo, photos } from "@/components/Photo";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Programs",
  description: "Friday and Saturday kirtan at ISKCON Margao.",
  alternates: { canonical: siteUrl("/programs") },
};

export default async function ProgramsPage() {
  const programs = (await getPrograms()) ?? [];

  return (
    <>
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/programs", label: "Programs" }]} />
      <PageHero eyebrow="ISKCON Margao" title="Programs">
        Weekly gatherings at the centre. Festivals are listed separately on the festivals page.
      </PageHero>
      <Prose>
        <h2 id="this-week">Weekly gatherings</h2>
        {programs.length === 0 ? (
          <p>Programs will appear here when they are published.</p>
        ) : (
          <div className="grid gap-6 mt-6 not-prose">
            {programs.map((p) => (
              <article key={p.id} className="border border-gold/25 bg-white/40 overflow-hidden">
                <Photo src={p.invitation_url || photos.kirtan} alt="" className="w-full h-48 object-cover" />
                <div className="p-6">
                  <p className="text-xs uppercase tracking-widest text-saffron">{formatProgramWhen(p)}</p>
                  <h3 className="font-serif text-2xl mt-1">
                    <Link href={`/programs/${p.slug}`}>{p.title}</Link>
                  </h3>
                  <p className="text-sm text-ink-muted mt-1">{onwards(p.start_time)}</p>
                  <p className="mt-3 text-ink-muted">{p.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
        <p className="mt-8">
          <Link href="/festivals">See festivals</Link>
        </p>
      </Prose>
    </>
  );
}
