"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
};

type NavItem = { href?: string; label?: string; group?: string; adminOnly?: boolean };

const nav: NavItem[] = [
  { href: "/", label: "Dashboard" },
  { group: "Content" },
  { href: "/articles", label: "Articles" },
  { href: "/festivals", label: "Festivals" },
  { href: "/programs", label: "Programs" },
  { href: "/announcements", label: "Announcements" },
  { group: "Media" },
  { href: "/videos", label: "Videos" },
  { group: "Community" },
  { href: "/volunteers", label: "Volunteers" },
  { href: "/subscribers", label: "Subscribers" },
  { href: "/contacts", label: "Contact Messages" },
  { group: "Donations", adminOnly: true },
  { href: "/donations", label: "Donations", adminOnly: true },
  { href: "/donation-purposes", label: "Donation Purposes" },
  { group: "Website", adminOnly: true },
  { href: "/settings", label: "Settings", adminOnly: true },
  { group: "System", adminOnly: true },
  { href: "/users", label: "Users & Team", adminOnly: true },
  { href: "/audit", label: "Audit Logs", adminOnly: true },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passMsg, setPassMsg] = useState("");

  useEffect(() => {
    api<{ user: User }>("/api/v1/admin/me").then((r) => {
      if (r.status === 401) {
        router.push("/login");
      } else if (r.ok && r.data?.user) {
        setCurrentUser(r.data.user);
      }
    });
  }, [router]);

  const isAdmin = currentUser?.role === "admin";

  const visibleNav = nav.filter((item) => {
    if (item.adminOnly && !isAdmin) return false;
    return true;
  });

  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr] bg-cream/30">
      {/* Mobile Top Header Bar */}
      <div className="md:hidden sticky top-0 z-30 bg-forest text-cream px-4 py-3 flex items-center justify-between shadow-md">
        <div>
          <span className="font-serif text-lg tracking-wide block leading-tight">ISKCON Margao</span>
          <span className="text-[10px] text-gold uppercase tracking-widest block">Content Studio</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="px-3 py-1.5 rounded-lg border border-gold/40 text-cream text-xs font-medium bg-cream/10 hover:bg-cream/20 flex items-center gap-1.5"
        >
          <span>{mobileMenuOpen ? "✕ Close" : "☰ Navigation"}</span>
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:block bg-forest text-cream p-6 border-b md:border-b-0 md:border-r border-gold/20 flex flex-col justify-between`}
      >
        <div>
          <div className="hidden md:block">
            <p className="font-serif text-2xl">ISKCON Margao</p>
            <p className="text-xs text-gold mt-1">Content studio</p>
          </div>

          {currentUser && (
            <div className="mt-4 p-2.5 bg-cream/10 rounded-xl border border-gold/20 flex items-center justify-between">
              <div className="truncate pr-2">
                <p className="text-xs font-semibold text-white truncate">{currentUser.name || currentUser.email}</p>
                <p className="text-[10px] text-cream/70 truncate">{currentUser.email}</p>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                currentUser.role === "admin" ? "bg-gold text-forest" : "bg-cream/20 text-cream"
              }`}>
                {currentUser.role}
              </span>
            </div>
          )}

          <nav className="mt-4 md:mt-6 space-y-1 text-sm">
            {visibleNav.map((item, i) =>
              "group" in item && item.group ? (
                <p key={i} className="pt-4 pb-1 text-[10px] uppercase tracking-widest text-gold/80 font-bold">
                  {item.group}
                </p>
              ) : (
                <Link
                  key={item.href}
                  href={item.href!}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                    path === item.href ? "bg-cream/20 text-white font-medium" : "hover:bg-cream/10 text-cream/90"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>
        </div>

        <div className="pt-6 mt-6 border-t border-gold/20 flex items-center justify-between">
          <button
            className="text-xs text-gold hover:text-white underline"
            onClick={() => setPasswordModalOpen(true)}
          >
            Change Password
          </button>
          <button
            className="text-xs underline text-gold hover:text-white"
            onClick={async () => {
              await api("/api/v1/admin/auth/logout", { method: "POST" });
              router.push("/login");
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Change Password Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-gold/30 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gold/20 pb-3">
              <h2 className="font-serif text-xl font-bold text-forest">Change Password</h2>
              <button
                onClick={() => {
                  setPasswordModalOpen(false);
                  setPassMsg("");
                }}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setPassMsg("");
                if (newPassword !== confirmPassword) {
                  setPassMsg("New passwords do not match.");
                  return;
                }
                const res = await api("/api/v1/admin/auth/change-password", {
                  method: "POST",
                  body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                  }),
                });
                if (res.ok) {
                  setPassMsg("Password updated successfully!");
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setTimeout(() => setPasswordModalOpen(false), 1500);
                } else {
                  setPassMsg(res.error || "Failed to update password.");
                }
              }}
              className="mt-4 space-y-4 text-xs"
            >
              <label className="block font-medium text-forest">
                Current Password *
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 w-full border border-gold/30 rounded-xl px-3 py-2 text-sm bg-white"
                />
              </label>
              <label className="block font-medium text-forest">
                New Password (min 10 characters) *
                <input
                  type="password"
                  required
                  minLength={10}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 w-full border border-gold/30 rounded-xl px-3 py-2 text-sm bg-white"
                />
              </label>
              <label className="block font-medium text-forest">
                Confirm New Password *
                <input
                  type="password"
                  required
                  minLength={10}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 w-full border border-gold/30 rounded-xl px-3 py-2 text-sm bg-white"
                />
              </label>
              {passMsg && (
                <p className={`text-xs font-semibold ${passMsg.includes("success") ? "text-green-700" : "text-red-700"}`}>
                  {passMsg}
                </p>
              )}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-forest text-cream font-medium hover:bg-forest/90 shadow"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="p-4 sm:p-6 md:p-10 max-w-full overflow-x-hidden">{children}</main>
    </div>
  );
}
