import { Breadcrumbs } from "@/components/Page";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/api";
import { Photo, photos } from "@/components/Photo";

export const metadata: Metadata = {
  title: "Sri Caitanya Mahaprabhu",
  description:
    "Learn about Sri Caitanya Mahaprabhu, the Pañca-tattva and the sankirtana movement of congregational chanting.",
  alternates: { canonical: siteUrl("/discover/caitanya") },
};

export default function Page() {
  return (
    <main className="bg-cream text-ink">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/discover", label: "Discover" },
          { href: "/discover/caitanya", label: "Caitanya Mahaprabhu" },
        ]}
      />

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8 sm:pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-forest/50">
              The golden avatar
            </p>

            <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-[1.05] text-forest sm:text-6xl lg:text-7xl">
              Sri Caitanya Mahaprabhu
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-ink-muted sm:text-xl">
              The teacher of sankirtana and the central figure of the
              Gaudiya-Vaishnava tradition followed by ISKCON.
            </p>
          </div>

          <div className="overflow-hidden rounded-[2rem]">
            <Photo
              src={photos.caitanya}
              alt="Sri Caitanya Mahaprabhu"
              className="h-[360px] w-full object-cover sm:h-[440px]"
            />
          </div>
        </div>
      </section>

      {/* WHO WAS CAITANYA */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
            Who was Sri Caitanya?
          </p>

          <h2 className="mt-4 max-w-3xl font-serif text-3xl leading-tight text-forest sm:text-4xl">
            A life centred on love of Krishna and the chanting of His holy names.
          </h2>

          <div className="mt-8 max-w-3xl space-y-5 text-base leading-8 text-ink-muted sm:text-lg">
            <p>
              Sri Caitanya Mahaprabhu appeared in Navadvipa, Bengal, in the
              late fifteenth century. He became the principal teacher and
              inspiration of the devotional movement that later became known
              as Gaudiya Vaishnavism.
            </p>

            <p>
              He taught that devotion to Krishna could be cultivated through
              hearing, chanting and devotional service. One of the most
              visible expressions of this teaching was <em>sankirtana</em> —
              the congregational chanting of the holy names.
            </p>

            <p>
              In the Gaudiya-Vaishnava understanding, Sri Caitanya Mahaprabhu
              is Krishna Himself appearing in the mood of His own devotee.
              His life demonstrated the very devotional path that He taught.
            </p>
          </div>
        </div>
      </section>

      {/* SANKIRTANA */}
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-cream/50">
                The sankirtana movement
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                Chanting together.
                <br />
                Sharing devotion.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-8 text-cream/70 sm:text-lg">
              <p>
                Sri Caitanya Mahaprabhu made congregational chanting of the
                holy names a central part of devotional life. His followers
                travelled, taught and gathered people together for sankirtana.
              </p>

              <p>
                The Hare Krishna maha-mantra and congregational kirtan practised
                in ISKCON continue this tradition of chanting the holy names
                together.
              </p>

              <div className="border-l border-cream/20 pl-5 pt-2 font-serif text-xl text-cream sm:text-2xl">
                Hare Krishna, Hare Krishna,
                <br />
                Krishna Krishna, Hare Hare
                <br />
                Hare Rama, Hare Rama,
                <br />
                Rama Rama, Hare Hare
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PANCHA TATTVA */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
              The Pañca-tattva
            </p>

            <h2 className="mt-4 font-serif text-3xl leading-tight text-forest sm:text-5xl">
              Five features of the Absolute Truth
            </h2>

            <p className="mt-6 text-base leading-8 text-ink-muted sm:text-lg">
              The Pañca-tattva refers to five manifestations who appeared
              together with Sri Caitanya Mahaprabhu. In the teachings of
              <em> Caitanya-caritāmṛta</em>, they are described as Sri
              Caitanya Mahaprabhu, Nityānanda Prabhu, Advaita Ācārya,
              Gadādhara Paṇḍita and Śrīvāsa Ṭhākura.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                number: "01",
                name: "Sri Caitanya Mahaprabhu",
                role: "Bhakta-rūpa",
                text: "The Supreme Lord appearing in the form of His own devotee.",
              },
              {
                number: "02",
                name: "Nityānanda Prabhu",
                role: "Bhakta-svarūpa",
                text: "The immediate expansion of Sri Caitanya Mahaprabhu.",
              },
              {
                number: "03",
                name: "Advaita Ācārya",
                role: "Bhaktāvatāra",
                text: "An incarnation of the Lord who played a central role in calling for His appearance.",
              },
              {
                number: "04",
                name: "Gadādhara Paṇḍita",
                role: "Bhakta-śakti",
                text: "Represents the Lord's internal devotional energy.",
              },
              {
                number: "05",
                name: "Śrīvāsa Ṭhākura",
                role: "Bhakta",
                text: "Represents the pure devotee and the community of devotees.",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="rounded-[1.5rem] bg-white p-6 sm:p-7"
              >
                <span className="text-xs tracking-[0.18em] text-forest/35">
                  {item.number}
                </span>

                <h3 className="mt-5 font-serif text-xl leading-tight text-forest">
                  {item.name}
                </h3>

                <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-forest/45">
                  {item.role}
                </p>

                <p className="mt-4 text-sm leading-7 text-ink-muted">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-3xl text-sm leading-7 text-ink-muted">
            Together, the Pañca-tattva are intimately connected with Sri
            Caitanya Mahaprabhu's sankirtana movement and the distribution of
            love of Godhead.
          </p>
        </div>
      </section>

      {/* WHY IT MATTERS TO ISKCON */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1fr] lg:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
                The tradition continues
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-tight text-forest sm:text-5xl">
                From sankirtana to ISKCON
              </h2>
            </div>

            <div className="space-y-5 text-base leading-8 text-ink-muted sm:text-lg">
              <p>
                The devotional tradition carried forward by the followers of
                Sri Caitanya Mahaprabhu eventually became the Gaudiya-Vaishnava
                tradition in which ISKCON stands.
              </p>

              <p>
                Centuries later, Srila Prabhupada carried this tradition beyond
                India and established the International Society for Krishna
                Consciousness in 1966.
              </p>

              <p>
                When people gather today for kirtan in an ISKCON centre, they
                are participating in a tradition whose central practice of
                congregational chanting traces back to Sri Caitanya Mahaprabhu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MARGAO */}
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-cream/50">
                In Margao
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                Sankirtana is still alive.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-8 text-cream/70 sm:text-lg">
                At ISKCON Margao, kirtan brings this tradition into the present
                through congregational chanting, Krishna Katha, prasadam and
                devotional association.
              </p>

              <div className="mt-8">
                <a
                  href="/visit"
                  className="inline-flex items-center rounded-full bg-cream px-6 py-3.5 text-sm font-medium text-forest transition hover:-translate-y-0.5"
                >
                  Experience kirtan
                  <span className="ml-2">→</span>
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem]">
              <Photo
                src={photos.community}
                alt="Devotees participating in kirtan"
                className="h-[360px] w-full object-cover sm:h-[440px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FESTIVAL */}
      <section className="bg-cream">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center sm:px-8 sm:py-24">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-forest/50">
            Celebrate Gaura Purnima
          </p>

          <h2 className="mt-4 font-serif text-4xl leading-tight text-forest sm:text-5xl">
            The appearance of Sri Caitanya Mahaprabhu
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
            Gaura Purnima commemorates the appearance of Sri Caitanya
            Mahaprabhu and is celebrated by devotees with chanting, worship,
            spiritual discussion and prasadam.
          </p>
        </div>
      </section>
    </main>
  );
}