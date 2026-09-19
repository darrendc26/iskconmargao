import type { Program } from "../../../packages/types";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const BADGES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function formatClock(t?: string | null) {
  if (!t) return "";
  const [hs, ms = "00"] = t.split(":");
  const h = Number(hs);
  if (Number.isNaN(h)) return t;
  const suffix = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return `${hr}:${ms.padStart(2, "0")} ${suffix}`;
}

export function onwards(t?: string | null) {
  const clock = formatClock(t);
  return clock ? `${clock} onwards` : "As announced";
}

export function dayBadge(p: Program) {
  if (p.occurs_on) return "DATE";
  if (p.day_of_week != null && BADGES[p.day_of_week]) return BADGES[p.day_of_week];
  return "PRG";
}

export type ThisWeekItem = {
  kind: "program";
  title: string;
  href: string;
  badge: string;
  when: string;
  blurb: string;
};

export function pickThisWeek(programs: Program[], limit = 3): ThisWeekItem[] {
  const items: ThisWeekItem[] = [];
  for (const p of programs.filter(isUpcomingProgram)) {
    if (items.length >= limit) break;
    items.push({
      kind: "program",
      title: p.title,
      href: `/programs/${p.slug}`,
      badge: dayBadge(p),
      when: `${formatProgramWhen(p)} · ${onwards(p.start_time)}`,
      blurb: p.description,
    });
  }
  return items;
}

export function formatProgramWhen(p: Program) {
  if (p.occurs_on) {
    return new Date(p.occurs_on + "T12:00:00").toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
  if (p.day_of_week != null && DAYS[p.day_of_week]) {
    return DAYS[p.day_of_week];
  }
  return "As announced";
}

export function isUpcomingProgram(p: Program) {
  if (!p.occurs_on) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return p.occurs_on >= today.toISOString().slice(0, 10);
}
