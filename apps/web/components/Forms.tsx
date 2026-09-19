"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const areas = [
  "Kirtan",
  "Annaseva / Prasadam",
  "Festivals",
  "Photography",
  "Videography",
  "Social Media",
  "Digital / Website",
  "Book Distribution",
  "Outreach",
  "Other",
];

export function VolunteerForm() {
  const searchParams = useSearchParams();
  const interestParam = searchParams ? searchParams.get("interest") : null;
  const [selectedAreas, setSelectedAreas] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (interestParam) {
      const aliases: Record<string, string> = {
        prasadam: "Annaseva / Prasadam",
        festival: "Festivals",
        "digital seva": "Digital / Website",
      };
      const mapped = aliases[interestParam.toLowerCase()] || interestParam;
      const match = areas.find((a) => a.toLowerCase() === mapped.toLowerCase());
      if (match) {
        setSelectedAreas((prev) => ({ ...prev, [match]: true }));
      }
    }
  }, [interestParam]);

  const handleCheckboxChange = (area: string, checked: boolean) => {
    setSelectedAreas((prev) => ({ ...prev, [area]: checked }));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    const fd = new FormData(e.currentTarget);
    const selected = areas.filter((a) => fd.get(a) === "on" || selectedAreas[a]);
    const area = String(fd.get("area") || "").trim();
    const availability = String(fd.get("availability") || "").trim();
    const note = String(fd.get("message") || "").trim();
    const message = [
      area ? `Area: ${area}` : "",
      availability ? `Availability: ${availability}` : "",
      note,
    ]
      .filter(Boolean)
      .join("\n");
    const body = {
      name: fd.get("name"),
      phone: fd.get("phone"),
      email: fd.get("email"),
      message,
      website: fd.get("website"),
      areas_of_interest: selected,
    };
    try {
      const res = await fetch("/api/v1/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) {
        setStatus("err");
        setErr(json.error?.message || "Please try again, or WhatsApp us.");
        return;
      }
      setStatus("ok");
    } catch {
      setStatus("err");
      setErr("Could not reach the server. Is the API running on port 8080?");
    }
  }

  if (status === "ok") {
    return <p className="text-forest font-medium text-lg">Thank you. The team will be in touch with you shortly.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
      <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />
      <label className="block">
        Name
        <input required name="name" className="mt-1 w-full border border-gold/30 bg-white/50 px-3 py-2 rounded" />
      </label>
      <label className="block">
        Phone
        <input name="phone" className="mt-1 w-full border border-gold/30 bg-white/50 px-3 py-2 rounded" />
      </label>
      <label className="block">
        Email
        <input type="email" name="email" className="mt-1 w-full border border-gold/30 bg-white/50 px-3 py-2 rounded" />
      </label>
      <label className="block">
        Area (neighbourhood / town)
        <input name="area" className="mt-1 w-full border border-gold/30 bg-white/50 px-3 py-2 rounded" />
      </label>
      <fieldset>
        <legend className="mb-2 font-medium">Seva interests</legend>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {areas.map((a) => (
            <label key={a} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name={a}
                checked={!!selectedAreas[a]}
                onChange={(e) => handleCheckboxChange(a, e.target.checked)}
                className="rounded border-gold/40 text-forest focus:ring-forest"
              />{" "}
              {a}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block">
        Availability
        <input
          name="availability"
          placeholder="e.g. Friday evenings, festival days"
          className="mt-1 w-full border border-gold/30 bg-white/50 px-3 py-2 rounded"
        />
      </label>
      <label className="block font-medium text-forest">
        Message
        <textarea name="message" rows={6} className="mt-1 w-full border border-gold/40 bg-white/70 px-4 py-3 rounded-xl min-h-[140px] focus:border-forest text-ink outline-none" />
      </label>
      <button className="rounded-full bg-forest text-cream px-8 py-3.5 font-medium hover:bg-forest/90 transition-colors shadow-sm">
        Offer seva
      </button>
      {status === "err" && <p className="text-sm text-red-600">{err}</p>}
    </form>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [err, setErr] = useState("");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    const fd = new FormData(e.currentTarget);
    const base = "";
    try {
      const res = await fetch(`${base}/api/v1/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fd)),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) {
        setStatus("err");
        setErr(json.error?.message || "Please wait a moment and try again.");
        return;
      }
      setStatus("ok");
    } catch {
      setStatus("err");
      setErr("Could not reach the server. Is the API running on port 8080?");
    }
  }
  if (status === "ok") return <p className="text-forest font-medium text-lg">Thank you. We will reply as soon as we can.</p>;
  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
      <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />
      <label className="block font-medium text-forest">
        Name
        <input required name="name" className="mt-1 w-full border border-gold/40 bg-white/70 px-4 py-2.5 rounded-xl focus:border-forest text-ink outline-none" />
      </label>
      <label className="block font-medium text-forest">
        Email
        <input type="email" name="email" className="mt-1 w-full border border-gold/40 bg-white/70 px-4 py-2.5 rounded-xl focus:border-forest text-ink outline-none" />
      </label>
      <label className="block font-medium text-forest">
        Phone
        <input name="phone" className="mt-1 w-full border border-gold/40 bg-white/70 px-4 py-2.5 rounded-xl focus:border-forest text-ink outline-none" />
      </label>
      <label className="block font-medium text-forest">
        Message
        <textarea required name="message" rows={7} className="mt-1 w-full border border-gold/40 bg-white/70 px-4 py-3 rounded-xl min-h-[160px] focus:border-forest text-ink outline-none" />
      </label>
      <button className="rounded-full bg-forest text-cream px-8 py-3.5 font-medium hover:bg-forest/90 transition-colors shadow-sm">Send Message</button>
      {status === "err" && <p className="text-sm text-red-600">{err}</p>}
    </form>
  );
}

const PLEDGE_AMOUNTS = [
  { label: "₹5,000", value: "5000" },
  { label: "₹10,000", value: "10000" },
  { label: "₹25,000", value: "25000" },
  { label: "₹50,000", value: "50000" },
  { label: "₹1 lakh", value: "100000" },
  { label: "₹2.5 lakh", value: "250000" },
  { label: "₹5 lakh+", value: "500000+" },
  { label: "Other", value: "other" },
];

export function NirmanPledgeForm() {
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [err, setErr] = useState("");
  const [choice, setChoice] = useState(PLEDGE_AMOUNTS[0].value);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    const fd = new FormData(e.currentTarget);
    const custom = String(fd.get("custom_amount") || "").trim();
    const amount = choice === "other" ? custom || "Other (unspecified)" : PLEDGE_AMOUNTS.find((a) => a.value === choice)?.label || choice;
    try {
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          website: fd.get("website"),
          subject: "Temple Nirman pledge",
          message: `Non-binding Temple Nirman pledge.\nIndicated amount: ${amount}\nNo payment collected.`,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) {
        setStatus("err");
        setErr(json.error?.message || "Please try again, or WhatsApp us.");
        return;
      }
      setStatus("ok");
    } catch {
      setStatus("err");
      setErr("Could not reach the server.");
    }
  }

  if (status === "ok") {
    return <p className="text-forest font-medium text-lg">Thank you. Your pledge is recorded as an expression of future support — no payment has been taken.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
      <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />
      <p className="text-sm font-medium text-forest">Indicated amount</p>
      <div className="flex flex-wrap gap-2">
        {PLEDGE_AMOUNTS.map((a) => (
          <button
            type="button"
            key={a.value}
            onClick={() => setChoice(a.value)}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
              choice === a.value ? "bg-forest text-cream border-forest shadow-sm" : "border-forest/40 text-forest hover:bg-sand/40"
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>
      {choice === "other" && (
        <label className="block font-medium text-forest">
          Other amount (₹)
          <input name="custom_amount" className="mt-1 w-full border border-gold/40 bg-white/70 px-4 py-2.5 rounded-xl focus:border-forest text-ink outline-none" />
        </label>
      )}
      <label className="block font-medium text-forest">
        Name
        <input required name="name" className="mt-1 w-full border border-gold/40 bg-white/70 px-4 py-2.5 rounded-xl focus:border-forest text-ink outline-none" />
      </label>
      <label className="block font-medium text-forest">
        Phone
        <input required name="phone" className="mt-1 w-full border border-gold/40 bg-white/70 px-4 py-2.5 rounded-xl focus:border-forest text-ink outline-none" />
      </label>
      <label className="block font-medium text-forest">
        Email
        <input required type="email" name="email" className="mt-1 w-full border border-gold/40 bg-white/70 px-4 py-2.5 rounded-xl focus:border-forest text-ink outline-none" />
      </label>
      <p className="text-xs text-ink-muted">This is a non-binding expression of future support. No payment is being collected at this stage.</p>
      <button className="rounded-full bg-forest text-cream px-8 py-3.5 font-medium hover:bg-forest/90 transition-colors shadow-sm">Register pledge</button>
      {status === "err" && <p className="text-sm text-red-600">{err}</p>}
    </form>
  );
}
