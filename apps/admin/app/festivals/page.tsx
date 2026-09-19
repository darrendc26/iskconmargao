"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Shell } from "@/components/Shell";
import { api } from "@/lib/api";

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("18:30");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("ISKCON Margao, Matchless Gifts, next to Borkar Hospital, Margao, Goa");
  const [description, setDescription] = useState("");
  const [program, setProgram] = useState("");
  const [shareText, setShareText] = useState("");
  const [coverMediaId, setCoverMediaId] = useState<string | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  const load = () => api<any[]>("/api/v1/admin/festivals").then((r) => setItems(r.data || []));

  useEffect(() => {
    load();
  }, []);

  async function handleCoverUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    setMsg("Uploading cover photo...");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "festivals");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/v1/admin/media/upload`, {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success && data.data?.id) {
        setCoverMediaId(data.data.id);
        setCoverPreviewUrl(data.data.url);
        setMsg("Cover photo uploaded!");
      } else {
        setMsg(data.error?.message || "Failed to upload photo.");
      }
    } catch {
      setMsg("Error uploading cover photo.");
    } finally {
      setUploadingCover(false);
    }
  }

  function startEdit(f: any) {
    setEditingId(f.id);
    setTitle(f.title || "");
    setDate(f.date || "");
    setStartTime(f.start_time || "18:30");
    setEndTime(f.end_time || "");
    setLocation(f.location || "ISKCON Margao, Margao, Goa");
    setDescription(f.description || "");
    setProgram(f.program || "");
    setShareText(f.share_text || "");
    setCoverPreviewUrl(f.cover_url || null);
    setCoverMediaId(f.cover_media_id || null);
    setMsg(`Editing festival: "${f.title}"`);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setTitle("");
    setDate("");
    setStartTime("18:30");
    setEndTime("");
    setDescription("");
    setProgram("");
    setShareText("");
    setCoverMediaId(null);
    setCoverPreviewUrl(null);
    setMsg("");
  }

  async function handleSave(publishedStatus: boolean) {
    if (!title.trim() || !date.trim()) {
      setMsg("Festival title and date are required.");
      return;
    }
    const isEdit = !!editingId;
    setMsg(isEdit ? "Saving changes..." : publishedStatus ? "Publishing festival live..." : "Saving festival draft...");

    const url = isEdit ? `/api/v1/admin/festivals/${editingId}` : "/api/v1/admin/festivals";
    const method = isEdit ? "PUT" : "POST";

    const body = {
      title,
      date,
      start_time: startTime || null,
      end_time: endTime || null,
      location,
      description,
      program,
      share_text: shareText,
      cover_media_id: coverMediaId,
      published: publishedStatus,
    };

    const res = await api(url, { method, body: JSON.stringify(body) });

    if (res.ok) {
      setMsg(
        isEdit
          ? publishedStatus
            ? "Festival updated and published live!"
            : "Festival updated successfully!"
          : publishedStatus
          ? "Festival created and published live!"
          : "Festival saved as draft!"
      );
      cancelEdit();
      load();
    } else {
      setMsg(res.error || "Could not save festival.");
    }
  }

  async function togglePublish(f: any) {
    const body = { ...f, published: !f.published };
    const res = await api(`/api/v1/admin/festivals/${f.id}`, { method: "PUT", body: JSON.stringify(body) });
    if (res.ok) load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this festival? This cannot be undone.")) return;
    const res = await api(`/api/v1/admin/festivals/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setMsg(res.error || "Could not delete this festival.");
      return;
    }
    setMsg("Festival deleted.");
    if (editingId === id) cancelEdit();
    load();
  }

  return (
    <Shell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-forest">Festivals</h1>
          <p className="mt-1 text-ink/70 max-w-xl">
            Create, edit and publish major festival events (Janmashtami, Gaura Purnima, Ratha Yatra) with program details and WhatsApp share messages.
          </p>
        </div>
      </div>

      {msg && (
        <div className="mt-4 p-3 text-sm rounded-lg bg-gold/15 border border-gold/30 text-forest font-medium">
          {msg}
        </div>
      )}

      <form ref={formRef} onSubmit={(e) => { e.preventDefault(); handleSave(true); }} className="mt-6 max-w-3xl space-y-4 bg-white/80 p-6 md:p-8 rounded-2xl border border-gold/30 shadow-sm">
        {editingId && (
          <div className="flex items-center justify-between bg-gold/10 p-3 rounded-xl border border-gold/30">
            <span className="text-xs font-bold text-forest uppercase tracking-wider">
              Editing Festival ID: {editingId}
            </span>
            <button
              type="button"
              onClick={cancelEdit}
              className="text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1 rounded-lg"
            >
              Cancel Edit
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium uppercase tracking-wider text-forest/80 mb-1">
              Festival Name *
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Sri Krishna Janmashtami"
              className="w-full border border-gold/30 rounded-xl px-4 py-2 bg-white text-ink text-base focus:border-forest"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-forest/80 mb-1">
              Festival Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full border border-gold/30 rounded-xl px-4 py-2 bg-white text-ink text-sm focus:border-forest"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-forest/80 mb-1">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border border-gold/30 rounded-xl px-4 py-2 bg-white text-ink text-sm focus:border-forest"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-forest/80 mb-1">
              End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border border-gold/30 rounded-xl px-4 py-2 bg-white text-ink text-sm focus:border-forest"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-forest/80 mb-1">
            Short Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Overview of the festival celebration..."
            className="w-full border border-gold/30 rounded-xl px-4 py-3 bg-white text-ink focus:border-forest min-h-[100px]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-forest/80 mb-1">
            Program Details & Timetable
          </label>
          <textarea
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            rows={6}
            placeholder="e.g. 6:30 PM Kirtan, 7:30 PM Abhishek, 8:30 PM Prasadam..."
            className="w-full border border-gold/30 rounded-xl px-4 py-3 bg-white text-ink focus:border-forest min-h-[150px]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-forest/80 mb-1">
            WhatsApp Share Text (Optional)
          </label>
          <textarea
            value={shareText}
            onChange={(e) => setShareText(e.target.value)}
            rows={4}
            placeholder="Custom text copied when devotees share this festival..."
            className="w-full border border-gold/30 rounded-xl px-4 py-3 bg-white text-ink text-xs focus:border-forest min-h-[100px]"
          />
        </div>

        <div className="border border-dashed border-gold/40 rounded-xl p-4 bg-cream/30">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-forest">Festival Cover Photo (Optional)</p>
              <p className="text-xs text-ink/70">Displayed on the festival banner and cards.</p>
            </div>
            <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-forest/10 hover:bg-forest/20 text-forest px-4 py-2 text-xs font-medium transition">
              <span>{uploadingCover ? "Uploading..." : "📷 Choose Cover Photo"}</span>
              <input type="file" accept="image/*" onChange={handleCoverUpload} disabled={uploadingCover} className="hidden" />
            </label>
          </div>
          {coverPreviewUrl && (
            <div className="mt-3 relative inline-block">
              <img src={coverPreviewUrl} alt="Cover preview" className="max-h-40 rounded-xl border border-gold/30 object-contain" />
              <button
                type="button"
                onClick={() => { setCoverMediaId(null); setCoverPreviewUrl(null); }}
                className="absolute top-1 right-1 bg-red-800 text-white rounded-full p-1 text-xs"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="rounded-full border border-forest text-forest hover:bg-forest/10 px-5 py-2 font-medium text-sm transition"
            >
              {editingId ? "Save Changes as Draft" : "Save Draft"}
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              className="rounded-full bg-forest text-cream hover:bg-forest/90 px-6 py-2 font-medium text-sm shadow-md transition flex items-center gap-1.5"
            >
              <span>🚀</span>
              <span>{editingId ? "Update & Publish Live" : "Publish Directly"}</span>
            </button>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-xs font-medium text-ink/70 hover:text-ink underline"
            >
              Cancel Editing
            </button>
          )}
        </div>
      </form>

      <div className="mt-12 max-w-4xl">
        <h2 className="font-serif text-2xl text-forest border-b border-gold/20 pb-2">Existing Festivals</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {items.map((f) => (
            <div key={f.id} className={`border p-4 bg-white/70 rounded-2xl flex flex-col justify-between ${editingId === f.id ? "border-forest ring-2 ring-forest/20" : "border-gold/20"}`}>
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-semibold text-forest text-lg">{f.title}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${f.published ? "bg-emerald-700 text-white" : "bg-amber-100 text-amber-800"}`}>
                    {f.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-xs text-ink/70">
                  {f.date ? new Date(f.date + "T12:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : ""}
                  {f.start_time ? ` · ${f.start_time}` : ""}
                </p>
                {f.description && <p className="text-sm text-ink-muted mt-2 line-clamp-2">{f.description}</p>}
                {f.cover_url && (
                  <img src={f.cover_url} alt="" className="mt-3 h-32 w-full object-cover rounded-xl border border-gold/20" />
                )}
              </div>

              <div className="flex gap-2 items-center mt-4 pt-3 border-t border-gold/10 justify-end flex-wrap">
                <button
                  type="button"
                  className="text-xs font-medium bg-gold/20 text-forest border border-gold/40 px-3 py-1.5 rounded-full hover:bg-gold/30"
                  onClick={() => startEdit(f)}
                >
                  ✏️ Edit
                </button>
                <button
                  type="button"
                  className={`text-xs font-medium px-3 py-1.5 rounded-full transition ${
                    f.published
                      ? "bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200"
                      : "bg-forest text-cream hover:bg-forest/90"
                  }`}
                  onClick={() => togglePublish(f)}
                >
                  {f.published ? "⏸️ Unpublish" : "🚀 Publish"}
                </button>
                <button
                  type="button"
                  className="text-xs text-red-800 border border-red-200 px-3 py-1.5 rounded-full hover:bg-red-50"
                  onClick={() => remove(f.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
