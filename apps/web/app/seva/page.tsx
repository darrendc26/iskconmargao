import { Breadcrumbs } from "@/components/Page";
import Link from "next/link";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/api";
import { Photo, photos } from "@/components/Photo";

export const metadata: Metadata = {
  title: "Seva | ISKCON Margao",
  description:
    "Discover ways to offer your time, skills and energy in devotional service at ISKCON Margao.",
  alternates: { canonical: siteUrl("/seva") },
};

const sevaItems = [
  {
    number: "01",
    title: "Kirtan Seva",
    desc: "Help create an atmosphere of joyful chanting through voice, mridanga, kartals or simply your presence.",
    interestKey: "Kirtan",
    img: photos.kirtan,
  },
  {
    number: "02",
    title: "Prasadam & Annaseva",
    desc: "Help with preparing, serving and cleaning so that prasadam can be shared with everyone.",
    interestKey: "Annaseva / Prasadam",
    img: photos.prasadam,
  },
  {
    number: "03",
    title: "Festival Seva",
    desc: "Help make special gatherings and festivals welcoming, organised and joyful.",
    interestKey: "Festivals",
    img: photos.festival,
  },
  {
    number: "04",
    title: "Photography",
    desc: "Capture meaningful moments from kirtan and festivals with care and respect.",
    interestKey: "Photography",
    img: photos.peacock,
  },
  {
    number: "05",
    title: "Videography",
    desc: "Create simple, authentic videos that help share the activities of the centre.",
    interestKey: "Videography",
    img: photos.kirtan,
  },
  {
    number: "06",
    title: "Social Media",
    desc: "Help people discover programmes and activities through thoughtful updates and invitations.",
    interestKey: "Social Media",
    img: photos.lotus,
  },
  {
    number: "07",
    title: "Digital Seva",
    desc: "Offer your skills in websites, design, technology and other practical digital work.",
    interestKey: "Digital / Website",
    img: photos.gita,
  },
  {
    number: "08",
    title: "Book Distribution",
    desc: "Help share Srila Prabhupada's books and Krishna-conscious literature when programmes are organised.",
    interestKey: "Book Distribution",
    img: photos.gita,
  },
  {
    number: "09",
    title: "Outreach",
    desc: "Help welcome newcomers and share the activities of ISKCON Margao with people across South Goa.",
    interestKey: "Outreach",
    img: photos.community,
  },
];

export default function Page() {
  return (
    <main className="bg-cream text-ink">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/seva", label: "Seva" },
        ]}
      />

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8 sm:pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-forest/50">
              Devotional service
            </p>

            <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-[1.05] text-forest sm:text-6xl lg:text-7xl">
              Seva
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-ink-muted sm:text-xl">
              Offer your time, skills and energy in the service of Krishna
              and the devotional community.
            </p>
          </div>

          <div className="overflow-hidden rounded-[2rem]">
            <Photo
              src={photos.community}
              alt="Devotees serving together"
              className="h-[360px] w-full object-cover sm:h-[460px]"
            />
          </div>
        </div>
      </section>

      {/* WHAT IS SEVA */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
            What is seva?
          </p>

          <h2 className="mt-4 max-w-3xl font-serif text-3xl leading-tight text-forest sm:text-4xl">
            Service offered with a spirit of devotion.
          </h2>

          <div className="mt-8 max-w-3xl space-y-5 text-base leading-8 text-ink-muted sm:text-lg">
            <p>
              <em>Seva</em> means service. In bhakti-yoga, service is an
              important way of expressing devotion to Krishna.
            </p>

            <p>
              Seva does not require a particular talent or position. Someone
              may sing during kirtan, prepare prasadam, welcome a visitor,
              photograph a festival, help with technology or simply give a
              little time to help things happen.
            </p>

            <p>
              What matters is the spirit in which the service is offered.
            </p>
          </div>
        </div>
      </section>

      {/* OPPORTUNITIES */}
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-cream/45">
              Ways to serve
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              There are many ways to contribute.
            </h2>

            <p className="mt-5 text-base leading-8 text-cream/65 sm:text-lg">
              Some services happen during programmes, while others happen
              behind the scenes throughout the year.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {sevaItems.map((item) => (
              <Link
                key={item.title}
                href={`/volunteer?interest=${encodeURIComponent(
                  item.interestKey
                )}`}
                className="group overflow-hidden rounded-[1.5rem] bg-cream text-ink transition hover:-translate-y-1"
              >
                <div className="overflow-hidden">
                  <Photo
                    src={item.img}
                    alt=""
                    className="h-48 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>

                <div className="p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="text-xs tracking-[0.18em] text-forest/35">
                      {item.number}
                    </span>

                    <span className="text-forest/40 transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>

                  <h3 className="mt-5 font-serif text-2xl text-forest">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-ink-muted">
                    {item.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* EVERYONE CAN SERVE */}
      <section className="bg-cream">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1fr] lg:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
                Start where you are
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-tight text-forest sm:text-5xl">
                Your skills can become an offering.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-8 text-ink-muted sm:text-lg">
              <p>
                You don't have to be a musician, cook or experienced
                volunteer. There is also a need for people who can organise,
                design, photograph, write, build websites, welcome visitors
                or help with simple practical tasks.
              </p>

              <p>
                If you're not sure where you fit, tell us what you enjoy and
                how much time you have. The team can help find a suitable way
                to serve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 sm:py-28">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-forest/50">
            Ready to help?
          </p>

          <h2 className="mt-4 font-serif text-4xl leading-tight text-forest sm:text-5xl">
            Find your seva.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
            Tell us what you'd like to help with, and the team at ISKCON
            Margao can get in touch.
          </p>

          <div className="mt-8">
            <Link
              href="/volunteer"
              className="inline-flex items-center rounded-full bg-forest px-7 py-3.5 text-sm font-medium text-cream transition hover:-translate-y-0.5"
            >
              Volunteer for seva
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}