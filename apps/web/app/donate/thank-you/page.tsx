import { Breadcrumbs, PageHero, Prose } from "@/components/Page";
import { siteUrl } from "@/lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Thank you", robots: { index: false }, alternates: { canonical: siteUrl("/donate/thank-you") } };

export default async function Thanks({ searchParams }: { searchParams: Promise<{ donation_id?: string }> }) {
  const { donation_id } = await searchParams;
  return (
    <>
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/donate", label: "Donate" }]} />
      <PageHero title="Thank you">
        If you completed a payment, our system will confirm it after the payment provider notifies us. This page alone
        is not a receipt of success.
      </PageHero>
      <Prose>
        {donation_id && <p>Reference: {donation_id}</p>}
        <p>Hare Krishna. Your intention to serve is received with gratitude.</p>
      </Prose>
    </>
  );
}
