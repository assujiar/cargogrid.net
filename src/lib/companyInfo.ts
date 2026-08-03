// Single source of truth for CargoGrid's public contact details.
//
// Deliberately dependency-free. The consumers span both sides of the
// server/client boundary — `lib/seo.ts` (server, JSON-LD), `Footer` and the two
// legal bodies (client), and `lib/emailTemplates.ts` (server, transactional
// mail). Keeping this module import-free means the client components can pull
// the address in without dragging `src/data.ts` (~46 KB of marketing copy,
// reachable from `lib/seo.ts`) into the browser bundle.
//
// These values were previously duplicated across five files and had already
// drifted: the website advertised one address while outbound email footers
// carried an entirely different one.

// Structured form, consumed by the Organization JSON-LD in `lib/seo.ts`.
// Field names match schema.org/PostalAddress and are spread verbatim.
export const companyAddress = {
  streetAddress: "Ashta SCBD District 8, Treasury Tower Lantai 5 Unit J, Senayan, Kec. Kebayoran Baru",
  addressLocality: "Jakarta Selatan",
  addressRegion: "Daerah Khusus Ibukota Jakarta",
  postalCode: "12190",
  addressCountry: "ID",
} as const;

// Flattened single-line renderings for human-facing copy.
export const companyAddressLine = {
  id: "Ashta SCBD District 8, Treasury Tower Lantai 5 Unit J, Senayan, Kec. Kebayoran Baru, Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12190",
  en: "Ashta SCBD District 8, Treasury Tower 5th Floor Unit J, Senayan, Kebayoran Baru, South Jakarta, Special Capital Region of Jakarta 12190",
} as const;

export const companyPhone = "+62877 8898 0088";
export const companyEmail = "service@cargogrid.net";
