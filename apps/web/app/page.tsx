import Link from "next/link";
import { getHomepage, siteUrl } from "@/lib/api";
import { mapsHref } from "@/lib/maps";
import { AnalyticsClick, ShareBar } from "@/components/ShareBar";
import { pickThisWeek } from "@/lib/when";
import { CENTRE } from "@/lib/site";
import { Photo, photos } from "@/components/Photo";
import type { Metadata } from "next";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "ISKCON Margao | A centre of ISKCON Goa in South Goa",
  description:
    "A place to chant, hear, learn and connect with Krishna consciousness in South Goa. Friday and Saturday kirtan at Matchless Gifts, Margao.",
  alternates: { canonical: siteUrl("/") },
  openGraph: {
    title: "ISKCON Margao",
    description: "A place to chant, hear, learn and connect with Krishna consciousness in South Goa.",
    url: siteUrl("/"),
  },
};

export default async function HomePage() {
  const data = await getHomepage();
  const settings = data?.settings;
  const maps = mapsHref(settings?.maps_url);
  const featured = data?.featured_festival;
  const thisWeek = pickThisWeek(data?.current_programs ?? []);
  const announcement = data?.announcements?.[0];

  return (
    <>
      {announcement && (
        <div className="bg-forest text-cream text-center text-sm py-2 px-4">
          <strong>{announcement.title}</strong>
          {announcement.message ? ` — ${announcement.message}` : ""}
          {announcement.cta_url && (
            <Link href={announcement.cta_url} className="underline ml-2">
              {announcement.cta_label || "Learn more"}
            </Link>
          )}
        </div>
      )}

      <section className="relative overflow-hidden bg-[#efe4cf]">
        <div className="relative mx-auto max-w-6xl grid md:grid-cols-2 items-stretch">
          <div className="px-4 py-12 md:py-24">
            <div className="flex items-center gap-3 mb-2">
              <Photo
                src={photos.logo}
                alt="ISKCON Margao Logo"
                className="h-12 w-12 sm:h-16 sm:w-16 object-contain"
              />
              <p className="text-[11px] tracking-[0.35em] uppercase text-saffron font-bold">Hare Krishna</p>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-forest leading-[0.95] mt-1">
              ISKCON
              <br />
              Margao
            </h1>
            <p className="mt-4 sm:mt-6 max-w-md text-base sm:text-lg text-ink-muted leading-relaxed">
              {settings?.hero_support ||
                "A place to chant, hear, learn and connect with Krishna consciousness in South Goa."}
            </p>
            <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
              <AnalyticsClick
                name="join_program_click"
                href="/programs"
                className="rounded-full bg-forest text-cream px-6 py-3 text-sm font-medium hover:bg-forest/90 shadow-sm"
              >
                Join Us
              </AnalyticsClick>
              <AnalyticsClick
                name="directions_click"
                href={maps}
                className="rounded-full border border-forest text-forest hover:bg-sand/40 px-6 py-3 text-sm font-medium"
              >
                Get Directions
              </AnalyticsClick>
            </div>
            <div className="mt-8 pt-5 border-t border-forest/10">
              <p className="text-xs tracking-[0.2em] uppercase text-forest font-bold">{CENTRE.weekly}</p>
              <p className="text-xs sm:text-sm mt-1 text-saffron font-medium">{CENTRE.rhythm}</p>
            </div>
          </div>
          <div className="relative w-full aspect-[4/5] sm:aspect-[16/9] md:aspect-auto md:min-h-full overflow-hidden">
            <Photo src={photos.hero} alt="Krishna deity with flute, flowers and lamps" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-[0.28em] uppercase text-saffron font-bold">Weekly programs</p>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-forest mt-1">This Week at ISKCON Margao</h2>
          </div>
          <Link href="/programs" className="text-sm font-medium text-forest hover:underline whitespace-nowrap">
            View all programs →
          </Link>
        </div>
        {thisWeek.length === 0 ? (
          <p className="mt-8 text-ink-muted">Programmes will appear here when they are announced.</p>
        ) : (
          <div className="mt-6 md:mt-8 grid md:grid-cols-2 gap-6">
            {thisWeek.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className="group border border-gold/20 bg-white/50 rounded-2xl overflow-hidden hover:border-gold/50 transition-colors shadow-sm"
              >
                <div className="relative h-44 sm:h-48">
                  <Photo
                    src={item.invitation_url || (i % 2 === 0 ? photos.kirtan : photos.community)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 text-[11px] font-bold tracking-widest uppercase bg-cream/95 text-forest px-3 py-1 rounded-full border border-gold/30">
                    {item.badge}
                  </span>
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="font-serif text-2xl text-forest group-hover:underline">{item.title}</h3>
                  <p className="text-sm text-ink-muted mt-1.5">{item.when}</p>
                  <p className="mt-2.5 text-ink-muted line-clamp-2 text-sm sm:text-base">{item.blurb}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 md:py-12 grid md:grid-cols-2 gap-6 md:gap-10 items-center">
        <div className="overflow-hidden rounded-2xl border border-gold/20 shadow-md aspect-[16/10] sm:aspect-auto min-h-[14rem] md:min-h-[18rem]">
          <Photo src={photos.community} alt="Community sitting together after kirtan" className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-[11px] tracking-[0.28em] uppercase text-saffron font-bold">Come as you are</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-forest mt-1.5">New to ISKCON?</h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-ink-muted leading-relaxed">
            You don&apos;t need to be a devotee or know anything beforehand. Come, listen to the kirtan, hear Krishna
            Katha and meet the community.
          </p>
          <Link href="/visit" className="inline-block mt-5 sm:mt-6 rounded-full bg-forest text-cream px-6 py-3 text-sm font-medium hover:bg-forest/90 shadow-sm transition">
            Plan Your First Visit →
          </Link>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-[11px] tracking-[0.28em] uppercase text-saffron text-center font-bold">What you&apos;ll experience</p>
          <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 md:gap-8 text-center">
            {[
              [photos.chanting, "Chant", "Experience kirtan and the congregational chanting of the Hare Krishna maha-mantra."],
              [photos.gita, "Learn", "Explore Bhagavad-gita and the teachings of Krishna."],
              [photos.prasadam, "Taste", "Share prasadam with the community."],
              [photos.community, "Connect", "Meet devotees and others interested in spiritual life."],
            ].map(([img, t, d]) => (
              <div key={t} className="bg-white/60 p-5 rounded-2xl border border-gold/20 shadow-sm flex flex-col items-center">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl mb-3.5">
                  <Photo src={img} alt="" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-serif text-2xl text-forest">{t}</h3>
                <p className="mt-1.5 text-sm text-ink-muted leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {featured && (
        <section className="mx-auto max-w-6xl px-4 pb-12 sm:pb-16">
          <div className="flex flex-col md:grid md:grid-cols-2 border border-gold/20 rounded-3xl overflow-hidden bg-white/40 shadow-sm">
            {/* Top Image on Mobile / Right Image on Desktop */}
            {featured.cover_url ? (
              <div className="w-full h-52 sm:h-64 md:h-auto min-h-[13rem] md:min-h-full relative overflow-hidden order-first md:order-last">
                <Photo src={featured.cover_url} alt={featured.title} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gold/20 via-cream to-cream-dark p-6 md:p-10 flex flex-col justify-center items-center text-center order-first md:order-last border-b md:border-b-0 md:border-l border-gold/20 min-h-[14rem]">
                <span className="text-4xl mb-2">🪷</span>
                <span className="font-serif text-xl text-forest font-semibold">{featured.title}</span>
                <span className="text-xs text-saffron font-bold uppercase tracking-widest mt-1">ISKCON Margao Celebration</span>
              </div>
            )}

            <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-between">
              <div>
                <p className="text-[11px] tracking-[0.28em] uppercase text-saffron font-bold">Upcoming Festival</p>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-forest mt-2">{featured.title}</h2>
                <p className="mt-3 text-forest font-medium text-sm sm:text-base">
                  {new Date(featured.date + "T12:00:00").toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  {featured.start_time ? ` · ${featured.start_time} onwards` : ""}
                </p>
                {featured.location && <p className="mt-1 text-xs sm:text-sm text-ink-muted">{featured.location}</p>}
                
                {featured.description && (
                  <p className="mt-3 sm:mt-4 text-ink-muted leading-relaxed text-sm sm:text-base line-clamp-3">
                    {featured.description}
                  </p>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href={`/festivals/${featured.slug}`}
                  className="rounded-full bg-forest text-cream px-6 py-2.5 text-sm font-medium hover:bg-forest/90 shadow-sm transition inline-flex items-center gap-1.5"
                >
                  <span>View Festival</span>
                  <span>→</span>
                </Link>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${featured.share_text || featured.title}\n\n${siteUrl(`/festivals/${featured.slug}`)}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-emerald-700 text-white hover:bg-emerald-800 px-5 py-2.5 text-sm font-medium transition-colors shadow-sm no-underline"
                >
                  Share on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="bg-forest text-cream py-14 sm:py-18 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-[11px] tracking-[0.28em] uppercase text-gold-soft font-bold">Be part of the journey</p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl mt-3">There is a place for you here.</h2>
          <p className="mt-3 sm:mt-5 text-base sm:text-lg text-cream/80 leading-relaxed max-w-2xl mx-auto">
            Come for the kirtan. Stay for the association. Find your own way to serve.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/visit" className="rounded-full bg-gold text-forest px-8 py-3.5 font-medium hover:bg-gold-soft shadow-md transition">
              Visit Us
            </Link>
            <Link href="/seva" className="rounded-full border border-cream/40 px-8 py-3.5 hover:bg-cream/10 font-medium transition">
              Serve With Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}