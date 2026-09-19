"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";

const nav = [
  { href: "/", label: "Dashboard" },
  { group: "Content" },
  { href: "/articles", label: "Articles" },
  { href: "/festivals", label: "Festivals" },
  { href: "/programs", label: "Programs" },
  { href: "/announcements", label: "Announcements" },
  { group: "Media" },
  { href: "/albums", label: "Photo Albums" },
  { href: "/videos", label: "Videos" },
  { group: "Community" },
  { href: "/volunteers", label: "Volunteers" },
  { href: "/subscribers", label: "Subscribers" },
  { href: "/contacts", label: "Contact Messages" },
  { group: "Donations" },
  { href: "/donations", label: "Donations" },
  { href: "/donation-purposes", label: "Donation Purposes" },
  { group: "Website" },
  { href: "/settings", label: "Settings" },
  { group: "System" },
  { href: "/users", label: "Users" },
  { href: "/audit", label: "Audit Logs" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    api("/api/v1/admin/me").then((r) => {
      if (r.status === 401) router.push("/login");
    });
  }, [router]);

  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr] bg-cream/30">
      {/* Mobile Top Header Bar */}
      <div className="md:hidden sticky top-0 z-30 bg-forest text-cream px-4 py-3 flex items-center justify-between shadow-md">
        <div>
          <span className="font-serif text-lg tracking-wide block leading-tight">ISKCON Margao</span>
          <span className="text-[10px] text-gold uppercase tracking-widest block">Content Studio</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="px-3 py-1.5 rounded-lg border border-gold/40 text-cream text-xs font-medium bg-cream/10 hover:bg-cream/20 flex items-center gap-1.5"
        >
          <span>{mobileMenuOpen ? "✕ Close" : "☰ Navigation"}</span>
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:block bg-forest text-cream p-6 border-b md:border-b-0 md:border-r border-gold/20`}
      >
        <div className="hidden md:block">
          <p className="font-serif text-2xl">ISKCON Margao</p>
          <p className="text-xs text-gold mt-1">Content studio</p>
        </div>
        <nav className="mt-4 md:mt-8 space-y-1 text-sm">
          {nav.map((item, i) =>
            "group" in item ? (
              <p key={i} className="pt-4 pb-1 text-[10px] uppercase tracking-widest text-gold/80 font-bold">
                {item.group}
              </p>
            ) : (
              <Link
                key={item.href}
                href={item.href!}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                  path === item.href ? "bg-cream/20 text-white font-medium" : "hover:bg-cream/10 text-cream/90"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>
        <button
          className="mt-8 text-xs underline text-gold hover:text-white"
          onClick={async () => {
            await api("/api/v1/admin/auth/logout", { method: "POST" });
            router.push("/login");
          }}
        >
          Sign out
        </button>
      </aside>

      {/* Main Content Viewport */}
      <main className="p-4 sm:p-6 md:p-10 max-w-full overflow-x-hidden">{children}</main>
    </div>
  );
}
