"use client";

import { api, apiUrl } from "@/lib/api";
import { FormEvent, useEffect, useState } from "react";
import { Shell } from "@/components/Shell";

export function SimpleList({
  title,
  path,
  fields,
  createExtra,
}: {
  title: string;
  path: string;
  fields: { name: string; label: string; type?: string; textarea?: boolean }[];
  createExtra?: Record<string, unknown>;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const load = () =>
    api<any>(path).then((r) => {
      if (r.status === 401) {
        setMsg("Please sign in again.");
        return;
      }
      if (!r.ok) {
        setMsg(r.error || "Could not load this list.");
        return;
      }
      setItems(Array.isArray(r.data) ? r.data : r.data?.items || []);
    });
  useEffect(() => {
    load();
  }, [path]);

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body: Record<string, unknown> = { ...createExtra };
    fields.forEach((f) => {
      const v = fd.get(f.name);
      if (f.type === "checkbox") body[f.name] = fd.get(f.name) === "on";
      else if (f.type === "number") body[f.name] = Number(v);
      else body[f.name] = v;
    });
    const res = await api(path, { method: "POST", body: JSON.stringify(body) });
    setMsg(res.ok ? "Saved." : res.error || "Could not save.");
    if (res.ok) {
      (e.target as HTMLFormElement).reset();
      load();
    }
  }

  async function remove(id: string) {
    if (!id) {
      setMsg("This item has no id, so it cannot be deleted.");
      return;
    }
    if (!confirm("Delete this item? This cannot be undone.")) return;
    const res = await api(`${path}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setMsg(res.error || "Could not delete this item.");
      return;
    }
    setMsg("Deleted.");
    load();
  }

  return (
    <Shell>
      <h1 className="font-serif text-4xl text-forest">{title}</h1>
      <form onSubmit={onCreate} className="mt-8 max-w-xl space-y-3 bg-white/70 p-6 border border-gold/20">
        {fields.map((f) => (
          <label key={f.name} className="block text-sm">
            {f.label}
            {f.textarea ? (
              <textarea name={f.name} rows={4} className="mt-1 w-full border px-3 py-2" />
            ) : (
              <input name={f.name} type={f.type || "text"} className="mt-1 w-full border px-3 py-2" />
            )}
          </label>
        ))}
        <button className="rounded-full bg-forest text-cream px-5 py-2 text-sm">Save</button>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
      <ul className="mt-10 space-y-3">
        {items.map((it) => (
          <li key={it.id} className="flex justify-between gap-4 border-b border-gold/20 py-3">
            <div>
              <p className="font-medium">{it.title || it.name || it.donor_name}</p>
              <p className="text-sm text-ink/60">{it.slug || it.email || it.status || it.date}</p>
            </div>
            {it.id && (
              <button type="button" className="text-sm text-red-800 border border-red-200 px-3 py-1" onClick={() => remove(it.id)}>
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </Shell>
  );
}

export function UploadHint() {
  return (
    <p className="text-sm text-ink/70 mt-2">
      Photos are stored securely. Visitors receive smaller, optimised versions — not the original phone file.
    </p>
  );
}

export async function uploadFile(file: File, folder: string, albumId?: string) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", folder);
  if (albumId) fd.append("album_id", albumId);
  const res = await fetch(`${apiUrl()}/api/v1/admin/media/upload`, {
    method: "POST",
    credentials: "include",
    body: fd,
  });
  return res.json();
}
