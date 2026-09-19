import { Breadcrumbs, PageHero, Prose } from "@/components/Page";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/api";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: siteUrl("/privacy") },
};

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/privacy", label: "Privacy" }]} />
      <PageHero title="Privacy Policy" />
      <Prose>
        <p>ISKCON Margao collects only what is needed to welcome you and run the centre.</p>
        <h2>Contact, volunteer, and subscriber forms</h2>
        <p>
          Names, emails, and phone numbers you submit are stored so we can reply. We do not sell this information.
          WhatsApp messages are never sent without explicit opt-in.
        </p>
        <h2>Donations</h2>
        <p>Payment details are processed by the payment provider. We store donation records for accounting, not card numbers.</p>
        <h2>Analytics</h2>
        <p>We record simple events such as page views and button clicks, without selling profiles.</p>
        <h2>Cookies</h2>
        <p>The public site uses essential cookies. The admin site uses a secure session cookie.</p>
        <h2>Unsubscribe</h2>
        <p>Write to us via the contact form to request deletion or to stop future messages.</p>
      </Prose>
    </>
  );
}
