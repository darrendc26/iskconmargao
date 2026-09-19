import { Breadcrumbs, PageHero, Prose } from "@/components/Page";
import { ContactForm } from "@/components/Forms";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/api";
import { CENTRE } from "@/lib/site";
import { mapsHref } from "@/lib/maps";
import { getSettings } from "@/lib/api";
import { AnalyticsClick } from "@/components/ShareBar";
import { Photo, photos } from "@/components/Photo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact ISKCON Margao at Matchless Gifts, next to Borkar Hospital, Margao, Goa.",
  alternates: { canonical: siteUrl("/contact") },
};

export default async function Page() {
  const s = await getSettings();
  const maps = mapsHref(s?.maps_url);
  const wa = s?.whatsapp_contact_url || s?.whatsapp_channel_url;
  return (
    <>
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/contact", label: "Contact" }]} />
      <PageHero title="We'd love to hear from you">
        {CENTRE.name}
        <br />
        {CENTRE.line1}
        <br />
        {CENTRE.line2}
        <br />
        {CENTRE.city}
      </PageHero>
      <div className="mx-auto max-w-3xl px-4 mb-8 overflow-hidden">
        <Photo src={photos.centre} alt="Placeholder street view of the centre" className="w-full max-h-64 object-cover" />
      </div>
      <Prose>
        <p>
          <strong>Phone</strong>
          <br />
          <a href={`tel:${CENTRE.phoneTel}`}>{CENTRE.phoneDisplay}</a>
        </p>
        <p className="text-sm text-ink-muted">
          This number is listed for the Margao centre by ISKCON Goa. Please confirm with the local team if you need to
          be sure it is current.
        </p>
        <div className="not-prose flex flex-wrap gap-3 my-6">
          <AnalyticsClick name="directions_click" href={maps} className="rounded-full bg-forest text-cream px-5 py-2 text-sm">
            Get Directions
          </AnalyticsClick>
          {wa && (
            <AnalyticsClick name="whatsapp_click" href={wa} className="rounded-full border px-5 py-2 text-sm">
              WhatsApp
            </AnalyticsClick>
          )}
        </div>
        <h2>Email</h2>
        <ContactForm />
      </Prose>
    </>
  );
}