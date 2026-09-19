import { getAlbums, siteUrl } from "@/lib/api";
import { Breadcrumbs, PageHero } from "@/components/Page";
import Link from "next/link";
import type { Metadata } from "next";
import { Photo, photos } from "@/components/Photo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Gallery",
  description: "Photographs from kirtan, festivals and community at ISKCON Margao.",
  alternates: { canonical: siteUrl("/gallery") },
};

export default async function GalleryPage() {
  const albums = (await getAlbums()) ?? [];
  return (
    <>
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/gallery", label: "Gallery" }]} />
      <PageHero title="Gallery">
        Albums from Friday kirtan, Saturday programmes, festivals and community seva — uploaded by the team through the
        CMS.
      </PageHero>
      <div className="mx-auto max-w-6xl px-4 pb-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.length === 0 &&
          [
            { title: "Friday Kirtan", img: photos.kirtan },
            { title: "Janmashtami", img: photos.festival },
            { title: "Community & Seva", img: photos.community },
          ].map((a) => (
            <div key={a.title} className="border border-gold/25 overflow-hidden bg-white/40">
              <Photo src={a.img} alt="" className="w-full h-44 object-cover" />
              <div className="p-6">
                <h2 className="font-serif text-2xl">{a.title}</h2>
                <p className="mt-2 text-sm text-ink-muted">Sample album for layout. Real photos will replace this from the CMS.</p>
              </div>
            </div>
          ))}
        {albums.map((a) => (
          <Link key={a.id} href={`/gallery/${a.slug}`} className="border border-gold/25 overflow-hidden bg-white/40">
            <Photo src={a.cover_url || photos.kirtan} alt="" className="w-full h-44 object-cover" />
            <div className="p-6">
              <h2 className="font-serif text-2xl">{a.title}</h2>
              <p className="text-sm text-ink-muted mt-2">{a.date}</p>
              <p className="mt-2 text-ink-muted line-clamp-3">{a.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}