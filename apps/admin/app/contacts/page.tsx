"use client";
import { useEffect, useState } from "react";
import { Shell } from "@/components/Shell";
import { api } from "@/lib/api";

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    api<any[]>("/api/v1/admin/contacts").then((r) => setItems(r.data || []));
  }, []);
  return (
    <Shell>
      <h1 className="font-serif text-4xl text-forest">Contact messages</h1>
      <ul className="mt-8 space-y-4">
        {items.map((v) => (
          <li key={v.id} className="border-b py-3">
            <p className="font-medium">{v.name}</p>
            <p className="text-sm">{v.email} {v.phone}</p>
            <p className="mt-1 whitespace-pre-wrap">{v.message}</p>
          </li>
        ))}
      </ul>
    </Shell>
  );
}
