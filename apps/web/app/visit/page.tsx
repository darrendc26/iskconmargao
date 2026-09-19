import { getSettings, siteUrl } from "@/lib/api";
import { mapsHref } from "@/lib/maps";
import { Breadcrumbs } from "@/components/Page";
import { AnalyticsClick } from "@/components/ShareBar";
import type { Metadata } from "next";
import Link from "next/link";
import { CENTRE } from "@/lib/site";
import { Photo, photos } from "@/components/Photo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Visit Us",
  description:
    "Plan your first visit to ISKCON Margao at Matchless Gifts, next to Borkar Hospital, Margao, Goa.",
  alternates: { canonical: siteUrl("/visit") },
};

export default async function VisitPage() {
  const s = await getSettings();
  const maps = mapsHref(s?.maps_url);
  const wa =
    s?.whatsapp_contact_url ||
    s?.whatsapp_channel_url ||
    "/contact";

  const programmeSteps = [
    {
      number: "01",
      title: "Arrive",
      text: "Come to the centre and settle in.",
    },
    {
      number: "02",
      title: "Kirtan",
      text: "Experience the joyful chanting of the holy names.",
    },
    {
      number: "03",
      title: "Hear",
      text: "Listen to Krishna Katha or join the discussion.",
    },
    {
      number: "04",
      title: "Prasadam",
      text: "Share sanctified food with the community.",
    },
    {
      number: "05",
      title: "Connect",
      text: "Meet devotees and others on a spiritual journey.",
    },
  ];

  const reassurance = [
    {
      title: "Come as you are",
      text: "You don't need to be a devotee or know anything beforehand.",
    },
    {
      title: "Come alone or with friends and family",
      text: "You are welcome even if this is your first time visiting.",
    },
    {
      title: "Simply listen",
      text: "There is no pressure to participate in every part of the programme.",
    },
  ];

  return (
    <main className="bg-cream text-ink">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/visit", label: "Visit Us" },
          ]}
        />
      </div>

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pb-24 lg:px-8 lg:pt-12">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="max-w-xl">
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.22em] text-forest/70">
              Your first visit
            </p>

            <h1 className="font-serif text-5xl leading-[0.98] tracking-tight text-forest sm:text-6xl lg:text-7xl">
              Come as you are.
            </h1>

            <p className="mt-7 max-w-lg text-lg leading-8 text-ink-muted sm:text-xl">
              Whether you're curious about Krishna consciousness,
              interested in kirtan, or simply looking for a welcoming
              spiritual community, you're welcome at ISKCON Margao.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/programs"
                className="rounded-full bg-forest px-6 py-3.5 text-sm font-medium text-cream transition hover:-translate-y-0.5"
              >
                See This Week
              </Link>

              <AnalyticsClick
                name="directions_click"
                href={maps}
                className="rounded-full border border-forest/20 bg-transparent px-6 py-3.5 text-sm font-medium text-forest transition hover:bg-forest/5"
              >
                Get Directions
              </AnalyticsClick>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[2rem]">
              <Photo
                src={photos.community}
                alt="Community gathered at ISKCON Margao"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>

            <div className="absolute -bottom-5 left-5 right-5 rounded-2xl bg-cream/95 p-5 shadow-lg backdrop-blur sm:left-auto sm:w-[300px]">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/60">
                Weekly gatherings
              </p>
              <p className="mt-2 font-serif text-xl text-forest">
                Friday & Saturday
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                7:30 PM onwards
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT TO EXPECT */}
      <section className="border-y border-forest/10 bg-white/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-forest/60">
              What to expect
            </p>

            <h2 className="mt-3 font-serif text-4xl leading-tight text-forest sm:text-5xl">
              A simple evening. A warm welcome.
            </h2>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {programmeSteps.map((step) => (
              <div key={step.number} className="relative">
                <span className="font-serif text-4xl text-forest/15">
                  {step.number}
                </span>

                <h3 className="mt-3 font-serif text-2xl text-forest">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-ink-muted">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWCOMERS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="overflow-hidden rounded-[2rem]">
            <Photo
              src={photos.community}
              alt="People gathering together at ISKCON Margao"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>

          <div className="max-w-xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-forest/60">
              New to ISKCON?
            </p>

            <h2 className="mt-3 font-serif text-4xl leading-tight text-forest sm:text-5xl">
              You don't have to know anything beforehand.
            </h2>

            <p className="mt-6 text-lg leading-8 text-ink-muted">
              You don't need to be a devotee, know Sanskrit, or
              understand everything before you come. You can simply
              arrive, listen to the kirtan, hear Krishna Katha and
              experience the evening at your own pace.
            </p>

            <div className="mt-10 space-y-7">
              {reassurance.map((item) => (
                <div
                  key={item.title}
                  className="border-b border-forest/10 pb-6 last:border-0"
                >
                  <h3 className="font-serif text-2xl text-forest">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-forest/5 p-5">
              <p className="text-sm leading-6 text-ink-muted">
                <span className="font-medium text-forest">
                  What should I wear?
                </span>{" "}
                Comfortable, modest clothing is appropriate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* THIS WEEK */}
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-cream/60">
                Join us
              </p>

              <h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
                This week at ISKCON Margao
              </h2>
            </div>

            <Link
              href="/programs"
              className="text-sm font-medium text-cream/80 underline underline-offset-4 transition hover:text-cream"
            >
              View all programmes
            </Link>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-cream/15 bg-cream/5 p-7 sm:p-9">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-cream/50">
                Friday
              </p>

              <h3 className="mt-4 font-serif text-3xl">
                Kirtan & Krishna Katha
              </h3>

              <p className="mt-3 text-sm text-cream/65">
                7:30 PM onwards
              </p>

              <p className="mt-6 max-w-md text-sm leading-6 text-cream/75">
                An evening of congregational kirtan, Krishna Katha,
                prasadam and spiritual association.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-cream/15 bg-cream/5 p-7 sm:p-9">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-cream/50">
                Saturday
              </p>

              <h3 className="mt-4 font-serif text-3xl">
                Kirtan & Discussion
              </h3>

              <p className="mt-3 text-sm text-cream/65">
                7:30 PM onwards
              </p>

              <p className="mt-6 max-w-md text-sm leading-6 text-cream/75">
                Join the community for kirtan, spiritual discussion,
                prasadam and association.
              </p>
            </div>
          </div>

          {s?.operating_note && (
            <p className="mt-8 max-w-2xl text-sm leading-6 text-cream/60">
              {s.operating_note}
            </p>
          )}
        </div>
      </section>

      {/* LOCATION */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="grid overflow-hidden rounded-[2rem] bg-white shadow-sm lg:grid-cols-2">
          <div className="min-h-[360px] lg:min-h-[500px]">
            <Photo
              src={photos.centre}
              alt="ISKCON Margao centre"
              className="h-full min-h-[360px] w-full object-cover lg:min-h-[500px]"
            />
          </div>

          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-forest/60">
              Find us
            </p>

            <h2 className="mt-3 font-serif text-4xl text-forest sm:text-5xl">
              In the heart of Margao
            </h2>

            <div className="mt-7 text-base leading-7 text-ink-muted">
              <p className="font-medium text-forest">
                {CENTRE.name}
              </p>

              <p className="mt-2">
                {CENTRE.line1}
                <br />
                {CENTRE.line2}
                <br />
                {CENTRE.city}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <AnalyticsClick
                name="directions_click"
                href={maps}
                className="rounded-full bg-forest px-6 py-3.5 text-sm font-medium text-cream transition hover:-translate-y-0.5"
              >
                Get Directions
              </AnalyticsClick>

              <AnalyticsClick
                name="whatsapp_click"
                href={wa}
                className="rounded-full border border-forest/20 px-6 py-3.5 text-sm font-medium text-forest transition hover:bg-forest/5"
              >
                WhatsApp
              </AnalyticsClick>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-[#163d32] px-6 py-16 text-center text-cream sm:px-12 sm:py-20">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cream/50">
            You're welcome here
          </p>

          <h2 className="mx-auto mt-4 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
            We'd love to welcome you.
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-cream/70">
            Come for the kirtan. Hear Krishna Katha. Share prasadam.
            Meet the community.
          </p>

          <div className="mt-8">
            <Link
              href="/programs"
              className="inline-flex rounded-full bg-cream px-7 py-3.5 text-sm font-medium text-forest transition hover:-translate-y-0.5"
            >
              See This Week's Programme
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}