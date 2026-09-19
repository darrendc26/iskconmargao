import { Breadcrumbs, PageHero, Prose } from "@/components/Page";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/api";

export const metadata: Metadata = { title: "Terms", alternates: { canonical: siteUrl("/terms") } };

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/terms", label: "Terms" }]} />
      <PageHero title="Terms" />
      <Prose>
        <p>
          This website describes ISKCON Margao as a spiritual centre in South Goa. Information is provided in good faith
          and program details may change. Donations are voluntary contributions, not purchases of goods, unless a
          specific seva is described by the organisation.
        </p>
      </Prose>
    </>
  );
}
