import { Breadcrumbs, PageHero, Prose } from "@/components/Page";
import type { Metadata } from "next";
import { siteUrl, apiGet } from "@/lib/api";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Videos",
  description: "Kirtan and program videos from ISKCON Margao.",
  alternates: { canonical: siteUrl("/videos") },
};

export default async function Page() {
  const videos = (await apiGet<{ title: string; slug: string; description: string; youtube_url: string }[]>("/api/v1/videos")) ?? [];
  return (
    <>
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/videos", label: "Videos" }]} />
      <PageHero title="Videos">Recordings will appear here when the team publishes them. We do not autoplay audio or video.</PageHero>
      <Prose>
        {videos.length === 0 && <p>No videos published yet.</p>}
        {videos.map((v) => (
          <article key={v.slug} className="mb-8">
            <h2>{v.title}</h2>
            <p>{v.description}</p>
            {v.youtube_url && (
              <p>
                <a href={v.youtube_url}>Watch on YouTube</a>
              </p>
            )}
          </article>
        ))}
      </Prose>
    </>
  );
}
