/**
 * Contact details a visitor supplies before a calculator will run.
 *
 * Validation lives here rather than in the form component because both sides of
 * the wire need it: the browser to tell the visitor what to fix, and the API
 * route to refuse anything the browser did not. A route that trusts its client
 * is a route with no validation at all.
 */

export interface ToolLead {
  name: string;
  company: string;
  email: string;
  phone: string;
}

export type ToolLeadField = keyof ToolLead;

export const EMPTY_TOOL_LEAD: ToolLead = { name: "", company: "", email: "", phone: "" };

/**
 * Deliberately loose. The point of this check is to catch the visitor who typed
 * their name into the email box, not to adjudicate RFC 5322 — every stricter
 * regex on the internet rejects addresses that genuinely deliver, and rejecting
 * a real address costs a real lead.
 */
const EMAIL_SHAPE = /^[^\s@]+@[^\s@.]+\.[^\s@]{2,}$/;

/** Indonesian mobile numbers, written any of the ways people actually write them. */
const PHONE_DIGITS = /^\+?\d[\d\s().-]{6,24}$/;

export function normalisePhone(input: string): string {
  return input.replace(/[\s().-]/g, "");
}

export function validateToolLead(lead: ToolLead): Partial<Record<ToolLeadField, string>> {
  const errors: Partial<Record<ToolLeadField, string>> = {};

  const name = lead.name.trim();
  if (!name) errors.name = "Nama lengkap wajib diisi.";
  else if (name.length < 2) errors.name = "Nama terlalu pendek.";
  else if (name.length > 160) errors.name = "Nama terlalu panjang.";

  const company = lead.company.trim();
  if (!company) errors.company = "Nama perusahaan wajib diisi.";
  else if (company.length > 160) errors.company = "Nama perusahaan terlalu panjang.";

  const email = lead.email.trim();
  if (!email) errors.email = "Email wajib diisi.";
  else if (!EMAIL_SHAPE.test(email)) errors.email = "Format email belum benar, contoh: nama@perusahaan.co.id";
  else if (email.length > 255) errors.email = "Email terlalu panjang.";

  const phone = lead.phone.trim();
  const digits = normalisePhone(phone).replace(/^\+/, "");
  if (!phone) errors.phone = "Nomor HP wajib diisi.";
  else if (!PHONE_DIGITS.test(phone) || digits.length < 8) errors.phone = "Nomor HP belum benar, contoh: 0812 3456 7890";
  else if (digits.length > 20) errors.phone = "Nomor HP terlalu panjang.";

  return errors;
}

export function isToolLeadValid(lead: ToolLead): boolean {
  return Object.keys(validateToolLead(lead)).length === 0;
}

/**
 * Where an unlocked visitor is remembered.
 *
 * localStorage, not a cookie: the value never needs to reach the server on a
 * page load, and keeping it out of the request headers keeps the tool pages
 * fully cacheable as static HTML. Storing it at all is what stops the gate from
 * asking the same person again on the next calculator, which is the difference
 * between a form and an obstacle course.
 */
const STORAGE_KEY = "cargogrid.tool-access.v1";

export function readStoredLead(): ToolLead | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ToolLead>;
    const lead: ToolLead = {
      name: String(parsed.name || ""),
      company: String(parsed.company || ""),
      email: String(parsed.email || ""),
      phone: String(parsed.phone || ""),
    };
    return isToolLeadValid(lead) ? lead : null;
  } catch {
    // Private browsing, a full quota, or a value some other tab corrupted. None
    // of those should break the calculator; they just mean asking again.
    return null;
  }
}

export function storeLead(lead: ToolLead): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lead));
  } catch {
    /* Non-fatal: the visitor is unlocked for this page either way. */
  }
}

export function clearStoredLead(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* Non-fatal. */
  }
}
