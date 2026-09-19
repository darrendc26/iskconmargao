import { Breadcrumbs } from "@/components/Page";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/api";
import Link from "next/link";
import { Photo, photos } from "@/components/Photo";

export const metadata: Metadata = {
  title: "Who is Krishna?",
  description:
    "Discover who Krishna is according to the Bhagavad-gita and the Gaudiya-Vaishnava tradition.",
  alternates: { canonical: siteUrl("/discover/krishna") },
};

export default function Page() {
  return (
    <main className="bg-cream text-ink">
      {/* Breadcrumbs */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/discover", label: "Discover" },
            { href: "/discover/krishna", label: "Krishna" },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pb-24 lg:px-8 lg:pt-12">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="max-w-xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-forest/60">
              Discover Krishna
            </p>

            <h1 className="mt-4 font-serif text-5xl leading-[1] tracking-tight text-forest sm:text-6xl">
              Who is Krishna?
            </h1>

            <p className="mt-7 text-lg leading-8 text-ink-muted sm:text-xl">
              In the Gaudiya-Vaishnava tradition, Krishna is the
              Supreme Personality of Godhead — the Supreme Lord,
              all-attractive and personal, and the eternal object of
              loving devotional service.
            </p>
          </div>

          <div className="overflow-hidden rounded-[2rem]">
            <Photo
              src={photos.hero}
              alt="Krishna deity"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="border-y border-forest/10 bg-white/40">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <p className="font-serif text-3xl leading-relaxed text-forest sm:text-4xl">
            "The Bhagavad-gita invites us to hear, inquire and
            understand."
          </p>

          <div className="mt-10 max-w-3xl space-y-6 text-base leading-8 text-ink-muted">
            <p>
              In the Bhagavad-gita, Krishna speaks to Arjuna about
              the nature of the self, the world, duty and devotion
              to God.
            </p>

            <p>
              In the Gaudiya-Vaishnava tradition, these teachings
              form part of a path of bhakti — developing a loving
              relationship with the Supreme through hearing,
              chanting, remembrance and devotional service.
            </p>

            <p>
              You are welcome to explore these teachings at your own
              pace. At ISKCON Margao, you can experience kirtan,
              hear Krishna Katha, explore the Bhagavad-gita and ask
              questions along the way.
            </p>
          </div>
        </div>
      </section>

      {/* Explore */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-forest/60">
            Explore further
          </p>

          <h2 className="mt-3 font-serif text-4xl text-forest sm:text-5xl">
            Begin wherever you are.
          </h2>

          <p className="mt-5 text-base leading-7 text-ink-muted">
            There is no need to understand everything at once.
            Start with a question that interests you.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <Link
            href="/discover/bhagavad-gita"
            className="group rounded-[1.5rem] border border-forest/10 bg-white p-7 transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
              Scripture
            </p>

            <h3 className="mt-4 font-serif text-2xl text-forest">
              Bhagavad-gita
            </h3>

            <p className="mt-3 text-sm leading-6 text-ink-muted">
              Explore the conversation between Krishna and Arjuna.
            </p>

            <span className="mt-6 inline-block text-sm font-medium text-forest">
              Explore the Gita →
            </span>
          </Link>

          <Link
            href="/discover/chanting"
            className="group rounded-[1.5rem] border border-forest/10 bg-white p-7 transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
              Practice
            </p>

            <h3 className="mt-4 font-serif text-2xl text-forest">
              Chanting
            </h3>

            <p className="mt-3 text-sm leading-6 text-ink-muted">
              Learn about the Hare Krishna maha-mantra and
              congregational kirtan.
            </p>

            <span className="mt-6 inline-block text-sm font-medium text-forest">
              Discover chanting →
            </span>
          </Link>

          <Link
            href="/articles"
            className="group rounded-[1.5rem] border border-forest/10 bg-white p-7 transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
              Learn
            </p>

            <h3 className="mt-4 font-serif text-2xl text-forest">
              Krishna & Bhakti
            </h3>

            <p className="mt-3 text-sm leading-6 text-ink-muted">
              Read simple introductions and deeper explorations of
              Krishna-consciousness.
            </p>

            <span className="mt-6 inline-block text-sm font-medium text-forest">
              Browse the library →
            </span>
          </Link>
        </div>
      </section>

      {/* Visit CTA */}
      <section className="px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-forest px-6 py-16 text-center text-cream sm:px-12 sm:py-20">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cream/50">
            Experience it for yourself
          </p>

          <h2 className="mx-auto mt-4 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
            Hear. Chant. Ask. Explore.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-cream/70">
            Come to a programme at ISKCON Margao and experience
            kirtan, Krishna Katha and the association of the
            community.
          </p>

          <Link
            href="/visit"
            className="mt-8 inline-flex rounded-full bg-cream px-7 py-3.5 text-sm font-medium text-forest transition hover:-translate-y-0.5"
          >
            Plan Your Visit
          </Link>
        </div>
      </section>
    </main>
  );
}