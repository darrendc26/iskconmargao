import { getFestivals, siteUrl } from "@/lib/api";
import { Breadcrumbs, PageHero } from "@/components/Page";
import Link from "next/link";
import type { Metadata } from "next";
import { Photo, photos } from "@/components/Photo";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Festivals",
  description: "Upcoming and past festivals at ISKCON Margao, South Goa.",
  alternates: { canonical: siteUrl("/festivals") },
};

export default async function FestivalsPage() {
  const data = await getFestivals();
  const upcoming = data?.upcoming ?? [];
  const past = data?.past ?? [];
  return (
    <>
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/festivals", label: "Festivals" }]} />
      <PageHero title="Festivals">Kirtan, katha and community on the sacred days of the year. Everyone is welcome.</PageHero>
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <h2 className="font-serif text-3xl text-forest">Upcoming</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {upcoming.length === 0 && <p className="text-ink-muted">No upcoming festivals are published yet.</p>}
          {upcoming.map((f) => (
            <Link key={f.id} href={`/festivals/${f.slug}`} className="border border-gold/25 bg-white/40 overflow-hidden">
              <Photo src={f.cover_url || photos.festival} alt="" className="w-full h-40 object-cover" />
              <div className="p-6">
                <p className="text-sm text-saffron">{f.date}</p>
                <h3 className="font-serif text-2xl mt-1">{f.title}</h3>
                <p className="mt-2 text-ink-muted line-clamp-3">{f.description}</p>
              </div>
            </Link>
          ))}
        </div>
        <h2 className="font-serif text-3xl text-forest mt-16">Past gatherings</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {past.map((f) => (
            <Link key={f.id} href={`/festivals/${f.slug}`} className="border border-gold/20 overflow-hidden">
              <Photo src={f.cover_url || photos.lotus} alt="" className="w-full h-28 object-cover" />
              <div className="p-4">
                <p className="text-xs">{f.date}</p>
                <h3 className="font-serif text-xl">{f.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
