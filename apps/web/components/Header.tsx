"use client";

import Link from "next/link";
import { useState } from "react";
import { Photo, photos } from "@/components/Photo";

const discover = [
  { href: "/discover/krishna", label: "Krishna" },
  { href: "/discover/radha-rani", label: "Srimati Radha Rani" },
  { href: "/discover/caitanya", label: "Caitanya Mahaprabhu", },
  { href: "/discover/bhagavad-gita", label: "Bhagavad-gita" },
  { href: "/discover/bhakti-yoga", label: "Bhakti-yoga" },
  { href: "/discover/chanting", label: "Chanting" },
  // {
  //   href: "/about/srila-prabhupada",
  //   label: "Srila Prabhupada",
  // },
];

const involved = [
  { href: "/seva", label: "Seva" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/temple-nirman", label: "Temple Nirman" },
];

const about = [
  { href: "/about", label: "ISKCON Margao" },
  {
    href: "/about/iskcon",
    label: "What is ISKCON?",
  },
  {
    href: "/about/srila-prabhupada",
    label: "Srila Prabhupada",
  },
  {
    href: "/about/our-journey",
    label: "Our Journey",
  },
  {
    href: "https://www.iskcongoa.com/",
    label: "ISKCON Goa",
    external: true,
  },
];

type DropdownItem = {
  href: string;
  label: string;
  external?: boolean;
};

function Dropdown({
  label,
  items,
}: {
  label: string;
  items: DropdownItem[];
}) {
  return (
    <div className="relative group">
      <button
        type="button"
        className="inline-flex items-center gap-1 px-2.5 py-2 text-[13px] text-forest/90 transition hover:text-forest"
        aria-haspopup="true"
      >
        {label}

        <span aria-hidden className="text-[9px]">
          ▾
        </span>
      </button>

      <div
        className="
          invisible absolute left-0 top-full z-[200]
          min-w-52
          border border-gold/30
          bg-cream
          py-2
          shadow-lg
          opacity-0
          transition-opacity
          group-hover:visible
          group-hover:opacity-100
          group-focus-within:visible
          group-focus-within:opacity-100
        "
      >
        {items.map((item) =>
          item.external ? (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="block px-4 py-2 text-sm text-ink transition hover:bg-cream-dark"
            >
              {item.label}
            </a>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 text-sm text-ink transition hover:bg-cream-dark"
            >
              {item.label}
            </Link>
          )
        )}
      </div>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const wa =
    process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL_URL || "/contact";

  function closeMenu() {
    setOpen(false);
    setOpenSection(null);
  }

  function toggleSection(section: string) {
    setOpenSection((current) =>
      current === section ? null : section
    );
  }

  return (
    <>
      {/* =========================================================
          HEADER
      ========================================================== */}
      <header
        className="
          sticky top-0 z-[100]
          border-b border-gold/15
          bg-cream/95
          backdrop-blur
        "
      >
        <div
          className="
            mx-auto flex h-[4.25rem]
            max-w-6xl
            items-center
            justify-between
            gap-6
            px-4
          "
        >
          <div className="flex items-center gap-6 lg:gap-10">
            {/* Logo */}
            <Link href="/" className="flex items-center leading-tight group shrink-0">
              <Photo
                src={photos.headerLogo}
                alt="ISKCON Margao"
                className="h-10 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            {/* =====================================================
                DESKTOP NAVIGATION
            ====================================================== */}
            <nav
              className="hidden items-center gap-1 lg:flex"
              aria-label="Main navigation"
            >
              <Link
                href="/"
                className="px-2.5 py-2 text-[13px] font-medium text-forest/90 transition hover:text-saffron"
              >
                Home
              </Link>

              <Link
                href="/visit"
                className="px-2.5 py-2 text-[13px] font-medium text-forest/90 transition hover:text-saffron"
              >
                Visit Us
              </Link>

              <Link
                href="/programs"
                className="px-2.5 py-2 text-[13px] font-medium text-forest/90 transition hover:text-saffron"
              >
                Programs
              </Link>

              <Dropdown
                label="Discover Krishna"
                items={discover}
              />

              <Link
                href="/festivals"
                className="px-2.5 py-2 text-[13px] font-medium text-forest/90 transition hover:text-saffron"
              >
                Festivals
              </Link>

              <Dropdown
                label="Get Involved"
                items={involved}
              />

              <Link
                href="/articles"
                className="px-2.5 py-2 text-[13px] font-medium text-forest/90 transition hover:text-saffron"
              >
                Blogs
              </Link>

              <Dropdown
                label="About"
                items={about}
              />
            </nav>
          </div>

          {/* =====================================================
              DESKTOP CTA
          ====================================================== */}
          <div className="hidden items-center gap-2 lg:flex">
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="
                rounded-full
                border border-forest/25
                px-4 py-1.5
                text-[13px]
                transition
                hover:border-forest
              "
            >
              WhatsApp
            </a>

            <Link
              href="/donate"
              className="
                rounded-full
                bg-forest
                px-4 py-1.5
                text-[13px]
                font-medium
                text-cream
                shadow-sm
                transition
                hover:bg-forest/90
              "
            >
              Donate
            </Link>
          </div>

          {/* =====================================================
              MOBILE HEADER ACTIONS
          ====================================================== */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/donate"
              className="
                rounded-full
                bg-forest
                px-3 py-1.5
                text-xs
                font-medium
                text-cream
                shadow-sm
                transition
                hover:bg-forest/90
              "
            >
              Donate
            </Link>

            <button
              type="button"
              className="
                flex
                items-center
                gap-1.5
                rounded-full
                border border-forest/30
                bg-sand/30
                px-3 py-1.5
                text-xs
                font-semibold
                text-forest
                transition
                hover:bg-sand/60
              "
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label="Toggle navigation menu"
              onClick={() => setOpen(true)}
            >
              <span aria-hidden>☰</span>
              <span>Menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================
          MOBILE NAVIGATION
          
          IMPORTANT:
          This is intentionally OUTSIDE the header.
          This prevents sticky/backdrop-blur stacking-context issues.
      ========================================================== */}
      {open && (
        <div
          id="mobile-navigation"
          className="
            fixed inset-0 z-[1000]
            bg-ink/50
            backdrop-blur-sm
            lg:hidden
          "
          onClick={closeMenu}
        >
          {/* =====================================================
              DRAWER
          ====================================================== */}
          <aside
            className="
              absolute
              right-0
              top-0
              flex
              h-full
              w-[min(88vw,24rem)]
              flex-col
              justify-between
              overflow-y-auto
              bg-cream
              p-5
              shadow-2xl
            "
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
          >
            <div>
              {/* =================================================
                  DRAWER HEADER
              ================================================== */}
              <div
                className="
                  mb-4
                  flex
                  items-center
                  justify-between
                  border-b
                  border-gold/20
                  pb-4
                "
              >
                <Link href="/" onClick={closeMenu} className="flex items-center">
                  <Photo
                    src={photos.headerLogo}
                    alt="ISKCON Margao"
                    className="h-9 w-auto object-contain"
                  />
                </Link>

                <button
                  type="button"
                  onClick={closeMenu}
                  className="
                    rounded-full
                    bg-gold/20
                    px-3 py-1
                    text-xs
                    font-bold
                    text-forest
                    transition
                    hover:bg-gold/30
                  "
                  aria-label="Close navigation menu"
                >
                  ✕ Close
                </button>
              </div>

              {/* =================================================
                  QUICK NAVIGATION
              ================================================== */}
              <div className="mb-5 grid grid-cols-2 gap-2 text-sm">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="
                    flex
                    flex-col
                    items-start
                    gap-1
                    rounded-xl
                    border border-gold/20
                    bg-white/80
                    p-3
                    font-medium
                    text-forest
                    transition
                    hover:border-forest
                  "
                >
                  <span className="text-base">🏠</span>
                  <span>Home</span>
                </Link>

                <Link
                  href="/visit"
                  onClick={closeMenu}
                  className="
                    flex
                    flex-col
                    items-start
                    gap-1
                    rounded-xl
                    border border-gold/20
                    bg-white/80
                    p-3
                    font-medium
                    text-forest
                    transition
                    hover:border-forest
                  "
                >
                  <span className="text-base">📍</span>
                  <span>Visit Us</span>
                </Link>

                <Link
                  href="/programs"
                  onClick={closeMenu}
                  className="
                    flex
                    flex-col
                    items-start
                    gap-1
                    rounded-xl
                    border border-gold/20
                    bg-white/80
                    p-3
                    font-medium
                    text-forest
                    transition
                    hover:border-forest
                  "
                >
                  <span className="text-base">🏛️</span>
                  <span>Programs</span>
                </Link>

                <Link
                  href="/festivals"
                  onClick={closeMenu}
                  className="
                    flex
                    flex-col
                    items-start
                    gap-1
                    rounded-xl
                    border border-gold/20
                    bg-white/80
                    p-3
                    font-medium
                    text-forest
                    transition
                    hover:border-forest
                  "
                >
                  <span className="text-base">🪷</span>
                  <span>Festivals</span>
                </Link>

                <Link
                  href="/articles"
                  onClick={closeMenu}
                  className="
                    flex
                    flex-col
                    items-start
                    gap-1
                    rounded-xl
                    border border-gold/20
                    bg-white/80
                    p-3
                    font-medium
                    text-forest
                    transition
                    hover:border-forest
                  "
                >
                  <span className="text-base">📰</span>
                  <span>Blogs & Articles</span>
                </Link>

                <Link
                  href="/seva"
                  onClick={closeMenu}
                  className="
                    flex
                    flex-col
                    items-start
                    gap-1
                    rounded-xl
                    border border-gold/20
                    bg-white/80
                    p-3
                    font-medium
                    text-forest
                    transition
                    hover:border-forest
                  "
                >
                  <span className="text-base">🤲</span>
                  <span>Seva & Volunteer</span>
                </Link>
              </div>

              {/* =================================================
                  ACCORDION SECTIONS
              ================================================== */}
              <div
                className="
                  space-y-2
                  border-t
                  border-gold/20
                  pt-3
                  text-sm
                "
              >
                {/* =================================================
                    DISCOVER
                ================================================== */}
                <div
                  className="
                    overflow-hidden
                    rounded-xl
                    border border-gold/20
                    bg-white/50
                  "
                >
                  <button
                    type="button"
                    onClick={() => toggleSection("discover")}
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      px-3.5
                      py-3
                      text-left
                      text-xs
                      font-medium
                      uppercase
                      tracking-wider
                      text-forest
                    "
                    aria-expanded={
                      openSection === "discover"
                    }
                  >
                    <span>✨ Discover Krishna</span>

                    <span aria-hidden>
                      {openSection === "discover"
                        ? "▲"
                        : "▼"}
                    </span>
                  </button>

                  {openSection === "discover" && (
                    <div
                      className="
                        space-y-1.5
                        border-t border-gold/15
                        bg-cream/30
                        px-3
                        pb-3
                        pt-2
                        text-xs
                      "
                    >
                      {discover.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMenu}
                          className="
                            block
                            rounded
                            px-2
                            py-2
                            text-ink/90
                            transition
                            hover:bg-gold/20
                          "
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* =================================================
                    GET INVOLVED
                ================================================== */}
                <div
                  className="
                    overflow-hidden
                    rounded-xl
                    border border-gold/20
                    bg-white/50
                  "
                >
                  <button
                    type="button"
                    onClick={() => toggleSection("involved")}
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      px-3.5
                      py-3
                      text-left
                      text-xs
                      font-medium
                      uppercase
                      tracking-wider
                      text-forest
                    "
                    aria-expanded={
                      openSection === "involved"
                    }
                  >
                    <span>🤝 Get Involved</span>

                    <span aria-hidden>
                      {openSection === "involved"
                        ? "▲"
                        : "▼"}
                    </span>
                  </button>

                  {openSection === "involved" && (
                    <div
                      className="
                        space-y-1.5
                        border-t border-gold/15
                        bg-cream/30
                        px-3
                        pb-3
                        pt-2
                        text-xs
                      "
                    >
                      {involved.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMenu}
                          className="
                            block
                            rounded
                            px-2
                            py-2
                            text-ink/90
                            transition
                            hover:bg-gold/20
                          "
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* =================================================
                    ABOUT
                ================================================== */}
                <div
                  className="
                    overflow-hidden
                    rounded-xl
                    border border-gold/20
                    bg-white/50
                  "
                >
                  <button
                    type="button"
                    onClick={() => toggleSection("about")}
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      px-3.5
                      py-3
                      text-left
                      text-xs
                      font-medium
                      uppercase
                      tracking-wider
                      text-forest
                    "
                    aria-expanded={
                      openSection === "about"
                    }
                  >
                    <span>ℹ️ About ISKCON</span>

                    <span aria-hidden>
                      {openSection === "about"
                        ? "▲"
                        : "▼"}
                    </span>
                  </button>

                  {openSection === "about" && (
                    <div
                      className="
                        space-y-1.5
                        border-t border-gold/15
                        bg-cream/30
                        px-3
                        pb-3
                        pt-2
                        text-xs
                      "
                    >
                      {about.map((item) =>
                        item.external ? (
                          <a
                            key={item.href}
                            href={item.href}
                            target="_blank"
                            rel="noreferrer"
                            className="
                              block
                              rounded
                              px-2
                              py-2
                              text-ink/90
                              transition
                              hover:bg-gold/20
                            "
                          >
                            {item.label} ↗
                          </a>
                        ) : (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeMenu}
                            className="
                              block
                              rounded
                              px-2
                              py-2
                              text-ink/90
                              transition
                              hover:bg-gold/20
                            "
                          >
                            {item.label}
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* =====================================================
                BOTTOM CTA
            ====================================================== */}
            <div
              className="
                mt-6
                space-y-2
                border-t
                border-gold/20
                pt-4
              "
            >
              <Link
                href="/donate"
                onClick={closeMenu}
                className="
                  block
                  w-full
                  rounded-full
                  bg-forest
                  py-3
                  text-center
                  text-sm
                  font-medium
                  text-cream
                  shadow-md
                  transition
                  hover:bg-forest/90
                "
              >
                Donate / Offer Seva
              </Link>

              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="
                  block
                  w-full
                  rounded-full
                  border
                  border-forest
                  py-2.5
                  text-center
                  text-xs
                  font-medium
                  text-forest
                  transition
                  hover:bg-sand/40
                "
              >
                Connect on WhatsApp
              </a>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}