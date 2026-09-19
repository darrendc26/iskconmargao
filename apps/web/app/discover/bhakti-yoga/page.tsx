import { Breadcrumbs } from "@/components/Page";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/api";
import { Photo, photos } from "@/components/Photo";

export const metadata: Metadata = {
  title: "Bhakti-yoga",
  description:
    "Explore bhakti-yoga, the path of loving devotional service to Krishna, and how it is practised through chanting, hearing, prasadam and seva.",
  alternates: { canonical: siteUrl("/discover/bhakti-yoga") },
};

export default function Page() {
  return (
    <main className="bg-cream text-ink">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/discover", label: "Discover" },
          { href: "/discover/bhakti-yoga", label: "Bhakti-yoga" },
        ]}
      />

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8 sm:pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-forest/50">
              The path of devotion
            </p>

            <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-[1.05] text-forest sm:text-6xl lg:text-7xl">
              Bhakti-yoga
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-ink-muted sm:text-xl">
              A path of loving devotional service to Krishna — through
              hearing, chanting, remembering, serving and cultivating a
              relationship with the Supreme.
            </p>
          </div>

          <div className="overflow-hidden rounded-[2rem]">
            <Photo
              src={photos.lotus}
              alt="Lotus offering"
              className="h-[360px] w-full object-cover sm:h-[440px]"
            />
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
            What is bhakti?
          </p>

          <h2 className="mt-4 max-w-3xl font-serif text-3xl leading-tight text-forest sm:text-4xl">
            Yoga means connection.
            <br />
            Bhakti is the path of loving devotion.
          </h2>

          <div className="mt-8 max-w-3xl space-y-5 text-base leading-8 text-ink-muted sm:text-lg">
            <p>
              The word <em>bhakti</em> comes from the Sanskrit root meaning
              devotion or loving service. Bhakti-yoga is the process of
              reconnecting with Krishna through devotional activities.
            </p>

            <p>
              Rather than being only a set of ideas, bhakti is something
              practised. We hear about Krishna, chant His names, remember
              Him, offer food, serve others and associate with devotees.
            </p>

            <p>
              In this way, spiritual life becomes something that can be
              experienced in everyday life — not simply studied as a
              philosophy.
            </p>
          </div>
        </div>
      </section>

      {/* PRACTICE */}
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-cream/50">
              How is it practised?
            </p>

            <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-5xl">
              Devotion is expressed through practice.
            </h2>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-[1.5rem] bg-cream/15 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                number: "01",
                title: "Hear",
                text: "Hear the names, teachings and pastimes of Krishna through kirtan, Krishna Katha and the scriptures.",
              },
              {
                number: "02",
                title: "Chant",
                text: "Chant the Hare Krishna maha-mantra, individually or together with others in kirtan.",
              },
              {
                number: "03",
                title: "Remember",
                text: "Gradually bring Krishna into your thoughts and daily life through remembrance and spiritual practice.",
              },
              {
                number: "04",
                title: "Serve",
                text: "Offer your time, skills and energy in service to Krishna and the devotional community.",
              },
              {
                number: "05",
                title: "Offer",
                text: "Learn to offer food, actions and the results of your work in a spirit of devotion.",
              },
              {
                number: "06",
                title: "Associate",
                text: "Spend time with people who are also trying to develop their spiritual lives through bhakti.",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="bg-forest p-7 sm:p-8"
              >
                <span className="text-xs tracking-[0.18em] text-cream/40">
                  {item.number}
                </span>

                <h3 className="mt-6 font-serif text-2xl text-cream">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-cream/65">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GOAL */}
      <section className="bg-cream">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1fr] lg:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
                The goal
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-tight text-forest sm:text-5xl">
                Not simply knowing about Krishna.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-8 text-ink-muted sm:text-lg">
              <p>
                In bhakti-yoga, spiritual knowledge and devotional practice
                come together. The aim is to awaken our eternal relationship
                with Krishna and develop genuine love and devotion for Him.
              </p>

              <p>
                This is why bhakti is described as a path of the heart as well
                as a path of knowledge and practice. As devotion develops,
                spiritual life becomes a relationship rather than merely an
                intellectual subject.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MARGAO */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="overflow-hidden rounded-[2rem]">
              <Photo
                src={photos.community}
                alt="Devotees participating in kirtan"
                className="h-[360px] w-full object-cover sm:h-[480px]"
              />
            </div>

            <div className="lg:pl-8">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
                Bhakti at ISKCON Margao
              </p>

              <h2 className="mt-4 font-serif text-3xl leading-tight text-forest sm:text-5xl">
                You can experience it for yourself.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-8 text-ink-muted sm:text-lg">
                At the Margao centre, bhakti-yoga comes alive through
                congregational kirtan, Krishna Katha, prasadam and devotional
                service.
              </p>

              <p className="mt-5 max-w-xl text-base leading-8 text-ink-muted">
                You do not need to know Sanskrit or have practised yoga
                before. You can simply come, listen, participate in kirtan,
                ask questions and gradually explore the path at your own
                pace.
              </p>

              <div className="mt-8">
                <a
                  href="/visit"
                  className="inline-flex items-center rounded-full bg-forest px-6 py-3.5 text-sm font-medium text-cream transition hover:-translate-y-0.5"
                >
                  Visit ISKCON Margao
                  <span className="ml-2">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className="bg-forest">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 sm:py-28">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-cream/45">
            Begin simply
          </p>

          <h2 className="mt-4 font-serif text-4xl leading-tight text-cream sm:text-5xl">
            Hear. Chant. Serve. Remember.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-cream/65 sm:text-lg">
            Bhakti-yoga is not something you have to understand all at once.
            It begins with taking a step toward Krishna.
          </p>
        </div>
      </section>
    </main>
  );
}