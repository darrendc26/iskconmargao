import { Breadcrumbs, PageHero, Prose } from "@/components/Page";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/api";
import Link from "next/link";
import { Photo, photos } from "@/components/Photo";

export const metadata: Metadata = {
  title: "Our Journey",
  description: "The story of ISKCON Margao as a growing centre of ISKCON Goa in South Goa.",
  alternates: { canonical: siteUrl("/about/our-journey") },
};

export default function Page() {
  return (
    <>
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/about", label: "About" },
          { href: "/about/our-journey", label: "Our Journey" },
        ]}
      />
      <PageHero title="Our Journey">
        The history of ISKCON Margao itself — not the global history of ISKCON. Dates and names below will be completed
        by the Margao devotees as they are confirmed.
      </PageHero>
      <Prose>
        <div className="not-prose mb-8 overflow-hidden">
          <Photo src={photos.community} alt="" className="w-full max-h-72 object-cover" />
        </div>
        <h2>The beginning</h2>
        <p>
          ISKCON Margao began as a local sangha in South Goa — a place to chant, hear and associate. Precise founding
          details belong to those who were there; this page will carry their account when it is ready.
        </p>
        <h2>Growing community</h2>
        <p>
          Over time, Friday and Saturday gatherings, festival observances and seva have drawn more people from Margao
          and nearby towns. Milestones will be listed here as the team records them.
        </p>
        <h2>Today</h2>
        <p>
          The centre currently serves from Matchless Gifts, next to Borkar Hospital, Margao. Weekly kirtan, Krishna
          Katha, prasadam and announced festivals are the public face of the community — not a daily temple timetable.
        </p>
        <h2>Looking ahead</h2>
        <p>
          As the community grows, we aspire to a larger spiritual home for South Goa. That is a vision, not a claim
          about land, construction dates or buildings that exist today.{" "}
          <Link href="/temple-nirman">Read about Temple Nirman</Link>.
        </p>
      </Prose>
    </>
  );
}