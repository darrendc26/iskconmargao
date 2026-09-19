"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Shell } from "@/components/Shell";
import { api } from "@/lib/api";
import { UploadHint, uploadFile } from "@/components/SimpleList";

const DAYS = [
  { v: "", label: "No weekly day (use a specific date instead)" },
  { v: "0", label: "Sunday" },
  { v: "1", label: "Monday" },
  { v: "2", label: "Tuesday" },
  { v: "3", label: "Wednesday" },
  { v: "4", label: "Thursday" },
  { v: "5", label: "Friday" },
  { v: "6", label: "Saturday" },
];

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const [invitationId, setInvitationId] = useState("");
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [occursOn, setOccursOn] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [active, setActive] = useState(true);

  const formRef = useRef<HTMLFormElement>(null);

  const load = () =>
    api<any[]>("/api/v1/admin/programs").then((r) => {
      if (!r.ok) {
        setMsg(r.error || "Could not load programs.");
        setItems([]);
        return;
      }
      setItems(Array.isArray(r.data) ? r.data : []);
    });

  useEffect(() => {
    load();
  }, []);

  async function onPhoto(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    const json = await uploadFile(file, "programs");
    setUploading(false);
    const id = json.data?.id;
    const url = json.data?.url;
    if (id) {
      setInvitationId(id);
      setPreview(url || "");
    } else {
      setMsg(json.error?.message || "Could not upload the invitation photo.");
    }
  }

  function startEdit(p: any) {
    setEditingId(p.id);
    setTitle(p.title || "");
    setDescription(p.description || "");
    setDayOfWeek(p.day_of_week != null ? String(p.day_of_week) : "");
    setOccursOn(p.occurs_on || "");
    setStartTime(p.start_time || "");
    setEndTime(p.end_time || "");
    setLocation(p.location || "");
    setActive(p.active !== false);
    setInvitationId(p.invitation_media_id || "");
    setPreview(p.invitation_url || "");
    setMsg(`Editing program: "${p.title}"`);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setDayOfWeek("");
    setOccursOn("");
    setStartTime("");
    setEndTime("");
    setLocation("");
    setActive(true);
    setInvitationId("");
    setPreview("");
    setMsg("");
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const isEdit = !!editingId;
    const url = isEdit ? `/api/v1/admin/programs/${editingId}` : "/api/v1/admin/programs";
    const method = isEdit ? "PUT" : "POST";

    const body: Record<string, unknown> = {
      title,
      description,
      start_time: startTime || null,
      end_time: endTime || null,
      location,
      occurs_on: occursOn.trim() || null,
      invitation_media_id: invitationId || null,
      day_of_week: dayOfWeek === "" ? null : Number(dayOfWeek),
      active,
    };

    const res = await api(url, { method, body: JSON.stringify(body) });
    if (res.ok) {
      setMsg(isEdit ? "Program updated successfully!" : "Program saved and published.");
      cancelEdit();
      load();
    } else {
      setMsg(res.error || "Could not save program.");
    }
  }

  async function toggleActive(p: any) {
    const body = { ...p, active: !p.active };
    const res = await api(`/api/v1/admin/programs/${p.id}`, { method: "PUT", body: JSON.stringify(body) });
    if (res.ok) load();
  }

  async function remove(id: string) {
    if (!confirm("Remove this program?")) return;
    const res = await api(`/api/v1/admin/programs/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setMsg(res.error || "Could not delete this program.");
      return;
    }
    setMsg("Program deleted.");
    if (editingId === id) cancelEdit();
    load();
  }

  return (
    <Shell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-forest">Programs</h1>
          <p className="mt-1 text-ink/70 max-w-xl">
            Manage weekly gatherings (Friday / Saturday) or one-off special events. Easily edit, activate or pause programs anytime.
          </p>
        </div>
      </div>

      {msg && (
        <div className="mt-4 p-3 text-sm rounded-lg bg-gold/15 border border-gold/30 text-forest font-medium">
          {msg}
        </div>
      )}

      <form ref={formRef} onSubmit={onSubmit} className="mt-6 max-w-2xl space-y-4 bg-white/80 p-6 rounded-2xl border border-gold/30 shadow-sm">
        {editingId && (
          <div className="flex items-center justify-between bg-gold/10 p-3 rounded-xl border border-gold/30">
            <span className="text-xs font-bold text-forest uppercase tracking-wider">
              Editing Program ID: {editingId}
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

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-forest/80 mb-1">
            Program Title *
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-gold/30 rounded-xl px-4 py-2 bg-white text-ink focus:border-forest"
          />
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-forest/80 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full border border-gold/30 rounded-xl px-4 py-3 bg-white text-ink focus:border-forest min-h-[120px]"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-forest/80 mb-1">
              Weekly Day
            </label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              className="w-full border border-gold/30 rounded-xl px-4 py-2 bg-white text-ink text-sm focus:border-forest"
            >
              {DAYS.map((d) => (
                <option key={d.v} value={d.v}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-forest/80 mb-1">
              Specific Date (Optional)
            </label>
            <input
              type="date"
              value={occursOn}
              onChange={(e) => setOccursOn(e.target.value)}
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
            Location
          </label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="ISKCON Margao, Margao, Goa"
            className="w-full border border-gold/30 rounded-xl px-4 py-2 bg-white text-ink focus:border-forest"
          />
        </div>

        <div className="border border-dashed border-gold/40 rounded-xl p-4 bg-cream/30">
          <p className="text-xs font-semibold text-forest mb-1">Invitation Photo (Optional)</p>
          <UploadHint />
          <input type="file" accept="image/*" className="mt-2 text-xs" onChange={(e) => onPhoto(e.target.files)} />
          {uploading && <p className="text-xs text-forest mt-1 font-medium">Uploading photo...</p>}
          {preview && (
            <div className="mt-3 relative inline-block">
              <img src={preview} alt="Invitation preview" className="max-h-40 rounded-xl border border-gold/30 object-contain" />
              <button
                type="button"
                onClick={() => { setInvitationId(""); setPreview(""); }}
                className="absolute top-1 right-1 bg-red-800 text-white rounded-full p-1 text-xs"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="active-chk"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="rounded border-gold text-forest focus:ring-forest"
          />
          <label htmlFor="active-chk" className="text-sm text-forest font-medium cursor-pointer">
            Program is Active & Visible on Website
          </label>
        </div>

        <div className="pt-2 flex items-center justify-between gap-4">
          <button
            type="submit"
            className="rounded-full bg-forest text-cream px-7 py-2.5 font-medium text-sm shadow-md hover:bg-forest/90 transition"
          >
            {editingId ? "Save Changes to Program" : "Save & Publish Program"}
          </button>
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
        <h2 className="font-serif text-2xl text-forest border-b border-gold/20 pb-2">Existing Programs</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {items.map((it) => (
            <div key={it.id} className={`border p-4 bg-white/70 rounded-2xl flex flex-col justify-between ${editingId === it.id ? "border-forest ring-2 ring-forest/20" : "border-gold/20"}`}>
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-semibold text-forest text-lg">{it.title}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${it.active ? "bg-emerald-700 text-white" : "bg-gray-100 text-gray-700"}`}>
                    {it.active ? "Active" : "Paused"}
                  </span>
                </div>
                <p className="text-xs text-ink/70">
                  {it.occurs_on
                    ? new Date(it.occurs_on + "T12:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
                    : it.day_of_week != null
                      ? DAYS.find((d) => d.v === String(it.day_of_week))?.label
                      : "Recurring"}
                  {it.start_time ? ` · ${it.start_time}` : ""}
                </p>
                {it.description && <p className="text-sm text-ink-muted mt-2 line-clamp-2">{it.description}</p>}
                {it.invitation_url && (
                  <img src={it.invitation_url} alt="" className="mt-3 h-32 w-full object-cover rounded-xl border border-gold/20" />
                )}
              </div>

              <div className="flex gap-2 items-center mt-4 pt-3 border-t border-gold/10 justify-end">
                <button
                  type="button"
                  className="text-xs font-medium bg-gold/20 text-forest border border-gold/40 px-3 py-1.5 rounded-full hover:bg-gold/30"
                  onClick={() => startEdit(it)}
                >
                  ✏️ Edit
                </button>
                <button
                  type="button"
                  className={`text-xs font-medium px-3 py-1.5 rounded-full transition ${
                    it.active
                      ? "bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200"
                      : "bg-forest text-cream hover:bg-forest/90"
                  }`}
                  onClick={() => toggleActive(it)}
                >
                  {it.active ? "⏸️ Pause" : "🚀 Activate"}
                </button>
                <button
                  type="button"
                  className="text-xs text-red-800 border border-red-200 px-3 py-1.5 rounded-full hover:bg-red-50"
                  onClick={() => remove(it.id)}
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
