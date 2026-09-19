/** Canonical Google Maps place for ISKCON Margao. */
export const MAPS_DIRECTIONS_URL =
  process.env.NEXT_PUBLIC_MAPS_URL || "https://maps.google.com/?q=ISKCON+Margao+Matchless+Gifts";

export function mapsHref(fromSettings?: string | null) {
  if (fromSettings?.includes("Matchless+Gifts") || fromSettings?.includes("Matchless Gifts")) {
    return fromSettings;
  }
  return MAPS_DIRECTIONS_URL;
}
