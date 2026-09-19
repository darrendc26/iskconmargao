import { getPurposes, siteUrl } from "@/lib/api";
import { Breadcrumbs } from "@/components/Page";
import { DonateForm } from "@/components/DonateForm";
import type { Metadata } from "next";
import Link from "next/link";
import { Photo, photos } from "@/components/Photo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support kirtan, prasadam, festivals, book distribution and the ongoing activities of ISKCON Margao.",
  alternates: { canonical: siteUrl("/donate") },
};

const donationCards = [
  {
    img: photos.prasadam,
    title: "Annaseva",
    description:
      "Support prasadam and Annaseva conducted through the centre.",
  },
  {
    img: photos.festival,
    title: "Festival Seva",
    description:
      "Help conduct festivals and special spiritual programmes.",
  },
  {
    img: photos.gita,
    title: "Book Distribution",
    description:
      "Help make Krishna-conscious literature available to others.",
  },
  {
    img: photos.kirtan,
    title: "General Seva",
    description:
      "Support the ongoing activities and needs of ISKCON Margao.",
  },
];

export default async function DonatePage() {
  const purposes = ((await getPurposes()) ?? []).filter(
    (p) => p.slug !== "temple-nirman"
  );

  return (
    <main className="bg-cream text-ink">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/donate", label: "Donate" },
        ]}
      />

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-5 pb-14 pt-8 sm:px-8 sm:pb-20">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-forest/50">
            Support the seva
          </p>

          <h1 className="mt-4 font-serif text-5xl leading-[1.05] text-forest sm:text-6xl">
            Support ISKCON Margao
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-muted sm:text-xl">
            Your support helps the centre continue its kirtan, spiritual
            programmes, prasadam, festivals, book distribution and other
            devotional activities.
          </p>
        </div>
      </section>

      {/* WAYS TO SUPPORT */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
              Your offering
            </p>

            <h2 className="mt-4 font-serif text-3xl leading-tight text-forest sm:text-4xl">
              Every contribution can support seva.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {donationCards.map((item) => (
              <div
                key={item.title}
                className="overflow-hidden rounded-[1.5rem] bg-cream"
              >
                <Photo
                  src={item.img}
                  alt=""
                  className="h-40 w-full object-cover"
                />

                <div className="p-6">
                  <h3 className="font-serif text-2xl text-forest">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-ink-muted">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DONATION FORM */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1fr] lg:items-start">
            <div className="lg:sticky lg:top-8">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
                Make an offering
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-tight text-forest sm:text-5xl">
                Support a seva that matters to you.
              </h2>

              <p className="mt-5 max-w-md text-base leading-8 text-ink-muted sm:text-lg">
                Choose a donation purpose and amount. Your contribution will
                support the activities associated with that seva.
              </p>
            </div>

            <div className="rounded-[1.75rem] bg-white p-6 shadow-sm sm:p-8">
              {purposes.length === 0 ? (
                <p className="text-sm leading-7 text-ink-muted">
                  Online donation purposes will appear here once configured.
                </p>
              ) : (
                <DonateForm purposes={purposes} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className="bg-cream">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center sm:px-8 sm:py-20">
          <h2 className="font-serif text-3xl text-forest sm:text-4xl">
            Thank you for supporting the community.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-ink-muted">
            Your support helps create opportunities for people to chant, hear,
            learn, serve and come together in Krishna consciousness.
          </p>
        </div>
      </section>
    </main>
  );
}