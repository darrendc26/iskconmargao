import { Breadcrumbs } from "@/components/Page";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/api";
import Link from "next/link";
import { Photo, photos } from "@/components/Photo";

export const metadata: Metadata = {
  title: "Srimati Radharani | The Goddess of Devotion",
  description:
    "Discover the beauty, compassion, devotion and divine love of Srimati Radharani, the beloved of Lord Krishna.",
  alternates: { canonical: siteUrl("/discover/radha-rani") },
};

export default function Page() {
  return (
    <main className="bg-cream text-ink">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/discover", label: "Discover" },
          { href: "/discover/radha-rani", label: "Radha Rani" },
        ]}
      />

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8 sm:pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-forest/50">
              The Goddess of Devotion
            </p>

            <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-[1.05] text-forest sm:text-6xl lg:text-7xl">
              Srimati Radharani
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-ink-muted sm:text-xl">
              The beloved of Lord Krishna, Srimati Radharani is cherished by
              devotees as the eternal embodiment of pure love and the highest
              expression of devotion.
            </p>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-gold/20 shadow-xl">
            <Photo
              src={photos.radharani}
              alt="Srimati Radharani"
              className="h-[360px] w-full object-cover sm:h-[440px]"
            />
          </div>
        </div>
      </section>

      {/* WHO IS RADHARANI */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
            Who is Srimati Radharani?
          </p>

          <h2 className="mt-4 max-w-3xl font-serif text-3xl leading-tight text-forest sm:text-4xl">
            The eternal beloved of Lord Krishna.
          </h2>

          <div className="mt-8 max-w-3xl space-y-5 text-base leading-8 text-ink-muted sm:text-lg">
            <p>
              Srimati Radharani is the most beloved of Lord Krishna and the
              eternal Queen of Vrindavan. Her life is the highest expression
              of love and devotion, completely centred on Krishna&apos;s
              happiness.
            </p>

            <p>
              Her love is selfless, wholehearted and without expectation. She
              lives only to please Krishna, and every thought, word and action
              reflects the depth of her devotion to Him.
            </p>

            <p>
              For devotees, Radharani is not simply someone to admire from a
              distance. She is the perfect example of how to love Krishna —
              with complete sincerity, humility and dedication.
            </p>
          </div>
        </div>
      </section>

      {/* THE LOVE OF RADHA */}
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-cream/50">
                Pure Divine Love
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                A love that asks for nothing in return.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-8 text-cream/70 sm:text-lg">
              <p>
                The love of Srimati Radharani is celebrated as the highest
                expression of devotional love. She does not seek anything for
                herself. Her only desire is to bring happiness to Krishna.
              </p>

              <p>
                This selfless love is the heart of <em>bhakti</em>. It teaches
                us that devotion is not about what we can receive, but about
                what we can lovingly offer.
              </p>

              <div className="border-l border-gold/40 pl-5 pt-2 font-serif text-xl italic text-cream sm:text-2xl">
                “Radharani is the greatest devotee of Lord Krishna.”
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RADHARANI IN VRINDAVAN */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
              Vṛndāvaneśvarī
            </p>

            <h2 className="mt-4 font-serif text-3xl leading-tight text-forest sm:text-5xl">
              The Queen of Vrindavan
            </h2>

            <p className="mt-6 text-base leading-8 text-ink-muted sm:text-lg">
              In Vrindavan, Srimati Radharani is lovingly known as
              <em> Vṛndāvaneśvarī</em>, the Queen of Vrindavan. She is at the
              heart of the eternal pastimes of Radha and Krishna, surrounded by
              her loving companions and devoted to Krishna&apos;s happiness.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                number: "01",
                title: "Pure Love",
                subtitle: "Prema",
                desc: "Her love for Krishna is completely selfless, unconditional and filled with the deepest affection.",
              },
              {
                number: "02",
                title: "Highest Devotion",
                subtitle: "Mahābhāva",
                desc: "Her devotion is celebrated as the highest and most complete expression of love for Krishna.",
              },
              {
                number: "03",
                title: "Queen of Vrindavan",
                subtitle: "Vṛndāvaneśvarī",
                desc: "Radharani is lovingly honoured as the eternal Queen of Vrindavan, the sacred land of Radha and Krishna.",
              },
              {
                number: "04",
                title: "Compassion",
                subtitle: "Karuṇā",
                desc: "Devotees lovingly seek Radharani's mercy, praying to develop sincere love and devotion to Krishna.",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="rounded-[1.5rem] border border-gold/15 bg-white p-6 shadow-sm sm:p-7"
              >
                <span className="text-xs tracking-[0.18em] text-forest/40">
                  {item.number}
                </span>

                <h3 className="mt-4 font-serif text-2xl leading-tight text-forest">
                  {item.title}
                </h3>

                <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-forest/60">
                  {item.subtitle}
                </p>

                <p className="mt-4 text-sm leading-7 text-ink-muted">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY DEVOTEES LOVE RADHARANI */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
              The Heart of Devotion
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight text-forest sm:text-5xl">
              Why devotees turn to Radharani
            </h2>
          </div>

          <div className="mt-10 space-y-6 text-base leading-8 text-ink-muted sm:text-lg">
            <p>
              Devotees approach Srimati Radharani with love and humility,
              seeking her mercy to develop genuine devotion to Krishna.
            </p>

            <p>
              Her example teaches us the beauty of selfless service — to
              remember Krishna, speak about Him, serve Him and seek His
              happiness above our own.
            </p>

            <p>
              To remember Radharani is to remember the deepest love and
              devotion found in Vrindavan. Her name is therefore spoken with
              great affection by devotees throughout the bhakti tradition.
            </p>
          </div>
        </div>
      </section>

      {/* CAITANYA CONNECTION */}
      <section className="bg-cream">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
            Radha and Krishna
          </p>

          <h2 className="mt-4 font-serif text-3xl leading-tight text-forest sm:text-5xl">
            The love of Radha and Krishna
          </h2>

          <div className="mt-8 space-y-5 text-base leading-8 text-ink-muted sm:text-lg">
            <p>
              The eternal relationship between Srimati Radharani and Lord
              Krishna is at the heart of Gaudiya-Vaishnava devotion. Their love
              is celebrated through kirtan, poetry, sacred texts and the
              devotional traditions of Vrindavan.
            </p>

            <p>
              Sri Caitanya Mahaprabhu is deeply connected with this mystery of
              divine love. In the Gaudiya tradition, He is understood as
              Krishna appearing in the devotional mood of Radharani.
            </p>

            <p>
              Through the teachings of Sri Caitanya Mahaprabhu, the path of
              loving devotion and the chanting of the holy names was shared
              widely for the benefit of everyone.
            </p>
          </div>

          <div className="mt-8">
            <Link
              href="/discover/caitanya"
              className="inline-flex text-sm font-medium text-forest underline decoration-gold/60 underline-offset-4 transition hover:decoration-gold"
            >
              Discover Sri Caitanya Mahaprabhu →
            </Link>
          </div>
        </div>
      </section>

      {/* VISIT CTA */}
      <section className="px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-20 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-forest px-6 py-16 text-center text-cream shadow-xl sm:px-12 sm:py-20">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cream/50">
            Come and Discover
          </p>

          <h2 className="mx-auto mt-4 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
            Discover the path of bhakti
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-cream/70">
            Join us at ISKCON Margao for kirtan, Krishna Katha and the
            association of devotees.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/visit"
              className="inline-flex rounded-full bg-cream px-7 py-3.5 text-sm font-medium text-forest transition hover:-translate-y-0.5"
            >
              Plan Your Visit
            </Link>

            <Link
              href="/discover/bhakti-yoga"
              className="inline-flex rounded-full border border-cream/30 px-7 py-3.5 text-sm font-medium text-cream transition hover:border-cream"
            >
              Explore Bhakti Yoga
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}