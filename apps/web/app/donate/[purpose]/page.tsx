import { getPurpose, getPurposes, siteUrl } from "@/lib/api";
import { Breadcrumbs } from "@/components/Page";
import { DonateForm } from "@/components/DonateForm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ purpose: string }>;
}): Promise<Metadata> {
  const { purpose } = await params;
  const p = await getPurpose(purpose);

  if (!p) {
    return { title: "Donate" };
  }

  return {
    title: `${p.title} | Donate`,
    description: p.description,
    alternates: {
      canonical: siteUrl(`/donate/${p.slug}`),
    },
  };
}

export default async function PurposePage({
  params,
}: {
  params: Promise<{ purpose: string }>;
}) {
  const { purpose } = await params;

  const p = await getPurpose(purpose);

  if (!p) {
    notFound();
  }

  const all = (await getPurposes()) ?? [p];

  return (
    <main className="bg-cream text-ink">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/donate", label: "Donate" },
          {
            href: `/donate/${p.slug}`,
            label: p.title,
          },
        ]}
      />

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-5 pb-12 pt-8 sm:px-8 sm:pb-20">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-forest/50">
            Support ISKCON Margao
          </p>

          <h1 className="mt-4 font-serif text-5xl leading-[1.05] text-forest sm:text-6xl">
            {p.title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-muted sm:text-xl">
            {p.description}
          </p>
        </div>
      </section>

      {/* CONTENT + DONATION */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1fr_0.8fr] lg:items-start">

          {/* PURPOSE DESCRIPTION */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
              About this seva
            </p>

            <div className="mt-5 max-w-2xl whitespace-pre-wrap text-base leading-8 text-ink-muted sm:text-lg">
              {p.long_description}
            </div>
          </div>

          {/* DONATION FORM */}
          <div className="rounded-[1.75rem] bg-cream p-6 sm:p-8 lg:sticky lg:top-8">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest/50">
              Make an offering
            </p>

            <h2 className="mt-3 font-serif text-2xl text-forest sm:text-3xl">
              Support this seva
            </h2>

            <p className="mt-3 text-sm leading-7 text-ink-muted">
              Choose an amount below and continue securely with the available
              payment options.
            </p>

            <div className="mt-6">
              <DonateForm
                purposes={all}
                initial={p.slug}
              />
            </div>
          </div>
        </div>
      </section>

      {/* TRUST / NOTE */}
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center sm:px-8 sm:py-20">
          <h2 className="font-serif text-3xl sm:text-4xl">
            Your support helps seva continue.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-cream/65 sm:text-base">
            Contributions help support the activities and services described
            on this page. Please retain your payment confirmation for your
            records.
          </p>
        </div>
      </section>
    </main>
  );
}