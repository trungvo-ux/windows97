export type LocalIePage = {
  path: string;
  title: string;
  displayUrl: string;
};

const TRUNG_ABOUT: LocalIePage = {
  path: "/pages/trung-vo-about.html",
  title: "Trung Vo — About Me",
  displayUrl: "trungvo.xyz",
};

const LOCAL_IE_PAGES: Record<string, LocalIePage> = {
  "trungvo.xyz": TRUNG_ABOUT,
  "www.trungvo.xyz": TRUNG_ABOUT,
  "trungvo.xyz/about": TRUNG_ABOUT,
  "www.trungvo.xyz/about": TRUNG_ABOUT,
};

const ARCHIVED_IE_HOSTS = ["google.com", "apple.com"];

/** Mid-year snapshot month used for fixed 2005 archive favorites (Google, Apple). */
export const IE_ARCHIVE_MONTH = "06";

export const IE_HOME_PAGE = TRUNG_ABOUT;

export function buildArchiveProxyUrl(
  targetUrl: string,
  year: string,
  theme: string
): string {
  const formattedUrl = targetUrl.startsWith("http")
    ? targetUrl
    : `https://${targetUrl}`;
  return `/api/iframe-check?url=${encodeURIComponent(
    formattedUrl
  )}&year=${encodeURIComponent(year)}&month=${IE_ARCHIVE_MONTH}&theme=${encodeURIComponent(theme)}`;
}

export function getArchivedHostsForPreload(): string[] {
  return [...ARCHIVED_IE_HOSTS];
}

export function resolveLocalPage(url: string): LocalIePage | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("/pages/")) {
    if (trimmed === TRUNG_ABOUT.path) return TRUNG_ABOUT;
    return null;
  }

  const normalized = trimmed
    .replace(/^https?:\/\//i, "")
    .replace(/\/$/, "")
    .toLowerCase();

  return LOCAL_IE_PAGES[normalized] ?? null;
}

export function isArchivedIePage(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed || trimmed.startsWith("/")) return false;

  try {
    const hostname = new URL(
      trimmed.startsWith("http") ? trimmed : `https://${trimmed}`
    ).hostname
      .replace(/^www\./i, "")
      .toLowerCase();

    return ARCHIVED_IE_HOSTS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}
