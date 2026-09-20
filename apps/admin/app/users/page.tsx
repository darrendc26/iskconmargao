"use client";
import { FormEvent, useEffect, useState } from "react";
import { Shell } from "@/components/Shell";
import { api } from "@/lib/api";

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    api<{ user: { role: string } }>("/api/v1/admin/me").then((r) => {
      const role = r.data?.user?.role || "";
      setUserRole(role);
      if (role === "admin") {
        load();
      }
    });
  }, []);

  const load = () =>
    api<any[]>("/api/v1/admin/users").then((r) => {
      if (!r.ok) {
        setMsg(r.error || "Could not load user list.");
        return;
      }
      setItems(r.data || []);
    });

  async function create(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (userRole !== "admin") {
      setMsg("Only admins can add members.");
      return;
    }
    const fd = new FormData(e.currentTarget);
    const res = await api("/api/v1/admin/users", {
      method: "POST",
      body: JSON.stringify({
        email: fd.get("email"),
        name: fd.get("name"),
        password: fd.get("password"),
        role: fd.get("role"),
      }),
    });
    if (res.ok) {
      setMsg("New team member added.");
      (e.target as HTMLFormElement).reset();
      load();
    } else {
      setMsg(res.error || "Could not add team member.");
    }
  }

  return (
    <Shell>
      <h1 className="font-serif text-4xl text-forest">Team & User Management</h1>
      <p className="mt-1 text-ink/70">Add team members and assign roles (Admin, Editor, Contributor).</p>

      {userRole && userRole !== "admin" ? (
        <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 max-w-xl">
          <h3 className="font-semibold text-lg flex items-center gap-2">🔒 Access Restricted</h3>
          <p className="mt-2 text-sm">
            Only <strong>Admins</strong> have permission to add, edit, or remove team members. Your active role is{" "}
            <span className="capitalize font-bold text-forest">{userRole}</span>.
          </p>
        </div>
      ) : (
        <>
          <form onSubmit={create} className="mt-6 max-w-md space-y-3 bg-white/70 p-6 rounded-2xl border border-gold/30 shadow-sm">
            <h2 className="font-serif text-xl text-forest font-semibold">Add New Team Member</h2>
            <label className="block text-xs font-medium uppercase tracking-wider text-forest/80">
              Full Name *
              <input name="name" placeholder="Devotee / Member Name" className="mt-1 w-full border border-gold/30 rounded-xl px-3 py-2 text-sm bg-white" required />
            </label>
            <label className="block text-xs font-medium uppercase tracking-wider text-forest/80">
              Email Address *
              <input name="email" type="email" placeholder="email@example.com" className="mt-1 w-full border border-gold/30 rounded-xl px-3 py-2 text-sm bg-white" required />
            </label>
            <label className="block text-xs font-medium uppercase tracking-wider text-forest/80">
              Initial Password *
              <input name="password" type="password" placeholder="10+ characters" className="mt-1 w-full border border-gold/30 rounded-xl px-3 py-2 text-sm bg-white" required />
            </label>
            <label className="block text-xs font-medium uppercase tracking-wider text-forest/80">
              Assign Access Role *
              <select name="role" className="mt-1 w-full border border-gold/30 rounded-xl px-3 py-2 text-sm bg-white font-medium">
                <option value="contributor">Contributor (Draft content, no publishing or member management)</option>
                <option value="editor">Editor (Create, edit & publish content, no member management)</option>
                <option value="admin">Admin (Full system access & member management)</option>
              </select>
            </label>
            <button className="mt-2 rounded-full bg-forest text-cream px-6 py-2.5 text-sm font-medium hover:bg-forest/90 shadow">
              Add Team Member
            </button>
            {msg && <p className="text-sm font-medium text-forest mt-2">{msg}</p>}
          </form>

          <div className="mt-10 max-w-2xl">
            <h2 className="font-serif text-2xl text-forest border-b border-gold/20 pb-2">Active Team Members</h2>
            <ul className="mt-4 space-y-3">
              {items.map((u) => (
                <li key={u.id} className="flex items-center justify-between gap-4 border border-gold/20 bg-white/70 p-4 rounded-xl shadow-sm">
                  <div>
                    <p className="font-medium text-forest">{u.name}</p>
                    <p className="text-xs text-ink/70">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      u.role === "admin" ? "bg-gold/20 text-forest border border-gold/40" : "bg-cream text-ink/80 border border-gold/20"
                    }`}>
                      {u.role}
                    </span>
                    <button
                      type="button"
                      className="text-xs text-red-800 border border-red-200 hover:bg-red-50 px-3 py-1 rounded-lg"
                      onClick={async () => {
                        if (!confirm(`Remove ${u.name} (${u.email})?`)) return;
                        const res = await api(`/api/v1/admin/users/${u.id}`, { method: "DELETE" });
                        setMsg(res.ok ? "User removed." : res.error || "Could not remove user.");
                        if (res.ok) load();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </Shell>
  );
}
