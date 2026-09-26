import { Breadcrumbs, PageHero } from "@/components/Page";
import Link from "next/link";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/api";
import { Photo, photos } from "@/components/Photo";

export const metadata: Metadata = {
  title: "Discover Krishna",
  description: "Explore the teachings, practices and traditions of Krishna consciousness.",
  alternates: { canonical: siteUrl("/discover") },
};


const cards = [
  { href: "/discover/krishna", title: "Krishna", desc: "Who is Krishna?", img: photos.hero },
  { href: "/discover/radha-rani", title: "Srimati Radharani", desc: "The supreme goddess of devotion and Krishna's pleasure potency.", img: photos.radharani },
  { href: "/discover/caitanya", title: "Sri Caitanya Mahaprabhu", desc: "The teachings and sankirtana movement of Caitanya Mahaprabhu.", img: photos.caitanya },
  { href: "/discover/bhagavad-gita", title: "Bhagavad-gita", desc: "The teachings of Krishna and Arjuna.", img: photos.gita },
  { href: "/discover/srimad-bhagavatam", title: "Śrīmad-Bhāgavatam", desc: "The ripe fruit of Vedic literature detailing pure devotion and Krishna's pastimes.", img: photos.bhagavatam },
  { href: "/discover/bhakti-yoga", title: "Bhakti-yoga", desc: "The path of devotional service.", img: photos.lotus },
  { href: "/discover/chanting", title: "Hare Krishna Maha-mantra", desc: "Understanding the chanting of the holy names.", img: photos.chanting },
  { href: "/about/srila-prabhupada", title: "Srila Prabhupada", desc: "The Founder-Acharya of ISKCON.", img: photos.prabhupada },
];

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/discover", label: "Discover" }]} />
      <PageHero title="Discover Krishna">Explore the teachings, practices and traditions of Krishna consciousness.</PageHero>
      <div className="mx-auto max-w-6xl px-4 pb-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="border border-gold/25 bg-white/40 overflow-hidden hover:border-gold/50">
            <Photo src={c.img} alt="" className="w-full h-40 object-cover" />
            <div className="p-6">
              <h2 className="font-serif text-2xl text-forest">{c.title}</h2>
              <p className="mt-2 text-sm text-ink-muted">{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>
      <p className="mx-auto max-w-6xl px-4 pb-16">
        <Link href="/articles" className="text-forest font-medium hover:underline">
          Explore the Knowledge Library →
        </Link>
      </p>
    </>
  );
}