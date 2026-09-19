import { getAlbum, siteUrl } from "@/lib/api";
import { Breadcrumbs, PageHero } from "@/components/Page";
import { ShareBar } from "@/components/ShareBar";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = await getAlbum(slug);
  if (!a) return { title: "Album" };
  return { title: a.title, description: a.description, alternates: { canonical: siteUrl(`/gallery/${a.slug}`) } };
}

export default async function AlbumPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await getAlbum(slug);
  if (!a) notFound();
  return (
    <>
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/gallery", label: "Gallery" },
          { href: `/gallery/${a.slug}`, label: a.title },
        ]}
      />
      <PageHero title={a.title}>{a.description}</PageHero>
      <div className="mx-auto max-w-6xl px-4 pb-8">
        <ShareBar text={`${a.title} — ISKCON Margao`} url={siteUrl(`/gallery/${a.slug}`)} />
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(a.photos || []).map((p) => (
          // eslint-disable-next-line @next/next/no-img-element
          <figure key={p.id}>
            <img src={p.url || p.thumb_url} alt={p.alt_text || a.title} className="w-full h-64 object-cover bg-cream-dark" />
            {p.caption && <figcaption className="text-sm mt-2 text-ink-muted">{p.caption}</figcaption>}
          </figure>
        ))}
      </div>
    </>
  );
}
