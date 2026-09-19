import { Suspense } from "react";
import { Breadcrumbs, PageHero, Prose } from "@/components/Page";
import { VolunteerForm } from "@/components/Forms";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/api";
import { Photo, photos } from "@/components/Photo";

export const metadata: Metadata = {
  title: "Volunteer",
  description: "Offer seva at ISKCON Margao — kirtan, prasadam, festivals, photography, outreach and more.",
  alternates: { canonical: siteUrl("/volunteer") },
};

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/volunteer", label: "Volunteer" }]} />
      <PageHero title="Volunteer">Tell us your name, how we can reach you, and how you would like to serve.</PageHero>
      <div className="mx-auto max-w-3xl px-4 mb-8 overflow-hidden">
        <Photo src={photos.community} alt="" className="w-full max-h-56 object-cover" />
      </div>
      <Prose>
        <Suspense fallback={<p className="text-ink-muted">Loading form...</p>}>
          <VolunteerForm />
        </Suspense>
      </Prose>
    </>
  );
}
