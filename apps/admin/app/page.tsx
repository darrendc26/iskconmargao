"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/Shell";
import { api } from "@/lib/api";
import Link from "next/link";

type Item = { id: string; title?: string; name?: string; slug?: string; date?: string; status?: string };

function ManageList({
  title,
  href,
  path,
  items,
  onDeleted,
}: {
  title: string;
  href: string;
  path: string;
  items: Item[];
  onDeleted: () => void;
}) {
  const [msg, setMsg] = useState("");
  async function remove(id: string) {
    if (!confirm(`Delete this ${title.slice(0, -1).toLowerCase()}? This cannot be undone.`)) return;
    const res = await api(`${path}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setMsg(res.error || "Could not delete.");
      return;
    }
    onDeleted();
  }
  return (
    <div className="bg-white/70 border border-gold/20 p-5">
      <div className="flex justify-between items-baseline gap-3">
        <h2 className="font-serif text-2xl text-forest">{title}</h2>
        <Link href={href} className="text-sm underline">
          Open
        </Link>
      </div>
      {msg && <p className="text-sm mt-2">{msg}</p>}
      {items.length === 0 ? (
        <p className="text-sm text-ink/60 mt-3">Nothing here yet.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((it) => (
            <li key={it.id} className="flex justify-between gap-3 border-b border-gold/15 py-2 text-sm">
              <span>
                {it.title || it.name}
                {it.slug || it.date || it.status ? (
                  <span className="block text-ink/50 text-xs">
                    {[it.status, it.date, it.slug].filter(Boolean).join(" · ")}
                  </span>
                ) : null}
              </span>
              {it.id && (
                <button type="button" className="shrink-0 text-red-800 border border-red-200 px-2 py-0.5" onClick={() => remove(it.id)}>
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const load = () => api("/api/v1/admin/dashboard").then((r) => setData(r.data));
  useEffect(() => {
    api("/api/v1/admin/me").then((r) => {
      if (r.status === 401) router.push("/login");
    });
    load();
  }, [router]);
  const c = data?.counts || {};
  return (
    <Shell>
      <h1 className="font-serif text-4xl text-forest">Dashboard</h1>
      <p className="mt-2 text-ink/70">Overview and a place to remove content from the site.</p>
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          ["Upcoming festivals", c.upcoming_festivals],
          ["Published articles", c.published_articles],
          ["Waiting for review", c.pending_content],
          ["Photo albums", c.albums],
          ["Subscribers", c.subscribers],
          ["Donations this month (₹)", c.donations_this_month_paise ? Math.round(c.donations_this_month_paise / 100) : 0],
        ].map(([l, v]) => (
          <div key={String(l)} className="bg-white/70 border border-gold/20 p-5">
            <p className="text-xs uppercase tracking-widest text-gold">{l}</p>
            <p className="font-serif text-3xl mt-2">{v ?? "—"}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/festivals" className="rounded-full bg-forest text-cream px-5 py-2 text-sm">
          Add Festival
        </Link>
        <Link href="/articles" className="rounded-full border px-5 py-2 text-sm">
          Write Article
        </Link>
        <Link href="/albums" className="rounded-full border px-5 py-2 text-sm">
          Upload Photos
        </Link>
      </div>
      <h2 className="font-serif text-3xl text-forest mt-12">Delete from the site</h2>
      <p className="text-sm text-ink/70 mt-1">Removing an item here takes it off the public pages.</p>
      <div className="mt-6 grid lg:grid-cols-2 gap-4">
        <ManageList title="Festivals" href="/festivals" path="/api/v1/admin/festivals" items={data?.festivals || []} onDeleted={load} />
        <ManageList title="Programs" href="/programs" path="/api/v1/admin/programs" items={data?.programs || []} onDeleted={load} />
        <ManageList title="Articles" href="/articles" path="/api/v1/admin/articles" items={data?.articles || []} onDeleted={load} />
        <ManageList title="Albums" href="/albums" path="/api/v1/admin/albums" items={data?.albums || []} onDeleted={load} />
      </div>
    </Shell>
  );
}
