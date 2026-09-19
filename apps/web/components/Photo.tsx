export const photos = {
  hero: "/images/hero-krishna.jpg",
  kirtan: "/images/kirtan.jpg",
  festival: "/images/festival.jpg",
  community: "/images/community.jpg",
  prasadam: "/images/prasadam.jpg",
  prabhupada: "/images/prabhupada.jpg",
  srilaprabhupada: "/images/srilaprabhupada.webp",
  gita: "/images/gita.jpg",
  chanting: "/images/chanting.jpg",
  centre: "/images/centre.jpg",
  peacock: "/images/peacock.jpg",
  lotus: "/images/lotus.jpg",
  caitanya: "/images/caitanya.jpg",
  logo: "/images/logo.png",
  headerLogo: "/images/header-logo.png",
} as const;

export function mediaUrl(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("http://localhost:8080")) {
    return url.replace("http://localhost:8080", "");
  }
  return url;
}

export function Photo({
  src,
  alt,
  className = "w-full h-full object-cover",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const resolvedSrc = mediaUrl(src);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={resolvedSrc} alt={alt} className={className} />
  );
}
