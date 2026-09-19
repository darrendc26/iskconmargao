import { Breadcrumbs } from "@/components/Page";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/api";
import { Photo, photos } from "@/components/Photo";

export const metadata: Metadata = {
  title: "Bhagavad-gita",
  description:
    "An introduction to the Bhagavad-gita, the conversation between Lord Krishna and Arjuna on the battlefield of Kurukshetra.",
  alternates: {
    canonical: siteUrl("/discover/bhagavad-gita"),
  },
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
            {
              href: "/discover/bhagavad-gita",
              label: "Bhagavad-gita",
            },
          ]}
        />
      </div>

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 sm:pb-28 lg:px-8 lg:pt-12">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="max-w-xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-forest/60">
              Discover
            </p>

            <h1 className="mt-4 font-serif text-5xl leading-[1] tracking-tight text-forest sm:text-6xl lg:text-7xl">
              Bhagavad-gita
            </h1>

            <p className="mt-7 text-xl leading-8 text-ink-muted">
              A conversation between Lord Krishna and Arjuna
              that begins on a battlefield and speaks to questions
              at the heart of human life.
            </p>
          </div>

          <div className="overflow-hidden rounded-[2rem]">
            <Photo
              src={photos.gita}
              alt="Bhagavad-gita"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* THE SCENE */}
      <section className="border-y border-forest/10 bg-white/40">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-forest/60">
            The setting
          </p>

          <h2 className="mt-4 font-serif text-4xl leading-tight text-forest sm:text-5xl">
            Before the teachings, there was a question.
          </h2>

          <div className="mt-8 space-y-6 text-base leading-8 text-ink-muted">
            <p>
              The Bhagavad-gita takes place on the battlefield of
              Kurukshetra. Two armies stand ready for battle, and
              Arjuna, a warrior and one of Krishna&apos;s close
              friends, asks Krishna to place his chariot between
              the opposing armies.
            </p>

            <p>
              When Arjuna sees teachers, relatives and friends on
              the other side, he becomes overwhelmed. He no longer
              knows whether he should fight. His weapons slip from
              his hands, and he turns to Krishna for guidance.
            </p>

            <p>
              What follows is not simply a conversation about a
              battle. Arjuna&apos;s uncertainty opens questions about
              the self, duty, action, suffering, death, God and the
              purpose of life.
            </p>
          </div>
        </div>
      </section>

      {/* ARJUNA'S QUESTIONS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-forest/60">
              Arjuna&apos;s dilemma
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight text-forest sm:text-5xl">
              Questions that still feel familiar.
            </h2>
          </div>

          <div>
            <p className="text-lg leading-8 text-ink-muted">
              Arjuna&apos;s situation is specific to the battlefield,
              but the questions he asks are universal.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                "Who am I?",
                "What is my duty?",
                "Why do we suffer?",
                "What happens after death?",
                "How should I act?",
                "What is the purpose of life?",
              ].map((question) => (
                <div
                  key={question}
                  className="rounded-2xl border border-forest/10 bg-white px-6 py-5"
                >
                  <p className="font-serif text-xl text-forest">
                    {question}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHAT KRISHNA TEACHES */}
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-cream/50">
              The teachings
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              Krishna begins with the nature of the self.
            </h2>

            <p className="mt-6 text-base leading-7 text-cream/70">
              Krishna teaches Arjuna that the self is eternal,
              while the body is temporary. From this foundation,
              the conversation unfolds into teachings about action,
              knowledge, yoga and devotion.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-px overflow-hidden rounded-[1.5rem] border border-cream/10 bg-cream/10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "The self",
                text: "The soul is eternal and distinct from the temporary body.",
              },
              {
                title: "Karma",
                text: "Our actions have consequences, and Krishna teaches how to act without selfish attachment.",
              },
              {
                title: "Yoga",
                text: "Spiritual practice can bring the mind and actions toward the Supreme.",
              },
              {
                title: "Bhakti",
                text: "Devotional service and loving remembrance of Krishna form the heart of spiritual life.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-forest p-7 sm:p-8"
              >
                <h3 className="font-serif text-2xl">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-cream/65">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE HEART */}
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-forest/60">
            At the heart of the Gita
          </p>

          <h2 className="mt-4 font-serif text-4xl leading-tight text-forest sm:text-5xl">
            A relationship with the Supreme
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-ink-muted">
            The Gita does not end with knowledge alone. Krishna
            guides Arjuna toward bhakti — loving devotional service
            to the Supreme Personality of Godhead.
          </p>

          <div className="mx-auto mt-10 max-w-2xl rounded-[1.5rem] bg-forest/5 px-7 py-8">
            <p className="font-serif text-2xl leading-relaxed text-forest">
              Hear Krishna&apos;s teachings. Reflect on them.
              Gradually understand their meaning for your own life.
            </p>
          </div>
        </div>
      </section>

      {/* WHY READ */}
      <section className="border-y border-forest/10 bg-white/40">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-forest/60">
                Why read it?
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-tight text-forest sm:text-5xl">
                A book to return to, not just finish.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-7 text-ink-muted">
              <p>
                The Bhagavad-gita brings together spiritual
                philosophy and practical questions about how we
                live, act and understand ourselves.
              </p>

              <p>
                Its teachings can be studied gradually. A single
                verse may raise a question that leads to deeper
                reflection and further study.
              </p>

              <p>
                For those wishing to study within the tradition
                followed by ISKCON, Srila Prabhupada&apos;s
                <em> Bhagavad-gita As It Is</em> presents the
                Sanskrit verses together with translations and
                detailed purports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VEDABASE */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="rounded-[2rem] bg-forest/5 p-8 sm:p-12">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
            Read the text
          </p>

          <h2 className="mt-3 font-serif text-3xl text-forest sm:text-4xl">
            Bhagavad-gita As It Is
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-ink-muted">
            Srila Prabhupada&apos;s edition includes the original
            Sanskrit verses, transliteration, English translation
            and detailed purports that explain the teachings in
            context.
          </p>

          <a
            href="https://vedabase.io/en/library/bg/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex rounded-full bg-forest px-6 py-3.5 text-sm font-medium text-cream transition hover:-translate-y-0.5"
          >
            Read on Vedabase ↗
          </a>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-[#163d32] px-6 py-16 text-center text-cream sm:px-12 sm:py-20">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cream/50">
            Explore further
          </p>

          <h2 className="mx-auto mt-4 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
            The conversation continues.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-cream/70">
            Krishna Katha and discussion at ISKCON Margao offer an
            opportunity to hear and explore these teachings together.
          </p>
        </div>
      </section>
    </main>
  );
}