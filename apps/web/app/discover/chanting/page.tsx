import { Breadcrumbs, PageHero, Prose } from "@/components/Page";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/api";
import Link from "next/link";
import { Photo, photos } from "@/components/Photo";

export const metadata: Metadata = {
  title: "Hare Krishna Maha-mantra | The Holy Names",
  description:
    "Discover the meaning of the Hare Krishna maha-mantra, why devotees chant it, and how kirtan and japa are practised in the bhakti tradition.",
  alternates: { canonical: siteUrl("/discover/chanting") },
};

export default function Page() {
  return (
    <>
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/discover", label: "Discover" },
          { href: "/discover/chanting", label: "Chanting" },
        ]}
      />

      <PageHero title="The Hare Krishna Maha-mantra">
        A loving call to Krishna through the chanting of His holy names,
        shared through kirtan and personal japa in the tradition of Sri
        Caitanya Mahaprabhu.
      </PageHero>

      <Prose>
        {/* INTRO IMAGE */}
        <div className="not-prose mb-10 overflow-hidden rounded-2xl">
          <Photo
            src={photos.chanting}
            alt="Japa mala beads used for chanting"
            className="w-full max-h-80 object-cover"
          />
        </div>

        {/* WHAT IS THE MAHA-MANTRA */}
        <h2>What is the Hare Krishna Maha-mantra?</h2>

        <p>
          The <em>Hare Krishna maha-mantra</em> is a sacred mantra made up of
          the names <strong>Hare</strong>, <strong>Krishna</strong>, and{" "}
          <strong>Rama</strong>.
        </p>

        <p>
          In the Gaudiya-Vaishnava tradition, chanting the holy names is a
          central practice of bhakti-yoga. Sri Caitanya Mahaprabhu especially
          encouraged the congregational chanting of the holy names, known as{" "}
          <em>sankirtana</em>.
        </p>

        {/* MANTRA */}
        <div className="not-prose my-10 rounded-2xl border border-gold/20 bg-cream px-5 py-8 sm:px-8">
          <p className="font-deva text-xl leading-loose text-center text-forest sm:text-2xl md:text-3xl">
            Hare Krishna Hare Krishna
            <br />
            Krishna Krishna Hare Hare
            <br />
            Hare Rama Hare Rama
            <br />
            Rama Rama Hare Hare
          </p>
        </div>

        {/* MEANING */}
        <h2>What does the mantra mean?</h2>

        <p>
          The maha-mantra is a loving call to the Divine. Rather than asking
          for material possessions, it expresses a desire to remember Krishna
          and to become engaged in His loving service.
        </p>

        <div className="not-prose my-8 overflow-hidden rounded-2xl border border-gold/15 bg-white">
          <div className="grid divide-y divide-gold/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="p-6">
              <p className="font-serif text-2xl text-forest">Hare</p>

              <p className="mt-2 text-sm leading-6 text-ink-muted">
                A loving call to the divine energy of the Lord, associated in
                the Gaudiya-Vaishnava tradition with Srimati Radharani.
              </p>
            </div>

            <div className="p-6">
              <p className="font-serif text-2xl text-forest">Krishna</p>

              <p className="mt-2 text-sm leading-6 text-ink-muted">
                The all-attractive name of the Supreme Lord, calling us to
                remember and lovingly serve Him.
              </p>
            </div>

            <div className="p-6">
              <p className="font-serif text-2xl text-forest">Rama</p>

              <p className="mt-2 text-sm leading-6 text-ink-muted">
                A name of the Lord associated with transcendental joy and
                spiritual pleasure.
              </p>
            </div>
          </div>
        </div>

        <p>
          Taken together, the maha-mantra can be approached as a heartfelt
          prayer:
        </p>

        <div className="not-prose my-8 rounded-2xl bg-cream px-6 py-8 text-center">
          <p className="font-serif text-xl leading-8 text-forest sm:text-2xl">
            “O Lord, O divine energy of the Lord, please engage me in Your
            loving service.”
          </p>
        </div>

        <p>
          The holy names are therefore not merely words to repeat. They are
          names of the Divine, chanted with the desire to remember Krishna and
          deepen our relationship with Him.
        </p>

        {/* WHY CHANT */}
        <h2>Why do devotees chant?</h2>

        <p>
          Bhakti begins with hearing and remembering. By repeatedly hearing
          and chanting the holy names, devotees cultivate remembrance of
          Krishna and gradually develop a deeper taste for devotional life.
        </p>

        <p>
          Chanting also gives the mind a place to return to. In the middle of
          everyday distractions, the holy name becomes a simple way to pause,
          listen and remember what is spiritually important.
        </p>

        <p>
          The practice is not about producing a particular mood or experience.
          Devotees simply try to hear the holy name attentively and sincerely,
          allowing the practice of chanting to deepen over time.
        </p>

        {/* SCRIPTURAL ROOTS */}
        <div className="not-prose my-12 rounded-[2rem] bg-forest px-6 py-10 text-cream sm:px-10 sm:py-12">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-cream/50">
            Scriptural Roots
          </p>

          <h2 className="mt-3 font-serif text-3xl text-cream sm:text-4xl">
            The holy name in scripture
          </h2>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-cream/70 sm:text-base">
            The chanting of the holy names is deeply rooted in the Vaishnava
            scriptural tradition. The Śrīmad-Bhāgavatam especially describes
            chanting as a powerful spiritual practice for the age of Kali.
          </p>

          <blockquote className="mt-8 border-l border-gold/50 pl-5 font-serif text-lg leading-8 text-cream sm:text-xl">
            “Simply by chanting the Hare Kṛṣṇa mahā-mantra, one can become free
            from material bondage and be promoted to the transcendental
            kingdom.”
          </blockquote>

          <p className="mt-4 text-xs leading-6 text-cream/50">
            — Śrīmad-Bhāgavatam 12.3.51
          </p>

        </div>

        {/* KIRTAN AND JAPA */}
        <h2>Kirtan and japa</h2>

        <p>
          There are two common ways devotees practise chanting the holy names.
          Both involve hearing and repeating the names of Krishna, but they are
          practised in different ways.
        </p>

        <div className="not-prose my-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-gold/15 bg-white p-6">
            <h3 className="font-serif text-2xl text-forest">Kirtan</h3>

            <p className="mt-3 text-sm leading-7 text-ink-muted">
              Kirtan is congregational chanting, usually accompanied by musical
              instruments. One person may lead the chanting while everyone
              responds together.
            </p>

            <p className="mt-3 text-sm leading-7 text-ink-muted">
              The shared singing, rhythm and response create an atmosphere in
              which everyone can participate.
            </p>
          </div>

          <div className="rounded-2xl border border-gold/15 bg-white p-6">
            <h3 className="font-serif text-2xl text-forest">Japa</h3>

            <p className="mt-3 text-sm leading-7 text-ink-muted">
              Japa is personal chanting, traditionally performed softly while
              counting repetitions on a string of beads called a{" "}
              <em>japa-mala</em>.
            </p>

            <p className="mt-3 text-sm leading-7 text-ink-muted">
              It provides a quiet opportunity to hear the holy name and focus
              the mind on Krishna.
            </p>
          </div>
        </div>

        {/* NEWCOMERS */}
        <h2>Can I chant if I am new?</h2>

        <p>
          Yes. You do not need to know Sanskrit, have previous experience with
          meditation, or understand everything before you begin.
        </p>

        <p>
          At kirtan, you can simply listen at first. When you feel comfortable,
          you can clap, sing along, or simply sit and hear the chanting.
        </p>

        <p>
          There is nothing complicated to learn. The mantra itself is easy to
          remember, and anyone can hear and chant the holy names.
        </p>

        {/* EXPERIENCE AT MARGAO */}
        <div className="not-prose my-12 rounded-[2rem] bg-forest px-6 py-10 text-cream shadow-xl sm:px-10 sm:py-12">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-cream/50">
            Experience it yourself
          </p>

          <h2 className="mt-3 font-serif text-3xl text-cream sm:text-4xl">
            Come for kirtan at ISKCON Margao
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-cream/70 sm:text-base">
            You do not have to know anything beforehand. Come, listen to the
            chanting, experience the atmosphere and discover bhakti at your
            own pace.
          </p>

          <div className="mt-6">
            <Link
              href="/visit"
              className="inline-flex rounded-full bg-cream px-6 py-3 text-sm font-medium text-forest no-underline transition hover:-translate-y-0.5"
            >
              Plan Your Visit
            </Link>
          </div>
        </div>

        {/* RELATED DISCOVER CONTENT
        <div className="not-prose mt-12 grid gap-5 sm:grid-cols-2">
          <Link
            href="/discover/bhakti-yoga"
            className="group rounded-2xl border border-gold/15 bg-white p-6 no-underline transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-forest/50">
              Explore
            </p>

            <h3 className="mt-2 font-serif text-2xl text-forest">
              Bhakti Yoga
            </h3>

            <p className="mt-2 text-sm leading-6 text-ink-muted">
              Discover the path of loving devotional service to Krishna.
            </p>

            <span className="mt-4 inline-block text-sm font-medium text-forest">
              Learn more →
            </span>
          </Link>

          <Link
            href="/discover/caitanya"
            className="group rounded-2xl border border-gold/15 bg-white p-6 no-underline transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-forest/50">
              Explore
            </p>

            <h3 className="mt-2 font-serif text-2xl text-forest">
              Sri Caitanya Mahaprabhu
            </h3>

            <p className="mt-2 text-sm leading-6 text-ink-muted">
              Learn about the teacher and tradition behind sankirtana.
            </p>

            <span className="mt-4 inline-block text-sm font-medium text-forest">
              Learn more →
            </span>
          </Link>
        </div> */}

        {/* CLOSING */}
        <div className="not-prose mt-14 text-center">
          <p className="font-serif text-xl text-forest sm:text-2xl">
            Hare Krishna Hare Krishna
            <br />
            Krishna Krishna Hare Hare
          </p>

          <p className="mt-4 text-sm text-ink-muted">
            The holy name is open to everyone.
          </p>
        </div>
      </Prose>
    </>
  );
}