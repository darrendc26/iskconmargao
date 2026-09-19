import type { ApiEnvelope, Homepage, Festival, Article, Album, Program, DonationPurpose, SiteSettings } from "../../../packages/types";

const serverBase = () =>
  process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function apiGet<T>(path: string, revalidate?: number): Promise<T | null> {
  try {
    const res = await fetch(`${serverBase()}${path}`, {
      ...(revalidate == null ? { cache: "no-store" as const } : { next: { revalidate } }),
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as ApiEnvelope<T>;
    if (!json.success || json.data === undefined) return null;
    return json.data;
  } catch {
    return null;
  }
}

export const getHomepage = () => apiGet<Homepage>("/api/v1/homepage", 10);
export const getSettings = () => apiGet<SiteSettings>("/api/v1/settings/public", 10);
export const getPrograms = () => apiGet<Program[]>("/api/v1/programs", 10);
export const getFestivals = () => apiGet<{ upcoming: Festival[]; past: Festival[] }>("/api/v1/festivals", 10);
export const getFestival = (slug: string) => apiGet<Festival>(`/api/v1/festivals/${slug}`, 10);
export const getArticles = () => apiGet<Article[]>("/api/v1/articles", 10);
export const getArticle = (slug: string) => apiGet<Article>(`/api/v1/articles/${slug}`, 10);
export const getAlbums = () => apiGet<Album[]>("/api/v1/albums", 10);
export const getAlbum = (slug: string) => apiGet<Album>(`/api/v1/albums/${slug}`, 10);
export const getPurposes = () => apiGet<DonationPurpose[]>("/api/v1/donate/purposes", 10);
export const getPurpose = (slug: string) => apiGet<DonationPurpose>(`/api/v1/donate/purposes/${slug}`, 10);
export const getSitemap = () => apiGet<{ urls: string[] }>("/api/v1/sitemap", 300);

export function siteUrl(path = "") {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://margao.iskcongoa.com").replace(/\/$/, "");
  return `${base}${path}`;
}
