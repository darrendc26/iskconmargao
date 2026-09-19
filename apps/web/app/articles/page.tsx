import { getArticles, siteUrl } from "@/lib/api";
import { Breadcrumbs, PageHero } from "@/components/Page";
import Link from "next/link";
import type { Metadata } from "next";
import { Photo, photos } from "@/components/Photo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Explore articles on Krishna, Bhagavad-gita, bhakti-yoga, festivals and spiritual life from ISKCON Margao.",
  alternates: {
    canonical: siteUrl("/articles"),
  },
};

export default async function ArticlesPage() {
  const articles = (await getArticles()) ?? [];

  /*
   * Latest articles first.
   *
   * This supports common date field names so the page keeps
   * working even if your API uses publishedAt or createdAt.
   */
  const sortedArticles = [...articles].sort((a, b) => {
    const dateA = new Date(
      a.published_at ?? a.createdAt ?? 0
    ).getTime();

    const dateB = new Date(
      b.published_at ?? b.createdAt ?? 0
    ).getTime();

    return dateB - dateA;
  });

  const latestArticle = sortedArticles[0];
  const remainingArticles = sortedArticles.slice(1);

  return (
    <main className="bg-cream text-ink">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/articles", label: "Blogs" },
        ]}
      />

      {/* HERO */}
      <PageHero title="Blogs">
        Explore articles on Krishna, Bhagavad-gita, bhakti-yoga, festivals,
        spiritual life and more from ISKCON Margao.
      </PageHero>

      {/* BLOG CONTENT */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 sm:pb-24">
          {sortedArticles.length === 0 ? (
            <div className="rounded-[1.5rem] bg-white px-6 py-14 text-center shadow-sm">
              <h2 className="font-serif text-2xl text-forest">
                Blogs are coming soon
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-ink-muted">
                New articles and Krishna-conscious resources will appear here
                as they are published.
              </p>
            </div>
          ) : (
            <>
              {/* LATEST ARTICLE */}
              {latestArticle && (
                <Link
                  href={`/articles/${latestArticle.slug}`}
                  className="group block overflow-hidden rounded-[1.75rem] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="grid md:grid-cols-2">
                    <div className="overflow-hidden">
                      <Photo
                        src={latestArticle.cover_url || photos.gita}
                        alt={latestArticle.title}
                        className="h-64 w-full object-cover transition duration-500 group-hover:scale-[1.03] md:h-full md:min-h-[360px]"
                      />
                    </div>

                    <div className="flex flex-col justify-center p-7 sm:p-10">
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-saffron">
                        Latest
                        {latestArticle.category
                          ? ` · ${latestArticle.category}`
                          : ""}
                      </p>

                      <h2 className="mt-4 font-serif text-3xl leading-tight text-forest sm:text-4xl">
                        {latestArticle.title}
                      </h2>

                      {latestArticle.excerpt && (
                        <p className="mt-4 max-w-xl text-base leading-8 text-ink-muted">
                          {latestArticle.excerpt}
                        </p>
                      )}

                      <span className="mt-7 text-sm font-medium text-forest">
                        Read article
                        <span className="ml-2 transition group-hover:translate-x-1 inline-block">
                          →
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* ALL OTHER BLOGS */}
              {remainingArticles.length > 0 && (
                <div className="mt-14">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
                      More to explore
                    </h2>

                    <div className="h-px flex-1 bg-gold/20" />
                  </div>

                  <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {remainingArticles.map((article) => (
                      <Link
                        key={article.id}
                        href={`/articles/${article.slug}`}
                        className="group overflow-hidden rounded-[1.5rem] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                      >
                        <div className="overflow-hidden">
                          <Photo
                            src={article.cover_url || photos.gita}
                            alt={article.title}
                            className="h-44 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                          />
                        </div>

                        <div className="p-6">
                          {article.category && (
                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-saffron">
                              {article.category}
                            </p>
                          )}

                          <h3 className="mt-3 font-serif text-2xl leading-tight text-forest">
                            {article.title}
                          </h3>

                          {article.excerpt && (
                            <p className="mt-3 line-clamp-3 text-sm leading-7 text-ink-muted">
                              {article.excerpt}
                            </p>
                          )}

                          <span className="mt-5 inline-block text-sm font-medium text-forest">
                            Read article
                            <span className="ml-2 transition group-hover:translate-x-1 inline-block">
                              →
                            </span>
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CLOSING */}
      {sortedArticles.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8 sm:py-20">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
              Keep exploring
            </p>

            <h2 className="mt-4 font-serif text-3xl leading-tight text-forest sm:text-4xl">
              Read, reflect and return.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-ink-muted">
              Explore the topics that interest you and take your time with
              each article.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}