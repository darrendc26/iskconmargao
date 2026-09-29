import { Breadcrumbs } from "@/components/Page";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/api";
import Link from "next/link";
import { Photo, photos } from "@/components/Photo";

export const metadata: Metadata = {
  title: "Who is Krishna?",
  description:
    "Discover who Krishna is according to the Bhagavad-gita and the Gaudiya-Vaishnava tradition, and explore the path of bhakti.",
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

            <h1 className="mt-4 font-serif text-5xl leading-[1] tracking-tight text-forest sm:text-6xl lg:text-7xl">
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

      {/* Who is Krishna? */}
      <section className="border-y border-forest/10 bg-white/40">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-forest/60">
            The Supreme Person
          </p>

          <h2 className="mt-3 font-serif text-4xl leading-tight text-forest sm:text-5xl">
            A person to know, not merely an idea to understand.
          </h2>

          <div className="mt-8 space-y-6 text-base leading-8 text-ink-muted sm:text-lg">
            <p>
              The word <em>Krishna</em> means "all-attractive." In
              the Gaudiya-Vaishnava tradition, Krishna is understood
              as the Supreme Personality of Godhead — the eternal
              source of all beings and the supreme object of loving
              devotion.
            </p>

            <p>
              Krishna is described not as an abstract force, but as
              the Supreme Person with whom the living being can have
              an eternal relationship. The path of bhakti is therefore
              not simply about acquiring information about God; it is
              about awakening our relationship with Him.
            </p>

            <p>
              The Bhagavad-gita presents Krishna as the teacher of
              spiritual knowledge, while the Śrīmad-Bhāgavatam
              describes His qualities, activities and relationships
              with His devotees.
            </p>
          </div>
        </div>
      </section>

      {/* Why the name Krishna */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-20">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-forest/60">
              The name
            </p>

            <h2 className="mt-3 font-serif text-4xl leading-tight text-forest sm:text-5xl">
              Why is He called Krishna?
            </h2>
          </div>

          <div className="space-y-6 text-base leading-8 text-ink-muted sm:text-lg">
            <p>
              Krishna is known as <em>all-attractive</em>. His beauty,
              qualities, wisdom, compassion and loving relationships
              with His devotees are celebrated throughout Vaishnava
              scriptures.
            </p>

            <p>
              For devotees, Krishna's name is not separate from
              Krishna Himself. This is why chanting the holy names is
              such an important part of bhakti-yoga.
            </p>

            <p>
              The Hare Krishna maha-mantra brings these names together
              in a simple prayer of devotion and longing for loving
              service.
            </p>

            <Link
              href="/discover/chanting"
              className="inline-flex items-center text-sm font-medium text-forest"
            >
              Learn about the Hare Krishna maha-mantra →
            </Link>
          </div>
        </div>
      </section>

      {/* Krishna and Arjuna */}
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
            <div className="max-w-xl">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-cream/50">
                The Bhagavad-gita
              </p>

              <h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
                Krishna speaks to Arjuna.
              </h2>

              <p className="mt-7 text-base leading-8 text-cream/70 sm:text-lg">
                On the battlefield of Kurukshetra, Arjuna is faced
                with a profound moral and spiritual crisis. He turns
                to Krishna, his friend and charioteer, for guidance.
              </p>

              <p className="mt-5 text-base leading-8 text-cream/70 sm:text-lg">
                Their conversation becomes the Bhagavad-gita — a
                dialogue about the self, duty, action, knowledge,
                meditation and devotion.
              </p>

              <p className="mt-5 text-base leading-8 text-cream/70 sm:text-lg">
                Krishna gradually guides Arjuna from confusion toward
                spiritual understanding and devotion.
              </p>

              <Link
                href="/discover/bhagavad-gita"
                className="mt-8 inline-flex rounded-full bg-cream px-6 py-3 text-sm font-medium text-forest transition hover:-translate-y-0.5"
              >
                Explore the Bhagavad-gita
              </Link>
            </div>

            <div className="rounded-[2rem] border border-cream/10 bg-white/5 p-8 sm:p-10">
              <p className="font-serif text-2xl leading-relaxed sm:text-3xl">
                "How can I act rightly? What is my duty? Who am I?
                What is the purpose of life?"
              </p>

              <p className="mt-6 text-sm leading-6 text-cream/50">
                These are among the questions that lead Arjuna to seek
                Krishna's guidance — questions that remain meaningful
                for people today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Krishna's relationships */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-forest/60">
            Relationship
          </p>

          <h2 className="mt-3 font-serif text-4xl leading-tight text-forest sm:text-5xl">
            Krishna is known through relationship.
          </h2>

          <p className="mt-5 text-base leading-7 text-ink-muted sm:text-lg">
            Bhakti is personal. The scriptures describe many ways in
            which devotees relate to Krishna — with reverence,
            friendship, affection and love.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "The Supreme Lord",
              text: "Krishna is worshipped as the Supreme Personality of Godhead and the ultimate object of devotion.",
            },
            {
              title: "The Friend",
              text: "Krishna's relationship with Arjuna shows how divine guidance can be personal, intimate and loving.",
            },
            {
              title: "The Beloved",
              text: "The devotional traditions of Vrindavan celebrate the intimate loving relationships between Krishna and His devotees.",
            },
            {
              title: "The Guide",
              text: "Through the Bhagavad-gita, Krishna guides Arjuna toward knowledge, devotion and spiritual purpose.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[1.5rem] border border-forest/10 bg-white p-7"
            >
              <h3 className="font-serif text-2xl text-forest">
                {item.title}
              </h3>

              <p className="mt-4 text-sm leading-6 text-ink-muted">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bhakti */}
      <section className="border-y border-forest/10 bg-white/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-forest/60">
                The path of bhakti
              </p>

              <h2 className="mt-3 font-serif text-4xl leading-tight text-forest sm:text-5xl">
                Knowing Krishna through devotion.
              </h2>

              <p className="mt-6 text-base leading-8 text-ink-muted sm:text-lg">
                Bhakti-yoga is the path of loving devotional service
                to Krishna. It is expressed through hearing about
                Krishna, chanting His names, remembering Him, serving
                Him and associating with devotees.
              </p>

              <p className="mt-5 text-base leading-8 text-ink-muted sm:text-lg">
                These practices are not presented as something reserved
                for people who already know Sanskrit or understand
                everything about Vedic philosophy. They are practices
                that can be approached gradually, through sincere
                hearing and participation.
              </p>

              <Link
                href="/discover/bhakti-yoga"
                className="mt-8 inline-flex text-sm font-medium text-forest"
              >
                Discover Bhakti-yoga →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  number: "01",
                  title: "Hear",
                  text: "Listen to Krishna Katha and the teachings of the scriptures.",
                },
                {
                  number: "02",
                  title: "Chant",
                  text: "Chant the Hare Krishna maha-mantra, individually or together.",
                },
                {
                  number: "03",
                  title: "Remember",
                  text: "Keep Krishna and His teachings in our consciousness.",
                },
                {
                  number: "04",
                  title: "Serve",
                  text: "Offer our time, abilities and actions in devotional service.",
                },
              ].map((item) => (
                <div
                  key={item.number}
                  className="rounded-[1.5rem] bg-cream p-7"
                >
                  <p className="text-xs font-medium tracking-[0.18em] text-forest/40">
                    {item.number}
                  </p>

                  <h3 className="mt-4 font-serif text-2xl text-forest">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-ink-muted">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Holy name */}
      <section className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-forest/60">
          The holy name
        </p>

        <h2 className="mt-3 font-serif text-4xl leading-tight text-forest sm:text-5xl">
          Hare Krishna, Hare Krishna
        </h2>

        <div className="mx-auto mt-8 max-w-3xl rounded-[2rem] border border-forest/10 bg-white p-8 sm:p-12">
          <p className="font-serif text-2xl leading-relaxed text-forest sm:text-3xl">
            Hare Krishna Hare Krishna
            <br />
            Krishna Krishna Hare Hare
            <br />
            Hare Rama Hare Rama
            <br />
            Rama Rama Hare Hare
          </p>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
          For devotees, chanting the holy names is a direct and
          accessible practice of bhakti. Through kirtan and japa,
          one can hear the names of Krishna and gradually cultivate
          remembrance and devotion.
        </p>

        <Link
          href="/discover/chanting"
          className="mt-7 inline-flex text-sm font-medium text-forest"
        >
          Learn about chanting →
        </Link>
      </section>

      {/* Krishna at Margao */}
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-20">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-cream/50">
                Krishna at ISKCON Margao
              </p>

              <h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
                You can begin simply.
              </h2>

              <p className="mt-7 max-w-2xl text-base leading-8 text-cream/70 sm:text-lg">
                You do not need to understand everything before you
                begin. Come, listen, ask questions and experience the
                practices of bhakti for yourself.
              </p>

              <p className="mt-5 max-w-2xl text-base leading-8 text-cream/70 sm:text-lg">
                At ISKCON Margao, you can join congregational kirtan,
                hear Krishna Katha, explore the Bhagavad-gita and spend
                time in the association of devotees.
              </p>

              <Link
                href="/visit"
                className="mt-8 inline-flex rounded-full bg-cream px-7 py-3.5 text-sm font-medium text-forest transition hover:-translate-y-0.5"
              >
                Plan Your Visit
              </Link>
            </div>

            <div className="rounded-[2rem] border border-cream/10 bg-white/5 p-8 sm:p-10">
              <p className="text-sm uppercase tracking-[0.18em] text-cream/40">
                A simple beginning
              </p>

              <div className="mt-7 space-y-5">
                {[
                  "Hear Krishna Katha",
                  "Join the kirtan",
                  "Ask your questions",
                  "Explore the Bhagavad-gita",
                  "Meet devotees",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 border-b border-cream/10 pb-5 last:border-0 last:pb-0"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-cream/60" />
                    <span className="text-base text-cream/80">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore further */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-forest/60">
            Explore further
          </p>

          <h2 className="mt-3 font-serif text-4xl text-forest sm:text-5xl">
            Continue your journey.
          </h2>

          <p className="mt-5 text-base leading-7 text-ink-muted">
            Start with whichever question interests you. You do not
            have to understand everything at once.
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
            href="/discover/bhakti-yoga"
            className="group rounded-[1.5rem] border border-forest/10 bg-white p-7 transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
              Path
            </p>

            <h3 className="mt-4 font-serif text-2xl text-forest">
              Bhakti-yoga
            </h3>

            <p className="mt-3 text-sm leading-6 text-ink-muted">
              Discover the path of loving devotional service to
              Krishna.
            </p>

            <span className="mt-6 inline-block text-sm font-medium text-forest">
              Discover bhakti →
            </span>
          </Link>

          <Link
            href="/discover/srimad-bhagavatam"
            className="group rounded-[1.5rem] border border-forest/10 bg-white p-7 transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
              Scripture
            </p>

            <h3 className="mt-4 font-serif text-2xl text-forest">
              Śrīmad-Bhāgavatam
            </h3>

            <p className="mt-3 text-sm leading-6 text-ink-muted">
              Explore Krishna, His devotees and the stories of bhakti.
            </p>

            <span className="mt-6 inline-block text-sm font-medium text-forest">
              Explore the Bhāgavatam →
            </span>
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-cream-dark px-6 py-16 text-center sm:px-12 sm:py-20">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-forest/60">
            Experience it for yourself
          </p>

          <h2 className="mx-auto mt-4 max-w-2xl font-serif text-4xl leading-tight text-forest sm:text-5xl">
            Hear. Chant. Ask. Explore.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-ink-muted">
            Come to a programme at ISKCON Margao and experience
            kirtan, Krishna Katha and the association of devotees.
          </p>

          <Link
            href="/visit"
            className="mt-8 inline-flex rounded-full bg-forest px-7 py-3.5 text-sm font-medium text-cream transition hover:-translate-y-0.5"
          >
            Plan Your Visit
          </Link>
        </div>
      </section>
    </main>
  );
}