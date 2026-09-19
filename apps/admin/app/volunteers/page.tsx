"use client";
import { useEffect, useState } from "react";
import { Shell } from "@/components/Shell";
import { api } from "@/lib/api";

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    api<any[]>("/api/v1/admin/volunteers").then((r) => {
      if (!r.ok) {
        setMsg(r.error || "Could not load volunteers.");
        return;
      }
      setItems(Array.isArray(r.data) ? r.data : []);
    });
  }, []);
  return (
    <Shell>
      <h1 className="font-serif text-4xl text-forest">Volunteers</h1>
      <p className="mt-2 text-sm text-ink/70">Same name and mobile number are shown as one card.</p>
      {msg && <p className="mt-4 text-sm">{msg}</p>}
      <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((v, i) => (
          <li key={v.id || i} className="border border-gold/25 bg-white/70 p-5 flex flex-col">
            <p className="font-medium text-lg">{v.name}</p>
            <p className="text-sm text-ink/60 mt-1">{v.created_at}</p>
            {v.submissions > 1 && (
              <p className="text-xs uppercase tracking-widest text-gold mt-2">{v.submissions} submissions</p>
            )}
            <p className="text-sm mt-3">
              {v.phone}
              {v.email ? ` · ${v.email}` : ""}
            </p>
            <p className="text-sm text-ink/60 mt-2">{(v.areas_of_interest || []).join(", ") || "No areas listed"}</p>
            {v.message && <p className="mt-3 text-sm whitespace-pre-wrap flex-1">{v.message}</p>}
          </li>
        ))}
      </ul>
    </Shell>
  );
}
