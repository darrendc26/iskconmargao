import { siteUrl } from "@/lib/api";
import { Breadcrumbs } from "@/components/Page";
import type { Metadata } from "next";
import { Photo, photos } from "@/components/Photo";
import { CENTRE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About ISKCON Margao",
  description:
    "Learn about ISKCON Margao, a centre of the International Society for Krishna Consciousness serving Margao and South Goa.",
  alternates: { canonical: siteUrl("/about") },
};

export default function AboutPage() {
  return (
    <main className="bg-cream text-ink">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/about", label: "About" },
        ]}
      />

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8 sm:pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-forest/50">
              ISKCON Margao · South Goa
            </p>

            <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-[1.05] text-forest sm:text-6xl lg:text-7xl">
              About ISKCON Margao
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-ink-muted sm:text-xl">
              A local centre of the International Society for Krishna
              Consciousness, where people come together for kirtan, Krishna
              Katha, prasadam, service and spiritual association.
            </p>
          </div>

          <div className="overflow-hidden rounded-[2rem]">
            <Photo
              src={photos.kirtan}
              alt="Kirtan gathering at ISKCON Margao"
              className="h-[360px] w-full object-cover sm:h-[460px]"
            />
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1fr] lg:items-start">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
                Who we are
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-tight text-forest sm:text-5xl">
                A place to gather, hear and serve.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-8 text-ink-muted sm:text-lg">
              <p>
                ISKCON Margao is a centre of the International Society for
                Krishna Consciousness serving people in Margao and across
                South Goa.
              </p>

              <p>
                We gather to chant the holy names of Krishna, hear and discuss
                spiritual knowledge, share prasadam and cultivate meaningful
                association with others on the path of bhakti-yoga.
              </p>

              <p>
                The centre currently meets at Matchless Gifts, next to Borkar
                Hospital in Margao. Our regular gatherings are centred around
                Friday and Saturday programmes, along with festivals and other
                activities as announced.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT HAPPENS HERE */}
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-cream/45">
              Life at the centre
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              Simple gatherings. Meaningful connection.
            </h2>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Kirtan",
                text: "Come together to chant the holy names with music and devotion.",
              },
              {
                title: "Krishna Katha",
                text: "Hear and discuss the teachings of Krishna and the bhakti tradition.",
              },
              {
                title: "Prasadam",
                text: "Share food prepared and offered with devotion.",
              },
              {
                title: "Seva",
                text: "Offer your time, skills and energy in devotional service.",
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

      {/* ISKCON CONNECTION */}
      <section className="bg-cream">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
                Our place within ISKCON
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-tight text-forest sm:text-5xl">
                Part of a worldwide tradition.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-8 text-ink-muted sm:text-lg">
              <p>
                ISKCON — the International Society for Krishna Consciousness —
                was founded in 1966 by His Divine Grace A.C. Bhaktivedanta
                Swami Prabhupada.
              </p>

              <p>
                ISKCON stands within the Gaudiya-Vaishnava tradition and
                teaches bhakti-yoga, the path of loving devotional service to
                Krishna.
              </p>

              <p>
                ISKCON Margao is one of the centres connected with ISKCON Goa,
                bringing this tradition into the local community of South Goa.
              </p>

              <div className="pt-2">
                <a
                  href={CENTRE.iskconWhat}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-forest underline decoration-forest/25 underline-offset-4 transition hover:decoration-forest"
                >
                  Learn what ISKCON is
                  <span className="ml-2">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR VISION */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1fr] lg:items-center">
            <div className="overflow-hidden rounded-[2rem]">
              <Photo
                src={photos.community}
                alt="Community gathering at ISKCON Margao"
                className="h-[360px] w-full object-cover sm:h-[460px]"
              />
            </div>

            <div className="lg:pl-8">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
                Looking ahead
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-tight text-forest sm:text-5xl">
                A spiritual home for South Goa.
              </h2>

              <div className="mt-6 space-y-5 text-base leading-8 text-ink-muted sm:text-lg">
                <p>
                  Our hope is to nurture a welcoming spiritual community where
                  people can come together to chant, hear Krishna Katha,
                  honour prasadam, celebrate festivals and engage in service.
                </p>

                <p>
                  As the community grows, we hope to create an even stronger
                  spiritual home for people across South Goa.
                </p>
              </div>

              <div className="mt-8">
                <a
                  href="/about/our-journey"
                  className="inline-flex items-center rounded-full bg-forest px-6 py-3.5 text-sm font-medium text-cream transition hover:-translate-y-0.5"
                >
                  Our journey
                  <span className="ml-2">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 sm:py-28">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-cream/45">
            Come and experience it
          </p>

          <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
            There is a place for you here.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-cream/65 sm:text-lg">
            Join us for kirtan, Krishna Katha and prasadam at ISKCON Margao.
          </p>

          <div className="mt-8">
            <a
              href="/visit"
              className="inline-flex items-center rounded-full bg-cream px-7 py-3.5 text-sm font-medium text-forest transition hover:-translate-y-0.5"
            >
              Plan your visit
              <span className="ml-2">→</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}