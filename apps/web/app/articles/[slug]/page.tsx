import { getArticle, siteUrl } from "@/lib/api";
import { Breadcrumbs, PageHero, Prose } from "@/components/Page";
import { ShareBar } from "@/components/ShareBar";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) return { title: "Article" };
  return {
    title: a.seo_title || a.title,
    description: a.seo_description || a.excerpt,
    alternates: { canonical: siteUrl(`/articles/${a.slug}`) },
    openGraph: { title: a.title, description: a.excerpt, url: siteUrl(`/articles/${a.slug}`) },
  };
}

import { ArticleContent } from "@/components/ArticleContent";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.excerpt,
    author: { "@type": "Organization", name: a.author || "ISKCON Margao" },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/articles", label: "Articles" },
          { href: `/articles/${a.slug}`, label: a.title },
        ]}
      />
      <PageHero eyebrow={a.category} title={a.title}>
        {a.excerpt}
      </PageHero>
      {a.cover_url && (
        <div className="mx-auto max-w-4xl px-4 mb-8">
          <img
            src={a.cover_url}
            alt={a.title}
            className="w-full h-72 md:h-[450px] object-cover rounded-3xl shadow-xl border border-gold/30"
          />
        </div>
      )}
      <Prose>
        <ArticleContent content={a.content} />
        <div className="not-prose mt-8">
          <ShareBar text={`${a.title} — ISKCON Margao`} url={siteUrl(`/articles/${a.slug}`)} />
        </div>
      </Prose>
    </>
  );
}
