import { getPrograms, getSettings, siteUrl } from "@/lib/api";
import { mapsHref } from "@/lib/maps";
import { Breadcrumbs, PageHero, Prose } from "@/components/Page";
import { ShareBar, AnalyticsClick } from "@/components/ShareBar";
import { notFound } from "next/navigation";
import { formatProgramWhen } from "@/lib/when";
import { Photo, photos } from "@/components/Photo";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const programs = (await getPrograms()) ?? [];
  const p = programs.find((x) => x.slug === slug);
  if (!p) notFound();
  const settings = await getSettings();
  const url = siteUrl(`/programs/${p.slug}`);
  const maps = mapsHref(settings?.maps_url);

  return (
    <>
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/programs", label: "Programs" },
          { href: `/programs/${p.slug}`, label: p.title },
        ]}
      />
      <PageHero eyebrow={formatProgramWhen(p)} title={p.title}>
        {p.description}
      </PageHero>
      <Prose>
        <Photo
          src={p.invitation_url || photos.kirtan}
          alt={p.title}
          className="w-full max-h-[32rem] object-cover bg-white not-prose mb-8"
        />
        <p>
          {p.start_time}
          {p.end_time ? ` – ${p.end_time}` : ""} · {p.location}
        </p>
        <ul>
          {(p.program_items || []).map((it) => (
            <li key={it.title}>{it.title}</li>
          ))}
        </ul>

        <div className="not-prose mt-8 flex flex-wrap gap-3">
          <AnalyticsClick name="directions_click" href={maps} className="rounded-full bg-forest text-cream hover:bg-forest/90 px-5 py-2 text-sm font-medium transition-colors no-underline">
            Get Directions
          </AnalyticsClick>
          <Link href="/volunteer" className="rounded-full border border-forest text-forest hover:bg-sand/40 px-5 py-2 text-sm font-medium transition-colors no-underline">
            Volunteer / seva
          </Link>
        </div>

        <div className="not-prose mt-6">
          <ShareBar text={`${p.title} at ISKCON Margao`} url={url} />
        </div>
      </Prose>
    </>
  );
}
