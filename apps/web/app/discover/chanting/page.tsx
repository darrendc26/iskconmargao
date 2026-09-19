import { Breadcrumbs, PageHero, Prose } from "@/components/Page";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/api";
import Link from "next/link";
import { Photo, photos } from "@/components/Photo";

export const metadata: Metadata = {
  title: "Hare Krishna Maha-mantra",
  description: "Congregational chanting of the Hare Krishna maha-mantra at ISKCON Margao.",
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
        Congregational chanting — sankirtana — as practised in the line of Sri Caitanya Mahaprabhu.
      </PageHero>
      <Prose>
        <div className="not-prose mb-8 overflow-hidden">
          <Photo src={photos.chanting} alt="Japa mala beads" className="w-full max-h-72 object-cover" />
        </div>
        <p className="font-deva text-xl md:text-2xl leading-loose text-center text-forest">
          Hare Krishna Hare Krishna
          <br />
          Krishna Krishna Hare Hare
          <br />
          Hare Rama Hare Rama
          <br />
          Rama Rama Hare Hare
        </p>
        <p>
          Chanting is calling on Krishna and Rama with the holy names. ISKCON practices congregational chanting
          (kirtan) together, and many also chant softly on beads (japa). Newcomers can sit, listen, clap, or sing —
          nothing is required.
        </p>
        <p>
          <strong>Experience kirtan in person at ISKCON Margao.</strong>
        </p>
        <p>
          <Link href="/programs" className="not-prose inline-block rounded-full bg-forest text-cream px-6 py-3 text-sm no-underline">
            Join Us
          </Link>
        </p>
      </Prose>
    </>
  );
}