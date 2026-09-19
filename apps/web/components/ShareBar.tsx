"use client";

import { useState } from "react";
import Link from "next/link";

export function ShareBar({ text, url }: { text: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const wa = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text}\n\n${url}`)}`;
  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={wa}
        target="_blank"
        rel="noreferrer"
        className="rounded-full bg-emerald-700 text-white hover:bg-emerald-800 px-5 py-2.5 text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-2 no-underline"
      >
        <span>Share on WhatsApp</span>
      </a>
      <button
        type="button"
        className="rounded-full border border-forest text-forest hover:bg-sand/40 px-5 py-2.5 text-sm font-medium transition-colors"
        onClick={async () => {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
      >
        {copied ? "Link copied ✓" : "Copy link"}
      </button>
    </div>
  );
}

export function AnalyticsClick({
  name,
  children,
  className,
  href,
}: {
  name: string;
  children: React.ReactNode;
  className?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        fetch("/api/v1/analytics/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, path: window.location.pathname }),
        }).catch(() => {});
      }}
    >
      {children}
    </Link>
  );
}
