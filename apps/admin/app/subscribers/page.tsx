"use client";
import { useEffect, useState } from "react";
import { Shell } from "@/components/Shell";
import { api } from "@/lib/api";

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    api<any[]>("/api/v1/admin/subscribers").then((r) => setItems(r.data || []));
  }, []);
  return (
    <Shell>
      <h1 className="font-serif text-4xl text-forest">Subscribers</h1>
      <ul className="mt-8 space-y-2">
        {items.map((v) => (
          <li key={v.id}>
            {v.name} · {v.email || v.phone} {v.whatsapp_opt_in ? "· WhatsApp opt-in" : ""}
          </li>
        ))}
      </ul>
    </Shell>
  );
}
