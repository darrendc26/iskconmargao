"use client";
import { FormEvent, useEffect, useState } from "react";
import { Shell } from "@/components/Shell";
import { api } from "@/lib/api";

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const load = () => api<any[]>("/api/v1/admin/users").then((r) => setItems(r.data || []));
  useEffect(() => {
    load();
  }, []);
  async function create(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await api("/api/v1/admin/users", {
      method: "POST",
      body: JSON.stringify({
        email: fd.get("email"),
        name: fd.get("name"),
        password: fd.get("password"),
        role: fd.get("role"),
      }),
    });
    load();
  }
  return (
    <Shell>
      <h1 className="font-serif text-4xl text-forest">Users</h1>
      <form onSubmit={create} className="mt-6 max-w-md space-y-2">
        <input name="name" placeholder="Name" className="w-full border px-3 py-2" required />
        <input name="email" type="email" placeholder="Email" className="w-full border px-3 py-2" required />
        <input name="password" type="password" placeholder="Password (10+ characters)" className="w-full border px-3 py-2" required />
        <select name="role" className="w-full border px-3 py-2">
          <option value="contributor">Contributor</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
        <button className="rounded-full bg-forest text-cream px-5 py-2 text-sm">Add person</button>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
      <ul className="mt-8 space-y-2">
        {items.map((u) => (
          <li key={u.id} className="flex justify-between gap-3 border-b border-gold/20 py-2">
            <span>
              {u.name} · {u.email} · {u.role}
            </span>
            <button
              type="button"
              className="text-sm text-red-800 border border-red-200 px-3 py-1"
              onClick={async () => {
                if (!confirm("Remove this user?")) return;
                const res = await api(`/api/v1/admin/users/${u.id}`, { method: "DELETE" });
                setMsg(res.ok ? "User removed." : res.error || "Could not remove this user.");
                if (res.ok) load();
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </Shell>
  );
}
