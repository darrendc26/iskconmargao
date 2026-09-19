import { getSitemap } from "@/lib/api";

export const revalidate = 300;

export default async function sitemap() {
  const data = await getSitemap();
  const urls = data?.urls ?? ["https://margao.iskcongoa.com/"];
  return urls.map((url) => ({ url, changeFrequency: "weekly" as const, priority: url.endsWith("/") ? 1 : 0.7 }));
}
