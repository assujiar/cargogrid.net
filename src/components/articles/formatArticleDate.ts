const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

/**
 * Formats an ISO date (YYYY-MM-DD) as "3 Agustus 2026".
 *
 * Parsed by hand rather than through `new Date(iso)`: that constructor reads a
 * bare date string as UTC midnight and then renders it in the local zone, which
 * in WIB (UTC+7) is fine but in any zone west of Greenwich shows the previous
 * day. A published date that shifts depending on where the server runs is a
 * needless way to make an article look a day stale.
 */
export function formatArticleDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  return `${day} ${MONTHS_ID[month - 1]} ${year}`;
}
