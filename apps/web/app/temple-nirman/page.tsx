import { Breadcrumbs, PageHero, Prose } from "@/components/Page";
import { NirmanPledgeForm } from "@/components/Forms";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/api";
import Link from "next/link";
import { Photo, photos } from "@/components/Photo";

export const metadata: Metadata = {
  title: "Temple Nirman",
  description:
    "A vision for a larger spiritual home for South Goa. Register a non-binding pledge — no payment is collected now.",
  alternates: { canonical: siteUrl("/temple-nirman") },
};

export default function Page() {
  return (
    <>
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/donate", label: "Donate" },
          { href: "/temple-nirman", label: "Temple Nirman" },
        ]}
      />
      <PageHero title="A Spiritual Home for South Goa">
        ISKCON Margao currently serves the community from its centre in Margao. As the community grows, we aspire to
        establish a larger spiritual home for South Goa.
      </PageHero>
      <Prose>
        <div className="not-prose mb-8 overflow-hidden">
          <Photo src={photos.centre} alt="Placeholder for a future spiritual home" className="w-full max-h-72 object-cover" />
        </div>
        <h2>What we envision</h2>
        <p>A place that can hold kirtan, Krishna Katha, festivals, prasadam, spiritual education, community gatherings and devotional service — when the project is formally undertaken.</p>
        <p>
          We do not claim land, construction dates, a budget or architectural plans until those actually exist.{" "}
          <Link href="/about/our-journey">Our journey</Link> records the centre as it is today.
        </p>
        <h2>Pledge your support</h2>
        <p>
          If you would like to indicate the amount you may be willing to contribute when the Temple Nirman project is
          formally undertaken, you can register your pledge below.
        </p>
        <p>
          <strong>This is a non-binding expression of future support. No payment is being collected at this stage.</strong>
        </p>
        <div className="not-prose mt-8">
          <NirmanPledgeForm />
        </div>
      </Prose>
    </>
  );
}