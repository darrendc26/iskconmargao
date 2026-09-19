"use client";
import { FormEvent, useEffect, useState } from "react";
import { Shell } from "@/components/Shell";
import { api } from "@/lib/api";
import { UploadHint, uploadFile } from "@/components/SimpleList";

export default function Page() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [current, setCurrent] = useState("");
  const [msg, setMsg] = useState("");
  const load = () =>
    api<any[]>("/api/v1/admin/albums").then((r) => setAlbums(Array.isArray(r.data) ? r.data : []));
  useEffect(() => {
    load();
  }, []);
  async function create(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await api("/api/v1/admin/albums", {
      method: "POST",
      body: JSON.stringify({ title: fd.get("title"), description: fd.get("description"), date: fd.get("date"), published: true }),
    });
    if (res.ok) load();
  }
  async function onFiles(files: FileList | null) {
    if (!files || !current) return;
    for (const file of Array.from(files)) {
      await uploadFile(file, "albums", current);
    }
    alert("Photos uploaded.");
  }
  async function remove(id: string) {
    if (!confirm("Delete this album and its photos? This cannot be undone.")) return;
    const res = await api(`/api/v1/admin/albums/${id}`, { method: "DELETE" });
    setMsg(res.ok ? "Album deleted." : res.error || "Could not delete this album.");
    if (res.ok) {
      if (current === id) setCurrent("");
      load();
    }
  }
  return (
    <Shell>
      <h1 className="font-serif text-4xl text-forest">Photo Albums</h1>
      <UploadHint />
      <form onSubmit={create} className="mt-6 max-w-xl space-y-3 bg-white/70 p-6 border">
        <input name="title" required placeholder="Album title" className="w-full border px-3 py-2" />
        <input name="date" type="date" className="w-full border px-3 py-2" />
        <textarea name="description" placeholder="Description" className="w-full border px-3 py-2" />
        <button className="rounded-full bg-forest text-cream px-5 py-2 text-sm">Create album</button>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
      <div className="mt-8">
        <label className="text-sm">
          Upload photos into
          <select className="ml-2 border px-2 py-1" value={current} onChange={(e) => setCurrent(e.target.value)}>
            <option value="">Choose album</option>
            {albums.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title}
              </option>
            ))}
          </select>
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          className="block mt-3"
          onChange={(e) => onFiles(e.target.files)}
        />
      </div>
      <ul className="mt-8 space-y-2">
        {albums.map((a) => (
          <li key={a.id} className="flex justify-between gap-3 border-b border-gold/20 py-2">
            <span>
              {a.title} {a.published ? "" : "(hidden)"}
            </span>
            <button type="button" className="text-sm text-red-800 border border-red-200 px-3 py-1" onClick={() => remove(a.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </Shell>
  );
}
