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
        className="rounded-full bg-[#075E54] hover:bg-[#054840] !text-white px-5 py-2.5 text-sm font-semibold transition-colors shadow-sm inline-flex items-center gap-2.5 !no-underline"
      >
        <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        </svg>
        <span className="!text-white font-medium">Share on WhatsApp</span>
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
