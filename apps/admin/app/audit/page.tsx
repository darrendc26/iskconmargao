"use client";
import { useEffect, useState } from "react";
import { Shell } from "@/components/Shell";
import { api } from "@/lib/api";

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    api<any[]>("/api/v1/admin/audit-logs").then((r) => setItems(r.data || []));
  }, []);
  return (
    <Shell>
      <h1 className="font-serif text-4xl text-forest">Audit log</h1>
      <ul className="mt-8 text-sm space-y-2">
        {items.map((a) => (
          <li key={a.id}>
            {a.created_at} · {a.action} · {a.entity} · {a.entity_id}
          </li>
        ))}
      </ul>
    </Shell>
  );
}
