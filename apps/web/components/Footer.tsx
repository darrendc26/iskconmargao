import Link from "next/link";
import { getSettings } from "@/lib/api";
import { mapsHref } from "@/lib/maps";
import { CENTRE } from "@/lib/site";

export async function Footer() {
  const s = await getSettings();
  const goa = s?.iskcon_goa_url || CENTRE.iskconGoa;
  const maps = mapsHref(s?.maps_url);
  const wa = s?.whatsapp_channel_url || s?.whatsapp_contact_url;

  const instagram = s?.instagram_url;
  const youtube = s?.youtube_url;
  const facebook = s?.facebook_url;
  const twitter = s?.twitter_url;

  const socialLinks = [
    { label: "Instagram", href: instagram },
    { label: "YouTube", href: youtube },
    { label: "Facebook", href: facebook },
    { label: "X", href: twitter },
  ].filter((item): item is { label: string; href: string } => Boolean(item.href));

  return (
    <footer className="bg-[#163428] text-cream">
      <div className="mx-auto max-w-6xl px-4 py-14 grid gap-10 md:grid-cols-3">
        {/* COLUMN 1 — ISKCON MARGAO */}
        <div>
          <p className="font-serif text-2xl tracking-wide">{CENTRE.name}</p>
          <p className="mt-4 text-cream/80 leading-relaxed text-sm">
            {CENTRE.line1}
            <br />
            {CENTRE.line2}
            <br />
            {CENTRE.city}
          </p>
          <p className="mt-4 text-sm text-gold-soft font-medium">{CENTRE.weekly}</p>
          <a
            href={maps}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-5 text-sm underline text-cream hover:text-gold-soft transition-colors focus:outline-none focus:ring-2 focus:ring-gold-soft/50 rounded-sm"
          >
            Get Directions
          </a>
        </div>

        {/* COLUMN 2 — EXPLORE */}
        <div>
          <p className="text-xs uppercase tracking-widest text-gold-soft font-bold">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm text-cream/85">
            <li>
              <Link href="/programs" className="hover:text-gold-soft transition-colors focus:outline-none focus:underline">
                Programs
              </Link>
            </li>
            <li>
              <Link href="/festivals" className="hover:text-gold-soft transition-colors focus:outline-none focus:underline">
                Festivals
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-gold-soft transition-colors focus:outline-none focus:underline">
                Gallery
              </Link>
            </li>
            <li>
              <Link href="/seva" className="hover:text-gold-soft transition-colors focus:outline-none focus:underline">
                Seva
              </Link>
            </li>
            <li>
              <Link href="/visit" className="hover:text-gold-soft transition-colors focus:outline-none focus:underline">
                Visit
              </Link>
            </li>
            <li>
              <Link href="/donate" className="hover:text-gold-soft transition-colors focus:outline-none focus:underline">
                Donate
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gold-soft transition-colors focus:outline-none focus:underline">
                Contact
              </Link>
            </li>
            {goa && (
              <li>
                <a
                  href={goa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-soft transition-colors focus:outline-none focus:underline"
                >
                  ISKCON Goa
                </a>
              </li>
            )}
          </ul>
        </div>

        {/* COLUMN 3 — STAY CONNECTED */}
        <div>
          <p className="text-xs uppercase tracking-widest text-gold-soft font-bold">Stay Connected</p>
          <p className="mt-4 text-sm text-cream/80 leading-relaxed max-w-sm">
            Get updates about upcoming festivals, kirtan and Krishna Katha.
          </p>
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 rounded-full border border-cream/30 hover:border-gold-soft px-5 py-2.5 text-sm font-medium text-cream hover:text-gold-soft hover:bg-cream/10 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-soft/50"
            >
              <span>Follow us on WhatsApp</span>
              <span>→</span>
            </a>
          )}
          {socialLinks.length > 0 && (
            <div className="mt-6 pt-5 border-t border-cream/10">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-cream/75">
                {socialLinks.map((item, index) => (
                  <span key={item.label} className="inline-flex items-center gap-3">
                    {index > 0 && <span className="text-cream/30" aria-hidden="true">·</span>}
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-gold-soft transition-colors focus:outline-none focus:underline"
                    >
                      {item.label}
                    </a>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* COPYRIGHT ROW */}
      <div className="border-t border-cream/10 text-sm text-cream/70 px-4 py-6 flex flex-wrap gap-4 justify-between max-w-6xl mx-auto">
        <p>© {new Date().getFullYear()} ISKCON Margao · A welcoming spiritual centre in South Goa.</p>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-gold-soft transition-colors focus:outline-none focus:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-gold-soft transition-colors focus:outline-none focus:underline">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}