/**
 * CSV parsing for contact import.
 *
 * Hand-rolled rather than pulled from npm because the input is one shape — a
 * contact export from a spreadsheet — and the parts that actually break real
 * imports are not the parts a library is needed for: quoted fields containing
 * the delimiter, embedded newlines, a UTF-8 BOM from Excel, and semicolon
 * delimiters from Excel in a locale that uses commas for decimals. All four are
 * handled here; anything more exotic belongs in a spreadsheet, not in this
 * parser.
 */

export interface ParsedCsv {
  headers: string[];
  rows: string[][];
}

/** Excel writes ; instead of , wherever the locale uses , as a decimal mark. */
function detectDelimiter(sample: string): string {
  const firstLine = sample.split(/\r?\n/)[0] || "";
  const counts: Array<[string, number]> = [
    [",", (firstLine.match(/,/g) || []).length],
    [";", (firstLine.match(/;/g) || []).length],
    ["\t", (firstLine.match(/\t/g) || []).length],
  ];
  counts.sort((a, b) => b[1] - a[1]);
  return counts[0][1] > 0 ? counts[0][0] : ",";
}

export function parseCsv(input: string): ParsedCsv {
  // Excel prefixes UTF-8 exports with a BOM, which otherwise ends up glued to
  // the first header name — so "email" silently becomes "﻿email".
  const text = input.replace(/^﻿/, "");
  const delimiter = detectDelimiter(text);

  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        // "" inside a quoted field is a literal quote, not the end of it.
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === delimiter) {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char === "\r") {
      // Swallowed: the \n that follows ends the record.
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const cleaned = rows.filter((r) => r.some((cell) => cell.trim() !== ""));
  if (cleaned.length === 0) return { headers: [], rows: [] };

  return {
    headers: cleaned[0].map((h) => h.trim()),
    rows: cleaned.slice(1),
  };
}

/** Contact fields an imported column can be mapped onto. */
export const IMPORT_FIELDS = [
  { key: "email", label: "Email", required: true },
  { key: "name", label: "Nama" },
  { key: "company", label: "Perusahaan" },
  { key: "phone", label: "Telepon" },
  { key: "job_role", label: "Jabatan" },
  { key: "lang", label: "Bahasa (id/en)" },
  { key: "tags", label: "Tag (pisahkan dengan |)" },
] as const;

export type ImportFieldKey = (typeof IMPORT_FIELDS)[number]["key"];

/**
 * First guess at which column is which, so a normal export maps itself and the
 * operator only corrects the odd one out. Matches on substrings in both
 * languages because real files say "Email Address", "E-mail", "Alamat Email",
 * "Nama Lengkap" and "Nama PT" with equal frequency.
 */
export function guessMapping(headers: string[]): Record<number, ImportFieldKey | ""> {
  const patterns: Array<[ImportFieldKey, RegExp]> = [
    ["email", /e-?mail|surel/i],
    ["name", /^(nama|name|full ?name|contact|kontak|pic)/i],
    ["company", /company|perusahaan|firma|organisasi|instansi|pt\b/i],
    ["phone", /phone|telp|telepon|hp|wa|whatsapp|mobile|no\.? ?tel/i],
    ["job_role", /role|jabatan|position|title|posisi/i],
    ["lang", /lang|bahasa|locale/i],
    ["tags", /tag|label|kategori|category|segment/i],
  ];

  const mapping: Record<number, ImportFieldKey | ""> = {};
  const taken = new Set<ImportFieldKey>();

  headers.forEach((header, index) => {
    const hit = patterns.find(([key, pattern]) => !taken.has(key) && pattern.test(header));
    if (hit) {
      mapping[index] = hit[0];
      taken.add(hit[0]);
    } else {
      mapping[index] = "";
    }
  });

  return mapping;
}

export interface MappedContact {
  email: string;
  name?: string;
  company?: string;
  phone?: string;
  job_role?: string;
  lang?: string;
  tags?: string[];
  custom_fields?: Record<string, string>;
}

/**
 * Applies a column mapping. Columns left unmapped are not discarded — they land
 * in custom_fields, where they stay available as {{merge_tags}}. A CSV with a
 * "Rute Utama" column is exactly the kind of thing worth personalising on, and
 * throwing it away at import time is a decision that cannot be undone later.
 */
export function mapRows(
  parsed: ParsedCsv,
  mapping: Record<number, ImportFieldKey | "">,
): { contacts: MappedContact[]; invalid: number } {
  const contacts: MappedContact[] = [];
  let invalid = 0;

  for (const row of parsed.rows) {
    const contact: MappedContact = { email: "" };
    const custom: Record<string, string> = {};

    row.forEach((rawValue, index) => {
      const value = (rawValue || "").trim();
      if (!value) return;
      const field = mapping[index];

      if (!field) {
        const header = parsed.headers[index];
        if (header) custom[header.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")] = value;
        return;
      }

      if (field === "tags") {
        contact.tags = value.split(/[|,;]/).map((t) => t.trim()).filter(Boolean);
      } else if (field === "email") {
        contact.email = value.toLowerCase();
      } else {
        contact[field] = value;
      }
    });

    if (Object.keys(custom).length > 0) contact.custom_fields = custom;

    if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(contact.email)) {
      invalid++;
      continue;
    }
    contacts.push(contact);
  }

  return { contacts, invalid };
}

/** Serialises contacts back out, for the export button. */
export function toCsv(rows: Array<Record<string, unknown>>, headers?: string[]): string {
  if (rows.length === 0) return "";
  const cols = headers || Object.keys(rows[0]);

  const cell = (value: unknown): string => {
    if (value == null) return "";
    const text = Array.isArray(value) ? value.join("|") : String(value);
    return /[",;\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };

  return [cols.join(","), ...rows.map((row) => cols.map((col) => cell(row[col])).join(","))].join("\r\n");
}
