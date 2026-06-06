/** Classic ~2005–2007 favicons for archived IE favorites (Google, Apple). */
export const CLASSIC_IE_FAVICONS: Record<string, string> = {
  "google.com": "/icons/ie-favicons/google-2007.png",
  "www.google.com": "/icons/ie-favicons/google-2007.png",
  "apple.com": "/icons/ie-favicons/apple-2007.png",
  "www.apple.com": "/icons/ie-favicons/apple-2007.png",
};

export function getHostnameFromUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    return new URL(
      trimmed.startsWith("http") ? trimmed : `https://${trimmed}`
    ).hostname.toLowerCase();
  } catch {
    return null;
  }
}

export function getClassicIeFavicon(urlOrHostname: string): string | null {
  const trimmed = urlOrHostname.trim().toLowerCase();
  if (!trimmed) return null;

  if (CLASSIC_IE_FAVICONS[trimmed]) {
    return CLASSIC_IE_FAVICONS[trimmed];
  }

  const hostname = trimmed.includes("://")
    ? getHostnameFromUrl(trimmed)
    : trimmed.replace(/^www\./, "");

  if (!hostname) return null;

  const bare = hostname.replace(/^www\./, "");
  return CLASSIC_IE_FAVICONS[hostname] ?? CLASSIC_IE_FAVICONS[bare] ?? null;
}

export function resolveIeFavicon(urlOrHostname: string): string {
  return (
    getClassicIeFavicon(urlOrHostname) ??
    `https://www.google.com/s2/favicons?domain=${
      getHostnameFromUrl(urlOrHostname) ?? urlOrHostname
    }&sz=32`
  );
}

type FaviconEntry = { url?: string; favicon?: string };

function patchEntryFavicon<T extends FaviconEntry>(entry: T): T {
  if (!entry.url) return entry;
  const classic = getClassicIeFavicon(entry.url);
  if (!classic) return entry;
  if (entry.favicon === classic) return entry;
  return { ...entry, favicon: classic };
}

export function patchClassicFavicons<T extends FaviconEntry>(entries: T[]): T[] {
  return entries.map(patchEntryFavicon);
}

export function getFavoriteIconSrc(
  url: string | undefined,
  favicon?: string
): string {
  if (url) {
    const classic = getClassicIeFavicon(url);
    if (classic) return classic;
  }
  return favicon || "/icons/ie-site.png";
}
