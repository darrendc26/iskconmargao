import { Breadcrumbs } from "@/components/Page";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/api";
import { Photo, photos } from "@/components/Photo";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Śrīmad-Bhāgavatam | The Story of Krishna and His Devotees",
  description:
    "Discover Śrīmad-Bhāgavatam, the sacred text of bhakti that explores Krishna, devotion, spiritual wisdom and the lives of His devotees.",
  alternates: {
    canonical: siteUrl("/discover/srimad-bhagavatam"),
  },
};

export default function Page() {
  return (
    <main className="bg-cream text-ink">
      {/* BREADCRUMBS */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/discover", label: "Discover" },
            {
              href: "/discover/srimad-bhagavatam",
              label: "Śrīmad-Bhāgavatam",
            },
          ]}
        />
      </div>

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 sm:pb-28 lg:px-8 lg:pt-12">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="max-w-xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-forest/60">
              The Ripe Fruit of Vedic Knowledge
            </p>

            <h1 className="mt-4 font-serif text-5xl leading-[1.05] tracking-tight text-forest sm:text-6xl lg:text-7xl">
              Śrīmad-Bhāgavatam
            </h1>

            <p className="mt-7 text-xl leading-8 text-ink-muted">
              A sacred journey into Krishna, His devotees, the nature of the
              soul, and the path of loving devotion.
            </p>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-gold/20 shadow-xl">
            <Photo
              src={photos.bhagavatam}
              alt="Śrīmad-Bhāgavatam sacred scripture"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* WHAT IS BHAGAVATAM */}
      <section className="border-y border-forest/10 bg-white/40">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-forest/60">
            What is Śrīmad-Bhāgavatam?
          </p>

          <h2 className="mt-4 font-serif text-4xl leading-tight text-forest sm:text-5xl">
            The ripe fruit of the tree of Vedic literature.
          </h2>

          <div className="mt-8 space-y-6 text-base leading-8 text-ink-muted sm:text-lg">
            <p>
              Śrīmad-Bhāgavatam, also known as the Bhāgavata Purāṇa, is one of
              the principal sacred texts of the Vaishnava tradition. ISKCON
              presents it alongside Bhagavad-gītā and Caitanya-caritāmṛta as
              one of its principal books.
            </p>

            <p>
              The Bhāgavatam explores the nature of the Supreme Lord, the soul,
              the material world and, above all, the path of loving devotion.
              Its teachings are presented through philosophy, conversations,
              histories and the lives of great devotees.
            </p>

            <p>
              It culminates in the beautiful descriptions of Lord Krishna and
              His transcendental pastimes, especially in the Tenth Canto.
            </p>
          </div>
        </div>
      </section>

      {/* WHY IT IS SPECIAL */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-forest/60">
              The Heart of the Bhāgavatam
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight text-forest sm:text-5xl">
              A book about loving devotion.
            </h2>
          </div>

          <div className="space-y-6 text-base leading-8 text-ink-muted sm:text-lg">
            <p>
              Śrīmad-Bhāgavatam begins by turning away from spirituality driven
              by temporary material rewards and directs the reader toward the
              highest spiritual truth.
            </p>

            <p>
              It teaches that genuine spiritual life is not simply about
              acquiring knowledge. It is about awakening our eternal
              relationship with the Supreme Lord through bhakti.
            </p>

            <p>
              The Bhāgavatam therefore invites us not only to understand
              Krishna, but to{" "}
              <strong>hear about Him, remember Him and develop love for Him.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* A BOOK OF STORIES */}
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-cream/50">
              Philosophy Through Stories
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              Meet the devotees
            </h2>

            <p className="mt-6 text-base leading-7 text-cream/70 sm:text-lg">
              The Bhāgavatam does not present spiritual knowledge as abstract
              philosophy alone. Its teachings come alive through the lives,
              struggles, prayers and devotion of great souls.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Dhruva Mahārāja",
                text: "A young prince whose determination and devotion lead him from a desire for worldly recognition toward profound spiritual realization.",
              },
              {
                title: "Prahlāda Mahārāja",
                text: "A child devotee whose unwavering faith in Krishna remains steady even in the face of great adversity.",
              },
              {
                title: "Ambarīṣa Mahārāja",
                text: "A king who demonstrates how every part of life can be dedicated to the service and remembrance of the Lord.",
              },
              {
                title: "Gajendra",
                text: "A powerful story of surrender and prayer, showing how sincere remembrance of the Lord can arise in the most difficult circumstances.",
              },
              {
                title: "The Pāṇḍavas",
                text: "Their lives reveal the challenges of dharma, friendship with Krishna and complete dependence upon His protection.",
              },
              {
                title: "King Parīkṣit",
                text: "Faced with the end of his life, King Parīkṣit turns completely toward hearing about Krishna from Śukadeva Gosvāmī.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border border-cream/10 bg-cream/5 p-6 sm:p-7"
              >
                <h3 className="font-serif text-2xl text-cream">
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

      {/* KRISHNA */}
      <section className="border-b border-forest/10 bg-white/40">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-forest/60">
            The Tenth Canto
          </p>

          <h2 className="mt-4 font-serif text-4xl leading-tight text-forest sm:text-5xl">
            The story of Krishna
          </h2>

          <div className="mt-8 space-y-6 text-base leading-8 text-ink-muted sm:text-lg">
            <p>
              The Tenth Canto is the heart of Śrīmad-Bhāgavatam. It describes
              the appearance and transcendental pastimes of Lord Krishna,
              including His childhood in Vrindavan, His relationships with His
              devotees and His activities in Mathura and Dvārakā.
            </p>

            <p>
              The earlier Cantos gradually establish the philosophical and
              devotional foundation needed to understand these descriptions.
              The Bhāgavatam therefore takes the reader on a progressive
              journey toward deeper appreciation of Krishna and pure devotion.
            </p>

            <p>
              The Bhāgavatam identifies Lord Krishna as the original Personality
              of Godhead and presents His pastimes as the culmination of its
              teachings.
            </p>
          </div>

          <div className="not-prose mt-8 rounded-2xl border border-gold/20 bg-cream p-6 sm:p-8">
            <p className="font-serif text-xl leading-8 text-forest sm:text-2xl">
              “Lord Śrī Kṛṣṇa is the original Personality of Godhead.”
            </p>

            <p className="mt-3 text-sm text-ink-muted">
              — Śrīmad-Bhāgavatam 1.3.28
            </p>
          </div>
        </div>
      </section>

      {/* THE 12 CANTOS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-forest/60">
            The Book at a Glance
          </p>

          <h2 className="mt-4 font-serif text-4xl leading-tight text-forest sm:text-5xl">
            Twelve Cantos
          </h2>

          <p className="mt-6 text-base leading-7 text-ink-muted sm:text-lg">
            Śrīmad-Bhāgavatam unfolds across twelve Cantos, moving through
            creation, spiritual knowledge, the lives of devotees, the
            incarnations of the Lord and, ultimately, the transcendental
            pastimes of Krishna.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              canto: "Canto 1",
              title: "Creation",
              desc: "The setting of the Bhāgavatam and the beginning of King Parīkṣit's story.",
            },
            {
              canto: "Canto 2",
              title: "The Cosmic Manifestation",
              desc: "The process of spiritual realization and meditation upon the Supreme.",
            },
            {
              canto: "Canto 3",
              title: "The Status Quo",
              desc: "Teachings on creation, the Supreme Lord and the spiritual path.",
            },
            {
              canto: "Canto 4",
              title: "The Creation of the Fourth Order",
              desc: "Stories of great devotees including Dhruva Mahārāja and Pṛthu Mahārāja.",
            },
            {
              canto: "Canto 5",
              title: "The Creative Impetus",
              desc: "Teachings concerning the universe, spiritual life and the journey of the soul.",
            },
            {
              canto: "Canto 6",
              title: "Prescribed Duties for Mankind",
              desc: "Stories and teachings illustrating the power of devotion and the holy name.",
            },
            {
              canto: "Canto 7",
              title: "The Science of God",
              desc: "The devotion of Prahlāda Mahārāja and the appearance of Lord Nṛsiṁhadeva.",
            },
            {
              canto: "Canto 8",
              title: "Withdrawal of the Cosmic Creations",
              desc: "The stories of Gajendra, the churning of the ocean and Lord Vāmana.",
            },
            {
              canto: "Canto 9",
              title: "Liberation",
              desc: "Dynasties of great kings and the histories of Lord Rāmacandra and His devotees.",
            },
            {
              canto: "Canto 10",
              title: "The Summum Bonum",
              desc: "The appearance and transcendental pastimes of Lord Krishna.",
            },
            {
              canto: "Canto 11",
              title: "General History",
              desc: "Deep teachings on bhakti, spiritual realization and the final instructions of Krishna.",
            },
            {
              canto: "Canto 12",
              title: "The Age of Deterioration",
              desc: "The conclusion of the Bhāgavatam and teachings concerning Kali-yuga and the power of hearing and remembering the Lord.",
            },
          ].map((item) => (
            <div
              key={item.canto}
              className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-forest/60">
                {item.canto}
              </span>

              <h3 className="mt-2 font-serif text-xl text-forest">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-ink-muted">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HEARING BHAGAVATAM */}
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-cream/50">
              Śravaṇam
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              Begin simply by hearing.
            </h2>

            <p className="mt-6 text-base leading-8 text-cream/70 sm:text-lg">
              One of the central practices of bhakti is <em>śravaṇam</em> —
              hearing about Krishna. The Bhāgavatam repeatedly places great
              importance on hearing and discussing the Lord&apos;s names,
              qualities and pastimes in the association of devotees.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-3xl rounded-[1.5rem] border border-cream/10 bg-cream/5 p-7 sm:p-9">
            <p className="font-serif text-xl leading-8 text-cream sm:text-2xl">
              “As soon as one attentively and submissively hears the message of
              Bhāgavatam, the Supreme Lord is established within the heart.”
            </p>

            <p className="mt-4 text-sm text-cream/50">
              — Śrīmad-Bhāgavatam 1.1.2
            </p>
          </div>
        </div>
      </section>

      {/* PRABHUPADA */}
      <section className="border-y border-forest/10 bg-white/40">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-forest/60">
                Śrīla Prabhupāda's Translation
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-tight text-forest sm:text-5xl">
                Bringing the Bhāgavatam to the world
              </h2>
            </div>

            <div className="space-y-5 text-base leading-7 text-ink-muted">
              <p>
                Śrīla Prabhupāda, the Founder-Ācārya of ISKCON, translated and
                wrote extensive purports to Śrīmad-Bhāgavatam as part of his
                work to share Krishna consciousness throughout the world.
              </p>

              <p>
                His edition presents the original Sanskrit, transliteration,
                word-for-word meanings, English translation and detailed
                purports drawing from the Gaudiya-Vaishnava tradition.
              </p>

              <p>
                The Bhāgavatam became one of his major literary works and
                remains one of the principal texts studied and shared within
                ISKCON.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ESSENCE */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="rounded-[2rem] border border-gold/20 bg-white p-8 shadow-sm sm:p-12">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
            The Essence
          </p>

          <h2 className="mt-4 font-serif text-3xl leading-tight text-forest sm:text-4xl">
            A book to hear, study and return to.
          </h2>

          <p className="mt-5 max-w-3xl text-base leading-8 text-ink-muted sm:text-lg">
            Śrīmad-Bhāgavatam is not simply a book of ancient stories. It is a
            sustained invitation to understand our relationship with Krishna,
            hear about His devotees and develop a deeper taste for bhakti.
          </p>

          <div className="mt-8 border-l-2 border-gold/50 pl-5">
            <p className="font-serif text-xl leading-8 text-forest sm:text-2xl">
              “Śrīmad-Bhāgavatam is declared to be the essence of all Vedānta
              philosophy.”
            </p>

            <p className="mt-3 text-sm text-ink-muted">
              — Śrīmad-Bhāgavatam 12.13.15
            </p>
          </div>
        </div>
      </section>

      {/* READ ONLINE */}
      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
        <div className="rounded-[2rem] bg-forest/5 p-8 sm:p-12">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
            Read Online
          </p>

          <h2 className="mt-3 font-serif text-3xl text-forest sm:text-4xl">
            Explore Śrīmad-Bhāgavatam
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-ink-muted">
            Read Śrīla Prabhupāda&apos;s edition of Śrīmad-Bhāgavatam on
            Vedabase, with Sanskrit verses, translations, purports and the
            complete text of all twelve Cantos.
          </p>

          <div className="mt-7 flex flex-wrap gap-4">
            <a
              href="https://vedabase.io/en/library/sb/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full bg-forest px-6 py-3.5 text-sm font-medium text-cream transition hover:-translate-y-0.5"
            >
              Read on Vedabase ↗
            </a>

            <Link
              href="/discover/bhagavad-gita"
              className="inline-flex rounded-full border border-forest/20 px-6 py-3.5 text-sm font-medium text-forest transition hover:bg-forest/5"
            >
              Explore Bhagavad-gītā
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-forest px-6 py-16 text-center text-cream shadow-xl sm:px-12 sm:py-20">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cream/50">
            Hear & Discover
          </p>

          <h2 className="mx-auto mt-4 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
            Hear about Krishna with us
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-cream/70">
            Join the association of devotees at ISKCON Margao for kirtan,
            Krishna Katha and opportunities to learn more about bhakti.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/visit"
              className="inline-flex rounded-full bg-cream px-7 py-3.5 text-sm font-medium text-forest transition hover:-translate-y-0.5"
            >
              Plan Your Visit
            </Link>

            <Link
              href="/programs"
              className="inline-flex rounded-full border border-cream/30 px-7 py-3.5 text-sm font-medium text-cream transition hover:border-cream"
            >
              Explore Programs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}