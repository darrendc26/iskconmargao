import Link from "next/link";
import { getSettings } from "@/lib/api";
import { mapsHref } from "@/lib/maps";
import { CENTRE } from "@/lib/site";

export async function Footer() {
  const s = await getSettings();
  const goa = s?.iskcon_goa_url || CENTRE.iskconGoa;
  const maps = mapsHref(s?.maps_url);
  const wa = s?.whatsapp_channel_url || s?.whatsapp_contact_url;
  return (
    <footer className="bg-[#163428] text-cream">
      <div className="mx-auto max-w-6xl px-4 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl">{CENTRE.name}</p>
          <p className="mt-4 text-cream/80 leading-relaxed text-sm">
            {CENTRE.line1}
            <br />
            {CENTRE.line2}
            <br />
            {CENTRE.city}
          </p>
          <p className="mt-4 text-sm text-gold-soft">{CENTRE.weekly}</p>
          <a href={maps} target="_blank" rel="noopener noreferrer" className="inline-block mt-5 text-sm underline">
            Get Directions
          </a>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-gold-soft">Stay connected</p>
          <p className="mt-3 text-sm text-cream/80 max-w-xs">Get updates about kirtan, festivals and weekly programs.</p>
          {wa && (
            <a href={wa} className="inline-block mt-5 rounded-full border border-cream/30 px-4 py-2 text-sm">
              Follow on WhatsApp
            </a>
          )}
          <ul className="mt-6 space-y-2 text-sm">
            <li>
              <Link href="/programs">Programs</Link>
            </li>
            <li>
              <Link href="/festivals">Festivals</Link>
            </li>
            <li>
              <Link href="/gallery">Gallery</Link>
            </li>
            <li>
              <Link href="/seva">Seva</Link>
            </li>
            <li>
              <Link href="/donate">Donate</Link>
            </li>
            <li>
              <Link href="/visit">Visit</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <a href={goa}>ISKCON Goa</a>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-serif italic text-xl leading-relaxed text-cream/90">
            “In the association of devotees, one can very easily understand the science of Krishna consciousness.”
          </p>
          <p className="mt-4 text-[11px] tracking-[0.2em] uppercase text-gold-soft">Srila Prabhupada</p>
        </div>
      </div>
      <div className="border-t border-cream/10 text-sm text-cream/70 px-4 py-6 flex flex-wrap gap-4 justify-between max-w-6xl mx-auto">
        <p>© {new Date().getFullYear()} ISKCON Margao · A welcoming spiritual centre in South Goa.</p>
        <div className="flex gap-4">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}