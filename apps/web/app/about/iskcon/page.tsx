import { PageHero, Breadcrumbs } from "@/components/Page";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/api";
import { CENTRE } from "@/lib/site";
import { Photo, photos } from "@/components/Photo";

export const metadata: Metadata = {
  title: "What is ISKCON?",
  description:
    "Learn about ISKCON, the International Society for Krishna Consciousness, founded by Srila Prabhupada in 1966.",
  alternates: { canonical: siteUrl("/about/iskcon") },
};

export default function Page() {
  return (
    <main className="bg-cream text-ink">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/about", label: "About" },
          { href: "/about/iskcon", label: "ISKCON" },
        ]}
      />

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8 sm:pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-forest/50">
              The International Society for Krishna Consciousness
            </p>

            <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-[1.05] text-forest sm:text-6xl lg:text-7xl">
              What is ISKCON?
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-ink-muted sm:text-xl">
              A worldwide spiritual movement centred on bhakti-yoga,
              devotional service to Krishna, and the teachings of
              Srila Prabhupada.
            </p>
          </div>

          <div className="overflow-hidden rounded-[2rem]">
            <Photo
              src={photos.srilaprabhupada}
              alt="Srila Prabhupada"
              className="h-[380px] w-full object-cover object-top sm:h-[480px]"
            />
          </div>
        </div>
      </section>

      {/* WHAT IS ISKCON */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1fr] lg:items-start">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
                At its heart
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-tight text-forest sm:text-5xl">
                Krishna consciousness through bhakti.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-8 text-ink-muted sm:text-lg">
              <p>
                ISKCON — the International Society for Krishna Consciousness —
                was founded by His Divine Grace A.C. Bhaktivedanta Swami
                Prabhupada in New York City in 1966.
              </p>

              <p>
                ISKCON teaches the path of <em>bhakti-yoga</em>, or loving
                devotional service to Krishna, the Supreme Personality of
                Godhead. Its teachings stand within the Gaudiya-Vaishnava
                tradition associated with Sri Caitanya Mahaprabhu.
              </p>

              <p>
                The Bhagavad-gita and Srimad-Bhagavatam are among the principal
                scriptures studied and taught within ISKCON.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IT LOOKS LIKE */}
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-cream/45">
              A living tradition
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              What does ISKCON actually do?
            </h2>

            <p className="mt-5 text-base leading-8 text-cream/65 sm:text-lg">
              ISKCON communities practise Krishna consciousness through
              devotional activities that can be experienced together.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Kirtan",
                text: "Congregational chanting of the Hare Krishna maha-mantra.",
              },
              {
                title: "Hearing",
                text: "Learning about Krishna through Bhagavad-gita, Srimad-Bhagavatam and spiritual discussions.",
              },
              {
                title: "Prasadam",
                text: "Food prepared and offered with devotion, then shared as prasadam.",
              },
              {
                title: "Seva",
                text: "Using our time, skills and energy in devotional service.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border border-cream/10 bg-cream/5 p-7"
              >
                <h3 className="font-serif text-2xl text-cream">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-cream/60">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAITANYA CONNECTION */}
      <section className="bg-cream">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="overflow-hidden rounded-[2rem]">
              <Photo
                src={photos.caitanya}
                alt="Sri Caitanya Mahaprabhu"
                className="h-[360px] w-full object-cover sm:h-[440px]"
              />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
                A tradition with deep roots
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-tight text-forest sm:text-5xl">
                From Sri Caitanya Mahaprabhu to ISKCON.
              </h2>

              <div className="mt-6 space-y-5 text-base leading-8 text-ink-muted sm:text-lg">
                <p>
                  ISKCON belongs to the Gaudiya-Vaishnava tradition, which
                  traces its devotional lineage through teachers in the
                  disciplic succession associated with Sri Caitanya Mahaprabhu.
                </p>

                <p>
                  Sri Caitanya Mahaprabhu emphasised congregational chanting
                  of the holy names. Centuries later, Srila Prabhupada carried
                  this tradition beyond India and established ISKCON.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEVEN PURPOSES */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
              Why was ISKCON established?
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight text-forest sm:text-5xl">
              Seven purposes.
            </h2>

            <p className="mt-5 text-base leading-8 text-ink-muted sm:text-lg">
              When ISKCON was incorporated in 1966, Srila Prabhupada stated
              seven purposes for the Society. Together, they describe its
              spiritual, educational and community mission.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                number: "01",
                title: "Spiritual knowledge",
                text: "To systematically propagate spiritual knowledge and educate people in the techniques of spiritual life.",
              },
              {
                number: "02",
                title: "Krishna consciousness",
                text: "To propagate Krishna consciousness as revealed in Bhagavad-gita and Srimad-Bhagavatam.",
              },
              {
                number: "03",
                title: "Sankirtana",
                text: "To bring members together and encourage the sankirtana movement of Sri Caitanya Mahaprabhu.",
              },
              {
                number: "04",
                title: "Practical understanding",
                text: "To teach a simpler and more natural way of life and encourage practical spiritual culture.",
              },
              {
                number: "05",
                title: "Spiritual community",
                text: "To create places where members can come together to cultivate Krishna consciousness.",
              },
              {
                number: "06",
                title: "Sharing knowledge",
                text: "To bring members closer together and develop their understanding through devotional association.",
              },
              {
                number: "07",
                title: "Books and publications",
                text: "To publish and distribute periodicals, books and other writings that advance these purposes.",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="rounded-[1.5rem] bg-cream p-7 sm:p-8"
              >
                <span className="text-xs tracking-[0.18em] text-forest/35">
                  {item.number}
                </span>

                <h3 className="mt-5 font-serif text-2xl text-forest">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-ink-muted">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <a
              href={CENTRE.gbcWhat}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-forest underline decoration-forest/25 underline-offset-4 transition hover:decoration-forest"
            >
              Read the official GBC overview
              <span className="ml-2">↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* ISKCON MARGAO */}
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1fr] lg:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-cream/45">
                ISKCON in South Goa
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                ISKCON Margao
              </h2>

              <p className="mt-6 max-w-xl text-base leading-8 text-cream/65 sm:text-lg">
                ISKCON Margao is a local centre of ISKCON Goa, where people
                can come together for kirtan, Krishna Katha, prasadam,
                devotional association and service.
              </p>

              <div className="mt-8">
                <a
                  href="/visit"
                  className="inline-flex items-center rounded-full bg-cream px-6 py-3.5 text-sm font-medium text-forest transition hover:-translate-y-0.5"
                >
                  Visit ISKCON Margao
                  <span className="ml-2">→</span>
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem]">
              <Photo
                src={photos.community}
                alt="ISKCON devotees gathered together"
                className="h-[360px] w-full object-cover sm:h-[440px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className="bg-cream">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center sm:px-8 sm:py-24">
          <h2 className="font-serif text-3xl text-forest sm:text-4xl">
            A worldwide movement, experienced locally.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
            From the chanting of the holy names to the study of Krishna's
            teachings, ISKCON brings an ancient devotional tradition into
            everyday community life.
          </p>
        </div>
      </section>
    </main>
  );
}