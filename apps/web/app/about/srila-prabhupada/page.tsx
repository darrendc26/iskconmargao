import { Breadcrumbs } from "@/components/Page";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/api";
import { CENTRE } from "@/lib/site";
import { Photo, photos } from "@/components/Photo";

export const metadata: Metadata = {
  title: "Srila Prabhupada",
  description:
    "His Divine Grace A.C. Bhaktivedanta Swami Prabhupada, Founder-Acharya of the International Society for Krishna Consciousness.",
  alternates: { canonical: siteUrl("/about/srila-prabhupada") },
};

export default function Page() {
  return (
    <main className="bg-cream text-ink">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/about", label: "About" },
          {
            href: "/about/srila-prabhupada",
            label: "Srila Prabhupada",
          },
        ]}
      />

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8 sm:pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-forest/50">
              Founder-Acharya of ISKCON
            </p>

            <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[1.05] text-forest sm:text-6xl lg:text-7xl">
              Srila Prabhupada
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-ink-muted sm:text-xl">
              His Divine Grace A.C. Bhaktivedanta Swami Prabhupada carried
              Krishna consciousness from India to communities around the
              world.
            </p>
          </div>

          <div className="overflow-hidden rounded-[2rem]">
            <Photo
              src={photos.srilaprabhupada}
              alt="Srila Prabhupada"
              className="h-[420px] w-full object-cover object-top sm:h-[520px]"
            />
          </div>
        </div>
      </section>

      {/* EARLY LIFE */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
            Before ISKCON
          </p>

          <h2 className="mt-4 max-w-3xl font-serif text-3xl leading-tight text-forest sm:text-4xl">
            A life shaped by devotion to Krishna.
          </h2>

          <div className="mt-8 max-w-3xl space-y-5 text-base leading-8 text-ink-muted sm:text-lg">
            <p>
              Srila Prabhupada was born Abhay Charan De in Calcutta in 1896.
              From childhood he was connected with the worship of Krishna and
              the devotional traditions of Bengal.
            </p>

            <p>
              In 1922, he met Srila Bhaktisiddhanta Sarasvati Thakura, the
              prominent Gaudiya-Vaishnava teacher of his time. He was asked to
              present the teachings of Sri Caitanya Mahaprabhu and Krishna
              consciousness in the English-speaking world.
            </p>

            <p>
              That instruction became the central mission of his later life.
            </p>
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-cream/45">
              The journey
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              From Calcutta to New York.
            </h2>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-[1.5rem] bg-cream/15 md:grid-cols-4">
            {[
              {
                year: "1896",
                title: "Born in Calcutta",
                text: "Abhay Charan De is born in Calcutta, India.",
              },
              {
                year: "1922",
                title: "An important meeting",
                text: "He meets Srila Bhaktisiddhanta Sarasvati Thakura and receives the instruction to preach Krishna consciousness in the West.",
              },
              {
                year: "1965",
                title: "Travels to America",
                text: "At the age of 69, he travels from India to the United States by sea.",
              },
              {
                year: "1966",
                title: "ISKCON begins",
                text: "He establishes the International Society for Krishna Consciousness in New York City.",
              },
            ].map((item) => (
              <div
                key={item.year}
                className="bg-forest p-7 sm:p-8"
              >
                <p className="font-serif text-2xl text-cream">
                  {item.year}
                </p>

                <h3 className="mt-5 text-base font-medium text-cream">
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

      {/* BUILDING ISKCON */}
      <section className="bg-cream">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1fr] lg:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
                Building a movement
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-tight text-forest sm:text-5xl">
                A tradition carried across the world.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-8 text-ink-muted sm:text-lg">
              <p>
                What began in a small storefront in New York grew into an
                international movement of temples, centres, farms,
                restaurants, educational projects and communities.
              </p>

              <p>
                Srila Prabhupada established temples, trained disciples,
                organised devotional communities and encouraged the
                distribution of Krishna consciousness through chanting,
                prasadam, devotional service and spiritual literature.
              </p>

              <p>
                He remained actively engaged in guiding the movement until
                his passing in Vrindavan in 1977.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BOOKS */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
                His books
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-tight text-forest sm:text-5xl">
                Teachings preserved in books.
              </h2>
            </div>

            <div>
              <p className="max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
                Srila Prabhupada translated and wrote extensive explanations
                of important Vaishnava texts. His works include
                <em> Bhagavad-gita As It Is</em>, the
                <em> Srimad-Bhagavatam</em> and
                <em> Sri Caitanya-caritamrita</em>.
              </p>

              <p className="mt-5 max-w-2xl text-base leading-8 text-ink-muted">
                His books remain a central part of study and spiritual
                education within ISKCON.
              </p>

              <div className="mt-8">
                <a
                  href={CENTRE.prabhupadaBooks}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full bg-forest px-6 py-3.5 text-sm font-medium text-cream transition hover:-translate-y-0.5"
                >
                  Explore Srila Prabhupada&apos;s books
                  <span className="ml-2">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LEGACY */}
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 sm:py-28">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-cream/45">
            His legacy
          </p>

          <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
            The chanting continues.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-cream/65 sm:text-lg">
            The communities established by Srila Prabhupada continue to
            practise and share Krishna consciousness through chanting,
            hearing, devotional service, prasadam and spiritual literature.
          </p>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-cream/65">
            ISKCON Margao is one of the centres connected with this worldwide
            movement, serving the community of Margao and South Goa.
          </p>
        </div>
      </section>

      {/* CLOSING */}
      <section className="bg-cream">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center sm:px-8 sm:py-24">
          <h2 className="font-serif text-3xl text-forest sm:text-4xl">
            Explore Krishna consciousness
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-ink-muted">
            Learn about the tradition Srila Prabhupada carried to the world,
            or experience it through kirtan and Krishna Katha at ISKCON
            Margao.
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
      </section>
    </main>
  );
}