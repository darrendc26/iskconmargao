"use client";
import { FormEvent, useEffect, useState } from "react";
import { Shell } from "@/components/Shell";
import { api } from "@/lib/api";

export default function Page() {
  const [s, setS] = useState<any>(null);
  useEffect(() => {
    api("/api/v1/admin/settings").then((r) => setS(r.data));
  }, []);
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    await api("/api/v1/admin/settings", { method: "PUT", body: JSON.stringify({ ...s, ...body }) });
    alert("Saved.");
  }
  if (!s) return <Shell>Loading…</Shell>;
  return (
    <Shell>
      <h1 className="font-serif text-4xl text-forest">Website settings</h1>
      <form onSubmit={save} className="mt-8 max-w-xl space-y-3">
        {[
          ["whatsapp_channel_url", "WhatsApp channel link"],
          ["whatsapp_contact_url", "WhatsApp contact link"],
          ["maps_url", "Google Maps directions link"],
          ["instagram_url", "Instagram"],
          ["facebook_url", "Facebook"],
          ["youtube_url", "YouTube"],
          ["operating_note", "When the centre is open (short note)"],
          ["vision_summary", "Vision for South Goa"],
        ].map(([k, l]) => (
          <label key={k} className="block text-sm">
            {l}
            <input name={k} defaultValue={s[k] || ""} className="mt-1 w-full border px-3 py-2" />
          </label>
        ))}
        <button className="rounded-full bg-forest text-cream px-5 py-2">Save settings</button>
      </form>
    </Shell>
  );
}
