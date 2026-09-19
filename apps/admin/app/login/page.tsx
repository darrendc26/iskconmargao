"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function LoginPage() {
  const [err, setErr] = useState("");
  const router = useRouter();
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await api("/api/v1/admin/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }),
    });
    if (!res.ok) {
      setErr("Those details did not work. Please try again in a moment.");
      return;
    }
    router.push("/");
  }
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white/70 p-8 border border-gold/30">
        <h1 className="font-serif text-3xl text-forest">Welcome back</h1>
        <p className="text-sm text-ink/70 mt-2">Sign in to update the ISKCON Margao website.</p>
        <label className="block mt-6 text-sm">
          Email
          <input name="email" type="email" required className="mt-1 w-full border px-3 py-2" />
        </label>
        <label className="block mt-4 text-sm">
          Password
          <input name="password" type="password" required className="mt-1 w-full border px-3 py-2" />
        </label>
        <button className="mt-6 w-full bg-forest text-cream py-2 rounded-full">Sign in</button>
        {err && <p className="mt-3 text-sm">{err}</p>}
      </form>
    </main>
  );
}
