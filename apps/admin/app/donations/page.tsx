"use client";
import { useEffect, useState } from "react";
import { Shell } from "@/components/Shell";
import { api, apiUrl } from "@/lib/api";

export default function Page() {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    api("/api/v1/admin/donations").then((r) => setData(r.data));
  }, []);
  const s = data?.stats || {};
  return (
    <Shell>
      <h1 className="font-serif text-4xl text-forest">Donations</h1>
      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        <div className="bg-white/70 p-4 border">Total ₹{Math.round((s.total_paise || 0) / 100)}</div>
        <div className="bg-white/70 p-4 border">This month ₹{Math.round((s.month_paise || 0) / 100)}</div>
        <div className="bg-white/70 p-4 border">Successful {s.successful}</div>
      </div>
      <a className="inline-block mt-6 underline text-sm" href={`${apiUrl()}/api/v1/admin/donations/export`}>
        Download CSV
      </a>
      <ul className="mt-8 space-y-2">
        {(data?.items || []).map((d: any) => (
          <li key={d.id} className="text-sm border-b py-2">
            {d.created_at} · {d.status} · ₹{(d.amount / 100).toLocaleString("en-IN")} · {d.purpose} · {d.donor_name}
          </li>
        ))}
      </ul>
    </Shell>
  );
}
