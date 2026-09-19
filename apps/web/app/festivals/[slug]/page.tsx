import { getFestival, getSettings, siteUrl } from "@/lib/api";
import { mapsHref } from "@/lib/maps";
import { Breadcrumbs, PageHero, Prose } from "@/components/Page";
import { ShareBar, AnalyticsClick } from "@/components/ShareBar";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Photo, photos } from "@/components/Photo";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const f = await getFestival(slug);
  if (!f) return { title: "Festival" };
  return {
    title: f.title,
    description: f.description.slice(0, 160),
    alternates: { canonical: siteUrl(`/festivals/${f.slug}`) },
    openGraph: { title: `${f.title} | ISKCON Margao`, description: f.description, url: siteUrl(`/festivals/${f.slug}`) },
  };
}

export default async function FestivalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = await getFestival(slug);
  if (!f) notFound();
  const settings = await getSettings();
  const url = siteUrl(`/festivals/${f.slug}`);
  const maps = mapsHref(settings?.maps_url);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: f.title,
    startDate: f.date,
    location: { "@type": "Place", name: "ISKCON Margao", address: f.location },
    description: f.description,
    organizer: { "@type": "Organization", name: "ISKCON Margao", url: siteUrl("/") },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/festivals", label: "Festivals" },
          { href: `/festivals/${f.slug}`, label: f.title },
        ]}
      />
      <PageHero eyebrow={f.date} title={f.title}>
        {f.start_time ? `${f.start_time} onwards · ` : ""}
        {f.location}
      </PageHero>
      <Prose>
        <Photo src={f.cover_url || photos.festival} alt="" className="w-full max-h-[28rem] object-cover bg-white mb-8 not-prose" />
        <p>{f.description}</p>
        {f.program && (
          <>
            <h2>Program</h2>
            <p className="whitespace-pre-wrap">{f.program}</p>
          </>
        )}
        {f.additional_info && (
          <>
            <h2>More information</h2>
            <p className="whitespace-pre-wrap">{f.additional_info}</p>
          </>
        )}
        <div className="not-prose mt-8 flex flex-wrap gap-3">
          <AnalyticsClick name="directions_click" href={maps} className="rounded-full bg-forest text-cream hover:bg-forest/90 px-5 py-2 text-sm font-medium transition-colors no-underline">
            Get Directions
          </AnalyticsClick>
          <Link href="/volunteer" className="rounded-full border border-forest text-forest hover:bg-sand/40 px-5 py-2 text-sm font-medium transition-colors no-underline">
            Volunteer / seva
          </Link>
        </div>
        <div className="not-prose mt-6">
          <ShareBar text={f.share_text || f.title} url={url} />
        </div>
      </Prose>
    </>
  );
}
