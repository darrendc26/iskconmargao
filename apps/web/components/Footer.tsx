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

  const socialIcons = [
    {
      label: "Instagram",
      href: instagram,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      label: "YouTube",
      href: youtube,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      label: "Facebook",
      href: facebook,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      label: "X (Twitter)",
      href: twitter,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
  ].filter((item): item is { label: string; href: string; icon: React.ReactNode } => Boolean(item.href));

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

        {/* COLUMN 3 — QUOTE & STAY CONNECTED */}
        <div className="flex flex-col justify-between">
          <div>
            <p className="font-serif italic text-lg leading-relaxed text-cream/90">
              “In the association of devotees, one can very easily understand the science of Krishna consciousness.”
            </p>
            <p className="mt-2.5 text-[11px] tracking-[0.2em] uppercase text-gold-soft font-bold">
              — Srila Prabhupada
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-cream/10">
            <p className="text-xs uppercase tracking-widest text-gold-soft font-bold">Stay Connected</p>
            <p className="mt-2 text-xs text-cream/80 leading-relaxed">
              Get updates about upcoming festivals, kirtan and Krishna Katha.
            </p>
            <div className="mt-3.5 flex flex-wrap items-center gap-3">
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-cream/30 hover:border-gold-soft px-4 py-2 text-xs font-medium text-cream hover:text-gold-soft hover:bg-cream/10 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-soft/50"
                >
                  <span>Follow on WhatsApp</span>
                  <span>→</span>
                </a>
              )}

              {socialIcons.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={item.label}
                  aria-label={item.label}
                  className="p-2.5 rounded-full border border-cream/25 bg-cream/5 hover:bg-cream/15 hover:border-gold-soft text-cream hover:text-gold-soft transition-all focus:outline-none focus:ring-2 focus:ring-gold-soft/50"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
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